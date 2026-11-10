import api from './api';

export type ProductType = 'product' | 'service';
export type ProductStatus = 'draft' | 'published';

export interface ProductRecord {
  id: string;
  businessId: string;
  name: string;
  type: ProductType;
  description?: string | null;
  price: number;
  currency: string;
  category?: string | null;
  availability?: string | null;
  stockQuantity?: number | null;
  sku?: string | null;
  businessLocation?: string | null;
  deliveryInfo?: string | null;
  productVariations?: unknown;
  slug: string;
  status: ProductStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductMediaRecord {
  id: string;
  productId: string;
  businessId: string;
  type: 'image' | 'video';
  url: string;
  provider: string;
  fileName?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  isPrimary?: boolean;
}

export const getProducts = async () =>
  api.get<{ success: boolean; data: { products: ProductRecord[] } }>('/products');

export const createProduct = async (payload: Partial<ProductRecord> & { name: string }) =>
  api.post<{ success: boolean; data: { product: ProductRecord } }>('/products', payload);

export const updateProduct = async (id: string, payload: Partial<ProductRecord>) =>
  api.patch<{ success: boolean; data: { product: ProductRecord } }>(`/products/${id}`, payload);

export const updateProductStatus = async (id: string, status: ProductStatus) =>
  api.patch<{ success: boolean; data: { product: ProductRecord } }>(`/products/${id}/status`, { status });

export const deleteProduct = async (id: string) =>
  api.delete<{ success: boolean; message?: string }>(`/products/${id}`);

export const listProductMedia = async (productId: string) =>
  api.get<{ success: boolean; data: { media: ProductMediaRecord[] } }>(`/products/${encodeURIComponent(productId)}/media`);

export const uploadProductMedia = async (productId: string, files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  return fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products/${encodeURIComponent(productId)}/media`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('bizpilot_auth_token') ?? ''}`,
    },
    body: formData,
  }).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Media upload failed.');
    }
    return data as { success: boolean; data: { media: ProductMediaRecord[] } };
  });
};

export const publishProduct = async (productId: string, channels: string[]) =>
  api.post<{ success: boolean; data: { product: ProductRecord; listings: Array<{ channel: string; status: string }> } }>(`/products/${encodeURIComponent(productId)}/publish`, { channels });

export const getPublicProducts = async () =>
  api.get<{ success: boolean; data: { products: ProductRecord[] } }>('/public/products');

export const getPublicProduct = async (slug: string) =>
  api.get<{ success: boolean; data: { product: ProductRecord & { business?: { id: string; name: string; slug: string } } } }>(`/public/products/${encodeURIComponent(slug)}`);

export default {
  getProducts,
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
  listProductMedia,
  uploadProductMedia,
  publishProduct,
  getPublicProducts,
  getPublicProduct,
};
