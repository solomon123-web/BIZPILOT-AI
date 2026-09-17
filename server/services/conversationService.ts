import { prisma } from '../config/prisma.js';

export const getConversationsForBusiness = async (businessId: string) => {
  return prisma.customerConversation.findMany({ where: { businessId }, orderBy: { updatedAt: 'desc' } });
};

export const getConversationById = async (id: string, businessId: string) => {
  return prisma.customerConversation.findFirst({ where: { id, businessId }, include: { messages: true } });
};

export const createMessage = async (conversationId: string, direction: string, content: string, senderName?: string, externalId?: string) => {
  return prisma.customerMessage.create({ data: { conversationId, direction, content, senderName, externalMessageId: externalId ?? undefined } });
};

export default { getConversationsForBusiness, getConversationById, createMessage };
