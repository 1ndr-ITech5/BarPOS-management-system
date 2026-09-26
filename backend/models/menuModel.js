const mongoose = require("mongoose")

const menuSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    offeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Workspace"
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("Menu", menuSchema)