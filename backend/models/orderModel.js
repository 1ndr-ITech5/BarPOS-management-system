const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    waiterId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    tableId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Table"
    },
    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open"
    },
    total: {
        type: Number,
        default: 0
    },
    closedAt: {
        type: Date,
        default: null
    }
}, 
{
    timestamps: true
})

module.exports = mongoose.model("Order", orderSchema)