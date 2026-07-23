const Order = require("../models/orderModel.js")
const Table = require("../models/tableModel.js")
const User = require("../models/userModel.js")
const OrderItem = require("../models/orderItemModel.js")

// get the order based on the table id
const getOrder = async(table_id) => {
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
    })

    // cases when you get order and when not
    if (!order) {
        return null
    }else{
        return order
    }
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
        error.statusCode = 400
        throw error
    }

    // check if any order is opened for that table
    const order = await Order.findOne({
        tableId: table_id,
        status: "open"
    })
    if (order) {
        const error = new Error("This table has an order already!")
        error.statusCode = 400
        throw error;
    }

    // create the order for that table
    const newOrder = await Order.create({
        waiterId: user_id,
        tableId: table_id
    })

    // update the table status to occupied after the newOrder gets created
    const updateTable = await Table.findByIdAndUpdate(
        table._id, 
        {   status: "occupied",
            openedBy: user_id,
            timeOpened: new Date()
        },
        {new: true, runValidators: true}
    )

    return newOrder
}

const updateOrderTotal = async(order_id) => {
    // find the order
    const order = await Order.findById(order_id)
    if (!order){
        const error = new Error("Order couldn't be found!")
        error.statusCode = 404
        throw error;
    }

    // check if that order is open
    if (order.status !== "open"){
        const error = new Error("Cannot update the total of an closed order!")
        error.statusCode = 400
        throw error
    }

    // get all the items in this order
    const items = await OrderItem.find({orderId: order_id})

    // calculate the total of these items
    const totalPrice = items.reduce(
        (sum, item) => sum += item.linePrice , 0
    );

    // update the order with the new total
    const updatedOrder = await Order.findByIdAndUpdate(
        order_id,
        {total: totalPrice},
        {new:true, runValidators: true}
    )
}

const closeOrder = async(table_id, user_id) => {
    // find the order based on the table
    const order = await Order.findOne({
        tableId: table_id,
        status: "open"
    })

    // check if order was found
    if(!order){
        const error = new Error("Order does not exists for this table!")
        error.statusCode = 404
        throw error;
    }

    // make sure that the waiter closing is the one that opened it
    if (order.waiterId.toString() !== user_id){
        const error = new Error("Only the waiter who opened it, has the right to close this order!")
        error.statusCode = 401
        throw error;
    }

    // update the order status
    const closedOrder = await Order.findByIdAndUpdate(
        order._id,
        {   status: "closed",
            closedAt: new Date()
        },
        {new: true, runValidators: true}
    )

    // update table occupation
    const table = await Table.findByIdAndUpdate(
        table_id,
        {   status: "available",
            openedBy: null,
            timeOpened: null
        },
        {new: true, runValidators: true}
    )

    return closedOrder
}

const deleteOrder = async(table_id, user_id) => {
    // check if the order exists
    const order = await Order.findOne({
        tableId: table_id,
        status: "open"
    })

    if(!order){
        const error = new Error("Order does not exists for this table!")
        error.statusCode = 404
        throw error;
    }

    // make sure that the waiter who opened it, has the right to close it aswell
    if (order.waiterId.toString() !== user_id){
        const error = new Error("Only the waiter who opened it, has the right to delete this order!")
        error.statusCode = 401
        throw error;
    }

    // delete the found order
    const deletedOrder = await Order.findByIdAndDelete(order._id)

    // update table occupation
    const table = await Table.findByIdAndUpdate(
        table_id,
        {   status: "available",
            openedBy: null,
            timeOpened: null
        },
        {new: true, runValidators: true}
    )


    return deletedOrder
}

module.exports = {getOrder, openOrder, updateOrderTotal, closeOrder, deleteOrder}