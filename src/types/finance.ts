export type CustomerStatus = 'active' | 'inactive' | 'pending';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: CustomerStatus;
  lastInteraction?: string; // ISO date or friendly string
  totalPurchases?: number;
  notes?: string;
}

export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  taxRate?: number; // 0-100
}

export interface Invoice {
  id: string; // invoice number
  customerId: string;
  items: InvoiceItem[];
  amount: number; // subtotal
  tax: number;
  total: number; // amount + tax
  date: string; // ISO date
  dueDate: string; // ISO date
  status: InvoiceStatus;
  notes?: string;
}
