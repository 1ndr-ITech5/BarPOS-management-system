const Order = require("../models/orderModel.js")
const Table = require("../models/tableModel.js")
const OrderItem = require("../models/orderItemModel.js")
const {messageError} = require("../utils/messageErrors.js")
const mongoose = require("mongoose")

// get order based on the table id
const getOrderByTable = async(table_id, userData) => {
    // check if this table exists in db
    const table = await Table.findOne({_id: table_id, ownedBy: userData.workspaceId})
    if (!table){throw messageError("This table does not exist!", 404)}
    
    const order = await Order.findOne({
        workspaceId: userData.workspaceId,
        tableId: table_id,
        status: "open"
    }).populate("waiterId", "first_name last_name").populate("tableId", "tableName")

    // when order is not found
    if (!order) {
        throw messageError(`No active order was found for table number ${table.tableName}!`, 404)
    }

    // check that only the waiter who opened it or the admin has permission to get it
    if(order.waiterId._id.toString() !== userData._id.toString() && userData.role !== "admin"){
        throw messageError(`Only ${order.waiterId.first_name} ${order.waiterId.last_name} 
            and the admin have access on this order!`, 403)
    }

    // query over order items
    const orderItems = await OrderItem.find({orderId: order._id})
    .populate("menuItemId", "productName")

    return {order, orderItems}
}

// get order based on orderId
const getOrderById = async(orderId, userData) => {
    const order = await Order.findOne({
        _id: orderId,
        workspaceId: userData.workspaceId,
        status: "open"
    }).populate("waiterId", "first_name last_name").populate("tableId", "tableName timeOpened")

    // when order is not found
    if (!order) {
        throw messageError(`No active order was found for this table!`, 404)
    }

    // check that only the waiter who opened it or the admin has permission to get it
    if(order.waiterId._id.toString() !== userData._id.toString() && userData.role !== "admin"){
        throw messageError(`Only ${order.waiterId.first_name} ${order.waiterId.last_name} 
            and the admin have access on this order!`, 403)
    }

    return order
}

// get all the active orders
const getAllOrders = async(workspaceId) => {
    // find in db all orders that have status open
    const activeOrders = await Order.find({workspaceId, status: "open"}).populate("waiterId", "first_name last_name")
    .populate("tableId", "tableNumber")

    const orderIds = activeOrders.map(order => order._id)
    const allItems = await OrderItem.find({orderId: {$in: orderIds}})
    const totals = new Map()

    for (const item of allItems) {
        const orderId = item.orderId.toString()
        totals.set(orderId, (totals.get(orderId) || 0) + Number(item.linePrice))
    }

    return activeOrders.map(order => {
        order.total = totals.get(order._id.toString()) || 0
        return order
    })
}

// get the active orders based on the waiter id
const getWaiterOrders = async(user_id, workspaceId) => {
    // find all the active orders that waiter has opened
    const waiterOrders = await Order.find({waiterId: user_id, workspaceId, status: "open"})
    .populate("tableId", "tableNumber")

    const orderIds = waiterOrders.map(order => order._id)
    const allItems = await OrderItem.find({orderId: {$in: orderIds}})
    const totals = new Map()

    for (const item of allItems) {
        const orderId = item.orderId.toString()
        totals.set(orderId, (totals.get(orderId) || 0) + Number(item.linePrice))
    }

    return waiterOrders.map(order => {
        order.total = totals.get(order._id.toString()) || 0
        return order
    })
}

// create the order
const openOrder = async(tableId, userData) => {
    // check if the table exists in db
    const table = await Table.findOne({_id: tableId, ownedBy: userData.workspaceId})
    if (!table) {throw messageError("This table does not exist!", 404)}

    // check table status to be available during the order opening
    if (table.status === "occupied"){
        throw messageError("Cannot open an order on an occupied table!", 409)
    }

    // check if any order is opened for that table
    const order = await Order.findOne({
        tableId: table._id,
        workspaceId: userData.workspaceId,
        status: "open"
    })
    if (order) {throw messageError("This table has an order already!", 409)}

    const session = await mongoose.startSession();

    // treat the dublicate errors
    try{
        await session.startTransaction();
        // create the order for that table
        const [newOrder] = await Order.create([{
            waiterId: userData._id,
            tableId: table._id,
            workspaceId: userData.workspaceId
        }], {session})

        // update the table status to occupied after the newOrder gets created
        await Table.findByIdAndUpdate(
            table._id, 
            {   status: "occupied",
                openedBy: userData._id,
                timeOpened: new Date()
            },
            {session, returnDocument: "after", runValidators: true}
        )
        await session.commitTransaction();
        return newOrder
    }catch(error){
        await session.abortTransaction();
        if(error.code === 11000){
            throw messageError("The order for this table has already been set!", 409)
        }
        throw error;
    }finally{
        await session.endSession();
    }
}

const closeOrder = async(orderId, tableId, session) => {
    // update the order status
    await Order.findByIdAndUpdate(
        orderId,
        {   status: "closed",
            closedAt: new Date()
        },
        {returnDocument: "after", runValidators: true, session}
    )

    // update table occupation
    await Table.findByIdAndUpdate(
        tableId,
        {   status: "available",
            openedBy: null,
            timeOpened: null
        },
        {returnDocument: "after", runValidators: true, session}
    )
}

const deleteOrder = async(tableId, userData) => {
    // check if the order exists
    const order = await Order.findOne({
        tableId: tableId,
        workspaceId: userData.workspaceId,
        status: "open"
    }).populate("waiterId", "first_name last_name")

    if(!order){throw messageError("Order does not exists for this table!", 404)}

    // make sure that the waiter who opened it, has the right to close it aswell, admin can do it too
    if (order.waiterId._id.toString() !== userData._id.toString() && userData.role !== "admin"){
        throw messageError(`Only ${order.waiterId.first_name} ${order.waiterId.last_name} and the admin, 
            have the rights to delete this order!`, 403)}

    const session = await mongoose.startSession();

    try{
        await session.startTransaction();
        await OrderItem.deleteMany({orderId: order._id}, {session})
        await Order.findByIdAndDelete(order._id, {session})

        // update table occupation
        await Table.findByIdAndUpdate(
            order.tableId,
            {   status: "available",
                openedBy: null,
                timeOpened: null
            },
            {returnDocument: "after", runValidators: true, session}
        )

        await session.commitTransaction();
    }catch(error){
        await session.abortTransaction();
        throw error
    }finally{
        await session.endSession();
    }
}

module.exports = {getOrderByTable, getOrderById, getAllOrders, getWaiterOrders, openOrder, closeOrder, deleteOrder}