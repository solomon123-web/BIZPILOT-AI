import React from 'react';
import { PageContainer } from '../../components/app/PageContainer';
import ExecutiveCommandCenter from '../../components/dashboard/ExecutiveCommandCenter';
import Assistant from '../../components/app/Assistant';
import MarketingTool from './MarketingTool';
import BrandingTool from './BrandingTool';
import CustomerRepliesTool from './CustomerRepliesTool';
import WebsiteBuilderTool from './WebsiteBuilderTool';
import CustomersTool from './CustomersTool';
import InvoicesTool from './InvoicesTool';
import AnalyticsPanel from './AnalyticsPage';
import SettingsPanel from './SettingsPage';
import { ProductsPage } from './ProductsPage';
import { OnlinePresencePage } from './OnlinePresencePage';
import { LeadsPage } from './LeadsPage';

export function HomePage() {
  return (
    <PageContainer maxWidth="full">
      <ExecutiveCommandCenter />
    </PageContainer>
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

export function LeadsPageRoute() {
  return <LeadsPage />;
}

export function ProductsPageRoute() {
  return <ProductsPage />;
}

export function OnlinePresencePageRoute() {
  return <OnlinePresencePage />;
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
