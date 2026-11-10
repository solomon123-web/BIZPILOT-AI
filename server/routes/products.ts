import { Router } from 'express';
import multer from 'multer';
import productController from '../controllers/productController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024, files: 12 },
});

router.use(authMiddleware as any);

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:id/media', productController.listProductMedia);
router.post('/:id/media', upload.array('files', 12), productController.uploadProductMedia);
router.post('/:id/publish', productController.publishProduct);
router.get('/:id', productController.getProduct);
router.patch('/:id', productController.updateProduct);
router.patch('/:id/status', productController.updateProductStatus);
router.delete('/:id', productController.deleteProduct);

export default router;
