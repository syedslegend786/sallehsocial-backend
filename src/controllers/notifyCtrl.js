import notifySchema from './../modules/notify.js'
export const notifyCtrl = {
    createNotify: async (req, res) => {
        try {
            const {
                id,
                user,
                recipents,
                url,
                text,
                content,
                image
            } = req.body
            const newNotify = new notifySchema({
                id,
                user,
                recipents,
                url,
                text,
                content,
                image
            })
            const notify = await newNotify.save()
            return res.status(200).json({ notify })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    deleteNotify: async (req, res) => {
        try {
            const notify = await notifySchema.findOneAndDelete({ id: req.params.id })
            return res.status(200).json({ notify })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getNotifies: async (req, res) => {
        try {
            const notifies = await notifySchema.find({ recipents: req.user.id }).sort("-createdAt").populate("user", "avatar username")
            return res.status(200).json({ notifies })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    isRead: async (req, res) => {
        try {
            await notifySchema.findOneAndUpdate({ _id: req.params.id }, {
                isRead: true
            })
            res.status(200).json({ msg: 'isRead done!!!' })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    deleteAllUserNotifies: async (req, res) => {
        try {
            await notifySchema.deleteMany({ recipents: req.user.id })
            res.status(200).json({ msg: 'deleted!' })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
}