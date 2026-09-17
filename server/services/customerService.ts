import { prisma } from '../config/prisma.js';

export const createCustomer = async (businessId: string, payload: any) => {
  const customer = await prisma.customer.create({ data: { ...payload, businessId } });
  return customer;
};

export const getCustomersByBusiness = async (businessId: string) => {
  return prisma.customer.findMany({ where: { businessId }, orderBy: { createdAt: 'desc' } });
};

export const getCustomerById = async (id: string, businessId: string) => {
  return prisma.customer.findFirst({ where: { id, businessId } });
};

export const updateCustomer = async (id: string, businessId: string, payload: any) => {
  const existing = await prisma.customer.findFirst({ where: { id, businessId } });
  if (!existing) return null;
  return prisma.customer.update({ where: { id }, data: payload });
};

export const deleteCustomer = async (id: string, businessId: string) => {
  return prisma.customer.deleteMany({ where: { id, businessId } });
};

export default {
  createCustomer,
  getCustomersByBusiness,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
