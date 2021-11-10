import { check, validationResult } from 'express-validator'
export const registerValidator = [
    check('fullname')
        .notEmpty()
        .withMessage('FullName is required'),
    check('username')
        .notEmpty()
        .withMessage('username is required'),
    check('email')
        .isEmail()
        .withMessage('valid email is required'),
    check('password')
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('minimum 6 digit password required')
]
export const loginValidator = [
    check('email')
        .notEmpty()
        .isEmail()
        .withMessage('email required!'),
    check('password')
        .notEmpty()
        .withMessage('password is required!')
]

export const validateResult = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.array().length > 0) {
        return res.status(400).json({
            error: errors.array()[0].msg
        })
    }
    next()
}