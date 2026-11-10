import api from './api';

export interface LeadRecord {
  id: string;
  businessId: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export type LeadPayload = Partial<Pick<LeadRecord, 'name' | 'email' | 'phone' | 'status' | 'metadata'>>;

export const getLeads = async (businessId?: string | null) => {
  const endpoint = businessId
    ? `/leads?businessId=${encodeURIComponent(businessId)}`
    : '/leads';

  return api.get<{ success: boolean; data: { leads: LeadRecord[] } }>(endpoint);
};

export const createLead = async (businessId: string, payload: LeadPayload = {}) => {
  return api.post<{ success: boolean; data: { lead: LeadRecord } }>('/leads', {
    businessId,
    payload,
  });
};

export const updateLead = async (id: string, payload: LeadPayload = {}) => {
  return api.patch<{ success: boolean; data: { lead: LeadRecord } }>(`/leads/${id}`, payload);
};

export const deleteLead = async (id: string) => {
  return api.delete<{ success: boolean; message?: string }>(`/leads/${id}`);
};

export default { getLeads, createLead, updateLead, deleteLead };
