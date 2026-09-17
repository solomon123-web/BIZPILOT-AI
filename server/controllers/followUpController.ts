import { type Request, type Response, type NextFunction } from 'express';
import followUpService from '../services/followUpService.js';
import businessService from '../services/businessService.js';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { businessId, payload } = req.body;
    if (!businessId || !payload) return res.status(400).json({ success: false, message: 'Missing required fields' });

    const business = await businessService.getBusinessById(businessId, user.id);
    if (!business) return res.status(403).json({ success: false, message: 'Business not found or access denied' });

    const f = await followUpService.createFollowUp(businessId, payload);
    return res.status(201).json({ success: true, followUp: f });
  } catch (err) {
    next(err);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { businessId } = req.query;
    if (!businessId || typeof businessId !== 'string') return res.status(400).json({ success: false, message: 'Missing businessId' });

    const business = await businessService.getBusinessById(businessId, user.id);
    if (!business) return res.status(403).json({ success: false, message: 'Business not found or access denied' });

    const items = await followUpService.listFollowUps(businessId);
    return res.status(200).json({ success: true, followUps: items });
  } catch (err) {
    next(err);
  }
};

export default { create, list };
