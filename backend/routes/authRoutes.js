const express = require("express")
const {registUser, logUser, logDemoUser, getMe} = require("../controllers/authController.js")
const authLimiter = require("../middlewares/rateLimiter.js")
const {protect} = require("../middlewares/authMiddleware.js")
const {adminOnly} = require("../middlewares/adminOnlyMiddleware.js")
const router = express.Router()

router.get("/me", protect, getMe)

// path to register controller
router.post("/register", protect, adminOnly, registUser)

// path to login controller
router.post("/login", authLimiter, logUser)

// path to login controller for demo account
router.post("/login-demo", logDemoUser)

module.exports = router;