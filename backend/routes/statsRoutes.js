const express = require("express")
const {protect} = require("../middlewares/authMiddleware.js")
const {adminOnly} = require("../middlewares/adminOnlyMiddleware.js")
const {statsWaiter, report} = require("../controllers/statsController.js")
const router = express.Router()

router.get("/waiter", protect, statsWaiter)

router.get("/performances", protect, adminOnly, report)

module.exports = router;