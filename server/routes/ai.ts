import { Router } from 'express';
import aiController from '../controllers/aiController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.get('/business-context', authMiddleware, aiController.getBusinessContext);
router.post('/chat', authMiddleware, aiController.chat);

export default router;
