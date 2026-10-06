const express = require("express")
const {getOrderByTableController, getOrderByIdController, getAllOrdersController, 
    getWaiterOrdersController, openOrderController, deleteOrderController} = require('../controllers/orderController.js')
const {protect} = require("../middlewares/authMiddleware.js")
const {adminOnly} = require("../middlewares/adminOnlyMiddleware.js")
const router = express.Router()

router.get("/all-orders", protect, adminOnly, getAllOrdersController)

router.get("/my-orders", protect, getWaiterOrdersController)

router.get("/tables/:tableId", protect, getOrderByTableController)

router.get("/orders/:orderId", protect, getOrderByIdController)

router.post("/:tableId/open", protect, openOrderController)

router.delete("/:tableId/delete", protect, deleteOrderController)

module.exports = router;