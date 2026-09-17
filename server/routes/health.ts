import { Router } from 'express';
import { prisma } from '../config/prisma.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: 'BizPilotAI API is running',
      database: 'connected',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
