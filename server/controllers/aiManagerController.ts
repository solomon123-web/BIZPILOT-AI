import { type Request, type Response, type NextFunction } from 'express';
import * as aiService from '../services/aiManagerService.js';
import businessService from '../services/businessService.js';

export const createAction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { businessId, actionType, parameters } = req.body;
    if (!businessId || !actionType) return res.status(400).json({ success: false, message: 'Missing businessId or actionType' });

    const business = await businessService.getBusinessById(businessId, user.id);
    if (!business) return res.status(403).json({ success: false, message: 'Business not found or access denied' });

    const action = await aiService.createAIAction(businessId, actionType, parameters ?? {}, true);

    return res.status(201).json({ success: true, action });
  } catch (error) {
    next(error);
  }
};

export const listActions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { businessId } = req.query;
    if (!businessId || typeof businessId !== 'string') return res.status(400).json({ success: false, message: 'Missing businessId' });

    const business = await businessService.getBusinessById(businessId, user.id);
    if (!business) return res.status(403).json({ success: false, message: 'Business not found or access denied' });

    const bId: string = Array.isArray(businessId) ? businessId[0] : (businessId as string);
    const actions = await aiService.getActionsForBusiness(bId);
    return res.status(200).json({ success: true, actions });
  } catch (error) {
    next(error);
  }
};

export const getAction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const { businessId } = req.query;
    if (!businessId || typeof businessId !== 'string') return res.status(400).json({ success: false, message: 'Missing businessId' });

    const bId: string = Array.isArray(businessId) ? businessId[0] : (businessId as string);
    const business = await businessService.getBusinessById(bId, user.id);
    if (!business) return res.status(403).json({ success: false, message: 'Business not found or access denied' });

    const action = await aiService.getActionById(String(id), String(bId));
    if (!action) return res.status(404).json({ success: false, message: 'Action not found' });

    return res.status(200).json({ success: true, action });
  } catch (error) {
    next(error);
  }
};

export default {
  createAction,
  listActions,
  getAction,
};
