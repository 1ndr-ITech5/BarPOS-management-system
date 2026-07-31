const asyncHandler = require("express-async-handler")
const {addOrderItem, removeOrderItem} = require("../services/orderItemService.js")

const addItem = asyncHandler(async(req,res) => {
    // get the params of orderid and menuitem id
    const {orderId, menuItemId} = req.params

    // get the user id from req.user
    const userData = req.user

    const addedItem = await addOrderItem(orderId, menuItemId, userData)
    res.status(201).json({
        addedItem, 
        response: "Item added on the order!"
    })
})

const removeItem = asyncHandler(async(req,res) => {
    // get the params of orderid and menuitem id
    const {orderId, menuItemId} = req.params

    // get the user id from req.user
    const userData = req.user

    const removedItem = await removeOrderItem(orderId, menuItemId, userData)
    res.status(200).json({
        removedItem, 
        response: "Item removed from the order!"
    })
})

module.exports = {addItem, removeItem} 