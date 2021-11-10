import express from 'express'

import { loginValidator, registerValidator, validateResult } from '../validators/validators.js'
import { userController } from '../controllers/user.js'
import { requireSignIn } from '../commonmiddlewares/commonmiddlewares.js'
const router = express.Router()
//auth section...
router.post('/register', registerValidator, validateResult, userController.register)
router.post('/login', loginValidator, validateResult, userController.login)
router.post('/logout', userController.logout)
router.get('/refreshToken', userController.refreshToken)
//user section...
router.get('/search', requireSignIn, userController.serachUser)
router.get('/profile/:id', requireSignIn, userController.userProfileData)
router.patch('/profile/update', requireSignIn, userController.userUpdateProfile)
//follow && unfollow...
router.patch('/follow/:id', requireSignIn, userController.follow)
router.patch('/unfollow/:id', requireSignIn, userController.unfollow)

router.get('/suggestionUsers', requireSignIn, userController.userSuggestion)


export default router;