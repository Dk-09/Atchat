import mongoose from "mongoose"

const user = new mongoose.Schema({
    username: {
        type: String,
        required: [true,"username is required"],
        unique: [true,"The username {VALUE} is already taken"],
        min: [4,"username must have more than 4 characters"],
        max: [20,"username must be less than 20 characters"]
    },
    password:{
        type: String,
        required: [true,"password is required"],
        min: [4,"password must have more than 4 characters"],
        max: [20,"password must be less than 20 characters"]
    },
}, {timestamps: true})

const userModel = mongoose.model("user", user)
export default userModel