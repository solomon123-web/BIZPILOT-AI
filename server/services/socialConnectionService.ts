/**
 * Social connection service
 * Manages social account connections and token storage
 */

import { prisma } from '../config/prisma.js';

export const createSocialConnection = async (
  businessId: string,
  platform: string,
  accountId: string,
  accountName: string,
  accountType: string,
  accessTokenRef: string,
  tokenExpiresAt?: Date,
  scopes?: string[],
  metadata?: any,
) => {
  return prisma.socialConnection.create({
    data: {
      businessId,
      platform,
      accountId,
      accountName,
      accountType,
      accessTokenRef,
      tokenExpiresAt,
      scopes: scopes || [],
      metadata: metadata || {},
      status: 'connected',
    },
  });
};

export const getSocialConnections = async (businessId: string) => {
  return prisma.socialConnection.findMany({
    where: { businessId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getSocialConnectionById = async (connectionId: string, businessId: string) => {
  return prisma.socialConnection.findFirst({
    where: { id: connectionId, businessId },
  });
};

export const getSocialConnectionByPlatformAndAccount = async (businessId: string, platform: string, accountId: string) => {
  return prisma.socialConnection.findFirst({
    where: { businessId, platform, accountId },
  });
};

export const updateSocialConnectionStatus = async (connectionId: string, businessId: string, status: string) => {
  return prisma.socialConnection.updateMany({
    where: { id: connectionId, businessId },
    data: { status },
  });
};

export const updateSocialConnectionToken = async (
  connectionId: string,
  businessId: string,
  accessTokenRef: string,
  tokenExpiresAt?: Date,
) => {
  return prisma.socialConnection.updateMany({
    where: { id: connectionId, businessId },
    data: { accessTokenRef, tokenExpiresAt },
  });
};

export const deleteSocialConnection = async (connectionId: string, businessId: string) => {
  return prisma.socialConnection.deleteMany({
    where: { id: connectionId, businessId },
  });
};

export const createOAuthState = async (state: string, businessId: string, platform: string, nonce: string, expiresAt: Date) => {
  return prisma.oAuthState.create({
    data: {
      state,
      businessId,
      platform,
      nonce,
      expiresAt,
    },
  });
};

export const getOAuthState = async (state: string) => {
  return prisma.oAuthState.findUnique({
    where: { state },
  });
};

export const deleteOAuthState = async (state: string) => {
  return prisma.oAuthState.deleteMany({
    where: { state },
  });
};

export default {
  createSocialConnection,
  getSocialConnections,
  getSocialConnectionById,
  getSocialConnectionByPlatformAndAccount,
  updateSocialConnectionStatus,
  updateSocialConnectionToken,
  deleteSocialConnection,
  createOAuthState,
  getOAuthState,
  deleteOAuthState,
};
