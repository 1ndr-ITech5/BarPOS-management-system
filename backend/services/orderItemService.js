const OrderItem = require("../models/orderItemModel.js")
const Order = require("../models/orderModel.js")
const Menu = require("../models/menuModel.js")

const getOrderItems = async(order_id) => {
    // check if order exists
    const order = await Order.findById(order_id)
    if (!order) {
        const error = new Error("Order does not exists!")
        error.statusCode = 404
        throw error
    }

    // get all the order items of that order
    const orderItems = await OrderItem.find({orderId: order_id})
    return orderItems
}

const addOrderItem = async(order_id, menuItem_id) => {
    // check if order exists
    const order = await Order.findById(order_id)
    if (!order) {
        const error = new Error("Order does not exists!")
        error.statusCode = 404
        throw error
    }

    // check if the order item is in the menu
    const item = await Menu.findById(menuItem_id)
    if (!item){
        const error = new Error("Item does not exists in the menu!")
        error.statusCode = 404
        throw error
    }

    // check if same orderItem has been created for that order
    const orderItem = await OrderItem.findOne({
        orderId: order_id,
        menuItemId: menuItem_id
    })
    if (!orderItem){
        const quantity = 1
        const newOrderItem = await OrderItem.create({
            orderId: order_id,
            menuItemId: menuItem_id,
            quantity,
            unitPrice: item.price,
            linePrice: quantity * item.price
        })
        return newOrderItem
    }else{
        const newQuantity = orderItem.quantity + 1
        const updatedOrderItem = await OrderItem.findByIdAndUpdate(
            orderItem._id,
            {   quantity: newQuantity,
                linePrice: newQuantity * orderItem.unitPrice
            },
            {
                new: true, runValidators: true
            })
            return updatedOrderItem
    }
}

const removeOrderItem = async(order_id, menuItem_id) => {
    // check if the order exists
    const order = await Order.findById(order_id)
    if (!order) {
        const error = new Error("Order does not exists!")
        error.statusCode = 404
        throw error
    }

    // check if the order item exists in this order
    const orderItem = await OrderItem.findOne({orderId: order_id, menuItemId: menuItem_id})
    if (!orderItem) {
        const error = new Error("Item does not exists in this order!")
        error.statusCode = 404
        throw error
    }

    // make sure when quantity goes below 1, then we delete it
    if (orderItem.quantity > 1){
        const newQuantity = orderItem.quantity - 1
        const updateOrderItem = await OrderItem.findByIdAndUpdate(
            orderItem._id,
            {   quantity: newQuantity,
                linePrice: newQuantity * orderItem.unitPrice
            },
            {
                new: true, runValidators: true
            })
        return updateOrderItem
    }else{
        const deleteOrderItem = await OrderItem.findByIdAndDelete(orderItem._id)
        return deleteOrderItem
    }
}

module.exports = {getOrderItems, addOrderItem, removeOrderItem}