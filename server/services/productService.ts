import { prisma } from '../config/prisma.js';

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'product';

const generateUniqueSlug = async (businessId: string, name: string): Promise<string> => {
  const base = slugify(name);
  let slug = base;
  let counter = 1;

  while (await prisma.product.findFirst({ where: { businessId, slug } })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
};

export const createProduct = async (businessId: string, payload: any) => {
  const name = String(payload?.name ?? '').trim();
  if (!name) {
    throw new Error('Product name is required.');
  }

  const type = String(payload?.type ?? 'product').trim() || 'product';
  const price = Number(payload?.price ?? 0);
  const currency = String(payload?.currency ?? 'USD').trim() || 'USD';
  const status = String(payload?.status ?? 'draft').trim() === 'published' ? 'published' : 'draft';
  const description = payload?.description == null ? null : String(payload.description).trim() || null;
  const category = payload?.category == null ? null : String(payload.category).trim() || null;
  const availability = payload?.availability == null ? 'in_stock' : String(payload.availability).trim() || 'in_stock';
  const stockQuantity = payload?.stockQuantity == null ? 0 : Number(payload.stockQuantity ?? 0);
  const sku = payload?.sku == null ? null : String(payload.sku).trim() || null;
  const businessLocation = payload?.businessLocation == null ? null : String(payload.businessLocation).trim() || null;
  const deliveryInfo = payload?.deliveryInfo == null ? null : String(payload.deliveryInfo).trim() || null;
  const productVariations = payload?.productVariations ?? null;

  const slug = await generateUniqueSlug(businessId, name);

  return prisma.product.create({
    data: {
      businessId,
      name,
      type,
      description,
      price: Number.isFinite(price) ? price : 0,
      currency,
      status,
      category,
      availability,
      stockQuantity: Number.isFinite(stockQuantity) ? Math.max(0, stockQuantity) : 0,
      sku,
      businessLocation,
      deliveryInfo,
      productVariations,
      slug,
    },
  });
};

export const getProductsByBusiness = async (businessId: string) => {
  return prisma.product.findMany({
    where: { businessId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getPublishedProductsByBusiness = async (businessId: string) => {
  return prisma.product.findMany({
    where: { businessId, status: 'published' },
    orderBy: { createdAt: 'desc' },
  });
};

export const getProductById = async (id: string, businessId: string) => {
  return prisma.product.findFirst({ where: { id, businessId } });
};

export const getProductBySlug = async (slug: string, businessId?: string) => {
  return prisma.product.findFirst({
    where: {
      slug,
      ...(businessId ? { businessId } : {}),
    },
  });
};

export const updateProduct = async (id: string, businessId: string, payload: any) => {
  const existing = await prisma.product.findFirst({ where: { id, businessId } });
  if (!existing) {
    return null;
  }

  const name = payload?.name == null ? existing.name : String(payload.name).trim();
  const type = payload?.type == null ? existing.type : String(payload.type).trim() || existing.type;
  const description = payload?.description == null ? existing.description : String(payload.description).trim() || null;
  const price = payload?.price == null ? existing.price : Number(payload.price ?? existing.price);
  const currency = payload?.currency == null ? existing.currency : String(payload.currency ?? existing.currency).trim() || existing.currency;
  const status = payload?.status == null ? existing.status : String(payload.status).trim() === 'published' ? 'published' : 'draft';
  const category = payload?.category == null ? existing.category : String(payload.category).trim() || null;
  const availability = payload?.availability == null ? existing.availability ?? 'in_stock' : String(payload.availability).trim() || 'in_stock';
  const stockQuantity = payload?.stockQuantity == null ? existing.stockQuantity ?? 0 : Number(payload.stockQuantity ?? 0);
  const sku = payload?.sku == null ? existing.sku : String(payload.sku).trim() || null;
  const businessLocation = payload?.businessLocation == null ? existing.businessLocation : String(payload.businessLocation).trim() || null;
  const deliveryInfo = payload?.deliveryInfo == null ? existing.deliveryInfo : String(payload.deliveryInfo).trim() || null;
  const productVariations = payload?.productVariations == null ? existing.productVariations : payload.productVariations;

  const updateData: any = {
    name,
    type,
    description,
    price: Number.isFinite(price) ? price : existing.price,
    currency,
    status,
    category,
    availability,
    stockQuantity: Number.isFinite(stockQuantity) ? Math.max(0, stockQuantity) : existing.stockQuantity ?? 0,
    sku,
    businessLocation,
    deliveryInfo,
    productVariations,
  };

  if (payload?.name && payload.name !== existing.name) {
    updateData.slug = await generateUniqueSlug(businessId, String(payload.name));
  }

  return prisma.product.update({
    where: { id },
    data: updateData,
  });
};

export const updateProductStatus = async (id: string, businessId: string, status: 'draft' | 'published') => {
  const existing = await prisma.product.findFirst({ where: { id, businessId } });
  if (!existing) {
    return null;
  }

  return prisma.product.update({
    where: { id },
    data: { status },
  });
};

export const deleteProduct = async (id: string, businessId: string) => {
  return prisma.product.deleteMany({ where: { id, businessId } });
};

export const getAllPublishedProducts = async () => {
  return prisma.product.findMany({
    where: { status: 'published' },
    orderBy: { createdAt: 'desc' },
    include: { business: true },
  });
};

export const getPublicProductBySlug = async (slug: string) => {
  return prisma.product.findFirst({
    where: { slug, status: 'published' },
    include: { business: { select: { id: true, name: true, slug: true } } },
  });
};

export default {
  createProduct,
  getProductsByBusiness,
  getPublishedProductsByBusiness,
  getProductById,
  getProductBySlug,
  updateProduct,
  updateProductStatus,
  deleteProduct,
  getAllPublishedProducts,
  getPublicProductBySlug,
};
