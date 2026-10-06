const asyncHandler = require("express-async-handler")
const {getOrderByTable, getOrderById, getAllOrders, getWaiterOrders, openOrder, deleteOrder} = require("../services/orderService.js")


const getOrderByTableController = asyncHandler(async(req,res) => {
    const {tableId} = req.params

    const foundOrder = await getOrderByTable(tableId, req.user)
    res.status(200).json(foundOrder)
})

const getOrderByIdController = asyncHandler(async(req,res) => {
    const {orderId} = req.params

    const foundOrder = await getOrderById(orderId, req.user)
    res.status(200).json(foundOrder)
})

const getAllOrdersController = asyncHandler(async(req,res) => {
    const allOrders = await getAllOrders(req.user.workspaceId)
    res.status(200).json(allOrders)
})


const getWaiterOrdersController = asyncHandler(async(req,res) => {
    const waiterId = req.user._id.toString()
    const waiterOrders = await getWaiterOrders(waiterId, req.user.workspaceId)
    res.status(200).json(waiterOrders)
})


const openOrderController = asyncHandler(async(req, res) => {
    // destruct the url by taking the table id
    const {tableId} = req.params

    const createdOrder = await openOrder(tableId, req.user)
    res.status(201).json({
        createdOrder,
        response: "Order opened successfully!"
    })
})

const deleteOrderController = asyncHandler(async(req, res) => {
    // destruct the url by taking the table id
    const {tableId} = req.params

    const deletedOrder = await deleteOrder(tableId, req.user)
    res.status(200).json({
        deletedOrder,
        response: "Order deleted by success!"
    })
})

module.exports = {getOrderByTableController, getOrderByIdController, getAllOrdersController, 
    getWaiterOrdersController, openOrderController, deleteOrderController}