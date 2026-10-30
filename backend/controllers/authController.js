const asyncHandler = require("express-async-handler")
const {registerNewUser, loginExistingUser, loginOnDemo, getUser} = require("../services/authService.js")
const generateToken = require("../utils/generateToken.js")

const getMe = asyncHandler(async(req, res) => {
    const userInfo = await getUser(req.user)
    res.status(200).json(userInfo);
})

const registUser = asyncHandler(async(req, res) => {
    // get the result from the service
    await registerNewUser(req.body, req.user)
    // check if the new user is created
    res.status(201).json({response: "New user registed successfully!"})
})


const logUser = asyncHandler(async(req, res) => {
    const user = await loginExistingUser(req.body, req.workspace)

    // return the user info in frontend altogether with the token
    res.status(200).json({
        first_name: user.first_name, 
        last_name: user.last_name,  
        role: user.role,
        workspaceId: user.workspaceId._id,
        workspace: user.workspaceId.name,
        token: generateToken({userId: user._id.toString(), workspaceId: user.workspaceId.toString(), type: "user"}),
        response: "User logged in successfully!"
    })
})

const logDemoUser = asyncHandler(async(req, res) => {
    const {selectedRole} = req.body
    const {workspaceId} = req.workspace

    const demoUser = await loginOnDemo(selectedRole, workspaceId)

    res.status(200).json({
        first_name: demoUser.first_name, 
        last_name: demoUser.last_name, 
        role: demoUser.role,
        workspaceId: demoUser.workspaceId._id,
        workspace: demoUser.workspaceId.name,
        token: generateToken({userId: demoUser._id.toString(), workspaceId: demoUser.workspaceId.toString(), type: "user"}),
        response: "Demo User logged in successfully!"
    })
})

module.exports = {registUser, logUser, logDemoUser, getMe}