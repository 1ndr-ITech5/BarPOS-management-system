const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
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
    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(this.password, salt)

    // save the hashed password as the new password
    this.password = hashPassword
})

// use compound index to have only an unique combination of username and workspace
userSchema.index(
    {username: 1, workspaceId: 1},
    {unique: true}
)

module.exports = mongoose.model("User", userSchema)