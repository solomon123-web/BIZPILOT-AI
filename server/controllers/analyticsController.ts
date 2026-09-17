import { type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import analyticsService from '../services/analyticsService.js';
import businessService from '../services/businessService.js';

const analyticsQuerySchema = z.object({
  period: z.coerce.number().int().min(1).max(365).optional(),
});

const getUserId = (req: Request) => (req as any).user?.id ?? null;

const getBusinessIdForUser = async (req: Request) => {
  const userId = getUserId(req);
  if (!userId) return null;

  const businesses = await businessService.getBusinessesByOwner(userId);
  return businesses[0]?.id ?? null;
};

export const getOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const parsed = analyticsQuerySchema.parse(req.query);
    const businessId = await getBusinessIdForUser(req);
    if (!businessId) {
      return res.status(200).json({
        success: true,
        data: {
          overview: {
            period: parsed.period ?? 30,
            totalRevenue: 0,
            paidRevenue: 0,
            outstandingRevenue: 0,
            totalCustomers: 0,
            totalInvoices: 0,
            paidInvoices: 0,
            pendingInvoices: 0,
            overdueInvoices: 0,
            recentCustomers: [],
            recentInvoices: [],
            revenueSeries: [],
          },
        },
      });
    }

    const overview = await analyticsService.getBusinessOverview(businessId, parsed.period ?? 30);

    return res.status(200).json({ success: true, data: { overview } });
  } catch (error) {
    next(error);
  }
};

export default { getOverview };
