import { Router } from 'express';
import aiManagerController from '../controllers/aiManagerController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware as any);

router.post('/actions', aiManagerController.createAction);
router.get('/actions', aiManagerController.listActions);
router.get('/actions/:id', aiManagerController.getAction);

export default router;
