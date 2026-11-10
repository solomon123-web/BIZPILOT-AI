import { useEffect, useState } from 'react';
import { PageContainer } from '../../components/app/PageContainer';
import { Button, Card } from '../../components/ui';
import productService, { type ProductRecord } from '../../services/productService';

export function OnlinePresencePage() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getProducts();
      setProducts(response?.data?.products ?? []);
    } catch (err: any) {
      setError(err?.message || 'Unable to load online presence data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const handleTogglePublish = async (product: ProductRecord) => {
    const nextStatus = product.status === 'published' ? 'draft' : 'published';

    try {
      setError(null);
      setSuccess(null);
      const response = await productService.updateProductStatus(product.id, nextStatus);
      const updated = response?.data?.product;
      if (updated) {
        setProducts((current) => current.map((item) => (item.id === product.id ? updated : item)));
        setSuccess(`Product ${nextStatus === 'published' ? 'published' : 'unpublished'} successfully.`);
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to change publication status.');
    }
  };

  const publicUrlFor = (slug?: string) => {
    if (!slug) {
      return null;
    }

    return `${window.location.origin}/p/${slug}`;
  };

  const publishedProducts = products.filter((product) => product.status === 'published');
  const unpublishedProducts = products.filter((product) => product.status !== 'published');

  return (
    <PageContainer>
      <div className="section-header">
        <div>
          <h2 className="h2">Online Presence</h2>
          <p className="body">Review your products and services that are live, unpublished, and available to the public.</p>
        </div>
      </div>

      {error ? <div className="field__error" style={{ marginBottom: 12 }}>{error}</div> : null}
      {success ? <div className="field__success" style={{ marginBottom: 12 }}>{success}</div> : null}

      {loading ? (
        <div className="empty">Loading online presence…</div>
      ) : products.length === 0 ? (
        <div className="empty">No products or services yet.</div>
      ) : (
        <div style={{ display: 'grid', gap: 20 }}>
          <Card>
            <h3 className="h3">Published products and services</h3>
            {publishedProducts.length === 0 ? (
              <p className="body">No published items yet.</p>
            ) : (
              <div className="list" style={{ display: 'grid', gap: 12 }}>
                {publishedProducts.map((product) => {
                  const url = publicUrlFor(product.slug);
                  return (
                    <div key={product.id} className="list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <div>
                        <div className="h4">{product.name}</div>
                        <div className="small" style={{ color: 'var(--color-text-muted)' }}>{product.type} • {product.status}</div>
                        {url && <div className="small" style={{ wordBreak: 'break-all' }}>{url}</div>}
                      </div>

                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {url && (
                          <a href={url} target="_blank" rel="noreferrer">
                            <Button variant="outline" size="sm">View public page</Button>
                          </a>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleTogglePublish(product)}>{product.status === 'published' ? 'Unpublish' : 'Publish'}</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <Card>
            <h3 className="h3">Unpublished items</h3>
            {unpublishedProducts.length === 0 ? (
              <p className="body">No unpublished items right now.</p>
            ) : (
              <div className="list" style={{ display: 'grid', gap: 12 }}>
                {unpublishedProducts.map((product) => (
                  <div key={product.id} className="list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <div>
                      <div className="h4">{product.name}</div>
                      <div className="small" style={{ color: 'var(--color-text-muted)' }}>{product.type} • {product.status}</div>
                    </div>

                    <Button variant="ghost" size="sm" onClick={() => handleTogglePublish(product)}>Publish</Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </PageContainer>
  );
}

export default OnlinePresencePage;
