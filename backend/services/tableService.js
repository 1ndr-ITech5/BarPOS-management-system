const Table = require("../models/tableModel.js")

const getTables = async(workspaceId) => {   
    const tables = await Table.find({ownedBy: workspaceId})
    .populate("openedBy", "first_name last_name")
    .populate("ownedBy", "name")
    return tables
}

module.exports = {getTables}