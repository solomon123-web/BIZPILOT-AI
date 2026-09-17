import { prisma } from '../config/prisma.js';

export const createWorkspace = async (
  businessId: string,
  name: string,
) => {
  return prisma.workspace.create({
    data: {
      name,
      businessId,
    },
  });
};

export const getWorkspacesByBusiness = async (
  businessId: string,
) => {
  return prisma.workspace.findMany({
    where: {
      businessId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getWorkspaceById = async (
  workspaceId: string,
  businessId: string,
) => {
  return prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      businessId,
    },
  });
};

export const updateWorkspace = async (
  workspaceId: string,
  businessId: string,
  name: string,
) => {
  return prisma.workspace.updateMany({
    where: {
      id: workspaceId,
      businessId,
    },
    data: {
      name,
    },
  });
};

export const deleteWorkspace = async (
  workspaceId: string,
  businessId: string,
) => {
  return prisma.workspace.deleteMany({
    where: {
      id: workspaceId,
      businessId,
    },
  });
};

export default {
  createWorkspace,
  getWorkspacesByBusiness,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
};
