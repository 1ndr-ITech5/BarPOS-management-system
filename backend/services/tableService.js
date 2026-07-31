const Table = require("../models/tableModel.js")
const User = require("../models/userModel.js")

const get = async() => {   
    const tables = await Table.find().populate("openedBy", "first_name last_name")
    return tables
}

module.exports = {get}