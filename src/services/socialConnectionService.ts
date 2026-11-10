import api from './api';

export interface SocialConnectionRecord {
  id: string;
  platform: string;
  accountName?: string | null;
  accountType?: string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getSocialConnections = async (businessId: string) => {
  return api.get<{ success: boolean; connections: SocialConnectionRecord[] }>(`/social/connections?businessId=${encodeURIComponent(businessId)}`);
};

export default { getSocialConnections };
