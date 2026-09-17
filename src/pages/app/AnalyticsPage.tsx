import { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '../../components/app/PageContainer';
import { Button, Card, Select } from '../../components/ui';
import Sparkline from '../../components/ui/Sparkline';
import analyticsService, { type AnalyticsOverview } from '../../services/analyticsService';

const PERIODS = [
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
  { label: '1 year', value: 365 },
] as const;

type PeriodValue = (typeof PERIODS)[number]['value'];

export function AnalyticsPage() {
  const [period, setPeriod] = useState<PeriodValue>(30);
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await analyticsService.getOverview(period);
        setData(response?.data?.overview ?? null);
      } catch (err: any) {
        setError(err?.message || 'Unable to load analytics.');
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [period]);

  const revenueChart = useMemo(() => (data?.revenueSeries ?? []).map((point) => ({ date: point.date, value: point.value })), [data]);

  if (loading) {
    return (
      <PageContainer>
        <div className="section-header">
          <h2 className="h2">Analytics</h2>
          <p className="body">Loading your business performance…</p>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="section-header">
          <h2 className="h2">Analytics</h2>
          <p className="field__error">{error}</p>
        </div>
      </PageContainer>
    );
  }

  const overview = data ?? {
    totalRevenue: 0,
    totalCustomers: 0,
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
    outstandingRevenue: 0,
    paidRevenue: 0,
    recentCustomers: [],
    recentInvoices: [],
    revenueSeries: [],
  };

  const totalRevenue = Number(overview.totalRevenue || 0);
  const totalCustomers = Number(overview.totalCustomers || 0);
  const totalInvoices = Number(overview.totalInvoices || 0);
  const paidInvoices = Number(overview.paidInvoices || 0);
  const pendingInvoices = Number(overview.pendingInvoices || 0);
  const outstandingRevenue = Number(overview.outstandingRevenue || 0);
  const averageInvoiceValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;

  return (
    <PageContainer>
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="h2">Analytics</h2>
          <p className="body">Overview of your business performance</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Select value={period} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPeriod(Number(e.target.value) as PeriodValue)}>
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </Select>
          <Button variant="ghost">Export</Button>
        </div>
      </div>

      <div className="analytics-grid">
        <Card>
          <h3 className="h3">Revenue</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="display">₦{totalRevenue.toLocaleString()}</div>
              <div className="small">Paid + pending invoice totals</div>
            </div>
            <div>
              <Sparkline data={revenueChart} />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="h3">Customers</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="display">{totalCustomers}</div>
              <div className="small">Active customers in this business</div>
            </div>
            <div>
              <Sparkline data={revenueChart.map((point) => ({ date: point.date, value: point.value > 0 ? 1 : 0 }))} color="var(--color-foreground)" />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="h3">Invoices</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="display">{totalInvoices}</div>
              <div className="small">Paid {paidInvoices} • Pending {pendingInvoices}</div>
            </div>
            <div>
              <Sparkline data={revenueChart} color="var(--color-primary)" />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="h3">Outstanding</h3>
          <div>
            <div className="display">₦{outstandingRevenue.toLocaleString()}</div>
            <div className="small">Pending and overdue invoices</div>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 20 }}>
        <Card>
          <h3 className="h3">Performance Summary</h3>
          <ul>
            <li>Paid invoices: {paidInvoices}</li>
            <li>Pending invoices: {pendingInvoices}</li>
            <li>Overdue invoices: {Number(overview.overdueInvoices || 0)}</li>
            <li>Average invoice value: ₦{averageInvoiceValue.toLocaleString()}</li>
          </ul>
        </Card>
      </div>
    </PageContainer>
  );
}

export default AnalyticsPage;
