const express = require("express")
const {getTables} = require("../controllers/tableController.js")
const router = express.Router()

router.get("/", getTables)

module.exports = router;