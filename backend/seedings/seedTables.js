require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") })
const Table = require("../models/tableModel.js")
const Workspace = require("../models/workspaceModel.js")
const connectDB = require('../config/db.js')


const insertTables = async() => {
    try{
        await connectDB();
        await Table.deleteMany()

        const mainWorkspace = await Workspace.findOne({ type: "main" })
        const demoWorkspace = await Workspace.findOne({ type: "demo" })

        const tables = [
            {
                tableNumber: 1,
                capacity: 4,
                ownedBy: mainWorkspace._id
            },
            {
                tableNumber: 2,
                capacity: 4,
                ownedBy: mainWorkspace._id
            },
            {
                tableNumber: 3,
                capacity: 4,
                ownedBy: mainWorkspace._id
            },
            {
                tableNumber: 4,
                capacity: 8,
                ownedBy: mainWorkspace._id
            },
            {
                tableNumber: 5,
                capacity: 4,
                ownedBy: mainWorkspace._id
            },
            {
                tableNumber: 6,
                capacity: 8,
                ownedBy: mainWorkspace._id
            },
            {
                tableNumber: 1,
                capacity: 4,
                ownedBy: demoWorkspace._id
            },
            {
                tableNumber: 2,
                capacity: 4,
                ownedBy: demoWorkspace._id
            },
            {
                tableNumber: 3,
                capacity: 8,
                ownedBy: demoWorkspace._id
            },
            {
                tableNumber: 4,
                capacity: 8,
                ownedBy: demoWorkspace._id
            },
            {
                tableNumber: 5,
                capacity: 8,
                ownedBy: demoWorkspace._id
            },
            {
                tableNumber: 6,
                capacity: 8,
                ownedBy: demoWorkspace._id
            },
            {
                tableNumber: 7,
                capacity: 4,
                ownedBy: demoWorkspace._id
            },
            {
                tableNumber: 8,
                capacity: 4,
                ownedBy: demoWorkspace._id
            }
        ]

        await Table.insertMany(tables)
        process.exit(0)
    }catch(error){
        console.log(`Error during connection with DB: ${error}`)
        process.exit(1)
    }
}

insertTables();