import { type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import businessService from '../services/businessService.js';

// placeholder route: list connected social accounts for a business
export const listAccounts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { businessId } = req.query;
    if (!businessId || typeof businessId !== 'string') return res.status(400).json({ success: false, message: 'Missing businessId' });

    const business = await businessService.getBusinessById(businessId, user.id);
    if (!business) return res.status(403).json({ success: false, message: 'Business not found or access denied' });

    const accounts = await prisma.connectedSocialAccount.findMany({ where: { businessId } });
    return res.status(200).json({ success: true, accounts });
  } catch (err) {
    next(err);
  }
};

// placeholder: attempt to publish a post -> returns NOT_CONFIGURED when no provider is wired
export const publishPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { businessId, provider, content } = req.body;
    if (!businessId || !provider || !content) return res.status(400).json({ success: false, message: 'Missing required fields' });

    const business = await businessService.getBusinessById(businessId, user.id);
    if (!business) return res.status(403).json({ success: false, message: 'Business not found or access denied' });

    // Do not fake publishing: return NOT_CONFIGURED when provider integration is not present
    return res.status(200).json({ success: false, code: 'NOT_CONFIGURED', message: 'Social provider not configured for publishing.' });
  } catch (err) {
    next(err);
  }
};

export default { listAccounts, publishPost };
