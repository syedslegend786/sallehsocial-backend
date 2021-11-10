import CommentSchema from '../modules/comments.js'
import PostSchema from '../modules/post.js'
export const commentsCtrl = {
    createComment: async (req, res) => {
        try {
            const { content, postId, tag, reply, postUserId } = req.body
            const newComment = new CommentSchema({
                user: req.user.id,
                content,
                tag,
                reply,
                postId,
                postUserId,
            })
            await PostSchema.findOneAndUpdate({ _id: postId }, {
                $push: {
                    comments: newComment._id
                }
            }, { new: true })
            await newComment.save()
            return res.status(200).json({
                newComment
            })
        } catch (error) {
            return res.status(500).json({
                msg: error.message,
            })
        }

    },
    updateComment: async (req, res) => {
        try {
            const { id, content } = req.body;
            await CommentSchema.findOneAndUpdate({ _id: id }, {
                content: content,
            })
            return res.status(200).json({
                msg: 'comment updated!'
            })
        } catch (error) {
            return res.status(500).json({
                msg: error.message
            })
        }
    },
    likeComment: async (req, res) => {
        try {
            const { id } = req.body;
            await CommentSchema.findOneAndUpdate({ _id: id }, {
                $push: {
                    likes: req.user.id
                }
            })
            return res.status(200).json({
                msg: 'commentliked!'
            })
        } catch (error) {
            return res.status(500).json({
                msg: error.message
            })
        }
    },
    unlikeComment: async (req, res) => {
        try {
            const { id } = req.body;
            await CommentSchema.findOneAndUpdate({ _id: id }, {
                $pull: {
                    likes: req.user.id
                }
            })
            return res.status(200).json({
                msg: 'commentunliked!'
            })
        } catch (error) {
            return res.status(500).json({
                msg: error.message
            })
        }
    },
    deleteComment: async (req, res) => {
        try {
            const comments = await CommentSchema.findOneAndDelete({
                _id: req.params.id,
                $or: [
                    { user: req.user.id },
                    { postUserId: req.user.id },
                ]
            })
            await PostSchema.findOneAndUpdate({
                _id: comments.postId
            }, {
                $pull: {
                    comments: req.params.id,
                }
            })
        } catch (error) {
            return res.status(500).json({
                msg: error.message,
            })
        }
    }
}