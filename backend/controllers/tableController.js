const asyncHandler = require("express-async-handler")
const {getTables, createTable, updateTable, deleteTable} = require("../services/tableService.js")

const getTablesController = asyncHandler(async(req,res) => {
    const tables = await getTables(req.user.workspaceId)
    res.status(200).json(tables)
});

const createTableController = asyncHandler(async(req, res) => {
    const newTable = await createTable(req.body, req.user)
    res.status(201).json({
        newTable,
        response: "New table created successfully!"
    })
})

const updateTableController = asyncHandler(async(req, res) => {
    const {tableId} = req.params
    await updateTable(tableId, req.body, req.user)
    res.status(200).json({
        response: "Table updated successfully!"
    })
})

const deleteTableController = asyncHandler(async(req, res) => {
    const {tableId} = req.params
    const response = await deleteTable(tableId, req.user)
    if (response === "archived"){
        res.status(200).json({response: "Table is set to archived status!"})
    }else{
        res.status(200).json({response: "Table deleted successfully from this workspace!"})
    }
})

module.exports = {getTablesController, createTableController, updateTableController, deleteTableController}