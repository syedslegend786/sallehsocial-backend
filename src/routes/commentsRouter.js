import express from 'express';
import { commentsCtrl } from '../controllers/commentsCtrl.js'
import { requireSignIn } from '../commonmiddlewares/commonmiddlewares.js'
const router = express.Router();

router.route('/comments')
    .post(requireSignIn, commentsCtrl.createComment)
router.patch('/updatecomment', requireSignIn, commentsCtrl.updateComment)
router.patch('/comment/like', requireSignIn, commentsCtrl.likeComment)
router.patch('/comment/unlike', requireSignIn, commentsCtrl.unlikeComment)
router.delete('/comment/:id', requireSignIn, commentsCtrl.deleteComment)
export default router;