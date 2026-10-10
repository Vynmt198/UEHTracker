import { Router } from 'express';
import usersController from './users.controller.js';
import { authMiddleware } from '../../common/middlewares/auth.middleware.js';

const router = Router();

router.get('/me', authMiddleware, usersController.getMyProfile);
router.put('/me', authMiddleware, usersController.updateMyProfile);
router.get('/faculties', usersController.getFaculties);

export default router;
