import { Router } from 'express';
import businessController from '../controllers/businessController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', businessController.createBusiness);
router.get('/', businessController.getBusinesses);
router.get('/:id', businessController.getBusiness);
router.patch('/:id', businessController.updateBusiness);
router.delete('/:id', businessController.deleteBusiness);

export default router;
