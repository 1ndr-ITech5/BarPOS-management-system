const User = require("../models/userModel.js")
const {verifyPassword} = require("./checkPasswordService.js")
const {messageError} = require("../utils/messageErrors.js")
const generateToken = require("../utils/generateToken.js")

// bussiness logic for register
const registerNewUser = async(userFields, adminData) => {
    const { first_name, last_name, code, role } = userFields

    // check that this operation cannot be called from demo workspace admins
    if(adminData.workspaceId.workspaceName === "demo"){
        throw messageError("A demo admin cannot register users!", 403)
    }

    // check if admin has provided all fields
    if(!first_name.trim() || !last_name.trim() || typeof first_name !== "string" || typeof last_name !== "string"){
        throw messageError("First and last names must be provided!", 400)
    }

    // check if the user given, exists already in database, in its own workspace
    const users = await User.find({workspaceId: adminData.workspaceId})
    for (const user of users){
        const matchingUser = await verifyPassword(code, user.code)

        if(matchingUser){
            throw messageError("This user already exists in your workspace!", 409)
        }
    }

    // try-catch block to handle race condition in user registration
    try {
        await User.create({
            first_name, last_name, code, role, 
            workspaceId: adminData.workspaceId
        })
    } catch (error) {
        if (error.code === 11000) {
            throw messageError("This user already exists!", 409)
        }
        throw error
    }
}

// log user in his workspace
const loginExistingUser = async(userCode, workspaceData) => {
    const { code } = userCode

    // check if the fields are filled
    if (!code){
        throw messageError("Please input the code field!", 400)
    }

    // check if code is given in desired format
    if (typeof code !== "string" || !/^\d{4,6}$/.test(code)){
        throw messageError("The code must contain between 4 and 6 digits!", 400)
    }

    // get all the users from the workspace where logged in
    const users = await User.find({workspaceId: workspaceData._id})

    // loop through them and find the matching code
    let matchingUser;

    for (const user of users){
        const match = await verifyPassword(code, user.code)

        if(match){
            matchingUser = user;
            break;
        }
    }

    return {
        first_name: matchingUser.first_name, 
        last_name: matchingUser.last_name,  
        role: matchingUser.role,
        workspaceId: matchingUser.workspaceId._id,
        workspace: matchingUser.workspaceId.barName,
        token: generateToken({userId: matchingUser._id.toString(), 
            workspaceId: matchingUser.workspaceId.toString(), type: "user"})
    }
}

const loginOnDemo = async(selectedRole, workspaceId) => {
    // find the selected user role on that workspace
    const demoUser = await User.findOne({workspaceId, role: selectedRole}).populate("workspaceId", "name")
    if (!demoUser){
        throw messageError("This demo user was not found!", 404)
    }

    // check the user's code
    await verifyPassword(process.env.DEMO_PASSWORD, demoUser.code)
    return {
        first_name: demoUser.first_name, 
        last_name: demoUser.last_name, 
        role: demoUser.role,
        workspaceId: demoUser.workspaceId._id,
        workspace: demoUser.workspaceId.barName,
        token: generateToken({userId: demoUser._id.toString(), 
            workspaceId: demoUser.workspaceId.toString(), type: "user"})
    }
}

const getUser = async(userData) => {
    // check if this user exists in database in his own workspace
    const user = await User.findOne({_id: userData._id, workspaceId: userData.workspaceId}).select("-code")
    if (!user){
        throw messageError("This user could not be found!", 404)
    }
    return user
}

module.exports = {registerNewUser, loginExistingUser, loginOnDemo, getUser};