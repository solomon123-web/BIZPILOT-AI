import { type Request, type Response, type NextFunction } from 'express';
import activityService from '../services/activityService.js';
import businessService from '../services/businessService.js';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { businessId } = req.query;
    if (!businessId || typeof businessId !== 'string') return res.status(400).json({ success: false, message: 'Missing businessId' });

    const business = await businessService.getBusinessById(businessId, user.id);
    if (!business) return res.status(403).json({ success: false, message: 'Business not found or access denied' });

    const items = await activityService.listActivities(businessId);
    return res.status(200).json({ success: true, items });
  } catch (err) {
    next(err);
  }
};

export default { list };
