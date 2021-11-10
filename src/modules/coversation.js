import mongoose from 'mongoose'


const conversationModal = new mongoose.Schema({
    recepents: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    media: [],
    text: String,
}, {
    timestamps: true
})

export default mongoose.model("coversations", conversationModal)