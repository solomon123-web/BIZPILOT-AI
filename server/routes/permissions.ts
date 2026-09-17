import { Router } from 'express';
import permissionController from '../controllers/permissionController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();
router.use(authMiddleware as any);

router.get('/', permissionController.listPermissions);
router.post('/', permissionController.upsert);

export default router;
