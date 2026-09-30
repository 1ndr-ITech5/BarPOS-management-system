const express = require("express")
const {getProducts} = require("../controllers/menuController.js")
const {protect} = require("../middlewares/authMiddleware.js")
const router = express.Router()

router.get("/", protect, getProducts)

module.exports = router;