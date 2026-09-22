const Order = require("../models/orderModel.js")
const Table = require("../models/tableModel.js")
const OrderItem = require("../models/orderItemModel.js")
const {deleteOrderItems} = require("./orderItemService.js")
const mongoose = require("mongoose")

// get the pre-bill of order based on the table id
const getPreBill = async(table_id, userData) => {
    // check if this table exists in db
    const table = await Table.findById(table_id)
    if (!table){
        const error = new Error("This table does not exist!")
        error.statusCode = 404
        throw error;
    }
    
    // get the order based on the table
    const order = await Order.findOne({
        tableId: table_id,
        status: "open"
    }).populate("waiterId", "first_name last_name")
    .populate("tableId", "tableNumber")

    // when order is not found
    if (!order) {
        const error = new Error(`No active order was found for table number ${table.tableNumber}!`)
        error.statusCode = 404
        throw error;
    }

    // check that only the waiter who opened it or the admin has permission to get it
    if(order.waiterId._id.toString() !== userData._id.toString() && userData.role !== "admin"){
        const error = new Error(`The pre-bill can be viewed by ${order.waiterId.first_name} ${order.waiterId.last_name} and the admin!`)
        error.statusCode = 403
        throw error;
    }

    // query over order items
    const orderItems = await OrderItem.find({orderId: order._id})
    .populate("menuItemId", "productName")

    return {order, orderItems}
}

// get all the active orders
const getAllOrders = async() => {
    // find in db all orders that have status open
    const activeOrders = await Order.find({status: "open"}).populate("waiterId", "first_name last_name")
    .populate("tableId", "tableNumber")
    
        const ordersWithTotals = await Promise.all(activeOrders.map(async(order) => {
            const items = await OrderItem.find({orderId: order._id})
            order.total = items.reduce((sum, item) => sum + Number(item.linePrice), 0)
            return order
        }))

        return ordersWithTotals
}

// get the active orders based on the waiter id
const getWaiterOrders = async(user_id) => {
    // find all the active orders that waiter has opened
    const waiterOrders = await Order.find({waiterId: user_id, status: "open"})
    .populate("tableId", "tableNumber")

        const ordersWithTotals = await Promise.all(waiterOrders.map(async(order) => {
            const items = await OrderItem.find({orderId: order._id})
            order.total = items.reduce((sum, item) => sum + Number(item.linePrice), 0)
            return order
        }))

        return ordersWithTotals
}

// create the order
const openOrder = async(table_id, user_id) => {
    // check if the table exists in db
    const table = await Table.findById(table_id)
    if (!table) {
        const error = new Error("This table does not exist!")
        error.statusCode = 404
        throw error;
    }

    // check table status to be available during the order opening
    if (table.status === "occupied"){
        const error = new Error("Cannot open an order on an occupied table!")
        error.statusCode = 409
        throw error
    }

    // check if any order is opened for that table
    const order = await Order.findOne({
        tableId: table_id,
        status: "open"
    })
    if (order) {
        const error = new Error("This table has an order already!")
        error.statusCode = 409
        throw error;
    }

    // treat the dublicate errors
    try{
        // create the order for that table
        const newOrder = await Order.create({
            waiterId: user_id,
            tableId: table_id
        })

        // update the table status to occupied after the newOrder gets created
        await Table.findByIdAndUpdate(
            table._id, 
            {   status: "occupied",
                openedBy: user_id,
                timeOpened: new Date()
            },
            {returnDocument: "after", runValidators: true}
        )

        return newOrder
    }catch(error){
        if(error.code === 11000){
            const err = new Error("The order for this table has already been set!")
            err.statusCode = 409
            throw err;
        }

        throw error;
    }
}

const updateOrderTotal = async(order_id) => {
    // get all the items in this order
    const items = await OrderItem.find({orderId: order_id})

    // calculate the total of these items
    const totalPrice = items.reduce(
            (sum, item) => sum + Number(item.linePrice),
            0
    );

    // update the order with the new total
        const updatedOrder = await Order.findByIdAndUpdate(
        order_id,
        {total: totalPrice},
            {new: true, runValidators: true}
    )

        if (!updatedOrder) {
            const error = new Error("Order total could not be updated because the order does not exist!")
            error.statusCode = 404
            throw error
        }

        return updatedOrder
}

const closeOrder = async(order_id, table_id, session) => {
    // update the order status
    await Order.findByIdAndUpdate(
        order_id,
        {   status: "closed",
            closedAt: new Date()
        },
        {returnDocument: "after", runValidators: true, session}
    )

    // update table occupation
    await Table.findByIdAndUpdate(
        table_id,
        {   status: "available",
            openedBy: null,
            timeOpened: null
        },
        {returnDocument: "after", runValidators: true, session}
    )
}

const deleteOrder = async(table_id, userData) => {
    // check if the order exists
    const order = await Order.findOne({
        tableId: table_id,
        status: "open"
    }).populate("waiterId", "first_name last_name")

    if(!order){
        const error = new Error("Order does not exists for this table!")
        error.statusCode = 404
        throw error;
    }

    // make sure that the waiter who opened it, has the right to close it aswell, admin can do it too
    if (order.waiterId._id.toString() !== userData._id.toString() && userData.role !== "admin"){
        const error = new Error(`Only ${order.waiterId.first_name} ${order.waiterId.last_name} and the admin, have the rights to delete this order!`)
        error.statusCode = 403
        throw error;
    }

    const session = await mongoose.startSession();

    try{
        await session.startTransaction();
        // delete the found order
        const deletedOrder = await Order.findByIdAndDelete(order._id, {session})

        // delete its items
        await deleteOrderItems(order._id, session)

        // update table occupation
        await Table.findByIdAndUpdate(
            table_id,
            {   status: "available",
                openedBy: null,
                timeOpened: null
            },
            {returnDocument: "after", runValidators: true, session}
        )

        await session.commitTransaction();
        return deletedOrder
    }catch(error){
        await session.abortTransaction();
        throw error
    }finally{
        await session.endSession();
    }
}

module.exports = {getPreBill, getAllOrders, getWaiterOrders, openOrder, updateOrderTotal, closeOrder, deleteOrder}