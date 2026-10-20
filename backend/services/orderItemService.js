const OrderItem = require("../models/orderItemModel.js")
const Order = require("../models/orderModel.js")
const Product = require("../models/productModel.js")
const {updateOrderTotal} = require("./orderTotalService.js")
const mongoose = require("mongoose")
const {messageError} = require("../utils/messageErrors.js")

const addOrderItem = async(order_id, productId, userData) => {
    // check if order exists
    const order = await Order.findOne({_id: order_id, workspaceId: userData.workspaceId, status: "open"})
    .populate("waiterId", "first_name last_name")
    if (!order) {
        const error = new Error("Order does not exists!")
        error.statusCode = 404
        throw error
    }

    // check if the order item is an available product
    const item = await Product.findOne({_id: productId, offeredBy: userData.workspaceId})
    if (!item){
        throw messageError("Product does not exist!", 404)
    }

    // make sure the product item is not archived or inavailable
    if(item.isArchived === true || item.isAvailable === true){
        throw messageError("This product cannot be added to the order, because is archived / not available!", 409)
    }

    // check if the waiter who opened it and the admin, have the rights to add items on order
    if (order.waiterId._id.toString() !== userData._id.toString() && userData.role !== "admin"){
        const error = new Error(`Only ${order.waiterId.first_name} ${order.waiterId.last_name} and the admin, have the rights to add items on this order!`)
        error.statusCode = 403
        throw error
    }

    //start the session of the items increment 
    const session = await mongoose.startSession()
    try{
        session.startTransaction()

        // check if same orderItem has been created for that order
        const orderItem = await OrderItem.findOne({
            orderId: order_id,
            menuItemId: productId
        }).session(session)
        if (!orderItem){
            const quantity = 1
            const newOrderItem = new OrderItem({
                orderId: order_id,
                menuItemId: productId,
                quantity,
                unitPrice: item.price,
                linePrice: quantity * item.price
            })
            await newOrderItem.save({session})
            // update the order's total
            await updateOrderTotal(order_id, session)
            await session.commitTransaction()
            // return the newly created / updated order item
            return newOrderItem
        }else{
            const updatedOrderItem = await OrderItem.findByIdAndUpdate(
                orderItem._id,
                {
                    $inc: {
                        quantity : 1,
                        linePrice: orderItem.unitPrice
                    }
                },
                {
                    session, returnDocument: "after", runValidators: true
                })
            // update the order's total
            await updateOrderTotal(order_id, session)
            await session.commitTransaction()
            return updatedOrderItem
        }
    }catch(error){
        await session.abortTransaction()
        if(error.code === 11000){
            const err = new Error("Error occured during items adding on order!")
            err.statusCode = 409
            throw err;
        }
        throw error
    }finally {
        await session.endSession()
    }
}

const removeOrderItem = async(order_id, productId, userData) => {

    // check if the order exists
    const order = await Order.findOne({_id: order_id, workspaceId: userData.workspaceId, status: "open"})
    .populate("waiterId", "first_name last_name")
    if (!order) {
        const error = new Error("Order does not exists!")
        error.statusCode = 404
        throw error
    }

    // check if the waiter who opened it and the admin have the right to remove items on order
    if (order.waiterId._id.toString() !== userData._id.toString() && userData.role !== "admin"){
        const error = new Error(`Only ${order.waiterId.first_name} ${order.waiterId.last_name} and the admin, have the rights to remove items on this order!`)
        error.statusCode = 403
        throw error
    }

    // start session
    const session = await mongoose.startSession()

    try{
        await session.startTransaction()

        // check if the order item exists in this order
        const orderItem = await OrderItem.findOne({orderId: order_id, menuItemId: productId}).session(session)
        if (!orderItem) {
            const error = new Error("This item does not exists in this order!")
            error.statusCode = 404
            throw error
        }

        // make sure when quantity goes below 1, then we delete it
        if (orderItem.quantity > 1){
            const updateOrderItem = await OrderItem.findByIdAndUpdate(
                orderItem._id,
                {
                    $inc: {
                        quantity : -1,
                        linePrice: -orderItem.unitPrice
                    }
                },
                {
                    session, returnDocument: "after", runValidators: true
                })
            // update the order's total
            await updateOrderTotal(order_id, session)
            await session.commitTransaction()
            return updateOrderItem
        }else{
            const deleteOrderItem = await OrderItem.findByIdAndDelete(orderItem._id, {session})
        
            // update the order's total
            await updateOrderTotal(order_id, session)
            await session.commitTransaction()
            return deleteOrderItem
        }
    }catch(error){
        await session.abortTransaction()
        throw error
    }finally {
        await session.endSession()
    }
}

const deleteOrderItems = async(orderId, session) => {
    // delete the order items
    await OrderItem.deleteMany({orderId}, {session})
}

module.exports = {addOrderItem, removeOrderItem, deleteOrderItems}