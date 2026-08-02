const Table = require("../models/tableModel.js")

const getTables = async() => {   
    const tables = await Table.find().populate("openedBy", "first_name last_name")
    return tables
}

module.exports = {getTables}