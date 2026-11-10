import api from './api';

export interface ActivityRecord {
  id: string;
  businessId: string;
  type: string;
  metadata?: Record<string, unknown> | null;
  createdAt?: string;
}

export const listActivities = async (businessId: string) => {
  return api.get<{ success: boolean; items: ActivityRecord[] }>(`/activity?businessId=${encodeURIComponent(businessId)}`);
};

export default { listActivities };
