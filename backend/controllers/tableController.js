const asyncHandler = require("express-async-handler")
const {get, open, close} = require("../services/tableService.js")

const getTables = asyncHandler(async(req,res) => {
    const tables = await get()
    res.status(200).json(tables)
});

module.exports = {getTables}