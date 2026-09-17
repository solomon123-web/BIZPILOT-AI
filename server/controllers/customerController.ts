import { type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import customerService from '../services/customerService.js';

const customerSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

const getUserId = (req: Request) => (req as any).user?.id ?? null;
const getUserBusinessId = async (req: Request) => {
  // Determine the user's primary business
  const businesses = await (await import('../services/businessService.js')).default.getBusinessesByOwner(getUserId(req) as string);
  return businesses[0]?.id ?? null;
};

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required.' });

    const businessId = await getUserBusinessId(req);
    if (!businessId) return res.status(400).json({ success: false, message: 'No business found for user.' });

    const parsed = customerSchema.parse(req.body);

    const customer = await customerService.createCustomer(businessId, parsed);

    return res.status(201).json({ success: true, data: { customer } });
  } catch (error) {
    next(error);
  }
};

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required.' });

    const businessId = await getUserBusinessId(req);
    if (!businessId) return res.status(200).json({ success: true, data: { customers: [] } });

    const customers = await customerService.getCustomersByBusiness(businessId);
    return res.status(200).json({ success: true, data: { customers } });
  } catch (error) {
    next(error);
  }
};

export const getCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required.' });

    const businessId = await getUserBusinessId(req);
    if (!businessId) return res.status(404).json({ success: false, message: 'Customer not found.' });

    const customer = await customerService.getCustomerById(String(req.params.id), businessId);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found.' });

    return res.status(200).json({ success: true, data: { customer } });
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required.' });

    const businessId = await getUserBusinessId(req);
    if (!businessId) return res.status(404).json({ success: false, message: 'Customer not found.' });

    const parsed = customerSchema.partial().parse(req.body);

    const updated = await customerService.updateCustomer(String(req.params.id), businessId, parsed);
    if (!updated) return res.status(404).json({ success: false, message: 'Customer not found.' });

    return res.status(200).json({ success: true, data: { customer: updated } });
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required.' });

    const businessId = await getUserBusinessId(req);
    if (!businessId) return res.status(404).json({ success: false, message: 'Customer not found.' });

    const result = await customerService.deleteCustomer(String(req.params.id), businessId);
    if (result.count === 0) return res.status(404).json({ success: false, message: 'Customer not found.' });

    return res.status(200).json({ success: true, message: 'Customer deleted.' });
  } catch (error) {
    next(error);
  }
};

export default {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
};
