const asyncHandler = require("express-async-handler")
const {getPayments, createPayment} = require("../services/paymentService.js")

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

module.exports = {getAllPayments, createNewPayment}