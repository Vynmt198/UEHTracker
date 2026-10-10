import { Router } from 'express';
import authController from './auth.controller.js';
import { authMiddleware } from '../../common/middlewares/auth.middleware.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authMiddleware, authController.logout);

export default router;
