const bcrypt = require("bcryptjs")

const verifyPassword = async(inputPassword, userPassword) => {
    // check if the passwords match
    const passmatch = await bcrypt.compare(inputPassword, userPassword)
    if (!passmatch){
        const error = new Error("Wrong password provided for this user!")
        error.statusCode = 401
        throw error;
    }
}

module.exports = {verifyPassword}