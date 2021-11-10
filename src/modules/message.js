import mongoose from 'mongoose'

const conversationModal = new mongoose.Schema({
    conversation: { type: mongoose.Types.ObjectId, ref: "coversations" },
    sender: { type: mongoose.Types.ObjectId, ref: 'user' },
    receiver: { type: mongoose.Types.ObjectId, ref: 'user' },
    media: [],
    text: String,
}, {
    timestamps: true
})
export default mongoose.model("messages", conversationModal)