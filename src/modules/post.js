import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    content: String,
    images: { type: Array, default: [] },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    comments: [{ type: mongoose.Types.ObjectId, ref: 'comments' }],
    user: { type: mongoose.Types.ObjectId, ref: 'user' }
}, {
    timestamps: true
})

export default mongoose.model('post', postSchema) 