const User = require("../models/userModel.js")
const Workspace = require("../models/workspaceModel.js")
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") })
const connectDB = require("../config/db.js")

const createAdmin = async() => {
    try{
        await connectDB();
        await User.deleteMany({})

        const mainWorkspace = await Workspace.findOne({ type: "main" })
        const demoWorkspace = await Workspace.findOne({ type: "demo" })

        const admins = [
            {
                first_name: "Indrit",
                last_name: "Llangozi",
                username: "inll_125",
                password: process.env.ADMIN_PASSWORD,
                workspaceId: mainWorkspace._id,
                role: "admin"
            },
            {
                first_name: "Joe",
                last_name: "Doe",
                username: "demo_account",
                password: process.env.DEMO_PASSWORD,
                workspaceId: demoWorkspace._id,
                role: "admin"
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