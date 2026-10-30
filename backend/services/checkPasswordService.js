const bcrypt = require("bcryptjs")
const {messageError} = require("../utils/messageErrors.js")

const verifyPassword = async(inputPassword, userPassword) => {
    // check if the passwords match
    const passmatch = await bcrypt.compare(inputPassword, userPassword)
    if (!passmatch){
        throw messageError("Wrong password provided for this user!", 401)
    }
    return passmatch
}

module.exports = {verifyPassword}