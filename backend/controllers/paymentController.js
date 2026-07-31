const asyncHandler = require("express-async-handler")
const {getPayments, createPayment} = require("../services/paymentService.js")

const getAllPayments = asyncHandler(async(req,res) => {
    const payments = await getPayments()
    res.status(200).json(payments)
})

const createNewPayment = asyncHandler(async(req,res) => {
    // get the order id from endpoint parameter
    const {orderId} = req.params

    // get the waiter id from req.user
    const user = req.user

    // get the req.body items and save them to paymentData
    const {amountPaid, method} = req.body
    const paymentData = {amountPaid, method}

    const newPayment = await createPayment(paymentData, orderId, user)

    res.status(201).json({
        newPayment,
        response: "New payment was created successfully!"
    })
})

module.exports = {getAllPayments, createNewPayment}