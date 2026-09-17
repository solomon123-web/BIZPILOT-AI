import { type Request, type Response, type NextFunction } from 'express';
import conversationService from '../services/conversationService.js';
import businessService from '../services/businessService.js';

export const listConversations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { businessId } = req.query;
    if (!businessId || typeof businessId !== 'string') return res.status(400).json({ success: false, message: 'Missing businessId' });

    const business = await businessService.getBusinessById(businessId, user.id);
    if (!business) return res.status(403).json({ success: false, message: 'Business not found or access denied' });

    const convos = await conversationService.getConversationsForBusiness(businessId);
    return res.status(200).json({ success: true, conversations: convos });
  } catch (err) {
    next(err);
  }
};

export const getConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { businessId } = req.query;
    const { id } = req.params;
    if (!businessId || typeof businessId !== 'string') return res.status(400).json({ success: false, message: 'Missing businessId' });

    const bId: string = Array.isArray(businessId) ? businessId[0] : (businessId as string);
    const business = await businessService.getBusinessById(bId, user.id);
    if (!business) return res.status(403).json({ success: false, message: 'Business not found or access denied' });

    const convo = await conversationService.getConversationById(String(id), String(bId));
    if (!convo) return res.status(404).json({ success: false, message: 'Conversation not found' });

    return res.status(200).json({ success: true, conversation: convo });
  } catch (err) {
    next(err);
  }
};

export const postMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { businessId, conversationId, direction, content, senderName } = req.body;
    if (!businessId || !conversationId || !direction || !content) return res.status(400).json({ success: false, message: 'Missing required fields' });

    const business = await businessService.getBusinessById(businessId, user.id);
    if (!business) return res.status(403).json({ success: false, message: 'Business not found or access denied' });

    const message = await conversationService.createMessage(conversationId, direction, content, senderName);
    return res.status(201).json({ success: true, message });
  } catch (err) {
    next(err);
  }
};

export default { listConversations, getConversation, postMessage };
