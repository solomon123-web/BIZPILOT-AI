import { type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import productService from '../services/productService.js';
import productMediaService from '../services/productMediaService.js';
import publishingService from '../services/publishingService.js';
import storageService from '../services/storageService.js';

const productSchema = z.object({
  name: z.string().trim().min(1).max(200),
  type: z.enum(['product', 'service']).optional().default('product'),
  description: z.string().trim().max(5000).optional().or(z.literal('')).default(''),
  price: z.coerce.number().min(0).max(100000000).optional().default(0),
  currency: z.string().trim().min(2).max(10).optional().default('USD'),
  status: z.enum(['draft', 'published']).optional().default('draft'),
  category: z.string().trim().max(100).optional().or(z.literal('')).default(''),
  availability: z.string().trim().max(50).optional().default('in_stock'),
  stockQuantity: z.coerce.number().int().min(0).max(1000000).optional().default(0),
  sku: z.string().trim().max(100).optional().or(z.literal('')).default(''),
  businessLocation: z.string().trim().max(200).optional().or(z.literal('')).default(''),
  deliveryInfo: z.string().trim().max(500).optional().or(z.literal('')).default(''),
  productVariations: z.any().optional(),
});

const getUserId = (req: Request): string | null => (req as any).user?.id ?? null;

const getUserBusinessId = async (req: Request): Promise<string | null> => {
  const userId = getUserId(req);
  if (!userId) {
    return null;
  }

  const businesses = await (await import('../services/businessService.js')).default.getBusinessesByOwner(userId);
  return businesses[0]?.id ?? null;
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const businessId = await getUserBusinessId(req);
    if (!businessId) {
      return res.status(400).json({ success: false, message: 'No business found for user.' });
    }

    const parsed = productSchema.parse(req.body);
    const product = await productService.createProduct(businessId, parsed);

    return res.status(201).json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const businessId = await getUserBusinessId(req);
    if (!businessId) {
      return res.status(200).json({ success: true, data: { products: [] } });
    }

    const products = await productService.getProductsByBusiness(businessId);
    return res.status(200).json({ success: true, data: { products } });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const businessId = await getUserBusinessId(req);
    if (!businessId) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const product = await productService.getProductById(String(req.params.id), businessId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.status(200).json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const businessId = await getUserBusinessId(req);
    if (!businessId) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const parsed = productSchema.partial().parse(req.body);
    const updated = await productService.updateProduct(String(req.params.id), businessId, parsed);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.status(200).json({ success: true, data: { product: updated } });
  } catch (error) {
    next(error);
  }
};

export const updateProductStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const businessId = await getUserBusinessId(req);
    if (!businessId) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const statusSchema = z.object({ status: z.enum(['draft', 'published']) });
    const parsed = statusSchema.parse(req.body);
    const updated = await productService.updateProductStatus(String(req.params.id), businessId, parsed.status);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.status(200).json({ success: true, data: { product: updated } });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const businessId = await getUserBusinessId(req);
    if (!businessId) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const result = await productService.deleteProduct(String(req.params.id), businessId);
    if (result.count === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.status(200).json({ success: true, message: 'Product deleted.' });
  } catch (error) {
    next(error);
  }
};

export const listProductMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const businessId = await getUserBusinessId(req);
    if (!businessId) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const product = await productService.getProductById(String(req.params.id), businessId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const media = await productMediaService.listProductMedia(product.id, businessId);
    return res.status(200).json({ success: true, data: { media } });
  } catch (error) {
    next(error);
  }
};

export const uploadProductMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const businessId = await getUserBusinessId(req);
    if (!businessId) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const product = await productService.getProductById(String(req.params.id), businessId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const files = Array.isArray(req.files) ? req.files : [];
    if (files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one image or video.' });
    }

    const uploadedFiles = await Promise.all(files.map(async (file: any) => {
      const stored = await storageService.uploadFile({
        fieldname: file.fieldname,
        originalname: file.originalname,
        filename: file.filename,
        encoding: file.encoding,
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer,
      });

      return {
        url: stored.url,
        type: stored.mimeType.startsWith('video/') ? 'video' : 'image',
        provider: stored.provider,
        fileName: stored.fileName,
        mimeType: stored.mimeType,
        sizeBytes: stored.sizeBytes,
      };
    }));

    const media = await productMediaService.addProductMedia(product.id, businessId, uploadedFiles);
    return res.status(200).json({ success: true, data: { media } });
  } catch (error) {
    next(error);
  }
};

export const publishProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const businessId = await getUserBusinessId(req);
    if (!businessId) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const product = await productService.getProductById(String(req.params.id), businessId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const channelsSchema = z.object({ channels: z.array(z.string()).default([]) });
    const parsed = channelsSchema.parse(req.body ?? {});

    const channels = parsed.channels.length > 0 ? parsed.channels : [];
    if (channels.length === 0) {
      return res.status(400).json({
        success: false,
        code: 'PUBLISHING_NOT_CONFIGURED',
        message: 'Select at least one platform with a real connected account and valid credentials before publishing.',
      });
    }

    const validation = await publishingService.validatePublishingRequest(businessId, channels);
    if (!validation.allowed) {
      return res.status(400).json({
        success: false,
        code: 'PUBLISHING_NOT_CONFIGURED',
        message: 'Publishing is blocked until the selected platform is connected and configured.',
        data: { missing: validation.missing },
      });
    }

    const listings = await Promise.all(channels.map(async (channel: string) => {
      const catalogEntry = publishingService.channelCatalog.find((entry) => entry.channel === channel);
      const status = catalogEntry?.availability === 'not_available' ? 'APPROVAL_REQUIRED' : (catalogEntry?.availability === 'requires_connection' ? 'CONNECTION_REQUIRED' : 'QUEUED');
      const listing = await publishingService.createProductListing(product.id, businessId, channel as any, status, {
        productName: product.name,
        status,
        price: product.price,
        currency: product.currency,
      });

      await publishingService.createPublishingJob(product.id, businessId, channel as any, {
        productName: product.name,
        channel,
        status,
      });

      return { channel, status, listingId: listing.id };
    }));

    return res.status(202).json({ success: true, data: { product, listings } });
  } catch (error) {
    next(error);
  }
};

export const listPublishedProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getAllPublishedProducts();
    return res.status(200).json({ success: true, data: { products } });
  } catch (error) {
    next(error);
  }
};

export const getPublishedProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getPublicProductBySlug(String(req.params.slug));
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found or not published.' });
    }

    return res.status(200).json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

export default {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
  listProductMedia,
  uploadProductMedia,
  publishProduct,
  listPublishedProducts,
  getPublishedProductBySlug,
};
