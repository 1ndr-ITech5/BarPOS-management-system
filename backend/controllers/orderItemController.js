const asyncHandler = require("express-async-handler")
const {addOrderItem, removeOrderItem} = require("../services/orderItemService.js")

const addItem = asyncHandler(async(req,res) => {
    // get the params of orderid and menuitem id
    const {orderId, menuItemId} = req.params

    const addedItem = await addOrderItem(orderId, menuItemId, req.user)
    res.status(201).json({
        addedItem, 
        response: "Item added on the order!"
    })
})

const removeItem = asyncHandler(async(req,res) => {
    // get the params of orderid and menuitem id
    const {orderId, menuItemId} = req.params

    const removedItem = await removeOrderItem(orderId, menuItemId, req.user)
    res.status(200).json({
        removedItem, 
        response: "Item removed from the order!"
    })
})

module.exports = {addItem, removeItem} 