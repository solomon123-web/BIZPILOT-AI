import { prisma } from '../config/prisma.js';

export type AnalyticsPeriod = 7 | 30 | 90 | 365;

const normalizePeriod = (value?: number): AnalyticsPeriod => {
  const allowed = [7, 30, 90, 365] as const;
  return allowed.includes((value ?? 30) as AnalyticsPeriod)
    ? ((value ?? 30) as AnalyticsPeriod)
    : 30;
};

const getDateRangeStart = (period: AnalyticsPeriod) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (period - 1));
  return start;
};

export const getBusinessOverview = async (businessId: string, period?: number) => {
  const normalizedPeriod = normalizePeriod(period);
  const rangeStart = getDateRangeStart(normalizedPeriod);

  const [customerCount, invoiceCount, paidInvoiceCount, pendingInvoiceCount, overdueInvoiceCount, totalRevenue, paidRevenue, outstandingRevenue, recentCustomers, recentInvoices, revenueSeries] = await Promise.all([
    prisma.customer.count({ where: { businessId } }),
    prisma.invoice.count({ where: { businessId } }),
    prisma.invoice.count({ where: { businessId, status: 'paid' } }),
    prisma.invoice.count({ where: { businessId, status: 'pending' } }),
    prisma.invoice.count({ where: { businessId, status: 'overdue' } }),
    prisma.invoice.aggregate({
      where: { businessId },
      _sum: { total: true },
    }),
    prisma.invoice.aggregate({
      where: { businessId, status: 'paid' },
      _sum: { total: true },
    }),
    prisma.invoice.aggregate({
      where: { businessId, status: { not: 'paid' } },
      _sum: { total: true },
    }),
    prisma.customer.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    }),
    prisma.invoice.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { customer: true, items: true },
    }),
    prisma.invoice.groupBy({
      by: ['issueDate'],
      where: { businessId, issueDate: { gte: rangeStart } },
      _sum: { total: true },
      orderBy: { issueDate: 'asc' },
    }),
  ]);

  const revenuePoints = revenueSeries.map((point) => ({
    date: new Date(point.issueDate).toISOString().slice(0, 10),
    value: Number(point._sum.total ?? 0),
  }));

  return {
    period: normalizedPeriod,
    totalRevenue: Number(totalRevenue._sum.total ?? 0),
    paidRevenue: Number(paidRevenue._sum.total ?? 0),
    outstandingRevenue: Number(outstandingRevenue._sum.total ?? 0),
    totalCustomers: customerCount,
    totalInvoices: invoiceCount,
    paidInvoices: paidInvoiceCount,
    pendingInvoices: pendingInvoiceCount,
    overdueInvoices: overdueInvoiceCount,
    recentCustomers: recentCustomers,
    recentInvoices: recentInvoices.map((invoice) => ({
      id: invoice.id,
      number: invoice.number,
      status: invoice.status,
      total: Number(invoice.total ?? 0),
      createdAt: invoice.createdAt,
      customer: invoice.customer ? { id: invoice.customer.id, name: invoice.customer.name } : null,
    })),
    revenueSeries: revenuePoints,
  };
};

export default {
  getBusinessOverview,
};
