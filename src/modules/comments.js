import mongoose from 'mongoose'

const commentsSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    tag: Object,
    reply: { type: mongoose.Types.ObjectId, ref: 'comments' },
    likes: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    postId: { type: mongoose.Types.ObjectId, ref: "post" },
    postUserId: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
    timestamps: true
})

export default mongoose.model('comments', commentsSchema)