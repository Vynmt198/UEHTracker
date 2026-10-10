import { Router } from 'express';
import drlController from './drl.controller.js';
import { authMiddleware } from '../../common/middlewares/auth.middleware.js';

const router = Router();
router.use(authMiddleware);

router.get('/records', drlController.getRecords);
router.post('/records', drlController.createRecord);
router.delete('/records/:id', drlController.deleteRecord);
router.get('/summary', drlController.getSummary);

export default router;
