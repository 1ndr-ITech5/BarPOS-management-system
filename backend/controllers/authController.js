const asyncHandler = require("express-async-handler")
const {registerNewUser, loginExistingUser, loginOnDemo, getUser} = require("../services/authService.js")

const getMe = asyncHandler(async(req, res) => {
    const userInfo = await getUser(req.user)
    res.status(200).json(userInfo);
})

const registUser = asyncHandler(async(req, res) => {
    await registerNewUser(req.body, req.user)
    res.status(201).json({response: "New user registed successfully!"})
})

const logUser = asyncHandler(async(req, res) => {
    const user = await loginExistingUser(req.body, req.workspace)
    res.status(200).json({user, response: "User logged in successfully!"})
})

const logDemoUser = asyncHandler(async(req, res) => {
    const {selectedRole} = req.body
    const {workspaceId} = req.workspace

    const demoUser = await loginOnDemo(selectedRole, workspaceId)
    res.status(200).json({user: demoUser, response: "Demo User logged in successfully!"})
})

module.exports = {registUser, logUser, logDemoUser, getMe}