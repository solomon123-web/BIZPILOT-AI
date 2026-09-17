import { prisma } from '../config/prisma.js';

export const createFollowUp = async (businessId: string, payload: any) => {
  return prisma.followUp.create({ data: { businessId, leadId: payload.leadId ?? undefined, dueAt: payload.dueAt ?? undefined, note: payload.note ?? undefined, status: payload.status ?? 'PENDING', metadata: payload.metadata ?? {} } });
};

export const listFollowUps = async (businessId: string) => {
  return prisma.followUp.findMany({ where: { businessId }, orderBy: { dueAt: 'asc' } });
};

export default { createFollowUp, listFollowUps };
