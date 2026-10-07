const User = require("../models/userModel.js")
const Workspace = require("../models/workspaceModel.js")
const {verifyPassword} = require("./checkPasswordService.js")

// bussiness logic for register
const registerNewUser = async(user_info, workspaceId) => {
    const { first_name, last_name, username, password, role } = user_info

    // check if the user has provided all the needed datas
    if ( !first_name || !last_name || !username || !password){
        const error = new Error("Please fill all the required fields!")
        error.statusCode = 400
        throw error;
    }

    // check if the username given, exists already in database, in its own workspace
    const user = await User.findOne({username, workspaceId})
    if (user){
        const error = new Error("This user already exists!")
        error.statusCode = 409
        throw error;
    }

    // try-catch block to handle the same time user registration
    try {
        await User.create({
            first_name, last_name, username, 
            password, role, workspaceId
        })
    } catch (error) {
        if (error.code === 11000) {
            const err = new Error("This user already exists!")
            err.statusCode = 409
            throw err
        }
        throw error
    }
}


const loginExistingUser = async(user_info) => {
    const { username, password } = user_info

    // check if the fields are filled
    if (!username || !password){
        const error = new Error("Please fill all the required fields!")
        error.statusCode = 400
        throw error;
    }

    // check if this username exists
    const user = await User.findOne({username}).populate("workspaceId", "name")
    if (!user){
        const error = new Error("This user does not exist!")
        error.statusCode = 404
        throw error;
    }

    // check if the passwords match
    await verifyPassword(password, user.password)
    return user;
}

const loginOnDemo = async() => {
    // find the demo workspace
    const demoWorkspace = await Workspace.findOne({type: "demo"})
    if (!demoWorkspace)
    {
        const error = new Error("This workspace does not exist!")
        error.statusCode = 404
        throw error;
    }

    // find the admin on that workspace
    const demoUser = await User.findOne({workspaceId: demoWorkspace._id, role: "admin"}).populate("workspaceId", "name")
    if (!demoUser)
    {
        const error = new Error("This demo user was not found!")
        error.statusCode = 404
        throw error;
    }

    // call the helper function that checks for password match
    await verifyPassword(process.env.DEMO_PASSWORD, demoUser.password)
    return demoUser;
}

const getUser = async(userData) => {
    // check if this user exists in database in his own workspace
    const user = await User.findOne({_id: userData._id, workspaceId: userData.workspaceId}).select("-password")
    if (!user){
        const error = new Error("This user could not be found!")
        error.statusCode = 404
        throw error;
    }

    return user
}

module.exports = {registerNewUser, loginExistingUser, loginOnDemo, getUser};