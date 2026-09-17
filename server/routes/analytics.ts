import { Router } from 'express';
import analyticsController from '../controllers/analyticsController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);
router.get('/overview', analyticsController.getOverview);

export default router;
