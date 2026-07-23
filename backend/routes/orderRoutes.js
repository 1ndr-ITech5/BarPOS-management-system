const express = require("express")
const {getOrderController, openOrderController, closeOrderController, deleteOrderController} = require('../controllers/orderController.js')
const {protect} = require("../middlewares/authMiddleware.js")
const router = express.Router()

router.get("/:tableId", protect, getOrderController)

router.post("/:tableId/open", protect, openOrderController)

router.put("/:tableId/close", protect, closeOrderController)

router.delete("/:tableId/delete", protect, deleteOrderController)

module.exports = router;