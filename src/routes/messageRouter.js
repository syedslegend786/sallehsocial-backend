import express from 'express'
const router = express.Router()
import { requireSignIn } from '../commonmiddlewares/commonmiddlewares.js'
import { messageCtrl } from '../controllers/messageCtrl.js';
router.post('/message', requireSignIn, messageCtrl.createMessage)
router.get('/conversations', requireSignIn, messageCtrl.getCoversationsSideBar)
router.get('/getmessages/:id', requireSignIn, messageCtrl.getMessagesData)

export default router;