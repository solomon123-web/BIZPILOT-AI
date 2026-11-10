import { type Request, type Response, type NextFunction } from 'express';
import leadService from '../services/leadService.js';
import businessService from '../services/businessService.js';

export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { businessId, payload } = req.body;
    if (!businessId || !payload) return res.status(400).json({ success: false, message: 'Missing required fields' });

    const business = await businessService.getBusinessById(businessId, user.id);
    if (!business) return res.status(403).json({ success: false, message: 'Business not found or access denied' });

    const lead = await leadService.createLead(businessId, payload);
    return res.status(201).json({ success: true, data: { lead } });
  } catch (err) {
    next(err);
  }
};

export const listLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { businessId } = req.query;
    const resolvedBusinessId = typeof businessId === 'string' ? businessId : (await businessService.getBusinessesByOwner(user.id))[0]?.id ?? null;

    if (!resolvedBusinessId) return res.status(400).json({ success: false, message: 'No business found for user.' });

    const business = await businessService.getBusinessById(resolvedBusinessId, user.id);
    if (!business) return res.status(403).json({ success: false, message: 'Business not found or access denied' });

    const leads = await leadService.getLeadsForBusiness(resolvedBusinessId);
    return res.status(200).json({ success: true, data: { leads } });
  } catch (err) {
    next(err);
  }
};

export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const leadId = String(req.params.id);
    const payload = req.body ?? {};
    const businessId = typeof req.body?.businessId === 'string'
      ? req.body.businessId
      : (await businessService.getBusinessesByOwner(user.id))[0]?.id ?? null;

    if (!businessId) return res.status(400).json({ success: false, message: 'No business found for user.' });

    const business = await businessService.getBusinessById(businessId, user.id);
    if (!business) return res.status(403).json({ success: false, message: 'Business not found or access denied' });

    const lead = await leadService.updateLead(leadId, businessId, payload);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found.' });

    return res.status(200).json({ success: true, data: { lead } });
  } catch (err) {
    next(err);
  }
};

export const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const leadId = String(req.params.id);
    const businessId = (await businessService.getBusinessesByOwner(user.id))[0]?.id ?? null;

    if (!businessId) return res.status(400).json({ success: false, message: 'No business found for user.' });

    const business = await businessService.getBusinessById(businessId, user.id);
    if (!business) return res.status(403).json({ success: false, message: 'Business not found or access denied' });

    const result = await leadService.deleteLead(leadId, businessId);
    if (result.count === 0) return res.status(404).json({ success: false, message: 'Lead not found.' });

    return res.status(200).json({ success: true, message: 'Lead deleted.' });
  } catch (err) {
    next(err);
  }
};

export default { createLead, listLeads, updateLead, deleteLead };
