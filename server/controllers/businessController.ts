import { type NextFunction, type Request, type Response } from 'express';
import { z } from 'zod';
import businessService from '../services/businessService.js';

const businessProfileSchema = z.object({
  name: z.string().trim().min(2).max(100),
  businessType: z.string().trim().max(100).optional(),
  country: z.string().trim().max(100).optional(),
  city: z.string().trim().max(100).optional(),
  description: z.string().trim().max(2000).optional(),
  goals: z.array(z.string().trim().min(1)).min(0).max(20).optional(),
});

const getUserId = (req: Request): string | null => {
  const user = (req as any).user;

  if (!user?.id) {
    return null;
  }

  return user.id;
};

export const createBusiness = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const parsed = businessProfileSchema.parse(req.body);

    const business = await businessService.createBusiness(
      userId,
      parsed,
    );

    return res.status(201).json({
      success: true,
      data: {
        business,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getBusinesses = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const businesses = await businessService.getBusinessesByOwner(userId);

    return res.status(200).json({
      success: true,
      data: {
        businesses,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getBusiness = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const business = await businessService.getBusinessById(
      String(req.params.id),
      userId,
    );

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        business,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateBusiness = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const parsed = businessProfileSchema.parse(req.body);

    const result = await businessService.updateBusiness(
      String(req.params.id),
      userId,
      parsed,
    );

    if (result.count === 0) {
      return res.status(404).json({
        success: false,
        message: 'Business not found.',
      });
    }

    const business = await businessService.getBusinessById(
      String(req.params.id),
      userId,
    );

    return res.status(200).json({
      success: true,
      data: {
        business,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBusiness = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const result = await businessService.deleteBusiness(
      String(req.params.id),
      userId,
    );

    if (result.count === 0) {
      return res.status(404).json({
        success: false,
        message: 'Business not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Business deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createBusiness,
  getBusinesses,
  getBusiness,
  updateBusiness,
  deleteBusiness,
};
