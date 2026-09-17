import { prisma } from '../config/prisma.js';

export const logActivity = async (businessId: string, type: string, metadata?: any) => {
  return prisma.businessActivity.create({ data: { businessId, type, metadata: metadata ?? {} } });
};

export const listActivities = async (businessId: string) => {
  return prisma.businessActivity.findMany({ where: { businessId }, orderBy: { createdAt: 'desc' } });
};

export default { logActivity, listActivities };
