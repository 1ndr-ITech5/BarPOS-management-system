const mongoose = require("mongoose")

const CategorySchema = new mongoose.Schema({
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Workspace"
    },
    categoryName: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isArchived: {
        type: Boolean,
        default: false
    } 
    },
    {timestamps: true}
)

module.exports = mongoose.model("Category", CategorySchema)