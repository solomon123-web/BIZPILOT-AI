import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from '../components/app/Sidebar';
import { Header } from '../components/app/Header';

const pageConfig: Record<string, { title: string; subtitle?: string }> = {
  '/app': { title: 'Home', subtitle: 'Welcome back' },
  '/app/assistant': { title: 'AI Assistant', subtitle: 'Your AI business co-pilot' },
  '/app/marketing': { title: 'Marketing', subtitle: 'Create and manage campaigns' },
  '/app/branding': { title: 'Branding', subtitle: 'Build your brand identity' },
  '/app/website-builder': { title: 'Website Builder', subtitle: 'Create your online presence' },
  '/app/customer-replies': { title: 'Customer Replies', subtitle: 'Manage customer conversations' },
  '/app/customers': { title: 'Customers', subtitle: 'View and manage your customers' },
  '/app/invoices': { title: 'Invoices', subtitle: 'Track payments and billing' },
  '/app/analytics': { title: 'Analytics', subtitle: 'Business insights and metrics' },
  '/app/settings': { title: 'Settings', subtitle: 'Manage your workspace' },
};

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const currentPage = pageConfig[location.pathname] || { title: 'Dashboard' };

  return (
    <div className="shell shell--app">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-workspace">
        <Header
          title={currentPage.title}
          subtitle={currentPage.subtitle}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        <main className="app-workspace__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
