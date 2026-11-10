import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { AppSidebar } from '../components/layout/AppSidebar';
import { TopBar } from '../components/layout/TopBar';

const pageConfig: Record<string, { title: string; subtitle?: string }> = {
  '/app': { title: 'Overview', subtitle: 'Your workspace overview' },
  '/app/assistant': { title: 'AI Assistant', subtitle: 'Your AI business co-pilot' },
  '/app/marketing': { title: 'Marketing', subtitle: 'Create and manage campaigns' },
  '/app/branding': { title: 'Branding', subtitle: 'Build your brand identity' },
  '/app/website-builder': { title: 'Website Builder', subtitle: 'Create your online presence' },
  '/app/customer-replies': { title: 'Customer Replies', subtitle: 'Manage customer conversations' },
  '/app/customers': { title: 'Customers', subtitle: 'View and manage your customers' },
  '/app/leads': { title: 'Leads', subtitle: 'Review prospects and follow-ups' },
  '/app/products': { title: 'Products & Services', subtitle: 'Manage your catalog' },
  '/app/online-presence': { title: 'Online Presence', subtitle: 'Published storefront and domain visibility' },
  '/app/invoices': { title: 'Invoices', subtitle: 'Track payments and billing' },
  '/app/analytics': { title: 'Analytics', subtitle: 'Business insights and metrics' },
  '/app/settings': { title: 'Settings', subtitle: 'Manage your workspace' },
};

const searchRoutes = [
  { label: 'Overview', to: '/app', keywords: ['home', 'overview', 'dashboard', 'kpi', 'metrics'] },
  { label: 'AI Assistant', to: '/app/assistant', keywords: ['ai', 'assistant', 'copilot', 'chat'] },
  { label: 'Marketing', to: '/app/marketing', keywords: ['marketing', 'social', 'campaign', 'post', 'content'] },
  { label: 'Branding', to: '/app/branding', keywords: ['branding', 'identity', 'logo', 'brand'] },
  { label: 'Website Builder', to: '/app/website-builder', keywords: ['website', 'builder', 'site', 'landing page'] },
  { label: 'Customer Replies', to: '/app/customer-replies', keywords: ['messages', 'inbox', 'chat', 'replies', 'conversations'] },
  { label: 'Customers', to: '/app/customers', keywords: ['crm', 'customers', 'pipeline', 'contacts'] },
  { label: 'Leads', to: '/app/leads', keywords: ['leads', 'prospects', 'opportunities', 'pipeline'] },
  { label: 'Products & Services', to: '/app/products', keywords: ['products', 'services', 'catalog', 'pricing'] },
  { label: 'Online Presence', to: '/app/online-presence', keywords: ['online presence', 'public page', 'published', 'storefront'] },
  { label: 'Invoices', to: '/app/invoices', keywords: ['billing', 'invoice', 'payments', 'finance'] },
  { label: 'Analytics', to: '/app/analytics', keywords: ['analytics', 'reports', 'performance', 'overview'] },
  { label: 'Settings', to: '/app/settings', keywords: ['settings', 'workspace', 'team', 'permissions'] },
];

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = pageConfig[location.pathname] || { title: 'Dashboard' };

  const searchIndex = useMemo(() => searchRoutes, []);

  const handleSearchSubmit = () => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return;

    const match = searchIndex.find(({ label, keywords }) => {
      const normalizedLabel = label.toLowerCase();
      const normalizedKeywords = keywords.map((keyword) => keyword.toLowerCase());
      return normalizedLabel.includes(query) || normalizedKeywords.some((keyword) => keyword.includes(query));
    });

    if (match) {
      navigate(match.to);
      setSearchValue('');
    }
  };

  return (
    <div className="shell shell--app">
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-workspace">
        <TopBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearchSubmit={handleSearchSubmit}
          onMenuClick={() => setSidebarOpen((open) => !open)}
          sidebarOpen={sidebarOpen}
        />

        <main className="app-workspace__content app-workspace__content--dashboard">
          <div className="page-header-inline">
            <div>
              <p className="eyebrow">BizPilotAI</p>
              <h1 className="page-title">{currentPage.title}</h1>
            </div>
            {currentPage.subtitle && <span className="page-subtitle">{currentPage.subtitle}</span>}
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
