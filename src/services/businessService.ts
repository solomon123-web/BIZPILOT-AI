import api from './api';
import type { BusinessProfile } from '../types/business';

export interface BusinessApiRecord {
  id: string;
  name: string;
  slug: string;
  businessType?: string | null;
  country?: string | null;
  city?: string | null;
  description?: string | null;
  goals?: string[];
  ownerId: string;
  createdAt?: string;
  updatedAt?: string;
  workspaces?: Array<{ id: string; name: string; businessId: string }>;
}

export function mapBusinessToProfile(
  business: BusinessApiRecord | null | undefined,
): BusinessProfile | null {
  if (!business) {
    return null;
  }

  return {
    id: business.id ?? undefined,
    businessName: business.name ?? '',
    businessType: business.businessType ?? '',
    country: business.country ?? '',
    city: business.city ?? '',
    description: business.description ?? '',
    goals: Array.isArray(business.goals)
      ? (business.goals as BusinessProfile['goals'])
      : [],
  };
}

export function mapProfileToPayload(
  profile: BusinessProfile,
): {
  name: string;
  businessType: string;
  country: string;
  city: string;
  description: string;
  goals: string[];
} {
  return {
    name: profile.businessName,
    businessType: profile.businessType,
    country: profile.country,
    city: profile.city,
    description: profile.description,
    goals: profile.goals,
  };
}

export const createBusiness = async (profile: BusinessProfile) => {
  return api.post<{ success: boolean; data: { business: BusinessApiRecord } }>(
    '/businesses',
    mapProfileToPayload(profile),
  );
};

export const getBusinesses = async () => {
  return api.get<{ success: boolean; data: { businesses: BusinessApiRecord[] } }>(
    '/businesses',
  );
};

export const getBusiness = async (id: string) => {
  return api.get<{ success: boolean; data: { business: BusinessApiRecord } }>(
    `/businesses/${id}`,
  );
};

export const updateBusiness = async (
  id: string,
  profile: BusinessProfile,
) => {
  return api.patch<{ success: boolean; data: { business: BusinessApiRecord } }>(
    `/businesses/${id}`,
    mapProfileToPayload(profile),
  );
};

export const deleteBusiness = async (id: string) => {
  return api.delete<{ success: boolean; message?: string }>(`/businesses/${id}`);
};

export default {
  createBusiness,
  getBusinesses,
  getBusiness,
  updateBusiness,
  deleteBusiness,
  mapBusinessToProfile,
  mapProfileToPayload,
};
