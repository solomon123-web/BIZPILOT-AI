import { prisma } from '../config/prisma.js';

const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'business';
};

const generateUniqueSlug = async (name: string): Promise<string> => {
  const baseSlug = createSlug(name);

  let slug = baseSlug;
  let counter = 1;

  while (await prisma.business.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

export const createBusiness = async (
  ownerId: string,
  payloadOrName: any,
  businessType?: string | null,
  country?: string | null,
  city?: string | null,
  description?: string | null,
  goals?: string[] | null,
) => {
  // If the owner already has a business, return the first existing one
  const existing = await prisma.business.findFirst({ where: { ownerId }, include: { workspaces: true } });
  if (existing) {
    return existing;
  }
  // Support being called with a parsed payload object
  let nameVal = '';
  let bt = businessType;
  let cty = country;
  let desc = description;
  let g = goals;

  if (typeof payloadOrName === 'object' && payloadOrName !== null) {
    nameVal = payloadOrName.name;
    bt = payloadOrName.businessType ?? null;
    cty = payloadOrName.country ?? null;
    desc = payloadOrName.description ?? null;
    g = payloadOrName.goals ?? [];
  } else {
    nameVal = String(payloadOrName || 'Untitled');
  }

  const slug = await generateUniqueSlug(nameVal);

  const result = await prisma.$transaction(async (tx) => {
    const business = await tx.business.create({
      data: {
        name: nameVal,
        slug,
        businessType: bt ?? null,
        country: cty ?? null,
        city: city ?? null,
        description: desc ?? null,
        goals: g ?? [],
        ownerId,
      },
    });

    await tx.workspace.create({
      data: {
        name: 'Main Workspace',
        businessId: business.id,
      },
    });

    return tx.business.findUnique({ where: { id: business.id }, include: { workspaces: true } });
  });

  return result;
};

export const getBusinessesByOwner = async (ownerId: string) => {
  return prisma.business.findMany({
    where: {
      ownerId,
    },
    include: {
      workspaces: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getBusinessById = async (
  businessId: string,
  ownerId: string,
) => {
  return prisma.business.findFirst({
    where: {
      id: businessId,
      ownerId,
    },
    include: {
      workspaces: true,
    },
  });
};

export const updateBusiness = async (
  businessId: string,
  ownerId: string,
  payloadOrName?: any,
  businessType?: string | null,
  country?: string | null,
  city?: string | null,
  description?: string | null,
  goals?: string[] | null,
) => {
  const existing = await prisma.business.findFirst({ where: { id: businessId, ownerId } });
  if (!existing) {
    return { count: 0 } as any;
  }

  let nameVal: string | undefined = undefined;
  let bt = businessType;
  let cty = country;
  let desc = description;
  let g = goals;

  if (typeof payloadOrName === 'object' && payloadOrName !== null) {
    nameVal = payloadOrName.name ?? undefined;
    bt = payloadOrName.businessType ?? bt;
    cty = payloadOrName.country ?? cty;
    desc = payloadOrName.description ?? desc;
    g = payloadOrName.goals ?? g;
  } else if (typeof payloadOrName === 'string') {
    nameVal = payloadOrName;
  }

  const data: any = {};

  if (nameVal && nameVal !== existing.name) {
    data.name = nameVal;
    data.slug = await generateUniqueSlug(nameVal);
  }

  if (bt !== undefined) data.businessType = bt;
  if (cty !== undefined) data.country = cty;
  if (city !== undefined) data.city = city;
  if (desc !== undefined) data.description = desc;
  if (g !== undefined) data.goals = g ?? [];

  const updated = await prisma.business.updateMany({ where: { id: businessId, ownerId }, data });

  return updated;
};

export const deleteBusiness = async (
  businessId: string,
  ownerId: string,
) => {
  return prisma.business.deleteMany({
    where: {
      id: businessId,
      ownerId,
    },
  });
};

export default {
  createBusiness,
  getBusinessesByOwner,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
};
