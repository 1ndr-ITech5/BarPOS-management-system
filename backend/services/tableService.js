const Table = require("../models/tableModel.js")
const User = require("../models/userModel.js")

const get = async() => {   
    const tables = await Table.find()
    return tables
}

const open = async(user_id, table_id) => {
    // find the table selected in DB
    const table = await Table.findById(table_id)
    if (!table){
        const error = new Error("This table does not exist!")
        error.statusCode = 404
        throw error;
    }

    // check if table has the occupied status
    if (table.status === "occupied"){
        const error = new Error("Cannot open a table that is currently occupied!")
        error.statusCode = 400
        throw error;
    }
    
    // check the user in DB
    const user = await User.findById(user_id)
    if (!user){
        const error = new Error("This user does not exist!")
        error.statusCode = 404
        throw error;
    }

    // now we update the status of the table
    const updatedTable = await Table.findByIdAndUpdate(
        table._id,
        {
            status: "occupied",
            openedBy: user._id,
            timeOpened: new Date()
        },
        {new: true, runValidators: true}
    )

    return updatedTable
}

const close = async(user_id, table_id) => {
    // find the table selected in DB
    const table = await Table.findById(table_id)
    if (!table){
        const error = new Error("This table does not exist!")
        error.statusCode = 404
        throw error;
    }

    // check if table has the occupied status
    if (table.status !== "occupied"){
        const error = new Error("Cannot close a table that is already available!")
        error.statusCode = 400
        throw error;
    }
    
    // check the user in DB
    const user = await User.findById(user_id)
    if (!user){
        const error = new Error("This user does not exist!")
        error.statusCode = 404
        throw error;
    }

    // now we update the status of the table
    const updatedTable = await Table.findByIdAndUpdate(
        table._id,
        {
            status: "available",
            openedBy: null,
            timeOpened: null
        },
        {new: true, runValidators: true}
    )

    return updatedTable
}

module.exports = {get, open, close}