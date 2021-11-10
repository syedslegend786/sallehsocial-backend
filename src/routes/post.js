import express from 'express'
import { requireSignIn } from '../commonmiddlewares/commonmiddlewares.js';
import { postCtrl } from '../controllers/post.js'
const router = express.Router()


router.route('/posts')
    .post(requireSignIn, postCtrl.creatPost)
    .get(requireSignIn, postCtrl.getPosts)
router.route('/posts/:id')
    //update post
    .patch(requireSignIn, postCtrl.updatePost)
    //delete post...
    .delete(requireSignIn, postCtrl.deletePost)

router.patch('/posts/:id/like', requireSignIn, postCtrl.likePost)
router.patch('/posts/:id/unlike', requireSignIn, postCtrl.unlikePost)
router.get('/userposts/:id', requireSignIn, postCtrl.getUserPosts)
router.get("/singlepost/:id", requireSignIn, postCtrl.getSinglePost)
router.get("/discover", requireSignIn, postCtrl.getDiscoverPosts)

router.patch('/savePost/:id', requireSignIn, postCtrl.savePost)
router.patch('/unSavePost/:id', requireSignIn, postCtrl.unSavePost)
router.get('/getsavedposts', requireSignIn, postCtrl.getSavedPosts)
export default router;