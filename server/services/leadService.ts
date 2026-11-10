import { prisma } from '../config/prisma.js';

export const createLead = async (businessId: string, payload: any) => {
  return prisma.lead.create({
    data: {
      businessId,
      name: payload.name ?? null,
      email: payload.email ?? null,
      phone: payload.phone ?? null,
      status: payload.status ?? 'NEW',
      metadata: payload.metadata ?? {},
    },
  });
};

export const getLeadById = async (leadId: string, businessId: string) => {
  return prisma.lead.findFirst({ where: { id: leadId, businessId } });
};

export const updateLead = async (leadId: string, businessId: string, data: any) => {
  const existing = await prisma.lead.findFirst({ where: { id: leadId, businessId } });
  if (!existing) return null;

  return prisma.lead.update({
    where: { id: leadId },
    data,
  });
};

export const getLeadsForBusiness = async (businessId: string) => {
  return prisma.lead.findMany({ where: { businessId }, orderBy: { createdAt: 'desc' } });
};

export const deleteLead = async (leadId: string, businessId: string) => {
  return prisma.lead.deleteMany({ where: { id: leadId, businessId } });
};

export default { createLead, getLeadById, updateLead, getLeadsForBusiness, deleteLead };
