import { type Request, type Response, type NextFunction } from 'express';
import auditService from '../services/auditService.js';
import businessService from '../services/businessService.js';

export const runExecutiveAudit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { businessId } = req.body ?? {};

    if (!businessId || typeof businessId !== 'string') {
      return res.status(400).json({ success: false, message: 'Missing businessId' });
    }

    const business = await businessService.getBusinessById(businessId, user.id);
    if (!business) {
      return res.status(403).json({ success: false, message: 'Business not found or access denied' });
    }

    const report = await auditService.runExecutiveAudit(businessId);

    return res.status(200).json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

export default { runExecutiveAudit };
