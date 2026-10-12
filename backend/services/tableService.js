const Table = require("../models/tableModel.js")
const Order = require("../models/orderModel.js")

const getTables = async(workspaceId) => {   
    const tables = await Table.find({ownedBy: workspaceId, isActive: true})
    .populate("openedBy", "first_name last_name")
    .populate("ownedBy", "name")
    return tables
}

const createTable = async(tableData, userData) => {
    // check the fields
    const {name, capacity} = tableData

    if (!name || !capacity){
        const error = new Error("Please fill all the fields required!")
        error.statusCode = 400
        throw error
    }

    if (typeof name !== "string" || name.trim() === "")
    {
        const error = new Error("Please give a proper name for the table!")
        error.statusCode = 400
        throw error
    }

    const tableName = name.trim()

    if (typeof capacity !== "number" || !Number.isFinite(capacity) || !Number.isInteger(capacity) || capacity < 1)
    {
        const error = new Error("Please provide a positive number for capacity field!")
        error.statusCode = 400
        throw error
    }

    // check if the table exists in this workspace
    const table = await Table.findOne({tableName: tableName, ownedBy: userData.workspaceId})
    if (table){
        const error = new Error("This table exists already in your workspace!")
        error.statusCode = 409
        throw error
    }

    const newTable = await Table.create({
        tableName: tableName,
        capacity: tableCapacity,
        ownedBy: userData.workspaceId
    })

    return (newTable)
}

const updateTable = async(tableId, tableData, userData) => {
    // check if the table exists in this workspace
    const table = await Table.findOne({_id: tableId, ownedBy: userData.workspaceId})
    if (!table){
        const error = new Error("This table does not exists in this workspace!")
        error.statusCode = 404
        throw error
    }

    // check the status availability
    if (table.status !== "available"){
        const error = new Error("Cannot update an occupied table!")
        error.statusCode = 409
        throw error
    } 

    // check the given fields
    const {name, capacity} = tableData

    if (name !== undefined){
        const tableName = name.trim()
        if (typeof tableName !== "string" || tableName === "") {
            const error = new Error("Please give a proper name for the table!");
            error.statusCode = 400;
            throw error;
        }
        // ensure that the name is unique in its own workspace
        const existingTable = await Table.findOne({_id: {$ne: tableId}, tableName: tableName, ownedBy: userData.workspaceId})
        if (existingTable)
        {
            const error = new Error("The name of the table should be unique within its own workspace!")
            error.statusCode = 409
            throw error
        }
    }
    if (capacity !== undefined){
        if (typeof capacity !== "number" || !Number.isFinite(capacity) || !Number.isInteger(capacity) || capacity < 1)
        {
            const error = new Error("Please provide a positive number for capacity field!")
            error.statusCode = 400
            throw error
        }
    }
    if (name === undefined && capacity === undefined) {
        const error = new Error("At least one field must be provided")
        error.statusCode = 400
        throw error
    }

    const updates = {};
    if (name !== undefined) {
        updates.tableName = name.trim();
    }
    if (capacity !== undefined) {
        updates.capacity = capacity;
    }

    await Table.findByIdAndUpdate(
        tableId,
        {$set: updates},
        {runValidators: true, new: true}
    )
}

const deleteTable = async(tableId, userData) => {
    // check if table exists, we know the drill
    const table = await Table.findOne({_id: tableId, ownedBy: userData.workspaceId})
    if (!table){
        const error = new Error("This table does not exists in this workspace!")
        error.statusCode = 404
        throw error
    }

    if (table.status !== "available"){
        const error = new Error("Cannot delete an occupied table!")
        error.statusCode = 409
        throw error
    } 

    // check if this table has historical orders associated
    const closedOrders = await Order.find({tableId: tableId, workspaceId: userData.workspaceId, status: "closed"})
    if (closedOrders.length > 0){
        await Table.findByIdAndUpdate(tableId, {isActive: false}, {runValidators: true, new: true})
        return "archived"
    }else{
        await Table.findByIdAndDelete(tableId)
        return "deleted"
    }
}

module.exports = {getTables, createTable, updateTable, deleteTable}