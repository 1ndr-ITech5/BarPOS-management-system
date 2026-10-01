const mongoose = require("mongoose")

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ["demo", "main"],
        required: true
    },
    lastDemoReset: {
        type: Date,
        default: null
    }
    }, 
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Workspace", workspaceSchema)