const OrderItem = require("../models/orderItemModel.js")
const Order = require("../models/orderModel.js")
const Menu = require("../models/menuModel.js")
const {updateOrderTotal} = require("./orderService.js")

const addOrderItem = async(order_id, menuItem_id, userData) => {
    // check if order exists
    const order = await Order.findOne({_id: order_id, status: "open"}).populate("waiterId", "first_name last_name")
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

    // check if the waiter who opened it and the admin, have the rights to add items on order
    if (order.waiterId._id.toString() !== userData._id.toString() && userData.role !== "admin"){
        const error = new Error(`Only ${order.waiterId.first_name} ${order.waiterId.last_name} and the admin, have the rights to add items on this order!`)
        error.statusCode = 403
        throw error
    }

    try{
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
            // update the order's total
            await updateOrderTotal(order_id)

            // return the newly created / updated order item
            return newOrderItem
        }else{
            const newQuantity = orderItem.quantity + 1
            const updatedOrderItem = await OrderItem.findByIdAndUpdate(
                orderItem._id,
                {   quantity: newQuantity,
                    linePrice: newQuantity * orderItem.unitPrice
                },
                {
                    returnDocument: "after", runValidators: true
                })
            // update the order's total
            await updateOrderTotal(order_id)

            return updatedOrderItem
        }
    }catch(error){
        if(error.code === 11000){
            const err = new Error("Error occured during items adding on order!")
            err.statusCode = 409
            throw err;
        }
        throw error
    }
}

const removeOrderItem = async(order_id, menuItem_id, userData) => {
    // check if the order exists
    const order = await Order.findOne({_id: order_id, status: "open"}).populate("waiterId", "first_name last_name")
    if (!order) {
        const error = new Error("Order does not exists!")
        error.statusCode = 404
        throw error
    }

    // check if the waiter who opened it and the admin have the right to add items on order
    if (order.waiterId._id.toString() !== userData._id.toString() && userData.role !== "admin"){
        const error = new Error(`Only ${order.waiterId.first_name} ${order.waiterId.last_name} and the admin, have the rights to remove items on this order!`)
        error.statusCode = 403
        throw error
    }

    // check if the order item exists in this order
    const orderItem = await OrderItem.findOne({orderId: order_id, menuItemId: menuItem_id})
    if (!orderItem) {
        const error = new Error("This item does not exists in this order!")
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
                returnDocument: "after", runValidators: true
            })
        // update the order's total
        await updateOrderTotal(order_id)

        return updateOrderItem
    }else{
        const deleteOrderItem = await OrderItem.findByIdAndDelete(orderItem._id)
        
        // update the order's total
        await updateOrderTotal(order_id)

        return deleteOrderItem
    }
}

const deleteOrderItems = async(orderId, session) => {
    // delete the order items
    await OrderItem.deleteMany({orderId}, {session})
}

module.exports = {addOrderItem, removeOrderItem, deleteOrderItems}