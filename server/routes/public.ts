import { Router } from 'express';
import productController from '../controllers/productController.js';

const router = Router();

router.get('/products', productController.listPublishedProducts);
router.get('/products/:slug', productController.getPublishedProductBySlug);

export default router;
