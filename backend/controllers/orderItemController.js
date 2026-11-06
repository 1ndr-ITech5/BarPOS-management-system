const asyncHandler = require("express-async-handler")
const {getOrderItems, addOrderItem, removeOrderItem, deleteOrderItem} = require("../services/orderItemService.js")


const getItems = asyncHandler(async(req,res) => {
    const {orderId} = req.params
    const orderItems = await getOrderItems(orderId, req.user.workspaceId)
    res.status(200).json(orderItems)
})


const addItem = asyncHandler(async(req,res) => {
    const {orderId, menuItemId} = req.params
    const addedItem = await addOrderItem(orderId, menuItemId, req.user)
    res.status(201).json({
        addedItem, 
        response: "Item added on the order!"
    })
})


const removeItem = asyncHandler(async(req,res) => {
    const {orderId, orderItemId} = req.params
    const removedItem = await removeOrderItem(orderId, orderItemId, req.user)
    res.status(200).json({
        removedItem, 
        response: "Item removed from the order!"
    })
})


const deleteItem = asyncHandler(async(req,res) => {
    const {orderId, orderItemId} = req.params
    await deleteOrderItem(orderId, orderItemId, req.user)
    res.status(200).json({response: "Item deleted from the order!"})
})

module.exports = {getItems, addItem, removeItem, deleteItem} 