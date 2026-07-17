const mongoose = require("mongoose")

const TableSchema = new mongoose.Schema({
    table_no: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["available", "occupied"],
        default: "available"
    },
    capacity: {
        type: Number,
        required: true
    },
    openedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    time_opened: {
        type: Date,
        default: null
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("Table", TableSchema)