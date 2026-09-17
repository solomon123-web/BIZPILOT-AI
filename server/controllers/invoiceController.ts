import { type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import invoiceService from '../services/invoiceService.js';

const invoiceItemSchema = z.object({ description: z.string().min(1).max(1000), quantity: z.number().int().min(1), unitPrice: z.number().min(0), taxRate: z.number().optional() });

const invoiceSchema = z.object({
  number: z.string().optional(),
  customerId: z.string().optional(),
  status: z.string().optional(),
  items: z.array(invoiceItemSchema).optional(),
  issueDate: z.string().optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
});

const getUserId = (req: Request) => (req as any).user?.id ?? null;
const getUserBusinessId = async (req: Request) => {
  const businesses = await (await import('../services/businessService.js')).default.getBusinessesByOwner(getUserId(req) as string);
  return businesses[0]?.id ?? null;
};

export const createInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required.' });

    const businessId = await getUserBusinessId(req);
    if (!businessId) return res.status(400).json({ success: false, message: 'No business found for user.' });

    const parsed = invoiceSchema.parse(req.body);
    const invoice = await invoiceService.createInvoice(businessId, parsed);

    return res.status(201).json({ success: true, data: { invoice } });
  } catch (error) {
    next(error);
  }
};

export const getInvoices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required.' });

    const businessId = await getUserBusinessId(req);
    if (!businessId) return res.status(200).json({ success: true, data: { invoices: [] } });

    const invoices = await invoiceService.getInvoicesByBusiness(businessId);
    return res.status(200).json({ success: true, data: { invoices } });
  } catch (error) {
    next(error);
  }
};

export const getInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required.' });

    const businessId = await getUserBusinessId(req);
    if (!businessId) return res.status(404).json({ success: false, message: 'Invoice not found.' });

    const invoice = await invoiceService.getInvoiceById(String(req.params.id), businessId);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' });

    return res.status(200).json({ success: true, data: { invoice } });
  } catch (error) {
    next(error);
  }
};

export const updateInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required.' });

    const businessId = await getUserBusinessId(req);
    if (!businessId) return res.status(404).json({ success: false, message: 'Invoice not found.' });

    const parsed = invoiceSchema.partial().parse(req.body);

    const updated = await invoiceService.updateInvoice(String(req.params.id), businessId, parsed);
    if (!updated) return res.status(404).json({ success: false, message: 'Invoice not found.' });

    return res.status(200).json({ success: true, data: { invoice: updated } });
  } catch (error) {
    next(error);
  }
};

export const deleteInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required.' });

    const businessId = await getUserBusinessId(req);
    if (!businessId) return res.status(404).json({ success: false, message: 'Invoice not found.' });

    const result = await invoiceService.deleteInvoice(String(req.params.id), businessId);
    if (result.count === 0) return res.status(404).json({ success: false, message: 'Invoice not found.' });

    return res.status(200).json({ success: true, message: 'Invoice deleted.' });
  } catch (error) {
    next(error);
  }
};

export default {
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoice,
  deleteInvoice,
};
