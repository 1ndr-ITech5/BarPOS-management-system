const express = require("express")
const {getTablesController} = require("../controllers/tableController.js")
const {protect} = require("../middlewares/authMiddleware.js")
const router = express.Router()

router.get("/", protect, getTablesController)

module.exports = router;