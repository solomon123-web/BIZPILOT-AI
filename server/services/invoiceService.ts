import { prisma } from '../config/prisma.js';

export const createInvoice = async (businessId: string, payload: any) => {
  // Calculate totals server-side
  const items = payload.items || [];
  const amount = items.reduce((s: number, it: any) => s + (it.quantity || 0) * (it.unitPrice || 0), 0);
  const tax = items.reduce((s: number, it: any) => s + ((it.taxRate || 0) * (it.quantity || 0) * (it.unitPrice || 0)) / 100, 0);
  const total = amount + tax;

  const number = payload.number || `INV-${Date.now()}`;

  const invoice = await prisma.$transaction(async (tx) => {
    const inv = await tx.invoice.create({
      data: {
        number,
        businessId,
        customerId: payload.customerId || null,
        status: payload.status || 'pending',
        amount,
        tax,
        total,
        issueDate: payload.issueDate ? new Date(payload.issueDate) : undefined,
        dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
        notes: payload.notes || null,
      },
    });

    if (Array.isArray(items) && items.length > 0) {
      for (const it of items) {
        await tx.invoiceItem.create({ data: { invoiceId: inv.id, description: it.description || '', quantity: it.quantity || 0, unitPrice: it.unitPrice || 0, taxRate: it.taxRate || 0 } });
      }
    }

    return tx.invoice.findUnique({ where: { id: inv.id }, include: { items: true } });
  });

  return invoice;
};

export const getInvoicesByBusiness = async (businessId: string) => {
  return prisma.invoice.findMany({ where: { businessId }, include: { items: true }, orderBy: { createdAt: 'desc' } });
};

export const getInvoiceById = async (id: string, businessId: string) => {
  return prisma.invoice.findFirst({ where: { id, businessId }, include: { items: true } });
};

export const updateInvoice = async (id: string, businessId: string, payload: any) => {
  const existing = await prisma.invoice.findFirst({ where: { id, businessId } });
  if (!existing) return null;

  // Recompute totals if items provided
  const items = payload.items ?? null;
  let amount = existing.amount;
  let tax = existing.tax;
  let total = existing.total;

  if (items) {
    amount = items.reduce((s: number, it: any) => s + (it.quantity || 0) * (it.unitPrice || 0), 0);
    tax = items.reduce((s: number, it: any) => s + ((it.taxRate || 0) * (it.quantity || 0) * (it.unitPrice || 0)) / 100, 0);
    total = amount + tax;
  }

  const updated = await prisma.$transaction(async (tx) => {
    if (items) {
      await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });
      for (const it of items) {
        await tx.invoiceItem.create({ data: { invoiceId: id, description: it.description || '', quantity: it.quantity || 0, unitPrice: it.unitPrice || 0, taxRate: it.taxRate || 0 } });
      }
    }

    const upd = await tx.invoice.update({ where: { id }, data: { ...payload, amount, tax, total } });
    return tx.invoice.findUnique({ where: { id: upd.id }, include: { items: true } });
  });

  return updated;
};

export const deleteInvoice = async (id: string, businessId: string) => {
  return prisma.invoice.deleteMany({ where: { id, businessId } });
};

export default {
  createInvoice,
  getInvoicesByBusiness,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};
