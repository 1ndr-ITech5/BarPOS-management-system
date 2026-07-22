const express = require("express")
const {getItems, addItem, removeItem} = require("../controllers/orderItemController.js")
const {protect} = require("../middlewares/authMiddleware")
const router = express.Router()

router.get("/:orderId/items", protect, getItems)

router.post("/:orderId/items/:menuItemId/add", protect, addItem)

router.delete("/:orderId/items/:menuItemId/remove", protect, removeItem)

module.exports = router;