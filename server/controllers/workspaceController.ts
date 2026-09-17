import { type NextFunction, type Request, type Response } from 'express';
import { z } from 'zod';
import workspaceService from '../services/workspaceService.js';
import { prisma } from '../config/prisma.js';

const createWorkspaceSchema = z.object({
  businessId: z.string().min(1),
  name: z.string().trim().min(2).max(100),
});

const updateWorkspaceSchema = z.object({
  name: z.string().trim().min(2).max(100),
});

const getUserId = (req: Request): string | null => {
  const user = (req as any).user;

  if (!user?.id) {
    return null;
  }

  return user.id;
};

const verifyBusinessOwnership = async (
  businessId: string,
  userId: string,
) => {
  return prisma.business.findFirst({
    where: {
      id: businessId,
      ownerId: userId,
    },
  });
};

export const createWorkspace = async (
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

    const parsed = createWorkspaceSchema.parse(req.body);

    const business = await verifyBusinessOwnership(
      parsed.businessId,
      userId,
    );

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found.',
      });
    }

    const workspace = await workspaceService.createWorkspace(
      parsed.businessId,
      parsed.name,
    );

    return res.status(201).json({
      success: true,
      data: {
        workspace,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkspaces = async (
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

    const businessId = String(req.query.businessId || '');

    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: 'businessId is required.',
      });
    }

    const business = await verifyBusinessOwnership(
      businessId,
      userId,
    );

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found.',
      });
    }

    const workspaces =
      await workspaceService.getWorkspacesByBusiness(businessId);

    return res.status(200).json({
      success: true,
      data: {
        workspaces,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkspace = async (
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

    const workspaceId = String(req.params.id);

    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        business: {
          ownerId: userId,
        },
      },
    });

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        workspace,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateWorkspace = async (
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

    const parsed = updateWorkspaceSchema.parse(req.body);

    const workspaceId = String(req.params.id);

    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        business: {
          ownerId: userId,
        },
      },
    });

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found.',
      });
    }

    await workspaceService.updateWorkspace(
      workspaceId,
      workspace.businessId,
      parsed.name,
    );

    const updatedWorkspace =
      await workspaceService.getWorkspaceById(
        workspaceId,
        workspace.businessId,
      );

    return res.status(200).json({
      success: true,
      data: {
        workspace: updatedWorkspace,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWorkspace = async (
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

    const workspaceId = String(req.params.id);

    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        business: {
          ownerId: userId,
        },
      },
    });

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found.',
      });
    }

    await workspaceService.deleteWorkspace(
      workspaceId,
      workspace.businessId,
    );

    return res.status(200).json({
      success: true,
      message: 'Workspace deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createWorkspace,
  getWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
};
