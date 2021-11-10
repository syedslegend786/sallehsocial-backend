import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/dbwatmerl/image/upload/v1631443955/sallehsocial/pngfind.com-avatar-png-52097_hcek6y.png'
    },
    role: { type: String, default: 'user' },
    gender: { type: String, default: 'male' },
    mobile: { type: String, default: '' },
    address: { type: String, default: '' },
    story: {
        type: String,
        default: '',
        maxlength: 200
    },
    website: { type: String, default: '' },
    followers: [{ type: mongoose.Types.ObjectId, ref: 'user', default: [] }],
    following: [{ type: mongoose.Types.ObjectId, ref: 'user', default: [] }],
    saved: [{ type: mongoose.Types.ObjectId, ref: 'post' }]
}, { timestamps: true })

export default mongoose.model('user', userSchema)