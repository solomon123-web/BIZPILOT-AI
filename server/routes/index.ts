import { Router } from 'express';
import healthRoutes from './health.js';
import authRoutes from './auth.js';
import businessRoutes from './business.js';
import workspaceRoutes from './workspace.js';
import customerRoutes from './customers.js';
import invoiceRoutes from './invoices.js';
import analyticsRoutes from './analytics.js';
import aiRoutes from './ai.js';
import aiManagerRoutes from './aiManager.js';
import socialRoutes from './social.js';
import socialConnectionRoutes from './socialConnections.js';
import permissionsRoutes from './permissions.js';
import conversationsRoutes from './conversations.js';
import leadsRoutes from './leads.js';
import followUpsRoutes from './followUps.js';
import activityRoutes from './activity.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/businesses', businessRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/customers', customerRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/ai', aiRoutes);
router.use('/ai/manager', aiManagerRoutes);
router.use('/social', socialRoutes);
router.use('/social/connections', socialConnectionRoutes);
router.use('/ai/permissions', permissionsRoutes);
router.use('/conversations', conversationsRoutes);
router.use('/leads', leadsRoutes);
router.use('/follow-ups', followUpsRoutes);
router.use('/activity', activityRoutes);

export default router;
