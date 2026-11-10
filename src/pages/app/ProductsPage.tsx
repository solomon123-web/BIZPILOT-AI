import React, { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '../../components/app/PageContainer';
import { Input, Button, Card, Select } from '../../components/ui';
import productService, { type ProductRecord, type ProductStatus, type ProductType } from '../../services/productService';

const emptyForm = {
  name: '',
  type: 'product' as ProductType,
  description: '',
  price: '0',
  currency: 'USD',
  category: '',
  availability: 'in_stock',
  stockQuantity: '0',
  sku: '',
  businessLocation: '',
  deliveryInfo: '',
  status: 'draft' as ProductStatus,
};

export function ProductsPage() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | ProductType>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<Array<{ name: string; url: string; type: 'image' | 'video' }>>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getProducts();
      setProducts(response?.data?.products ?? []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load products and services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesType = typeFilter === 'all' || product.type === typeFilter;
      if (!matchesType) {
        return false;
      }

      if (!query) {
        return true;
      }

      const value = query.toLowerCase();
      return (
        product.name.toLowerCase().includes(value) ||
        (product.description ?? '').toLowerCase().includes(value) ||
        product.currency.toLowerCase().includes(value)
      );
    });
  }, [products, query, typeFilter]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(false);
    setMediaFiles([]);
    setMediaPreviews([]);
  };

  const openCreateForm = (type: ProductType = 'product') => {
    setForm({ ...emptyForm, type });
    setEditingId(null);
    setFormOpen(true);
    setMediaFiles([]);
    setMediaPreviews([]);
    setError(null);
    setSuccess(null);
  };

  const openEditForm = (product: ProductRecord) => {
    setForm({
      name: product.name,
      type: product.type,
      description: product.description ?? '',
      price: String(product.price ?? 0),
      currency: product.currency || 'USD',
      category: product.category ?? '',
      availability: product.availability ?? 'in_stock',
      stockQuantity: String(product.stockQuantity ?? 0),
      sku: product.sku ?? '',
      businessLocation: product.businessLocation ?? '',
      deliveryInfo: product.deliveryInfo ?? '',
      status: product.status,
    });
    setEditingId(product.id);
    setFormOpen(true);
    setMediaFiles([]);
    setMediaPreviews([]);
    setError(null);
    setSuccess(null);
  };

  const handleMediaSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(event.target.files ?? []);
    if (nextFiles.length === 0) {
      return;
    }

    setMediaFiles(nextFiles);
    setMediaPreviews(nextFiles.map((file) => ({
      name: file.name,
      type: file.type.startsWith('video/') ? 'video' : 'image',
      url: URL.createObjectURL(file),
    })));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const name = form.name.trim();
    if (!name) {
      setError('Product name is required.');
      return;
    }

    const priceValue = Number(form.price ?? 0);
    if (!Number.isFinite(priceValue) || priceValue < 0) {
      setError('Price must be a valid non-negative number.');
      return;
    }

    const payload = {
      name,
      type: form.type,
      description: form.description.trim(),
      price: priceValue,
      currency: form.currency,
      category: form.category.trim(),
      availability: form.availability,
      stockQuantity: Number(form.stockQuantity || 0),
      sku: form.sku.trim(),
      businessLocation: form.businessLocation.trim(),
      deliveryInfo: form.deliveryInfo.trim(),
      status: form.status,
    };

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      let savedProduct: ProductRecord | null = null;

      if (editingId) {
        const response = await productService.updateProduct(editingId, payload);
        savedProduct = response?.data?.product ?? null;
        if (savedProduct) {
          setProducts((current) => current.map((product) => (product.id === editingId ? savedProduct! : product)));
          setSuccess('Product updated successfully.');
        }
      } else {
        const response = await productService.createProduct(payload);
        savedProduct = response?.data?.product ?? null;
        if (savedProduct) {
          setProducts((current) => [savedProduct!, ...current]);
          setSuccess('Product created successfully.');
        }
      }

      if (savedProduct && mediaFiles.length > 0) {
        await productService.uploadProductMedia(savedProduct.id, mediaFiles);
        setSuccess('Product saved with uploaded media.');
      }

      resetForm();
    } catch (err: any) {
      setError(err?.message || 'Unable to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: ProductRecord) => {
    if (!window.confirm(`Delete ${product.name}?`)) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      await productService.deleteProduct(product.id);
      setProducts((current) => current.filter((item) => item.id !== product.id));
      setSuccess('Product deleted.');
    } catch (err: any) {
      setError(err?.message || 'Unable to delete product.');
    }
  };

  const handleTogglePublish = async (product: ProductRecord) => {
    const nextStatus = product.status === 'published' ? 'draft' : 'published';

    try {
      setError(null);
      setSuccess(null);
      const response = await productService.updateProductStatus(product.id, nextStatus);
      const updated = response?.data?.product;
      if (updated) {
        setProducts((current) => current.map((item) => (item.id === product.id ? updated : item)));
        setSuccess(`Product marked as ${nextStatus === 'published' ? 'published' : 'draft'}.`);
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to change publication status.');
    }
  };

  const handlePublish = async (product: ProductRecord) => {
    try {
      setError(null);
      setSuccess(null);
      if (selectedChannels.length === 0) {
        setError('Select at least one platform that is connected and configured for publishing.');
        return;
      }

      const response = await productService.publishProduct(product.id, selectedChannels);
      const listingDetails = response?.data?.listings ?? [];
      const summary = listingDetails.map((entry) => `${entry.channel}:${entry.status}`).join(', ');
      setSuccess(`Publishing request queued for ${summary || 'selected channels'}. No external publication is reported until the platform confirms it.`);
    } catch (err: any) {
      setError(err?.message || 'Unable to start publishing.');
    }
  };

  return (
    <PageContainer>
      <div className="section-header">
        <div>
          <h2 className="h2">Products & Services</h2>
          <p className="body">Manage your real catalog, pricing, and publication status for your business.</p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button onClick={() => openCreateForm('product')}>Add Product</Button>
          <Button variant="outline" onClick={() => openCreateForm('service')}>Add Service</Button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <Input
          placeholder="Search products or services"
          value={query}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
        />
        <Select
          value={typeFilter}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setTypeFilter(event.target.value as 'all' | ProductType)}
        >
          <option value="all">All item types</option>
          <option value="product">Products</option>
          <option value="service">Services</option>
        </Select>
      </div>

      {error ? <div className="field__error" style={{ marginBottom: 12 }}>{error}</div> : null}
      {success ? <div className="field__success" style={{ marginBottom: 12 }}>{success}</div> : null}

      {formOpen && (
        <Card style={{ marginBottom: 16 }}>
          <form onSubmit={handleSubmit} className="stack">
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <div>
                <label className="label">Name</label>
                <Input value={form.name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm((current) => ({ ...current, name: event.target.value }))} />
              </div>

              <div>
                <label className="label">Type</label>
                <Select value={form.type} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setForm((current) => ({ ...current, type: event.target.value as ProductType }))}>
                  <option value="product">Product</option>
                  <option value="service">Service</option>
                </Select>
              </div>

              <div>
                <label className="label">Price</label>
                <Input type="number" min="0" step="0.01" value={form.price} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm((current) => ({ ...current, price: event.target.value }))} />
              </div>

              <div>
                <label className="label">Currency</label>
                <Input value={form.currency} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm((current) => ({ ...current, currency: event.target.value.toUpperCase() }))} />
              </div>

              <div>
                <label className="label">Category</label>
                <Input value={form.category} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm((current) => ({ ...current, category: event.target.value }))} />
              </div>

              <div>
                <label className="label">Availability</label>
                <Select value={form.availability} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setForm((current) => ({ ...current, availability: event.target.value }))}>
                  <option value="in_stock">In stock</option>
                  <option value="limited">Limited stock</option>
                  <option value="preorder">Pre-order</option>
                  <option value="out_of_stock">Out of stock</option>
                </Select>
              </div>

              <div>
                <label className="label">Stock quantity</label>
                <Input type="number" min="0" value={form.stockQuantity} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm((current) => ({ ...current, stockQuantity: event.target.value }))} />
              </div>

              <div>
                <label className="label">SKU</label>
                <Input value={form.sku} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm((current) => ({ ...current, sku: event.target.value }))} />
              </div>

              <div>
                <label className="label">Business location</label>
                <Input value={form.businessLocation} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm((current) => ({ ...current, businessLocation: event.target.value }))} />
              </div>
            </div>

            <div>
              <label className="label">Description</label>
              <textarea value={form.description} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setForm((current) => ({ ...current, description: event.target.value }))} rows={4} style={{ width: '100%', resize: 'vertical' }} />
            </div>

            <div>
              <label className="label">Delivery info</label>
              <textarea value={form.deliveryInfo} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setForm((current) => ({ ...current, deliveryInfo: event.target.value }))} rows={3} style={{ width: '100%', resize: 'vertical' }} />
            </div>

            <div>
              <label className="label">Add Photos & Videos</label>
              <input type="file" accept="image/*,video/*" multiple onChange={handleMediaSelection} />
              {mediaPreviews.length > 0 ? (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {mediaPreviews.map((preview) => (
                    <div key={`${preview.name}-${preview.url}`} style={{ position: 'relative', width: 92, height: 92, borderRadius: 8, overflow: 'hidden', border: '1px solid #dfe5f1', background: '#f8fafc' }}>
                      {preview.type === 'video' ? (
                        <video src={preview.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <img src={preview.url} alt={preview.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Update item' : 'Create item'}</Button>
              <Button variant="ghost" type="button" onClick={resetForm}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="empty">Loading products and services…</div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty">No products or services yet.</div>
      ) : (
        <div className="list" style={{ display: 'grid', gap: 12 }}>
          {filteredProducts.map((product) => (
            <div key={product.id} className="list-item" style={{ display: 'grid', gap: 8, gridTemplateColumns: 'minmax(0, 1.5fr) repeat(3, minmax(100px, 1fr)) auto', alignItems: 'center' }}>
              <div>
                <div className="h4">{product.name}</div>
                <div className="small" style={{ color: 'var(--color-text-muted)' }}>{product.type === 'service' ? 'Service' : 'Product'} • {product.slug}</div>
              </div>

              <div>
                <div className="small" style={{ color: 'var(--color-text-muted)' }}>Price</div>
                <div className="h4">{product.currency} {Number(product.price ?? 0).toFixed(2)}</div>
              </div>

              <div>
                <div className="small" style={{ color: 'var(--color-text-muted)' }}>Status</div>
                <span className="badge">{product.status}</span>
              </div>

              <div>
                <div className="small" style={{ color: 'var(--color-text-muted)' }}>Publication</div>
                <span className="badge">{product.status === 'published' ? 'Live' : 'Draft'}</span>
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <Button variant="ghost" size="sm" onClick={() => openEditForm(product)}>Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => handleTogglePublish(product)}>{product.status === 'published' ? 'Unpublish' : 'Publish'}</Button>
                <Button variant="ghost" size="sm" onClick={() => handlePublish(product)}>Publish to channel</Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(product)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Card style={{ marginTop: 16 }}>
        <div className="h4">Publishing channels</div>
        <div className="small" style={{ color: 'var(--color-text-muted)', marginBottom: 10 }}>Select the channels to queue for your next product publication.</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['facebook', 'instagram', 'whatsapp', 'shopify', 'tiktok', 'jumia', 'jiji'].map((channel) => (
            <button
              key={channel}
              type="button"
              onClick={() => setSelectedChannels((current) => current.includes(channel) ? current.filter((item) => item !== channel) : [...current, channel])}
              style={{
                border: '1px solid #dfe5f1',
                borderRadius: 999,
                background: selectedChannels.includes(channel) ? '#166534' : '#fff',
                color: selectedChannels.includes(channel) ? '#fff' : '#1f2937',
                padding: '6px 10px',
                cursor: 'pointer',
              }}
            >
              {channel}
            </button>
          ))}
        </div>
      </Card>
    </PageContainer>
  );
}

export default ProductsPage;
