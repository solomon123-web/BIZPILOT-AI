import { NavLink } from 'react-router-dom';
import {
  Home,
  Zap,
  Megaphone,
  Palette,
  Globe,
  MessageSquare,
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';

import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar, Button } from '../ui';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const mainNavItems = [
  { to: '/app', label: 'Home', icon: Home, section: 'main' },
  { to: '/app/assistant', label: 'AI Assistant', icon: Zap, section: 'main' },
];

const growNavItems = [
  {
    to: '/app/marketing',
    label: 'Marketing',
    icon: Megaphone,
    section: 'grow',
  },
  {
    to: '/app/branding',
    label: 'Branding',
    icon: Palette,
    section: 'grow',
  },
  {
    to: '/app/website-builder',
    label: 'Website Builder',
    icon: Globe,
    section: 'grow',
  },
];

const customersNavItems = [
  {
    to: '/app/customer-replies',
    label: 'Customer Replies',
    icon: MessageSquare,
    section: 'customers',
  },
  {
    to: '/app/customers',
    label: 'Customers',
    icon: Users,
    section: 'customers',
  },
];

const manageNavItems = [
  {
    to: '/app/invoices',
    label: 'Invoices',
    icon: FileText,
    section: 'manage',
  },
  {
    to: '/app/analytics',
    label: 'Analytics',
    icon: BarChart3,
    section: 'manage',
  },
];

const settingsNavItems = [
  {
    to: '/app/settings',
    label: 'Settings',
    icon: Settings,
    section: 'settings',
  },
];

export function Sidebar({
  isOpen = true,
  onClose,
}: SidebarProps) {
  const { business, user } = useWorkspace();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar${isOpen ? ' sidebar--open' : ''}`}
        aria-label="Sidebar navigation"
      >
        {/* Header */}
        <div className="sidebar__header">
          <div
            className="brand brand--sidebar"
            aria-label="BizPilotAI workspace"
          >
            <span className="brand__mark">B</span>
            <span className="brand__text">
              BizPilotAI
            </span>
          </div>
        </div>

        {/* Workspace Info */}
        {business && (
          <div className="sidebar__workspace">
            <p className="label">Workspace</p>

            <button
              type="button"
              className="workspace-switcher"
            >
              <span className="workspace-switcher__name">
                {business.businessName}
              </span>

              <ChevronDown size={14} />
            </button>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="sidebar__nav">
          <NavSection
            title="Main"
            items={mainNavItems}
            onClose={onClose}
          />

          <NavSection
            title="Grow"
            items={growNavItems}
            onClose={onClose}
          />

          <NavSection
            title="Customers"
            items={customersNavItems}
            onClose={onClose}
          />

          <NavSection
            title="Manage"
            items={manageNavItems}
            onClose={onClose}
          />

          <NavSection
            title="Settings"
            items={settingsNavItems}
            onClose={onClose}
          />
        </nav>

        {/* Footer */}
        <div className="sidebar__footer">
          {user && (
            <button
              type="button"
              className="user-menu"
            >
              <Avatar name={user.name} />

              <div className="user-menu__info">
                <p className="user-menu__name">
                  {user.name}
                </p>

                <p className="user-menu__email">
                  {user.email}
                </p>
              </div>

              <ChevronDown size={14} />
            </button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="sidebar__logout"
            aria-label="Sign out"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </Button>
        </div>
      </aside>
    </>
  );
}

interface NavSectionProps {
  title: string;
  items: Array<{
    to: string;
    label: string;
    icon: React.ComponentType<any>;
    section: string;
  }>;
  onClose?: () => void;
}

function NavSection({
  title,
  items,
  onClose,
}: NavSectionProps) {
  return (
    <div className="nav-section">
      <p className="nav-section__title">
        {title}
      </p>

      <div className="nav-section__items">
        {items.map(
          ({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar__link${
                  isActive
                    ? ' sidebar__link--active'
                    : ''
                }`
              }
              onClick={onClose}
            >
              <Icon
                size={18}
                strokeWidth={1.5}
              />

              <span>{label}</span>
            </NavLink>
          ),
        )}
      </div>
    </div>
  );
}
