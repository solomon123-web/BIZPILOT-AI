import { Router } from 'express';
import workspaceController from '../controllers/workspaceController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', workspaceController.createWorkspace);
router.get('/', workspaceController.getWorkspaces);
router.get('/:id', workspaceController.getWorkspace);
router.patch('/:id', workspaceController.updateWorkspace);
router.delete('/:id', workspaceController.deleteWorkspace);

export default router;
