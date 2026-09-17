import { Router } from 'express';
import invoiceController from '../controllers/invoiceController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', invoiceController.getInvoices);
router.post('/', invoiceController.createInvoice);
router.get('/:id', invoiceController.getInvoice);
router.put('/:id', invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);

export default router;
