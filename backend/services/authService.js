const bcrypt = require("bcryptjs")
const User = require("../models/userModel.js")


// bussiness logic for register
const register = async(user_info) => {
    const { first_name, last_name, username, password, role } = user_info

    // check if the user has provided all the needed datas
    if ( !first_name || !last_name || !username || !password){
        const error = new Error("Please fill all the required fields!")
        error.statusCode = 400
        throw error;
    }

    // check if the username given, exists already in database
    const user = await User.findOne({username})
    if (user){
        const error = new Error("This user already exists!")
        error.statusCode = 400
        throw error;
    }

    // save the new user to the database
    const newUser = await User.create({
        first_name, last_name, username, 
        password, role})

    return newUser
}


const login = async(user_info) => {
    const { username, password } = user_info

    // check if the fields are filled
    if (!username || !password){
        const error = new Error("Please fill all the required fields!")
        error.statusCode = 400
        throw error;
    }

    // check if this username exists
    const user = await User.findOne({username})
    if (!user){
        const error = new Error("This user does not exist!")
        error.statusCode = 404
        throw error;
    }

    // check if the passwords match
    const passmatch = await bcrypt.compare(password, user.password)
    if (!passmatch){
        const error = new Error("Wrong password provided for this user!")
        error.statusCode = 401
        throw error;
    }

    return user
}

module.exports = {register, login};