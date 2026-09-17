/**
 * Social connection routes
 * OAuth and connection management endpoints
 */

import { Router } from 'express';
import socialConnectionController from '../controllers/socialConnectionController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// Public callback endpoint (no auth required)
router.get('/meta/callback', socialConnectionController.handleMetaCallback);

// Protected endpoints
router.use(authMiddleware as any);

router.post('/meta/connect', socialConnectionController.initiateMetaConnection);
router.get('/', socialConnectionController.listSocialConnections);
router.delete('/:id', socialConnectionController.disconnectSocialAccount);

export default router;
