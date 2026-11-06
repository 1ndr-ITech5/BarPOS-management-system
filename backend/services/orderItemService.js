const OrderItem = require("../models/orderItemModel.js")
const Order = require("../models/orderModel.js")
const Product = require("../models/productModel.js")
const {updateOrderTotal} = require("./orderTotalService.js")
const mongoose = require("mongoose")
const {messageError} = require("../utils/messageErrors.js")

// create a service to get all order items from a specific order
const getOrderItems = async(orderId, workspaceId) => {
    // find the order within the workspace
    const order = await Order.findOne({_id: orderId, workspaceId: workspaceId, status: "open"})
    if (!order){
        throw messageError("The order was not found!", 404)
    }

    // when find the order, get all his order items
    const orderItems = await OrderItem.find({orderId: order._id}).populate("menuItemId", "productName")
    return orderItems
}


const addOrderItem = async(orderId, productId, userData) => {
    // check if order exists
    const order = await Order.findOne({_id: orderId, workspaceId: userData.workspaceId, status: "open"})
    if (!order) {
        throw messageError("Order does not exists!", 404)
    }

    // check if the waiter who opened it and the admin, have the rights to add items on order
    if (order.waiterId._id.toString() !== userData._id.toString() && userData.role !== "admin"){
        throw messageError(`Only ${order.waiterId.first_name} ${order.waiterId.last_name} and the admin, 
            have the rights to add items on this order!`, 403)
    }

    // check if the order item is an available product
    const item = await Product.findOne({_id: productId, offeredBy: userData.workspaceId})
    .populate("categoryId", "categoryName isActive isArchived")
    if (!item){
        throw messageError("Product does not exist!", 404)
    }

    // check for product's availability
    if(item.isAvailable === false || item.categoryId.isActive === false 
        || item.isArchived === true || item.categoryId.isArchived === true){
        throw messageError("A non-active product cannot be added on an order!", 409)
    }

    //start the session of the items increment 
    const session = await mongoose.startSession()
    try{
        session.startTransaction()

        // check if same orderItem has been created for that order
        const orderItem = await OrderItem.findOne({orderId: order._id, menuItemId: item._id}).session(session)
        if (!orderItem){
            const quantity = 1
            const newOrderItem = new OrderItem({
                orderId: order._id,
                menuItemId: item._id,
                quantity,
                unitPrice: item.price,
                linePrice: quantity * item.price
            })
            await newOrderItem.save({session})
            // update the order's total
            await updateOrderTotal(order._id, session)
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
            await updateOrderTotal(order._id, session)
            await session.commitTransaction()
            return updatedOrderItem
        }
    }catch(error){
        await session.abortTransaction()
        if(error.code === 11000){
            throw messageError("Error occured during items adding on order!", 409)
        }
        throw error
    }finally {
        await session.endSession()
    }
}

const removeOrderItem = async(orderId, orderItemId, userData) => {
    // check if the order exists
    const order = await Order.findOne({_id: orderId, workspaceId: userData.workspaceId, status: "open"})
    .populate("waiterId", "first_name last_name")
    if (!order) {throw messageError("Order does not exists!", 404)}

    // check if the waiter who opened it and the admin have the right to remove items on order
    if (order.waiterId._id.toString() !== userData._id.toString() && userData.role !== "admin"){
        throw messageError(`Only ${order.waiterId.first_name} ${order.waiterId.last_name} and the admin, 
            have the rights to remove items on this order!`, 403)
    }

    // find the order item
    const orderItem = await OrderItem.findOne({_id: orderItemId, orderId: order._id})
    if (!orderItem) {throw messageError("This item does not exist in this order!", 404)}

    // start session
    const session = await mongoose.startSession()

    try{
        await session.startTransaction()

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
            await updateOrderTotal(order._id, session)
            await session.commitTransaction()
            return updateOrderItem
        }else{
            const deleteOrderItem = await OrderItem.findByIdAndDelete(orderItem._id, {session})
            await updateOrderTotal(order._id, session)
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

const deleteOrderItem = async(orderId, orderItemId, userData) => {
    // find the order
    const order = await Order.findOne({_id: orderId, workspaceId: userData.workspaceId})
    if(!order){
        throw messageError("Order was not found!", 404)
    }

    // check if the waiter who opened the order or admin is performing this operation
    if(order.waiterId !== userData._id.toString() && userData.role !== "admin"){
        throw messageError("Only the waiter who opened the order or admin can perform this operation!", 409)
    }

    const session = await mongoose.startSession()
    try{
        await session.startTransaction()

        const deletedItem = await OrderItem.findOneAndDelete({_id: orderItemId, orderId: order._id}, {session})
        if(!deletedItem){
            throw messageError("Cannot delete an order item that does not even exist!", 404)
        
        }
        await updateOrderTotal(order._id, session)
        await session.commitTransaction()
    }catch(error){
        await session.abortTransaction()
        throw error
    }finally{
        await session.endSession()
    }
}

module.exports = {getOrderItems, addOrderItem, removeOrderItem, deleteOrderItem}