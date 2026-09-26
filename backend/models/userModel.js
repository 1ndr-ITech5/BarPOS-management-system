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
        required: true,
        unique: true
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
    partOf: {
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
    // check if password is modified
    if(!this.isModified("password")){
        return;
    }

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(this.password, salt)

    // save the hashed password as the new password
    this.password = hashPassword
})

module.exports = mongoose.model("User", userSchema)