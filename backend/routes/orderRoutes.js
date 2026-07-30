const express = require("express")
const {getOrderController, getAllOrdersController, getWaiterOrdersController, openOrderController, deleteOrderController} = require('../controllers/orderController.js')
const {protect} = require("../middlewares/authMiddleware.js")
const {adminOnly} = require("../middlewares/adminOnlyMiddleware.js")
const router = express.Router()

router.get("/:tableId", protect, getOrderController)

router.get("/all-orders", protect, adminOnly, getAllOrdersController)

router.get("/my-orders", protect, getWaiterOrdersController)

router.post("/:tableId/open", protect, openOrderController)

router.delete("/:tableId/delete", protect, deleteOrderController)

module.exports = router;