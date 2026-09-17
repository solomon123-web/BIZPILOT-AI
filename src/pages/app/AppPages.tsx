import React from 'react';
import { PageContainer } from '../../components/app/PageContainer';
import { Button } from '../../components/ui';
import { Zap, MessageSquare, Sparkles, Briefcase, TrendingUp, ArrowRight } from 'lucide-react';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import Assistant from '../../components/app/Assistant';
import MarketingTool from './MarketingTool';
import BrandingTool from './BrandingTool';
import CustomerRepliesTool from './CustomerRepliesTool';
import WebsiteBuilderTool from './WebsiteBuilderTool';
import CustomersTool from './CustomersTool';
import InvoicesTool from './InvoicesTool';
import AnalyticsPanel from './AnalyticsPage';
import SettingsPanel from './SettingsPage';

export function HomePage() {
  const { user } = useWorkspace();
  const firstName = user?.name.split(' ')[0] || 'there';

  return (
    <PageContainer>
      <div className="app-page">
        {/* Greeting */}
        <div className="greeting">
          <h1 className="display">Good morning, {firstName} 👋</h1>
          <p className="body--large" style={{ marginTop: '8px', color: 'var(--color-text-secondary)' }}>
            What would you like to work on today?
          </p>
        </div>

        {/* Quick Actions */}
        <section className="quick-actions">
          <div className="section-header">
            <h2 className="h2">Quick Actions</h2>
            <p className="body" style={{ color: 'var(--color-text-muted)' }}>
              Powered by AI – get instant help with any task
            </p>
          </div>
          <div className="quick-actions__grid">
            <QuickActionCard
              icon={Sparkles}
              title="Create a Social Post"
              description="Generate engaging content for your audience"
              to="/app/marketing"
            />
            <QuickActionCard
              icon={MessageSquare}
              title="Reply to a Customer"
              description="Respond to customer inquiries with AI help"
              to="/app/customer-replies"
            />
            <QuickActionCard
              icon={TrendingUp}
              title="Create an Offer"
              description="Design special promotions for your products"
              to="/app/marketing"
            />
            <QuickActionCard
              icon={Briefcase}
              title="Improve My Branding"
              description="Enhance your brand identity and messaging"
              to="/app/branding"
            />
            <QuickActionCard
              icon={TrendingUp}
              title="Build My Website"
              description="Create or update your online presence"
              to="/app/website-builder"
            />
            <QuickActionCard
              icon={Zap}
              title="Ask BizPilotAI"
              description="Get instant help with any business question"
              to="/app/assistant"
            />
          </div>
        </section>

        {/* AI Recommendations */}
        <section className="recommendations">
          <div className="section-header">
            <h2 className="h2">Recommended for you</h2>
            <p className="body" style={{ color: 'var(--color-text-muted)' }}>
              AI-powered insights tailored to your business
            </p>
          </div>
          <div className="recommendation-list">
            <RecommendationItem
              title="Create a weekend cake promotion"
              description="Capitalize on weekend demand with a special offer"
              action="Create promotion"
              priority="high"
            />
            <RecommendationItem
              title="You haven't posted this week"
              description="Keep your audience engaged with regular updates"
              action="Create post"
              priority="medium"
            />
            <RecommendationItem
              title="3 customers need follow-up"
              description="Respond to pending inquiries to improve satisfaction"
              action="View customers"
              priority="high"
            />
          </div>
        </section>

        {/* Business Setup Progress */}
        <section className="setup-progress">
          <div className="section-header">
            <h2 className="h2">Business Setup</h2>
            <p className="body" style={{ color: 'var(--color-text-muted)' }}>
              Complete your workspace configuration
            </p>
          </div>
          <div className="setup-items">
            <SetupItem title="Business Profile" progress={100} />
            <SetupItem title="Brand Identity" progress={100} />
            <SetupItem title="Marketing Setup" progress={60} />
            <SetupItem title="Website" progress={30} />
          </div>
        </section>

        {/* Recent Activity */}
        <section className="recent-activity">
          <div className="section-header">
            <h2 className="h2">Recent Activity</h2>
          </div>
          <div className="activity-list">
            <ActivityItem
              action="Instagram post created"
              timestamp="2 hours ago"
            />
            <ActivityItem
              action="Customer reply generated"
              timestamp="4 hours ago"
            />
            <ActivityItem
              action="Invoice created"
              timestamp="1 day ago"
            />
            <ActivityItem
              action="Brand profile updated"
              timestamp="3 days ago"
            />
          </div>
        </section>
      </div>
    </PageContainer>
  );
}

interface QuickActionCardProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  to: string;
}

function QuickActionCard({
  icon: Icon,
  title,
  description,
  to,
}: QuickActionCardProps) {
  return (
    <a href={to} className="quick-action-card">
      <div className="quick-action-card__icon">
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <h3 className="h3" style={{ marginTop: '12px' }}>
        {title}
      </h3>
      <p className="small" style={{ marginTop: '4px', color: 'var(--color-text-muted)' }}>
        {description}
      </p>
    </a>
  );
}

interface RecommendationItemProps {
  title: string;
  description: string;
  action: string;
  priority?: 'low' | 'medium' | 'high';
}

function RecommendationItem({
  title,
  description,
  action,
  priority = 'medium',
}: RecommendationItemProps) {
  return (
    <div className={`recommendation-item recommendation-item--${priority}`}>
      {priority === 'high' && (
        <div className="recommendation-item__badge">🔥 Priority</div>
      )}
      <div>
        <h3 className="h3">{title}</h3>
        <p className="small" style={{ marginTop: '4px' }}>
          {description}
        </p>
      </div>
      <Button variant="primary" size="sm">
        {action}
        <ArrowRight size={14} style={{ marginLeft: '4px' }} />
      </Button>
    </div>
  );
}

interface SetupItemProps {
  title: string;
  progress: number;
}

function SetupItem({ title, progress }: SetupItemProps) {
  return (
    <div className="setup-item">
      <div className="setup-item__header">
        <span className="h3">{title}</span>
        <span className="small">{progress}%</span>
      </div>
      <div className="setup-item__progress">
        <div
          className="setup-item__progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

interface ActivityItemProps {
  action: string;
  timestamp: string;
}

function ActivityItem({ action, timestamp }: ActivityItemProps) {
  return (
    <div className="activity-item">
      <p className="body">{action}</p>
      <p className="small">{timestamp}</p>
    </div>
  );
}

// Placeholder Pages

export function AIAssistantPage() {
  return (
    <PageContainer>
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          {/* Assistant component */}
          {/* lazy load to avoid circular deps */}
          <React.Suspense fallback={<div>Loading assistant…</div>}>
            {/* @ts-ignore */}
            <Assistant />
          </React.Suspense>
        </div>
      </div>
    </PageContainer>
  );
}

export function MarketingPage() {
  return <MarketingTool />;
}

export function BrandingPage() {
  return <BrandingTool />;
}

export function WebsiteBuilderPage() {
  return <WebsiteBuilderTool />;
}

export function CustomerRepliesPage() {
  return <CustomerRepliesTool />;
}

export function CustomersPage() {
  return <CustomersTool />;
}

export function InvoicesPage() {
  return <InvoicesTool />;
}

export function AnalyticsPage() {
  return <AnalyticsPanel />;
}

export function SettingsPage() {
  return <SettingsPanel />;
}
