const jwt = require("jsonwebtoken")

const generateToken = (id) => {
    return jwt.sign({id: id.toString()}, process.env.JWT_SECRET, {expiresIn: '5d'})
}

module.exports = generateToken;