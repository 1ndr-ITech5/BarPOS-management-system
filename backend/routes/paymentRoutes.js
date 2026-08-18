const {getClosedPayment, getAllPayments, createNewPayment} = require("../controllers/paymentController.js")
const express = require("express")
const {protect} = require("../middlewares/authMiddleware.js")
const {adminOnly} = require("../middlewares/adminOnlyMiddleware.js")
const router = express.Router()

router.get("/:orderId/payment", protect, getClosedPayment)

router.get("/payments", protect, adminOnly, getAllPayments)

router.post("/order/:orderId/payment", protect, createNewPayment)

module.exports = router;