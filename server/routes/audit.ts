import { Router } from 'express';
import auditController from '../controllers/auditController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware as any);
router.post('/executive', auditController.runExecutiveAudit);

export default router;
