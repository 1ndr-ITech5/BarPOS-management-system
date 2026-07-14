const express = require("express")
const dotenv = require("dotenv").config()
const connectDB = require('./config/db.js')
const port = process.env.PORT || 8000

// call the connection with mongo
connectDB();
const app = express();

// middleware to translate json
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.listen(port, () => console.log(`Server running on port ${port}`))