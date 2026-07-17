const express = require("express")
const dotenv = require("dotenv").config()
const connectDB = require('./config/db.js')
const {errorHandler} = require("./middlewares/errorMiddleware.js")
const port = process.env.PORT || 5000

// call the connection with mongo
connectDB();
const app = express();

// middleware to translate json
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// manage paths for user authentication
app.use("/api/auth", require("./routes/authRoutes.js"))

// manage paths for table modification
app.use("/api/tables", require("./routes/tableRoutes.js"))

// call middleware to catch the errors
app.use(errorHandler)

app.listen(port, () => console.log(`Server running on port ${port}`))