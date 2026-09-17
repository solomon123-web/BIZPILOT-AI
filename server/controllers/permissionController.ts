import { type Request, type Response, type NextFunction } from 'express';
import permissionService from '../services/permissionService.js';
import businessService from '../services/businessService.js';

export const listPermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { businessId } = req.query;
    if (!businessId || typeof businessId !== 'string') return res.status(400).json({ success: false, message: 'Missing businessId' });

    const business = await businessService.getBusinessById(businessId, user.id);
    if (!business) return res.status(403).json({ success: false, message: 'Business not found or access denied' });

    const perms = await permissionService.getPermissionsForBusiness(businessId);
    return res.status(200).json({ success: true, permissions: perms });
  } catch (err) {
    next(err);
  }
};

export const upsert = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { businessId, key, mode } = req.body;
    if (!businessId || !key || !mode) return res.status(400).json({ success: false, message: 'Missing required fields' });

    const business = await businessService.getBusinessById(businessId, user.id);
    if (!business) return res.status(403).json({ success: false, message: 'Business not found or access denied' });

    const perm = await permissionService.upsertPermission(businessId, key, mode);
    return res.status(200).json({ success: true, permission: perm });
  } catch (err) {
    next(err);
  }
};

export default { listPermissions, upsert };
