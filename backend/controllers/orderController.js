const asyncHandler = require("express-async-handler")
const {getOrder, openOrder, deleteOrder} = require("../services/orderService.js")

const getOrderController = asyncHandler(async(req,res) => {
    const {tableId} = req.params

    const foundOrder = await getOrder(tableId)
    res.status(200).json(foundOrder)
})

const openOrderController = asyncHandler(async(req, res) => {
    // destruct the url by taking the table id
    const {tableId} = req.params

    // get the waiter id from the req.user
    const userId = req.user._id.toString()

    const createdOrder = await openOrder(tableId, userId)
    res.status(201).json({
        createdOrder,
        response: "Order opened successfully!"
    })
})

const deleteOrderController = asyncHandler(async(req, res) => {
    // destruct the url by taking the table id
    const {tableId} = req.params

    // get the waiter id from the req.user
    const userId = req.user._id.toString()

    const deletedOrder = await deleteOrder(tableId, userId)
    res.status(200).json({
        deletedOrder,
        response: "Order deleted by success!"
    })
})

module.exports = {getOrderController, openOrderController, deleteOrderController}