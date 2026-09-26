const mongoose = require("mongoose")

const workspaceSchema = new mongoose.Schema({
    workspaceName: {
        type: String, 
        required: true,
        unique: true
    },
    workspaceType: {
        type: String,
        enum: ["demo", "main"],
        required: true
    }
    }, 
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Workspace", workspaceSchema)