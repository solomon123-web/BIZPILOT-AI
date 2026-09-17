import { Card } from '../ui';

export function ProductPreview() {
  return (
    <div className="product-preview" aria-label="BizPilotAI dashboard preview">
      <div className="product-preview__header">
        <span className="badge">Live workspace</span>
        <div className="product-preview__status">
          <span className="status-dot status-dot--success" />
          <span className="small">Systems online</span>
        </div>
      </div>

      <div className="product-preview__body">
        <aside className="product-preview__sidebar">
          <div className="product-preview__item product-preview__item--active">Overview</div>
          <div className="product-preview__item">Marketing</div>
          <div className="product-preview__item">Brand</div>
          <div className="product-preview__item">Customers</div>
        </aside>

        <div className="product-preview__main">
          <div className="product-preview__stats">
            <Card className="mini-card">
              <span className="label">Revenue</span>
              <strong>$84.2k</strong>
              <span className="trend trend--positive">+14.8%</span>
            </Card>
            <Card className="mini-card">
              <span className="label">Inbox</span>
              <strong>126</strong>
              <span className="trend trend--neutral">+12 today</span>
            </Card>
          </div>

          <Card className="chart-card">
            <div className="chart-card__header">
              <span className="label">Performance</span>
              <span className="small">This month</span>
            </div>
            <div className="chart-bars" aria-hidden="true">
              <span style={{ height: '32%' }} />
              <span style={{ height: '48%' }} />
              <span style={{ height: '55%' }} />
              <span style={{ height: '74%' }} />
              <span style={{ height: '63%' }} />
              <span style={{ height: '88%' }} />
              <span style={{ height: '100%' }} />
            </div>
          </Card>

          <div className="product-preview__list">
            <div className="list-row">
              <span className="list-row__label">Campaign launch</span>
              <span className="list-row__value">Ready</span>
            </div>
            <div className="list-row">
              <span className="list-row__label">Brand refresh</span>
              <span className="list-row__value">Drafting</span>
            </div>
            <div className="list-row">
              <span className="list-row__label">Customer replies</span>
              <span className="list-row__value">Auto-sending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
