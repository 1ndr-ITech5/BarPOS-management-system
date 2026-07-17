const jwt = require("jsonwebtoken")
const User = require("../models/userModel.js")

const protect = async(req, res, next) => {
    let token;

    // check if the req.headers exists
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1]
            // extract the user's id from token
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            // check in the db if this user exists
            req.user = await User.findById(decode.id).select("-password")
            next();
        }catch(error){
            console.log(`Error: ${error}!`)
        }
    }

    // check if token is empty
    if (!token){
        res.status(401)
        throw new Error("Not authorized for this action!")
    }
}

module.exports = {protect}