import { prisma } from '../config/prisma.js';
import env from '../config/env.js';

export type SupportedChannel = 'facebook' | 'instagram' | 'tiktok' | 'whatsapp' | 'shopify' | 'jumia' | 'jiji';

export const channelCatalog = [
  { channel: 'facebook', availability: 'requires_approval', label: 'Facebook Pages', description: 'Official Meta approval required for live publishing.' },
  { channel: 'instagram', availability: 'requires_approval', label: 'Instagram Professional Accounts', description: 'Official Meta approval required for live publishing.' },
  { channel: 'tiktok', availability: 'not_available', label: 'TikTok', description: 'Integration not available yet.' },
  { channel: 'whatsapp', availability: 'requires_connection', label: 'WhatsApp Business', description: 'Requires an approved WhatsApp Business app connection.' },
  { channel: 'shopify', availability: 'requires_approval', label: 'Shopify', description: 'Requires Shopify app approval and credentials.' },
  { channel: 'jumia', availability: 'not_available', label: 'Jumia', description: 'Additional seller approval required.' },
  { channel: 'jiji', availability: 'not_available', label: 'Jiji', description: 'Additional marketplace approval required.' },
] as const;

export const getAvailablePublishingChannels = async (businessId: string) => {
  const connections = await prisma.socialConnection.findMany({
    where: { businessId },
    select: { platform: true, status: true, accountName: true },
  });

  return channelCatalog.map((channel) => {
    const connected = connections.some((connection) => connection.platform === channel.channel && connection.status === 'connected');
    return {
      ...channel,
      connected,
      status: connected ? 'connected' : channel.availability,
    };
  });
};

const getPlatformRequirement = (channel: SupportedChannel) => {
  const base = {
    facebook: { label: 'Facebook Pages', configured: () => Boolean(env.META_APP_ID && env.META_APP_SECRET) },
    instagram: { label: 'Instagram Professional Accounts', configured: () => Boolean(env.META_APP_ID && env.META_APP_SECRET) },
    tiktok: { label: 'TikTok', configured: () => Boolean(env.TIKTOK_CLIENT_KEY && env.TIKTOK_CLIENT_SECRET) },
    whatsapp: { label: 'WhatsApp Business', configured: () => Boolean(env.WHATSAPP_ACCESS_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID) },
    shopify: { label: 'Shopify', configured: () => Boolean(env.SHOPIFY_APP_KEY && env.SHOPIFY_APP_SECRET) },
    jumia: { label: 'Jumia', configured: () => false },
    jiji: { label: 'Jiji', configured: () => false },
  } as const;

  return base[channel];
};

export const validatePublishingRequest = async (businessId: string, channels: string[]) => {
  const requested = [...new Set(channels.filter(Boolean).map((channel) => String(channel).toLowerCase()))];
  const missing: Array<{ channel: string; reason: string }> = [];

  for (const channel of requested) {
    const normalizedChannel = channel as SupportedChannel;
    const requirement = getPlatformRequirement(normalizedChannel);
    const hasConnectedAccount = await prisma.socialConnection.findFirst({
      where: {
        businessId,
        platform: normalizedChannel,
        status: 'connected',
      },
    });

    if (!requirement.configured()) {
      missing.push({
        channel,
        reason: `${requirement.label} is not configured. Add the required app credentials before publishing.`,
      });
      continue;
    }

    if (!hasConnectedAccount) {
      missing.push({
        channel,
        reason: `${requirement.label} requires an active connected account before publishing.`,
      });
    }
  }

  return {
    allowed: missing.length === 0,
    missing,
  };
};

export const createProductListing = async (productId: string, businessId: string, channel: SupportedChannel, status: string = 'DRAFT', content?: any) => {
  return prisma.productListing.upsert({
    where: { productId_channel: { productId, channel } },
    update: { businessId, status, content: content ?? undefined },
    create: { productId, businessId, channel, status, content: content ?? undefined },
  });
};

export const createPublishingJob = async (productId: string, businessId: string, channel: SupportedChannel, payload: any = {}) => {
  return prisma.publishingJob.create({
    data: {
      productId,
      businessId,
      channel,
      status: 'QUEUED',
      payload,
    },
  });
};

export const markPublishingJob = async (jobId: string, status: string, result?: any, errorMessage?: string) => {
  return prisma.publishingJob.update({
    where: { id: jobId },
    data: {
      status,
      result: result ?? undefined,
      errorMessage: errorMessage ?? null,
    },
  });
};

export default {
  channelCatalog,
  getAvailablePublishingChannels,
  validatePublishingRequest,
  createProductListing,
  createPublishingJob,
  markPublishingJob,
};
