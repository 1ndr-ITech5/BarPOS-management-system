const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Workspace"
    },
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

orderSchema.index(
    { tableId: 1 },
    {
        unique: true,
        partialFilterExpression: {
            status: "open"
        }
    }
)

module.exports = mongoose.model("Order", orderSchema)