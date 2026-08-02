const asyncHandler = require("express-async-handler")
const {registerNewUser, loginExistingUser} = require("../services/authService.js")
const generateToken = require("../utils/generateToken.js")

// bussiness logic for register
const registUser = asyncHandler(async(req, res) => {
    
    // get the result from the service
    const newUser = await registerNewUser(req.body)

    // check if the new user is created
    res.status(201).json({
        first_name: newUser.first_name, 
        last_name: newUser.last_name, 
        username: newUser.username, 
        role: newUser.role,
        token: generateToken(newUser._id),
        response: "New user registed successfully!"
    })
})


const logUser = asyncHandler(async(req, res) => {
    
    const user = await loginExistingUser(req.body)

    // return the user info in frontend altogether with the token
    res.status(200).json({
        first_name: user.first_name, 
        last_name: user.last_name, 
        username: user.username, 
        role: user.role,
        token: generateToken(user._id),
        response: "User logged in successfully!"
    })
})

module.exports = {registUser, logUser}