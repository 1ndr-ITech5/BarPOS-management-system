const jwt = require("jsonwebtoken")

const generateToken = (userId, workspaceId) => {
    return jwt.sign({userId: userId.toString(), workspaceId: workspaceId.toString()}, process.env.JWT_SECRET, {expiresIn: '5d'})
}

module.exports = generateToken;