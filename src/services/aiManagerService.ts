import api from './api';

export interface AIActionRecord {
  id: string;
  businessId: string;
  actionType: string;
  status: string;
  requiresPermission: boolean;
  parameters?: Record<string, unknown>;
  result?: Record<string, unknown> | null;
  error?: string | null;
  createdAt?: string;
  executedAt?: string | null;
}

export const listActions = async (businessId: string) => {
  return api.get<{ success: boolean; actions: AIActionRecord[] }>(`/ai/manager/actions?businessId=${encodeURIComponent(businessId)}`);
};

export const createAction = async (
  businessId: string,
  actionType: string,
  parameters: Record<string, unknown>,
  requiresPermission = true,
) => {
  return api.post<{ success: boolean; action: AIActionRecord }>('/ai/manager/actions', {
    businessId,
    actionType,
    parameters,
    requiresPermission,
  });
};

export default { listActions, createAction };
