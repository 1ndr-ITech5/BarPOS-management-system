const {getAllPayments, createNewPayment} = require("../controllers/paymentController.js")
const express = require("express")
const {protect} = require("../middlewares/authMiddleware.js")
const router = express.Router()

router.get("/payments", protect, getAllPayments)

router.post("/order/:orderId/payment", protect, createNewPayment)

module.exports = router;