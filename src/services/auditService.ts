import api from './api';

export interface ExecutiveAuditResult {
  status: 'healthy' | 'watch' | 'action_required';
  anomalies: number;
  generatedAt: string;
  checks: Array<{
    label: string;
    ok: boolean;
    detail: string;
  }>;
  totals: {
    customers: number;
    leads: number;
    invoices: number;
    pendingInvoices: number;
    overdueInvoices: number;
    aiActions: number;
    connectedAccounts: number;
  };
}

export const runExecutiveAudit = async (businessId: string) => {
  return api.post<{ success: boolean; report: ExecutiveAuditResult }>(`/audit/executive`, { businessId });
};

export default { runExecutiveAudit };
