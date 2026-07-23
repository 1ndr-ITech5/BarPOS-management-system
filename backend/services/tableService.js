const Table = require("../models/tableModel.js")
const User = require("../models/userModel.js")

const get = async() => {   
    const tables = await Table.find()
    return tables
}

module.exports = {get}