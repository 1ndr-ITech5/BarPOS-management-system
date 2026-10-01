const Workspace = require("../models/workspaceModel.js")
const User = require("../models/userModel.js")
const Table = require("../models/tableModel.js")
const Order = require("../models/orderModel.js")
const OrderItem = require("../models/orderItemModel.js")
const Payment = require("../models/paymentModel.js")
const {isSameDay} = require("../utils/checkDay.js")
const mongoose = require("mongoose")

const demoReset = async() => {
    // find the demo workspace
    const demoWorkspace = await Workspace.findOne({type: "demo"})
    if (!demoWorkspace)
    {
        throw new Error("Demo workspace not found!")
    }

    // find the main admin of that workspace
    const demoAdmin = await User.findOne({workspaceId: demoWorkspace._id, username: process.env.DEMO_ACCOUNT, role: "admin"})
    if (!demoAdmin)
    {
        throw new Error("Demo admin not found!")
    }

    // create a session
    const session = await mongoose.startSession()

    try{
        session.startTransaction()

        // delete all users in demo workspace except the main one
        await User.deleteMany({
            workspaceId: demoWorkspace._id,
            _id: {$ne: demoAdmin._id}}).session(session)

        // find all orders in this workspace
        const allDemoOrders = await Order.find({workspaceId: demoWorkspace._id}).session(session)

        // map the list into only order ids
        const orderIds = allDemoOrders.map(order => order._id)

        await OrderItem.deleteMany({orderId: {$in: orderIds}}).session(session)
        await Payment.deleteMany({workspaceId: demoWorkspace._id}).session(session)
        await Order.deleteMany({workspaceId: demoWorkspace._id}).session(session)

        // reset table status
        await Table.updateMany({
            ownedBy: demoWorkspace._id,
            },
            {$set: 
                {   
                    status: "available",
                    timeOpened: null,
                    openedBy: null
                }
            }).session(session)

        // update the reset time on demo workspace 
        await Workspace.updateOne(
            { _id: demoWorkspace._id },
            {$set: 
                {lastDemoReset: new Date()}
            }).session(session)

        await session.commitTransaction()
    }
    catch(error){
        await session.abortTransaction()
        throw error
    }
    finally{
        await session.endSession()
    }
}

const checkDemoReset = async() => {
    // find the demo workspace
    const demoWorkspace = await Workspace.findOne({type: "demo"})
    if (!demoWorkspace)
    {
        throw new Error("Demo workspace not found!")
    }

    // get the today's date
    const today = new Date()

    // check if today is the same day with the last time demo workspace resetation
    if (!demoWorkspace.lastDemoReset || !isSameDay(demoWorkspace.lastDemoReset, today))
    {
        await demoReset()
    }
}

module.exports = {demoReset, checkDemoReset}