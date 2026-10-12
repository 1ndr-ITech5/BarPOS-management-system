const express = require("express")
const {getTablesController, createTableController, updateTableController, deleteTableController} = require("../controllers/tableController.js")
const {adminOnly} = require("../middlewares/adminOnlyMiddleware.js")
const {protect} = require("../middlewares/authMiddleware.js")
const router = express.Router()

router.get("/", protect, getTablesController)

router.post("/create", protect, adminOnly, createTableController)

router.patch("/update/:tableId", protect, adminOnly, updateTableController)

router.delete("/delete/:tableId", protect, adminOnly, deleteTableController)

module.exports = router;