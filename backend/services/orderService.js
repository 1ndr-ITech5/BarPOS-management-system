const Order = require("../models/orderModel.js")
const Table = require("../models/tableModel.js")
const User = require("../models/userModel.js")


// get the order based on the table id
const getOrder = async(table_id) => {
    // check if this table exists in db
    const table = await Table.findById(table_id)
    if (!table){
        const error = new Error("This table does not exist!")
        error.statusCode = 404
        throw error;
    }
    
    // get the order based on the table
    const order = await Order.findOne({
        tableId: table_id,
        status: "open"
    })

    // cases when you get order and when not
    if (!order) {
        return null
    }else{
        return order
    }
}

// create the order
const openOrder = async(table_id, user_id) => {
    // check if the user exists in db
    const user = await User.findById(user_id)
    if (!user) {
        const error = new Error("This user does not exist!")
        error.statusCode = 404
        throw error;
    }

    // check if the table exists in db
    const table = await Table.findById(table_id)
    if (!table) {
        const error = new Error("This table does not exist!")
        error.statusCode = 404
        throw error;
    }

    // check if any order is opened for that table
    const order = await Order.findOne({
        tableId: table_id,
        status: "open"
    })
    if (order) {
        const error = new Error("This table has an order already!")
        error.statusCode = 400
        throw error;
    }

    // create the order for that table
    const newOrder = await Order.create({
        waiterId: user_id,
        tableId: table_id
    })

    // update the table status to occupied after the newOrder gets created
    const updateTableStatus = await Table.findByIdAndUpdate(
        table._id, 
        {status: "occupied"},
        {new: true, runValidators: true}
    )

    return newOrder

    // calculate the total from all products price
}