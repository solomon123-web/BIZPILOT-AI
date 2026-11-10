import { type ReactNode, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bot,
  Briefcase,
  CircleDollarSign,
  Gauge,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Workflow,
} from 'lucide-react';
import { Button } from '../ui';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import analyticsService, { type AnalyticsOverview } from '../../services/analyticsService';
import customerService, { type CustomerRecord } from '../../services/customerService';
import invoiceService, { type InvoiceRecord } from '../../services/invoiceService';
import leadService, { type LeadRecord } from '../../services/leadService';
import aiManagerService, { type AIActionRecord } from '../../services/aiManagerService';
import activityService, { type ActivityRecord } from '../../services/activityService';
import socialConnectionService, { type SocialConnectionRecord } from '../../services/socialConnectionService';
import { generateAiResponse } from '../../services/aiService';
import auditService, { type ExecutiveAuditResult } from '../../services/auditService';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

const formatCompactNumber = (value: number) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

const buildChartPath = (values: number[]) => {
  if (values.length === 0) return '';

  const width = 420;
  const height = 110;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / range) * (height - 16) - 8;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
};

export function ExecutiveCommandCenter() {
  const { business, user } = useWorkspace();
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [aiActions, setAiActions] = useState<AIActionRecord[]>([]);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [connections, setConnections] = useState<SocialConnectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commandText, setCommandText] = useState('');
  const [commandLoading, setCommandLoading] = useState(false);
  const [commandResult, setCommandResult] = useState<string | null>(null);
  const [commandError, setCommandError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<ExecutiveAuditResult | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);

  const businessId = business?.id ?? null;

  useEffect(() => {
    const loadDashboard = async () => {
      if (!businessId) {
        setAnalytics(null);
        setCustomers([]);
        setInvoices([]);
        setLeads([]);
        setAiActions([]);
        setActivities([]);
        setConnections([]);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [analyticsResponse, customerResponse, invoiceResponse, leadResponse, aiActionsResponse, activityResponse, connectionResponse] = await Promise.all([
          analyticsService.getOverview(30),
          customerService.getCustomers(),
          invoiceService.getInvoices(),
          leadService.getLeads(businessId),
          aiManagerService.listActions(businessId),
          activityService.listActivities(businessId),
          socialConnectionService.getSocialConnections(businessId),
        ]);

        setAnalytics(analyticsResponse?.data?.overview ?? null);
        setCustomers(customerResponse?.data?.customers ?? []);
        setInvoices(invoiceResponse?.data?.invoices ?? []);
        setLeads(leadResponse?.data?.leads ?? []);
        setAiActions(aiActionsResponse?.actions ?? []);
        setActivities(activityResponse?.items ?? []);
        setConnections(connectionResponse?.connections ?? []);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unable to load business data.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, [businessId]);

  const chartValues = useMemo(
    () => (analytics?.revenueSeries ?? []).map((point) => Number(point.value || 0)),
    [analytics],
  );

  const chartPath = useMemo(() => buildChartPath(chartValues), [chartValues]);

  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const totalRevenue = Number(analytics?.totalRevenue ?? 0);
  const pendingInvoices = Number(analytics?.pendingInvoices ?? 0);
  const outstandingRevenue = Number(analytics?.outstandingRevenue ?? 0);
  const leadsCount = leads.length;
  const totalCustomers = customers.length;
  const connectedAccounts = connections.length;
  const systemHealth = aiActions.length > 0 ? 'Operational' : 'Monitoring';

  const quickPrompts = [
    'Summarize today\'s business activity',
    'Draft a social post for my business',
    'Review my pending invoices',
    'Find the best opportunities in my pipeline',
  ];

  const handlePrompt = async (prompt: string) => {
    if (!prompt.trim() || !businessId) {
      return;
    }

    setCommandLoading(true);
    setCommandError(null);
    setCommandResult(null);

    try {
      const response = await generateAiResponse(prompt, business, [
        { id: 'user-1', role: 'user', content: prompt, timestamp: new Date().toISOString() },
      ]);
      setCommandResult(response);
      await aiManagerService.createAction(businessId, 'AI_COMMAND', {
        prompt,
        response,
      }, true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'The AI command could not be completed.';
      setCommandError(message);
    } finally {
      setCommandLoading(false);
    }
  };

  const handleAudit = async () => {
    if (!businessId) {
      return;
    }

    setAuditLoading(true);
    try {
      const response = await auditService.runExecutiveAudit(businessId);
      setAuditResult(response?.report ?? null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to run executive audit.';
      setCommandError(message);
    } finally {
      setAuditLoading(false);
    }
  };

  const invoiceRows = (invoices ?? []).slice(0, 4);
  const streamRows = (activities ?? []).slice(0, 5);

  return (
    <div className="executive-page">
      <section className="executive-briefing">
        <div>
          <p className="eyebrow">Executive briefing</p>
          <h1 className="dashboard-title">Good morning, {firstName}.</h1>
          <p className="subtle-copy">
            {business?.businessName
              ? `Your ${business.businessName} workspace is tracking ${customers.length} customers, ${leads.length} leads, and ${invoices.length} invoices.`
              : 'Connect a business workspace to view live metrics.'}
          </p>
        </div>

        <div className="briefing-actions">
          <Button variant="ghost" onClick={handleAudit} loading={auditLoading}>
            Run Executive Audit
          </Button>
          <Button variant="primary">View live ops</Button>
        </div>
      </section>

      {loading && businessId && <div className="inline-error">Loading business data…</div>}
      {error && <div className="inline-error">{error}</div>}

      {auditResult && (
        <div className={`audit-banner audit-banner--${auditResult.status}`}>
          <div>
            <strong>Executive audit</strong>
            <p>{auditResult.anomalies} anomaly checks flagged.</p>
          </div>
          <span>{auditResult.status}</span>
        </div>
      )}

      <section className="kpi-grid">
        <KpiCard icon={<CircleDollarSign size={18} />} title="Revenue" value={formatCurrency(totalRevenue)} detail={outstandingRevenue > 0 ? `${formatCurrency(outstandingRevenue)} outstanding` : 'No outstanding balances'} accent="green" />
        <KpiCard icon={<Users size={18} />} title="Leads" value={formatCompactNumber(leadsCount)} detail={`${totalCustomers} customers active`} accent="blue" />
        <KpiCard icon={<Workflow size={18} />} title="AI actions" value={String(aiActions.length)} detail={aiActions.length ? 'recent actions logged' : 'No actions yet'} accent="purple" />
        <KpiCard icon={<Sparkles size={18} />} title="Social reach" value={connectedAccounts ? `${connectedAccounts} connected` : 'No integrations'} detail={connectedAccounts ? 'active profiles linked' : 'not enough data yet'} accent="teal" />
      </section>

      <section className="content-grid">
        <div className="panel panel--wide panel--chart">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Revenue & cash flow</p>
              <h2>Performance</h2>
            </div>
            <div className="chip-row">
              <span className="chip chip--active">30D</span>
              <span className="chip">90D</span>
              <span className="chip">1Y</span>
            </div>
          </div>

          <div className="chart-meta">
            <strong>{formatCurrency(totalRevenue)}</strong>
            <span>{analytics ? 'Live business revenue' : 'No revenue data yet'}</span>
          </div>

          {chartValues.length > 0 ? (
            <svg viewBox="0 0 420 110" className="revenue-chart" preserveAspectRatio="none" aria-label="Revenue chart">
              <defs>
                <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(125, 211, 252, 0.55)" />
                  <stop offset="100%" stopColor="rgba(125, 211, 252, 0.02)" />
                </linearGradient>
              </defs>
              <path d={`${chartPath} L 420 110 L 0 110 Z`} fill="url(#areaGradient)" opacity="0.9" />
              <path d={chartPath} fill="none" stroke="rgba(148, 163, 184, 0.9)" strokeWidth="3" strokeLinecap="round" />
            </svg>
          ) : (
            <div className="empty-panel">No revenue data available yet.</div>
          )}
        </div>

        <div className="panel panel--compact">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Business health</p>
              <h2>System status</h2>
            </div>
            <ShieldCheck size={18} />
          </div>

          <div className="health-list">
            <StatusRow label="Database" value="Connected" tone="good" />
            <StatusRow label="AI" value={systemHealth} tone={systemHealth === 'Operational' ? 'good' : 'neutral'} />
            <StatusRow label="Invoices" value={`${pendingInvoices} pending`} tone={pendingInvoices > 0 ? 'warn' : 'good'} />
            <StatusRow label="Integrations" value={`${connectedAccounts} connected`} tone={connectedAccounts > 0 ? 'good' : 'neutral'} />
          </div>
        </div>
      </section>

      <section className="two-column-grid">
        <div className="panel">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Priority accounts</p>
              <h2>Invoice actions</h2>
            </div>
            <Button variant="ghost" size="sm">View all</Button>
          </div>

          <div className="table-list">
            {invoiceRows.length > 0 ? (
              invoiceRows.map((invoice) => (
                <div key={invoice.id} className="table-row">
                  <div className="table-row__primary">
                    <div className="avatar-badge">
                      {invoice.number.slice(0, 1).toUpperCase() || 'I'}
                    </div>
                    <div>
                      <strong>{invoice.number || 'Invoice'}</strong>
                      <small>{invoice.customerId ? `Customer ${invoice.customerId.slice(0, 6)}` : 'Invoice record'}</small>
                    </div>
                  </div>

                  <div className="table-row__values">
                    <span>{formatCurrency(Number(invoice.total || 0))}</span>
                    <small>{invoice.status}</small>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-panel">No invoices available for this business yet.</div>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Autonomous stream</p>
              <h2>AI actions</h2>
            </div>
            <Button variant="ghost" size="sm">Open log</Button>
          </div>

          <div className="activity-list">
            {aiActions.length > 0 ? (
              aiActions.slice(0, 5).map((action) => (
                <div key={action.id} className="activity-item">
                  <div className="activity-item__icon"><Bot size={14} /></div>
                  <div>
                    <strong>{action.actionType}</strong>
                    <small>{action.status}</small>
                  </div>
                  <span className={`pill pill--${action.status.toLowerCase()}`}>{action.status}</span>
                </div>
              ))
            ) : (
              <div className="empty-panel">No AI actions yet.</div>
            )}
          </div>
        </div>
      </section>

      <section className="command-grid">
        <div className="panel panel--command">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Immediate dispatch</p>
              <h2>Copilot command hub</h2>
            </div>
            <Sparkles size={18} />
          </div>

          <div className="quick-actions-row">
            {quickPrompts.map((prompt) => (
              <Button key={prompt} variant="ghost" size="sm" onClick={() => void handlePrompt(prompt)}>
                {prompt}
              </Button>
            ))}
          </div>

          <textarea
            className="command-input"
            value={commandText}
            onChange={(event) => setCommandText(event.target.value)}
            placeholder="Command Copilot Hub..."
            rows={4}
          />

          <div className="command-actions">
            <Button variant="primary" onClick={() => void handlePrompt(commandText)} loading={commandLoading}>
              Dispatch AI
            </Button>
            <Button variant="ghost" onClick={() => setCommandText('')}>Clear</Button>
          </div>

          {commandError && <div className="inline-error">{commandError}</div>}
          {commandResult && <div className="assistant-response">{commandResult}</div>}
        </div>

        <div className="panel panel--brief">
          <div className="panel__header">
            <div>
              <p className="eyebrow">AI business brief</p>
              <h2>What needs attention</h2>
            </div>
            <Briefcase size={18} />
          </div>

          <div className="brief-list">
            <BriefListItem icon={<TrendingUp size={14} />} title="Revenue signal" detail={totalRevenue > 0 ? `${formatCurrency(totalRevenue)} across active invoices` : 'No revenue data yet'} />
            <BriefListItem icon={<AlertTriangle size={14} />} title="Pending billing" detail={pendingInvoices > 0 ? `${pendingInvoices} invoice actions need review` : 'No outstanding invoice follow-ups'} />
            <BriefListItem icon={<MessageSquareText size={14} />} title="Customer pipeline" detail={leadsCount > 0 ? `${leadsCount} live opportunities in motion` : 'No active leads yet'} />
            <BriefListItem icon={<Gauge size={14} />} title="Operations" detail={connectedAccounts > 0 ? `${connectedAccounts} connected channels available` : 'Connect a social channel to start automations'} />
          </div>
        </div>
      </section>

      {streamRows.length > 0 && (
        <section className="panel panel--activity">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Recent activity</p>
              <h2>Operational timeline</h2>
            </div>
            <Activity size={18} />
          </div>

          <div className="timeline-list">
            {streamRows.map((item) => (
              <div key={item.id} className="timeline-item">
                <div className="timeline-item__dot" />
                <div>
                  <strong>{item.type}</strong>
                  <small>{new Date(item.createdAt ?? Date.now()).toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function KpiCard({
  icon,
  title,
  value,
  detail,
  accent,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  detail: string;
  accent: 'green' | 'blue' | 'purple' | 'teal';
}) {
  return (
    <div className={`kpi-card kpi-card--${accent}`}>
      <div className="kpi-card__icon">{icon}</div>
      <div>
        <p className="eyebrow">{title}</p>
        <h3>{value}</h3>
        <small>{detail}</small>
      </div>
    </div>
  );
}

function StatusRow({ label, value, tone }: { label: string; value: string; tone: 'good' | 'warn' | 'neutral' }) {
  return (
    <div className="status-row">
      <span>{label}</span>
      <span className={`status-pill status-pill--${tone}`}>{value}</span>
    </div>
  );
}

function BriefListItem({ icon, title, detail }: { icon: ReactNode; title: string; detail: string }) {
  return (
    <div className="brief-item">
      <div className="brief-item__icon">{icon}</div>
      <div>
        <strong>{title}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}

export default ExecutiveCommandCenter;
