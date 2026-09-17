import type { BusinessProfile } from '../types/business';

const STORAGE_KEY = 'bizpilotai.business-profile';

export function readBusinessProfile(): BusinessProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    const profile = parsed as Partial<BusinessProfile>;
    const isValid =
      typeof profile.businessName === 'string' &&
      typeof profile.businessType === 'string' &&
      typeof profile.country === 'string' &&
      typeof profile.city === 'string' &&
      typeof profile.description === 'string' &&
      Array.isArray(profile.goals);

    return isValid ? (profile as BusinessProfile) : null;
  } catch {
    return null;
  }
}

export function writeBusinessProfile(profile: BusinessProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function clearBusinessProfile() {
  localStorage.removeItem(STORAGE_KEY);
}
