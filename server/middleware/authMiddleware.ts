import { type NextFunction, type Request, type Response } from 'express';
import authService from '../services/authService.js';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const token = authHeader.replace('Bearer ', '').trim();

    let payload;
    try {
      payload = authService.verifyAuthToken(token);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }

    const user = await authService.findUserById(payload.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }

    // Attach safe user object to request
    (req as any).user = { id: user.id, name: user.name, email: user.email };

    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
