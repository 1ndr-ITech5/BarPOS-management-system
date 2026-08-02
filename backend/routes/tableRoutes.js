const express = require("express")
const {getTablesController} = require("../controllers/tableController.js")
const router = express.Router()

router.get("/", getTablesController)

module.exports = router;