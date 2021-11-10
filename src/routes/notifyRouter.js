import express from 'express'
import { notifyCtrl } from '../controllers/notifyCtrl.js';
import { requireSignIn } from './../commonmiddlewares/commonmiddlewares.js'
const router = express.Router()

router.post("/notify/create", requireSignIn, notifyCtrl.createNotify)
router.delete("/notify/delete/:id", requireSignIn, notifyCtrl.deleteNotify)
router.get("/notify/get", requireSignIn, notifyCtrl.getNotifies)
router.patch("/notify/isread/:id", requireSignIn, notifyCtrl.isRead)
router.delete("/notify/deleteallnotifies", requireSignIn, notifyCtrl.deleteAllUserNotifies)

export default router;