import { prisma } from '../config/prisma.js';

export const createAIAction = async (businessId: string, actionType: string, parameters: any, requiresPermission = true) => {
  return prisma.aIAction.create({
    data: {
      businessId,
      actionType,
      parameters,
      requiresPermission,
    },
  });
};

export const getActionsForBusiness = async (businessId: string) => {
  return prisma.aIAction.findMany({ where: { businessId }, orderBy: { createdAt: 'desc' } });
};

export const getActionById = async (actionId: string, businessId: string) => {
  return prisma.aIAction.findFirst({ where: { id: actionId, businessId } });
};

export const updateActionStatus = async (actionId: string, businessId: string, status: string, result?: any, error?: string) => {
  return prisma.aIAction.updateMany({ where: { id: actionId, businessId }, data: { status, result: result ?? undefined, error: error ?? undefined, executedAt: status === 'COMPLETED' ? new Date() : undefined } });
};

export default {
  createAIAction,
  getActionsForBusiness,
  getActionById,
  updateActionStatus,
};
