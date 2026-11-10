import { Router } from 'express';
import leadController from '../controllers/leadController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();
router.use(authMiddleware as any);

router.post('/', leadController.createLead);
router.get('/', leadController.listLeads);
router.patch('/:id', leadController.updateLead);
router.delete('/:id', leadController.deleteLead);

export default router;
