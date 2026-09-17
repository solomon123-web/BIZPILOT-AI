import { prisma } from '../config/prisma.js';

export const getPermissionsForBusiness = async (businessId: string) => {
  return prisma.aIPermission.findMany({ where: { businessId } });
};

export const upsertPermission = async (businessId: string, key: string, mode: string) => {
  const existing = await prisma.aIPermission.findFirst({ where: { businessId, key } });
  if (existing) {
    return prisma.aIPermission.update({ where: { id: existing.id }, data: { mode } });
  }
  return prisma.aIPermission.create({ data: { businessId, key, mode } });
};

export default { getPermissionsForBusiness, upsertPermission };
