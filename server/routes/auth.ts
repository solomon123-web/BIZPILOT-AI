import { Router } from 'express';
import authController from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.me);
router.post('/logout', authController.logout);

export default router;
