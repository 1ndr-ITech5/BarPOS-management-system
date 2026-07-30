const User = require("../models/userModel.js")
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") })
const connectDB = require("../config/db.js")

const createAdmin = async() => {
    try{
        await connectDB();

        // check if any admin is already stored in db
        const admin = await User.findOne({role: "admin"})
        if (admin){
            throw new Error("An admin exists already in database!")
        }

        const newAdmin = await User.create({
            first_name: "Indrit",
            last_name: "Llangozi",
            username: "inll_125",
            password: process.env.ADMIN_PASSWORD,
            role: "admin"
        })

        process.exit(0)
    }catch(error){
        console.log(`${error.message}`)
        process.exit(1)
    }
}

createAdmin();