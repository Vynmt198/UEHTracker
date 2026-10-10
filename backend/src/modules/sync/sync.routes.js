import { Router } from 'express';
import syncController from './sync.controller.js';
import { authMiddleware } from '../../common/middlewares/auth.middleware.js';

const router = Router();
router.use(authMiddleware);

router.post('/push', syncController.pushLocal);
router.post('/push-local', syncController.pushLocal);
router.get('/pull', syncController.pullCloud);

export default router;
