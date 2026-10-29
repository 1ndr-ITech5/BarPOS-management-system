const jwt = require("jsonwebtoken")
const Workspace = require("../models/workspaceModel.js")
const {messageError} = require("../utils/messageErrors.js");

const workspaceProtect = async(req, res, next) => {
    let token;

    // check if the req.headers exists
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1]
            // extract the workspace id from token
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            // check in the db if this workspace exists
            const workspace = await Workspace.findById(decode.workspaceId).select("-password")
            if (!workspace){
                throw messageError("This workspace does not exist anymore!", 401)
            }
            req.workspace = workspace
            next();
        }catch(error){
            error.statusCode = 401
            throw error;
        }
    }

    // check if token is empty
    if (!token){
        throw messageError("Please log in to continue!", 401)
    }
}

module.exports = {workspaceProtect}