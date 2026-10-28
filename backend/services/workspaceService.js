const Workspace = require("../models/workspaceModel.js")
const {messageError} = require("../utils/messageErrors.js")
const generateToken = require("../utils/generateToken.js")
const bcrypt = require("bcryptjs")

// login on real workspace accounts
const loginOnRealWorkspace = async(loginData) => {
    // destruct the given data
    const {workspaceName, password} = loginData

    // check the username principles
    if (workspaceName.trim() === "" || typeof workspaceName !== "string"){
        throw messageError("Please provide the workspace name!", 400)
    }

    // check if this workspace exists in db
    const existingWorkspace = await Workspace.findOne({workspaceName: workspaceName.trim()})
    if(!existingWorkspace){
        throw messageError("This workspace does not exist!", 404)
    }

    // check if the given password matches
    const matchingPasswords = await bcrypt.compare(password, existingWorkspace.password)
    if (!matchingPasswords){
        throw messageError("Wrong password provided for this workspace!", 401)
    }

    // return the workspace data
    return {
        barName: existingWorkspace.barName, 
        workspaceName: existingWorkspace.workspaceName, 
        type: existingWorkspace.type,
        token: generateToken({workspaceId: existingWorkspace._id, type: "workspace"})
    }
}

// login on demo workspace
const loginOnDemoWorkspace = async() => {
    // pass the needed checks
    const demoWorkspace = await Workspace.findOne({workspaceName: process.env.DEMO_WORKSPACE_NAME})
    if(!demoWorkspace){
        throw messageError("An error occured on demo workspace login! Please try later!", 404)
    }

    const matchPasswords = await bcrypt.compare(demoWorkspace.password, process.env.DEMO_PASSWORD)
    if(!matchPasswords){
        throw messageError("An error occured on demo workspace login! Please try later!", 401)
    }

    // return the demo workspace data
    return {
        barName: demoWorkspace.barName, 
        workspaceName: demoWorkspace.workspaceName, 
        type: demoWorkspace.type,
        token: generateToken({workspaceId: demoWorkspace._id, type: "workspace"})
    }
}

module.exports = {loginOnRealWorkspace, loginOnDemoWorkspace}