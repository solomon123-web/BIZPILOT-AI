import { Router } from 'express';
import customerController from '../controllers/customerController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', customerController.getCustomers);
router.post('/', customerController.createCustomer);
router.get('/:id', customerController.getCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

export default router;
