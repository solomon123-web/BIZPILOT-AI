import { prisma } from '../config/prisma.js';

export const listProductMedia = async (productId: string, businessId: string) => {
  return prisma.productMedia.findMany({
    where: { productId, businessId },
    orderBy: { createdAt: 'desc' },
  });
};

export const addProductMedia = async (productId: string, businessId: string, media: Array<{ url: string; type: string; provider?: string; fileName?: string | null; mimeType?: string | null; sizeBytes?: number | null }>) => {
  if (media.length === 0) {
    return [] as any[];
  }

  const created = await Promise.all(media.map((item) => prisma.productMedia.create({
    data: {
      productId,
      businessId,
      type: item.type === 'video' ? 'video' : 'image',
      url: item.url,
      provider: item.provider || 'local',
      fileName: item.fileName ?? null,
      mimeType: item.mimeType ?? null,
      sizeBytes: item.sizeBytes ?? null,
      isPrimary: false,
    },
  })));

  return created;
};

export const deleteProductMedia = async (productId: string, mediaId: string, businessId: string) => {
  return prisma.productMedia.deleteMany({ where: { id: mediaId, productId, businessId } });
};

export default {
  listProductMedia,
  addProductMedia,
  deleteProductMedia,
};
