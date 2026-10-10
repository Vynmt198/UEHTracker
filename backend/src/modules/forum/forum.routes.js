import { Router } from 'express';
import forumController from './forum.controller.js';
import { authMiddleware } from '../../common/middlewares/auth.middleware.js';

const router = Router();

router.get('/posts', forumController.getPosts);
router.post('/posts', authMiddleware, forumController.createPost);
router.get('/posts/:id', forumController.getPostDetail);
router.post('/posts/:id/comments', authMiddleware, forumController.addComment);
router.post('/posts/:id/vote', authMiddleware, forumController.votePost);

export default router;
