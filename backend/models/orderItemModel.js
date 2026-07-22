const mongoose = require("mongoose")

const orderItemSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Order"
    },
    menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Menu"
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
    unitPrice: {
        type: Number,
        required: true
    },
    linePrice: {
        type: Number,
        required: true
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("OrderItem", orderItemSchema)