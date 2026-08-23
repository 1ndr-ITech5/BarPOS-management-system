const asyncHandler = require("express-async-handler")
const {getCreatedPayment, getPayments, createPayment} = require("../services/paymentService.js")

const getClosedPayment = asyncHandler(async(req,res) => {
    
    const {orderId} = req.params
    const userData = req.user

    const createdPayment = await getCreatedPayment({orderId, userData})
    res.status(200).json(createdPayment)
})

const getAllPayments = asyncHandler(async(req,res) => {
    const payments = await getPayments()
    res.status(200).json(payments)
})

const createNewPayment = asyncHandler(async(req,res) => {
    // get the order id from endpoint parameter
    const {orderId} = req.params

    const newPayment = await createPayment(req.body, orderId, req.user)

    res.status(201).json({
        newPayment,
        response: "New payment was created successfully!"
    })
})

module.exports = {getClosedPayment, getAllPayments, createNewPayment}