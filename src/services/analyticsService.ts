import api from './api';

export interface AnalyticsOverview {
  period: number;
  totalRevenue: number;
  paidRevenue: number;
  outstandingRevenue: number;
  totalCustomers: number;
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  recentCustomers: Array<{ id: string; name: string; email?: string; createdAt?: string }>;
  recentInvoices: Array<{ id: string; number: string; status: string; total: number; createdAt?: string; customer?: { id: string; name: string } }>;
  revenueSeries: Array<{ date: string; value: number }>;
}

export const getOverview = async (period?: number) => {
  return api.getWithQuery<{ success: boolean; data: { overview: AnalyticsOverview } }>('/analytics/overview', { period });
};

export default { getOverview };
