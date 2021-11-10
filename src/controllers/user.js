import userSchema from '../modules/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { APIfeatures } from './post.js';
export const userController = {
    register: async (req, res) => {
        try {
            const { fullname, email, password, username, gender } = req.body;
            const user = await userSchema.findOne({ email: email })
            if (user) {
                return res.status(400).json({
                    msg: 'email already exist...'
                })
            }
            const _username = await userSchema.findOne({ username: username })
            if (_username) {
                return res.status(400).json({
                    msg: 'email already exist...'
                })
            }
            else {
                const cryptPassword = await bcrypt.hash(password, 10)
                // return res.status(200).json({
                //     msg: cryptPassword
                // })
                const newUser = new userSchema({
                    fullname, username, email, password: cryptPassword, gender,
                })
                const accessToken = createAccessToken({ id: newUser._id })
                const refreshToken = createRefreshToken({ id: newUser._id })
                res.cookie('refreshtoken', refreshToken, {
                    httpOnly: true,
                    path: '/api/refreshToken',
                    maxAge: 30 * 24 * 60 * 60 * 1000 // 30days
                })
                await newUser.save()
                return res.status(200).json({
                    msg: 'Register successfully!',
                    accessToken,
                    user: {
                        ...newUser._doc,
                        password: ''
                    }
                })
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await userSchema.findOne({ email: email }).populate("followers following", "avatar username fullname followers following")
            if (!user) {
                return res.status(400).json({ msg: 'No user found!' })
            }
            if (user) {
                const isMatch = await bcrypt.compare(password, user.password)
                if (isMatch) {
                    const accessToken = createAccessToken({ id: user._id })
                    const refreshToken = createRefreshToken({ id: user._id })
                    res.cookie('refreshtoken', refreshToken, {
                        httpOnly: true,
                        path: '/api/refreshToken',
                        maxAge: 30 * 24 * 60 * 60 * 1000 // 30days
                    })
                    return res.status(200).json({
                        msg: 'Login Success!',
                        accessToken,
                        user: {
                            ...user._doc,
                            password: ''
                        }
                    })
                } else {
                    return res.status(400).json({
                        msg: 'wrong password'
                    })
                }
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    refreshToken: async (req, res) => {
        try {
            const ref_token = req.cookies.refreshtoken
            if (!ref_token) {
                return res.status(400).json({ msg: 'please login!' })
            }
            jwt.verify(ref_token, process.env.REFRESH_SECRET, async (err, result) => {
                if (err) return res.status(400).json({ msg: 'please login!' })
                if (result) {
                    const _user = await userSchema.findById(result.id).select('-password')
                        .populate("followers following", "avatar username fullname followers following")
                    if (!_user) return res.status(400).json({ msg: 'user does not exist!' })
                    if (_user) {
                        const accesstoken = createAccessToken({ id: result.id })
                        return res.status(200).json({
                            accesstoken,
                            user: _user,
                        })
                    }
                    // return res.status(200).json({ result })
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
        // res.status(200).json({
        //     msg: 'refresh token'
        // })
    },
    logout: (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/api/refreshToken' })
            return res.json({ msg: "Logged out!" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    serachUser: async (req, res) => {
        try {
            const users = await userSchema.find({ username: { $regex: req.query.username } })
                .limit(10).select('fullname avatar username')
            if (users) {
                res.status(200).json({
                    users
                })
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    userProfileData: async (req, res) => {
        try {
            const user = await userSchema.findById(req.params.id).select("-password").populate("followers following", "username fullname avatar")
            if (!user) {
                return res.status(400).json({ msg: 'no user found!' })
            }
            if (user) {
                return res.status(200).json({
                    user
                })
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    userUpdateProfile: async (req, res) => {
        try {
            const { fullname, website, mobile, story, gender, avatar } = req.body;
            if (!fullname) {
                return res.status(400).json({ msg: 'fullname is required!' })
            }
            await userSchema.findOneAndUpdate({ _id: req.user.id }, {
                fullname, website, mobile, story, gender, avatar
            })
            res.status(200).json({ msg: "updated successfully!" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    follow: async (req, res) => {
        try {
            const { id } = req.params;
            const alreadyFollowed = await userSchema.findOne({ _id: req.user.id, following: { _id: id } })
            if (alreadyFollowed) {
                return res.status(400).json({ msg: 'already followed!' })
            }
            // else return res.status(200).json({ msg: 'success followed!' })
            await userSchema.findOneAndUpdate({ _id: req.user.id }, {
                $push: {
                    following: id
                }
            })
            await userSchema.findOneAndUpdate({ _id: id }, {
                $push: {
                    followers: req.user.id,
                }
            })
            res.json({ msg: 'successfully followed!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    unfollow: async (req, res) => {
        try {
            const { id } = req.params;
            const alreadyFollowed = await userSchema.findOne({ _id: req.user.id, following: { _id: id } })
            if (!alreadyFollowed) {
                return res.status(400).json({ msg: 'already unfollowed!' })
            }
            // else return res.status(200).json({ msg: 'success followed!' })
            await userSchema.findOneAndUpdate({ _id: req.user.id }, {
                $pull: {
                    following: id
                }
            })
            await userSchema.findOneAndUpdate({ _id: id }, {
                $pull: {
                    followers: req.user.id,
                }
            })
            res.json({ msg: 'successfully unfollowed!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    userSuggestion: async (req, res) => {
        try {
            const user = await userSchema.findOne({ _id: req.user.id })
            const apifeatures = new APIfeatures(userSchema.find({ _id: { $nin: [...user.following, req.user.id] } }), req.query)
            const users = await apifeatures.query.select('-password')
            return res.json({ users })
        } catch (error) {
            return res.status(500).json({
                msg: error.message
            })
        }
    }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_SECRET, { expiresIn: '1d' })
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_SECRET, { expiresIn: '1d' })
}

