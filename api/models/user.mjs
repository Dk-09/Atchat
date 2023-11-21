import mongoose from "mongoose"

const user = new mongoose.Schema({
    username: {
        type: String,
        required: [true,"username is required"],
        unique: [true,"The username is already taken"]
    },
    password:{
        type: String,
        required: [true,"password is required"]
    },
}, {timestamps: true})

const userModel = mongoose.model("user", user)
export default userModel