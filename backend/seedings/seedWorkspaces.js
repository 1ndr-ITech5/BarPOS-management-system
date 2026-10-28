const Workspace = require("../models/workspaceModel.js")
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") })
const connectDB = require("../config/db.js")

const createWorkspaces = async() => {
    try{
        await connectDB();

        await Workspace.deleteMany({})

        const workspaces = [
            {
                "barName": "Bar Restaurant Kusho",
                "workspaceName": "kushoteam",
                "password": process.env.REAL_WORKSPACE_PASSWORD,
                "type": "real"
            },
            {
                "barName": "Demo Workspace",
                "workspaceName": "demoaccount",
                "password": process.env.DEMO_PASSWORD,
                "type": "demo"
            },
        ]

        await Workspace.create(workspaces)

        process.exit(0)
    }catch(error){
        console.log(`${error.message}`)
        process.exit(1)
    }
}

createWorkspaces();