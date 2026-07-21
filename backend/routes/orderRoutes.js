const express = require("express")
const {findOrder, createOrder, lockOrder, removeOrder} = require('../controllers/orderController.js')
const {protect} = require("../middlewares/authMiddleware.js")
const router = express.Router()

router.get("/:id", findOrder)

router.post("/open/:id", protect, createOrder)

router.put("/close/:id", protect, lockOrder)

router.delete("/delete/:id", protect, removeOrder)

module.exports = router;