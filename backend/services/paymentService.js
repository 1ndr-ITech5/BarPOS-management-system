const Payment = require("../models/paymentModel.js")
const Order = require("../models/orderModel.js")
const OrderItem = require("../models/orderItemModel.js")
const {closeOrder} = require("./orderService.js")

const getCreatedPayment = async({orderId}) => {
    const createdPayment = await Payment.findOne({orderId: orderId})
    .populate({path: "orderId", populate: {path: "tableId", select: "tableNumber"}})
    .populate("waiterId", "first_name last_name")

    // return if no payment was found
    if(!createdPayment){
        return null
    }

    const orderItems = await OrderItem.find({orderId: createdPayment.orderId._id}).populate("menuItemId", "productName")

    return {createdPayment, orderItems}
}

const getPayments = async() => {
    const payments = await Payment.find().populate({path: "orderId", populate: {path: "tableId", select: "tableNumber"}})
    .populate("waiterId", "first_name last_name")
    return payments
}

const createPayment = async(paymentData, order_id, user) => {
    // check if the open order exists
    const order = await Order.findOne({
        _id: order_id,
        status: "open"
    }).populate("waiterId", "first_name last_name")
    if (!order){
        const error = new Error("Cannot create a payment for an order that doesn't exist!")
        error.statusCode = 404
        throw error
    }

    // check if this order has items in it
    const orderItems = await OrderItem.find({orderId: order_id})
    if (orderItems.length === 0){
        const error = new Error("Cannot create a payment for an order that doesn't have any items in it!")
        error.statusCode = 404
        throw error
    }

    // check if the waiter who opened the order will be the one who closes it
    if (order.waiterId._id.toString() !== user._id.toString() && user.role !== "admin"){
        const error = new Error(`The waiter: ${order.waiterId.first_name} ${order.waiterId.last_name} and admin have the rights to close the order!`)
        error.statusCode = 403
        throw error
    }

    // check if all the required fields are filled
    const {amountPaid, method} = paymentData
    if (!amountPaid || !method){
        const error = new Error("Please provide the required payment fields!")
        error.statusCode = 400
        throw error
    }

    // check if amount paid by user is greater or equal to total order amount
    if (amountPaid < order.total){
        const error = new Error(`Amount paid should be greater or equal to total order amount! Amount needed to be added: ${order.total - amountPaid}`)
        error.statusCode = 400
        throw error
    }

    // save payment in the database
    const payment = await Payment.create({
        orderId: order_id,
        waiterId: user._id,
        totalAmount: order.total,
        amountPaid: amountPaid,
        change: amountPaid - order.total,
        method: method
    })

    // with payment creation, close the order
    await closeOrder(order._id, order.tableId)

    return payment
}

module.exports = {getCreatedPayment, getPayments, createPayment}