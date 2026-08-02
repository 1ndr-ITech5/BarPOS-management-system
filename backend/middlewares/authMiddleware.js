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
            const user = await User.findById(decode.id).select("-password")
            if (!user){
                const error = new Error("This user does not exist anymore!")
                error.statusCode = 401
                throw error;
            }
            req.user = user
            next();
        }catch(error){
            error.statusCode = 401
            throw error;
        }
    }

    // check if token is empty
    if (!token){
        const error = new Error("You are not authorized for this action!")
        error.statusCode = 401
        throw error;
    }
}

module.exports = {protect}