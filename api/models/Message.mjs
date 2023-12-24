import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    from: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    to: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    text: String
}, {timestamps: true})

const messageModel = mongoose.model("messages", messageSchema)
export default messageModel