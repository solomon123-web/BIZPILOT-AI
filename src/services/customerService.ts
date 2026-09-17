import api from './api';

export interface CustomerRecord {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  notes?: string | null;
  businessId: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getCustomers = async () => {
  return api.get<{ success: boolean; data: { customers: CustomerRecord[] } }>('/customers');
};

export const createCustomer = async (payload: Partial<CustomerRecord>) => {
  return api.post<{ success: boolean; data: { customer: CustomerRecord } }>('/customers', payload);
};

export const updateCustomer = async (id: string, payload: Partial<CustomerRecord>) => {
  return api.put<{ success: boolean; data: { customer: CustomerRecord } }>(`/customers/${id}`, payload);
};

export const deleteCustomer = async (id: string) => {
  return api.delete<{ success: boolean; message?: string }>(`/customers/${id}`);
};

export default { getCustomers, createCustomer, updateCustomer, deleteCustomer };
