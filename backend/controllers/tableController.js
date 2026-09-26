const asyncHandler = require("express-async-handler")
const {getTables} = require("../services/tableService.js")

const getTablesController = asyncHandler(async(req,res) => {
    const tables = await getTables(req.user.workspaceId)
    res.status(200).json(tables)
});

module.exports = {getTablesController}