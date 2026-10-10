import { Router } from 'express';
import forumController from './forum.controller.js';
import { authMiddleware, optionalAuthMiddleware } from '../../common/middlewares/auth.middleware.js';

const router = Router();

router.get('/posts', optionalAuthMiddleware, forumController.getPosts);
router.post('/posts', authMiddleware, forumController.createPost);
router.get('/posts/:id', optionalAuthMiddleware, forumController.getPostDetail);
router.post('/posts/:id/comments', authMiddleware, forumController.addComment);
router.post('/posts/:id/vote', authMiddleware, forumController.votePost);

export default router;

