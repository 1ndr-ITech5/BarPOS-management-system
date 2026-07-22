const asyncHandler = require("express-async-handler")
const {getOrderItems, addOrderItem, removeOrderItem} = require("../services/orderItemService.js")


const getItems = asyncHandler(async(req,res) => {
    // destruct the endpoint by getting the order id param
    const {orderId} = req.params

    const orderItems = await getOrderItems(orderId)
    res.status(200).json(orderItems)
})

const addItem = asyncHandler(async(req,res) => {
    // get the params of orderid and menuitem id
    const {orderId, menuItemId} = req.params

    const addedItem = await addOrderItem(orderId, menuItemId)
    res.status(201).json({
        addedItem, 
        response: "Item added on the order!"
    })
})

const removeItem = asyncHandler(async(req,res) => {
    // get the params of orderid and menuitem id
    const {orderId, menuItemId} = req.params

    const removedItem = await removeOrderItem(orderId, menuItemId)
    res.status(200).json({
        removedItem, 
        response: "Item removed from the order!"
    })
})

module.exports = {getItems, addItem, removeItem} 