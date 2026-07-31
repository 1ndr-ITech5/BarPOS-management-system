const express = require("express")
const {addItem, removeItem} = require("../controllers/orderItemController.js")
const {protect} = require("../middlewares/authMiddleware")
const router = express.Router()

router.post("/:orderId/item/:menuItemId/add", protect, addItem)

router.delete("/:orderId/item/:menuItemId/remove", protect, removeItem)

module.exports = router;