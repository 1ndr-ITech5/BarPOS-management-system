const express = require("express")
const dotenv = require("dotenv").config()
const validEnv = require("./config/validEnv.js")

validEnv();

const connectDB = require('./config/db.js')
const {errorHandler} = require("./middlewares/errorMiddleware.js")
const {checkDemoReset} = require("./services/demoResetService.js")
require("./jobs/demoResetJob.js")
const helmet = require("helmet")
const cors = require("cors")
const port = process.env.PORT || 5000

const app = express();

// enable communication with frontend port
app.use(cors({
    origin: process.env.FRONTEND_URL,
    allowedHeaders: ["Content-Type", "Authorization"]
}))

// set HTTP security headers with helmet
app.use(helmet())

// middleware to translate json
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// manage paths for user authentication
app.use("/api/auth", require("./routes/authRoutes.js"))

// manage paths for table modification
app.use("/api/tables", require("./routes/tableRoutes.js"))

// manage the menu items
app.use("/api/products", require("./routes/productRoutes.js"))

// manage the order manipulation paths
app.use("/api/order", require("./routes/orderRoutes.js"))

// manage the order items paths
app.use("/api/order", require("./routes/orderItemRoutes.js"))

// manage the payment paths
app.use("/api", require("./routes/paymentRoutes.js"))

// manage the stats
app.use("/api/stats", require("./routes/statsRoutes.js"))

// manage the categories path
app.use("/api/categories", require("./routes/categoryRoutes.js"))

// call middleware to catch the errors
app.use(errorHandler)

const startServer = async () => {
    await connectDB()
    await checkDemoReset()

    app.listen(port, () => {console.log(`Server running on port ${port}`)})
}

startServer()