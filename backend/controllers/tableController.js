const asyncHandler = require("express-async-handler")
const {get, open, close} = require("../services/tableService.js")

const getTables = asyncHandler(async(req,res) => {
    const tables = await get()
    res.status(200).json(tables)
});

const openTable = asyncHandler(async(req,res) => {
    // destruct req.user and table id
    const {_id: userId} = req.user
    const {id: tableId} = req.params

    const tableOpen = await open(userId, tableId)

    res.status(200).json({
        tableOpen,
        response: "Table opened successfully!"
    })
})

const closeTable = asyncHandler(async(req,res) => {
    // destruct req.user and table id
    const {_id: userId} = req.user
    const {id: tableId} = req.params

    const tableClose = await close(userId, tableId)

    res.status(200).json({
        tableClose,
        response: "Table closed successfully!"
    })
})

module.exports = {getTables, openTable, closeTable}