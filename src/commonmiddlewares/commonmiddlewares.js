import jwt from 'jsonwebtoken'
import userSchema from '../modules/user.js'
export const requireSignIn = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) return res.status(400).json({ msg: 'jwt required' })
    jwt.verify(token, process.env.ACCESS_SECRET, (error, user) => {
        if (error) return res.status(500).json({ msg: 'access denied!' })
        if (user) {
            req.user = user
            next()
        }
    })
}