import { prisma } from '../config/prisma.js';

export const runExecutiveAudit = async (businessId: string) => {
  const [customers, leads, invoices, pendingInvoices, overdueInvoices, aiActions, connectedAccounts] = await Promise.all([
    prisma.customer.count({ where: { businessId } }),
    prisma.lead.count({ where: { businessId } }),
    prisma.invoice.count({ where: { businessId } }),
    prisma.invoice.count({ where: { businessId, status: 'pending' } }),
    prisma.invoice.count({ where: { businessId, status: 'overdue' } }),
    prisma.aIAction.count({ where: { businessId } }),
    prisma.socialConnection.count({ where: { businessId } }),
  ]);

  const checks = [
    {
      label: 'Customer coverage',
      ok: customers > 0,
      detail: `${customers} customer records detected`,
    },
    {
      label: 'Lead pipeline',
      ok: leads > 0,
      detail: `${leads} leads in the active pipeline`,
    },
    {
      label: 'Invoice health',
      ok: pendingInvoices === 0,
      detail: `${pendingInvoices} pending invoice(s) require review`,
    },
    {
      label: 'AIOps activity',
      ok: aiActions >= 0,
      detail: `${aiActions} AI actions have been logged`,
    },
    {
      label: 'Social connectivity',
      ok: connectedAccounts > 0,
      detail: `${connectedAccounts} connected social account(s)`,
    },
  ];

  const anomalies = checks.filter((check) => !check.ok).length;

  let status: 'healthy' | 'watch' | 'action_required' = 'healthy';
  if (anomalies >= 3) {
    status = 'action_required';
  } else if (anomalies > 0) {
    status = 'watch';
  }

  return {
    status,
    anomalies,
    generatedAt: new Date().toISOString(),
    checks,
    totals: {
      customers,
      leads,
      invoices,
      pendingInvoices,
      overdueInvoices,
      aiActions,
      connectedAccounts,
    },
  };
};

export default { runExecutiveAudit };
