const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        trim: true,
        match: /^\d{4,6}$/
    },
    role: {
        type: String,
        enum: ["admin", "waiter"],
        default: "waiter"
    },
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Workspace"
    }
    },
    {
        timestamps: true
})

// use mongoose middleware to hash the user's password
userSchema.pre("save", async function() {
    if (!this.isModified("password")) return
    const salt = await bcrypt.genSalt(10)
    this.code = await bcrypt.hash(this.code, salt)
})

// use compound index to have only an unique combination of username and workspace
userSchema.index(
    {code: 1, workspaceId: 1},
    {unique: true}
)

module.exports = mongoose.model("User", userSchema)