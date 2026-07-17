const express = require("express")
const {getTables, openTable, closeTable} = require("../controllers/tableController.js")
const {protect} = require("../middlewares/authMiddleware.js")
const router = express.Router()

router.get("/", getTables)

router.put("/:id/open", protect, openTable)

router.put("/:id/close", protect, closeTable)

module.exports = router;