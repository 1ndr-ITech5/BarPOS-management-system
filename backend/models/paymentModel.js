const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Order"
    },
    waiterId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    totalAmount: {
        type: Number,
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    change: {
        type: Number,
        required: true
    },
    tips: {
        type: Number,
        default: 0
    },
    method: {
        type: String,
        enum: ["cash", "card"],
        required: true
    },
    status: {
        type: String,
        enum: ["completed"],
        default: "completed"
    },
    paidAt: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("Payment", paymentSchema)