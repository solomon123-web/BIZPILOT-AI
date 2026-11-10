import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageContainer } from '../components/app/PageContainer';
import productService, { type ProductRecord } from '../services/productService';

export function PublicProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<(ProductRecord & { business?: { id: string; name: string; slug: string } }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!slug) {
        setError('Missing product slug.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await productService.getPublicProduct(slug);
        setProduct(response?.data?.product ?? null);
      } catch (err: any) {
        setError(err?.message || 'This product is not available publicly.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [slug]);

  if (loading) {
    return <PageContainer><div className="empty">Loading public product…</div></PageContainer>;
  }

  if (error || !product) {
    return (
      <PageContainer>
        <div className="empty">{error ?? 'Product not found or not published.'}</div>
        <div style={{ marginTop: 16 }}>
          <Link to="/" className="text-link">Return home</Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="md">
      <div className="section-header">
        <div>
          <h1 className="h1">{product.name}</h1>
          <p className="body">{product.type === 'service' ? 'Service' : 'Product'} from {product.business?.name ?? 'This business'}</p>
        </div>
      </div>

      <div className="card card--feature" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div className="label">Price</div>
            <div className="h3">{product.currency} {Number(product.price ?? 0).toFixed(2)}</div>
          </div>
          <div>
            <div className="label">Status</div>
            <span className="badge">{product.status}</span>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <h2 className="h2">Description</h2>
          <p className="body">{product.description || 'No description provided.'}</p>
        </div>
      </div>
    </PageContainer>
  );
}

export default PublicProductPage;
