import { Router } from 'express';
import followUpController from '../controllers/followUpController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();
router.use(authMiddleware as any);

router.post('/', followUpController.create);
router.get('/', followUpController.list);

export default router;
