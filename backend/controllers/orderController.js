const asyncHandler = require("express-async-handler")
const {getPreBill, getAllOrders, getWaiterOrders, openOrder, deleteOrder} = require("../services/orderService.js")


const getOrderController = asyncHandler(async(req,res) => {
    const {tableId} = req.params

    const userData = req.user

    const foundOrder = await getPreBill(tableId, userData)
    res.status(200).json(foundOrder)
})


const getAllOrdersController = asyncHandler(async(req,res) => {
    const allOrders = await getAllOrders()
    res.status(200).json(allOrders)
})


const getWaiterOrdersController = asyncHandler(async(req,res) => {
    const waiterId = req.user._id.toString()
    const waiterOrders = await getWaiterOrders(waiterId)
    res.status(200).json(waiterOrders)
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

    // get the user data from the req.user
    const userData = req.user

    const deletedOrder = await deleteOrder(tableId, userData)
    res.status(200).json({
        deletedOrder,
        response: "Order deleted by success!"
    })
})

module.exports = {getOrderController, getAllOrdersController, getWaiterOrdersController, openOrderController, deleteOrderController}