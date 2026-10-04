const asyncHandler = require("express-async-handler")
const {registerNewUser, loginExistingUser, loginOnDemo, getUser} = require("../services/authService.js")
const generateToken = require("../utils/generateToken.js")

const getMe = asyncHandler(async(req, res) => {
    const userInfo = await getUser(req.user)
    res.status(200).json(userInfo);
})

// bussiness logic for register
const registUser = asyncHandler(async(req, res) => {
    
    // get the result from the service
    await registerNewUser(req.body, req.user.workspaceId)

    // check if the new user is created
    res.status(201).json({response: "New user registed successfully!"})
})


const logUser = asyncHandler(async(req, res) => {
    
    const user = await loginExistingUser(req.body)

    // return the user info in frontend altogether with the token
    res.status(200).json({
        first_name: user.first_name, 
        last_name: user.last_name, 
        username: user.username, 
        role: user.role,
        workspaceId: user.workspaceId._id,
        workspace: user.workspaceId.name,
        token: generateToken(user._id, user.workspaceId),
        response: "User logged in successfully!"
    })
})

const logDemoUser = asyncHandler(async(req, res) => {
    const demoUser = await loginOnDemo()

    res.status(200).json({
        first_name: demoUser.first_name, 
        last_name: demoUser.last_name, 
        username: demoUser.username, 
        role: demoUser.role,
        workspaceId: demoUser.workspaceId._id,
        workspace: demoUser.workspaceId.name,
        token: generateToken(demoUser._id, demoUser.workspaceId),
        response: "Demo User logged in successfully!"
    })
})

module.exports = {registUser, logUser, logDemoUser, getMe}