import postModal from './../modules/post.js';
import userModal from './../modules/user.js'
import commentModal from '../modules/comments.js'

export class APIfeatures {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }
    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}
export const postCtrl = {
    creatPost: async (req, res) => {
        try {
            const { images, content } = req.body;
            if (!images.length > 0) {
                return res.status(400).json({
                    msg: 'images required!!!!'
                })
            }
            const newPost = new postModal({
                images,
                content,
                user: req.user.id,
            })
            await newPost.save()
            return res.status(200).json({
                msg: 'post created successfully!',
                data: newPost,
            })
        } catch (error) {
            return res.status(500).json({
                msg: error.message,
            })
        }

    },
    getPosts: async (req, res) => {
        const user = await userModal.findById(req.user.id)
        const apifeature = new APIfeatures(postModal.find({ user: [...user.following, req.user.id] }), req.query).paginating()
        const posts = await apifeature.query.populate("user", "avatar fullname username followers").populate("likes", "username fullname avatar").sort("-createdAt")
            .populate({
                path: "comments",
                populate: {
                    path: "user likes content",
                    select: "-password"
                }
            })

        return res.json({
            results: posts.length,
            posts,
        })
    },
    updatePost: async (req, res) => {
        try {
            const { id } = req.params
            const { content, images } = req.body
            const newPost = await postModal.findOneAndUpdate({ _id: id }, { content, images })
            return res.status(200).json({
                msg: 'updated successfully!',
                data: {
                    ...newPost._doc,
                    images,
                    content,
                }
            })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    likePost: async (req, res) => {
        try {
            await postModal.findOneAndUpdate({ _id: req.params.id }, {
                $push: { likes: req.user.id }
            }, { new: true })
            return res.status(200).json({ msg: 'post liked successfully!' })
        } catch (error) {
            return res.status(500).json({
                msg: error.message
            })
        }
    },
    unlikePost: async (req, res) => {
        try {
            const id = req.params.id
            await postModal.findOneAndUpdate({ _id: id }, {
                $pull: { likes: req.user.id }
            }, { new: true })
            return res.status(200).json({ msg: 'post unliked successfully!' })
        } catch (error) {
            return res.status(500).json({
                msg: error.message
            })
        }
    },
    getUserPosts: async (req, res) => {
        try {
            const apifeature = new APIfeatures(postModal.find({ user: req.params.id }), req.query).paginating()
            const posts = await apifeature.query.sort("-createdAt")
            return res.status(200).json({ posts, results: posts.length })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getSinglePost: async (req, res) => {
        try {
            const post = await postModal.findOne({ _id: req.params.id }).populate("user", "avatar fullname username").populate("likes", "username fullname avatar").sort("-createdAt")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes content",
                        select: "-password"
                    }
                })
            return res.json({
                post
            })
        } catch (error) {
            return res.status().jons({ msg: error.message })
        }
    },
    getDiscoverPosts: async (req, res) => {
        try {
            const user = await userModal.findOne({ _id: req.user.id })
            const apifreature = new APIfeatures(postModal.find({ user: { $nin: [...user.following, user._id] } }), req.query)
            const posts = await apifreature.query.populate("user", "avatar fullname username").populate("likes", "username fullname avatar").sort("-createdAt")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes content",
                        select: "-password"
                    }
                })
            res.status(200).json({
                posts,
                results: posts.length,
            })
        } catch (error) {
            return res.status().json({
                msg: error.message
            })
        }
    },
    deletePost: async (req, res) => {
        try {
            const post = await postModal.findOneAndDelete({ _id: req.params.id, user: req.user.id })
            await commentModal.deleteMany({ _id: { $in: [...post.comments] } })
            return res.status(200).json({ post })
        } catch (error) {
            return res.status().json({ msg: error.message })
        }
    },
    savePost: async (req, res) => {
        try {
            await userModal.findOneAndUpdate({ _id: req.user.id }, {
                $push: {
                    saved: req.params.id
                }
            })
            return res.status(200).json({ msg: 'post saved' })
        } catch (error) {
            return res.status().json({ msg: error.message })
        }
    },
    unSavePost: async (req, res) => {
        try {
            await userModal.findOneAndUpdate({ _id: req.user.id }, {
                $pull: {
                    saved: req.params.id
                }
            })
            return res.status(200).json({ msg: 'post unSaved' })
        } catch (error) {
            return res.status().json({ msg: error.message })
        }
    },
    getSavedPosts: async (req, res) => {
        try {
            const user = await userModal.findOne({ _id: req.user.id })
            const apifeature = new APIfeatures(postModal.find({ _id: { $in: [...user.saved] } }), req.query).paginating()
            const posts = await apifeature.query
            res.status(200).json({
                results: posts.length,
                posts: posts,
            })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }

    }
}