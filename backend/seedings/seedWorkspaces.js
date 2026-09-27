const Workspace = require("../models/workspaceModel.js")
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") })
const connectDB = require("../config/db.js")

const createWorkspaces = async() => {
    try{
        await connectDB();

        await Workspace.deleteMany({})

        const workspaces = [
            {
                "name": "Bar Restaurant Kusho",
                "type": "main"
            },
            {
                "name": "Demo Workspace",
                "type": "demo"
            }
        ]

        await Workspace.insertMany(workspaces)

        process.exit(0)
    }catch(error){
        console.log(`${error.message}`)
        process.exit(1)
    }
}

createWorkspaces();