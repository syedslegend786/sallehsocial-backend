import coversationModel from '../modules/coversation.js'
import messageModel from '../modules/message.js'
import { APIfeatures } from '../controllers/post.js'
export const messageCtrl = {
    createMessage: async (req, res) => {
        try {
            const { text, receiver, media } = req.body
            if (!receiver && !text) {
                return res.status(500).json({ msg: 'all credentials are required!' })
            }
            const cv = await coversationModel.findOneAndUpdate({
                $or: [
                    { recepents: [req.user.id, receiver] },
                    { recepents: [receiver, req.user.id] },
                ]
            }, {
                recepents: [req.user.id, receiver],
                media: media,
                text: text,
            }, {
                new: true, upsert: true
            })
            const message = new messageModel({
                conversation: cv._id,
                sender: req.user.id,
                receiver: receiver,
                media: media,
                text: text,
            })
            await message.save()
            return res.status(200).json({ message })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getCoversationsSideBar: async (req, res) => {
        try {
            const apiFeature = new APIfeatures(
                coversationModel.find({ recepents: req.user.id }),
                req.query
            ).paginating()
            const cv = await apiFeature.query.populate("recepents", "avatar username fullname")
            return res.status(200).json({
                results: cv.length,
                cv
            })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getMessagesData: async (req, res) => {
        try {
            const apifeature = new APIfeatures(
                messageModel.find({
                    $or: [
                        { sender: req.user.id, receiver: req.params.id },
                        { sender: req.params.id, receiver: req.user.id }
                    ]
                }),
                req.query
            ).paginating()
            const messages = await apifeature.query.sort({ datefield: -1 })
            return res.status(200).json({
                results: messages.length,
                messages,
            })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
}