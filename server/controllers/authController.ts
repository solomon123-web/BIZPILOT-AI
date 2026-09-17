import { type NextFunction, type Request, type Response } from 'express';
import { z } from 'zod';
import authService from '../services/authService.js';

const signupSchema = z.object({
  name: z.string().optional(),
  email: z.string().min(1).email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1),
});

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = signupSchema.parse(req.body);

    const email = parsed.email.trim().toLowerCase();

    const existing = await authService.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Account with this email already exists.' });
    }

    const passwordHash = await authService.hashPassword(parsed.password);

    const user = await authService.createUser(parsed.name, email, passwordHash);

    const token = authService.generateAuthToken(user.id);

    return res.status(201).json({ success: true, data: { user, token } });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginSchema.parse(req.body);

    const email = parsed.email.trim().toLowerCase();

    const user = await authService.findUserByEmail(email);

    // Generic error message for security
    const genericError = { success: false, message: 'Invalid email or password.' };

    if (!user) {
      return res.status(401).json(genericError);
    }

    const passwordMatches = await authService.verifyPassword(parsed.password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json(genericError);
    }

    const token = authService.generateAuthToken(user.id);

    // Do not return passwordHash
    const safeUser = { id: user.id, name: user.name, email: user.email };

    return res.status(200).json({ success: true, data: { user: safeUser, token } });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // `authMiddleware` attaches `user` to the request
    const anyReq = req as any;
    if (!anyReq.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const user = anyReq.user;

    return res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

export const logout = async (_req: Request, res: Response) => {
  // Stateless JWT: frontend should remove the token. Endpoint provided for parity.
  return res.status(200).json({ success: true, message: 'Logged out (client should remove token).' });
};

export default { signup, login, me, logout };
