const asyncHandler = require("express-async-handler")
const {getOrder, openOrder, closeOrder, deleteOrder} = require("../services/orderService.js")

const findOrder = asyncHandler(async(req,res) => {
    const {id} = req.params

    const foundOrder = await getOrder(id)
    res.status(200).json(foundOrder)
})

const createOrder = asyncHandler(async(req, res) => {
    // destruct the url by taking the table id
    const {id} = req.params

    // get the waiter id from the req.user
    const userId = req.user._id.toString()

    const createdOrder = await openOrder(id, userId)
    res.status(201).json({
        createdOrder,
        response: "Order opened successfully!"
    })
})

const lockOrder = asyncHandler(async(req,res) => {
    // destruct the url by taking the table id
    const {id} = req.params

    // get the waiter id from the req.user
    const userId = req.user._id.toString()

    const closedOrder = await closeOrder(id, userId)
    res.status(200).json({
        closedOrder,
        response: "Order closed successfully!"
    })
})

const removeOrder = asyncHandler(async(req, res) => {
    // destruct the url by taking the table id
    const {id} = req.params

    // get the waiter id from the req.user
    const userId = req.user._id.toString()

    const deletedOrder = await deleteOrder(id, userId)
    res.status(200).json({
        deletedOrder,
        response: "Order deleted by success!"
    })
})

module.exports = {findOrder, createOrder, lockOrder, removeOrder}