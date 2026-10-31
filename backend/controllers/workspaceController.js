const {loginOnRealWorkspace, loginOnDemoWorkspace} = require("../services/workspaceService.js")
const asyncHandler = require("express-async-handler")

const signInRealWorkspace = asyncHandler(async(req, res) => {
    const workspace = await loginOnRealWorkspace(req.body)
    res.status(200).json({workspace, response: `Signed in the ${workspace.barName} workspace!`})
})

const signInDemoWorkspace = asyncHandler(async(req, res) => {
    const demo = await loginOnDemoWorkspace()
    res.status(200).json({workspace: demo, response: `Signed in the ${demo.barName} workspace!`})
})

module.exports = {signInRealWorkspace, signInDemoWorkspace}