const mongoose = require("mongoose")

const TableSchema = new mongoose.Schema({
    tableNumber: {
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
    ownedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Workspace"
    },
    openedBy: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "User"
    },
    timeOpened: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("Table", TableSchema)