const express = require("express")
const {registUser, logUser} = require("../controllers/authController.js")
const authLimiter = require("../middlewares/rateLimiter.js")
const {protect} = require("../middlewares/authMiddleware.js")
const {adminOnly} = require("../middlewares/adminOnlyMiddleware.js")
const router = express.Router()

// path to register controller
router.post("/register", authLimiter, protect, adminOnly, registUser)

// path to login controller
router.post("/login", authLimiter, logUser)

module.exports = router;