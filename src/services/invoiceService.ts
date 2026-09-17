import api from './api';

export interface InvoiceItemRecord {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
}

export interface InvoiceRecord {
  id: string;
  number: string;
  businessId: string;
  workspaceId?: string | null;
  customerId?: string | null;
  status: string;
  amount: number;
  tax: number;
  total: number;
  issueDate?: string;
  dueDate?: string;
  notes?: string | null;
  items?: InvoiceItemRecord[];
}

export const getInvoices = async () => {
  return api.get<{ success: boolean; data: { invoices: InvoiceRecord[] } }>('/invoices');
};

export const createInvoice = async (payload: Partial<InvoiceRecord>) => {
  return api.post<{ success: boolean; data: { invoice: InvoiceRecord } }>('/invoices', payload);
};

export const updateInvoice = async (id: string, payload: Partial<InvoiceRecord>) => {
  return api.put<{ success: boolean; data: { invoice: InvoiceRecord } }>(`/invoices/${id}`, payload);
};

export const deleteInvoice = async (id: string) => {
  return api.delete<{ success: boolean; message?: string }>(`/invoices/${id}`);
};

export default { getInvoices, createInvoice, updateInvoice, deleteInvoice };
