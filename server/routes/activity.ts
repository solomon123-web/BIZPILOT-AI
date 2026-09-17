import { Router } from 'express';
import activityController from '../controllers/activityController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();
router.use(authMiddleware as any);

router.get('/', activityController.list);

export default router;
