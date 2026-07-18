require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") })
const Table = require("../models/tableModel.js")
const connectDB = require('../config/db.js')

const tables = [
    {
        tableNumber: 1,
        capacity: 4
    },
    {
        tableNumber: 2,
        capacity: 4
    },
    {
        tableNumber: 3,
        capacity: 4
    },
    {
        tableNumber: 4,
        capacity: 8
    }
]

const insertTables = async() => {
    try{
        // connect with the database
        await connectDB();

        // insert the tables
        await Table.deleteMany()
        await Table.insertMany(tables)

        // disconnect from the database with success
        process.exit(0)
    }catch(error){
        console.log(`Error during connection with DB: ${error}`)
        process.exit(1)
    }
}

insertTables();