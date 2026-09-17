import { prisma } from '../config/prisma.js';

export const createLead = async (businessId: string, payload: any) => {
  return prisma.lead.create({ data: { businessId, name: payload.name ?? null, email: payload.email ?? null, phone: payload.phone ?? null, status: payload.status ?? 'NEW', metadata: payload.metadata ?? {} } });
};

export const updateLead = async (leadId: string, businessId: string, data: any) => {
  return prisma.lead.updateMany({ where: { id: leadId, businessId }, data });
};

export const getLeadsForBusiness = async (businessId: string) => {
  return prisma.lead.findMany({ where: { businessId }, orderBy: { createdAt: 'desc' } });
};

export default { createLead, updateLead, getLeadsForBusiness };
