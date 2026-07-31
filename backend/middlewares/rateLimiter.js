const rateLimit = require("express-rate-limit")

const authLimiter = rateLimit({
    windowMs: 20 * 60 * 1000,
    max: 6,
    message: {
        message: "Too many requests done! Try again after 20 minutes!"
    },
    standardHeaders: true,
    legacyHeaders: false
})

module.exports = authLimiter;