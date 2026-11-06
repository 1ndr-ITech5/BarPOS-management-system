const express = require("express")
const {getItems, addItem, removeItem, deleteItem} = require("../controllers/orderItemController.js")
const {protect} = require("../middlewares/authMiddleware")
const router = express.Router()

router.get("/:orderId/orderItems", protect, getItems)

router.post("/:orderId/item/:menuItemId/add", protect, addItem)

router.delete("/:orderId/item/:orderItemId/remove", protect, removeItem)

router.delete("/:orderId/item/:orderItemId/delete", protect, deleteItem)

module.exports = router;