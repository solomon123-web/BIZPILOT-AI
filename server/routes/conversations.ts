import { Router } from 'express';
import conversationController from '../controllers/conversationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();
router.use(authMiddleware as any);

router.get('/', conversationController.listConversations);
router.get('/:id', conversationController.getConversation);
router.post('/messages', conversationController.postMessage);

export default router;
