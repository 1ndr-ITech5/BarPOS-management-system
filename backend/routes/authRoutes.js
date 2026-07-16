const express = require("express")
const {registUser, logUser} = require("../controllers/authController.js")
const router = express.Router()

// path to register controller
router.post("/register", registUser)

// path to login controller
router.post("/login", logUser)

module.exports = router;