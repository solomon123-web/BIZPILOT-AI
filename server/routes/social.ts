import { Router } from 'express';
import socialController from '../controllers/socialController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();
router.use(authMiddleware as any);

router.get('/accounts', socialController.listAccounts);
router.post('/publish', socialController.publishPost);

export default router;
