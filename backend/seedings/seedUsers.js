const User = require("../models/userModel.js")
const Workspace = require("../models/workspaceModel.js")
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") })
const connectDB = require("../config/db.js")

const createAdmin = async() => {
    try{
        await connectDB();
        await User.deleteMany({})

        const mainWorkspace = await Workspace.findOne({ type: "real" })
        const demoWorkspace = await Workspace.findOne({ type: "demo" })

        const admins = [
            {
                first_name: "Indrit",
                last_name: "Llangozi",
                code: process.env.ADMIN_CODE,
                workspaceId: mainWorkspace._id,
                role: "admin"
            },
            {
                first_name: "Joe",
                last_name: "Doe",
                code: process.env.DEMO_ADMIN_CODE,
                workspaceId: demoWorkspace._id,
                role: "admin"
            },
            {
                first_name: "Demo",
                last_name: "Waiter",
                code: process.env.DEMO_WAITER_CODE,
                workspaceId: demoWorkspace._id,
                role: "waiter"
            }
        ]

        await User.create(admins)
        process.exit(0)
    }catch(error){
        console.log(`${error.message}`)
        process.exit(1)
    }
}

createAdmin();