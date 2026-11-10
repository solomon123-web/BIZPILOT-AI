import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  Briefcase,
  FileText,
  Globe,
  Home,
  LogOut,
  Megaphone,
  MessageSquare,
  Settings,
  Users,
  Zap,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { Avatar, Button } from '../ui';

interface AppSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navGroups = [
  {
    title: 'MAIN',
    items: [
      { to: '/app', label: 'Home', icon: Home },
      { to: '/app/assistant', label: 'AI Assistant', icon: Zap },
    ],
  },
  {
    title: 'GROW',
    items: [
      { to: '/app/marketing', label: 'Marketing', icon: Megaphone },
      { to: '/app/branding', label: 'Branding', icon: Briefcase },
      { to: '/app/website-builder', label: 'Website Builder', icon: FileText },
      { to: '/app/products', label: 'Products & Services', icon: FileText },
      { to: '/app/online-presence', label: 'Online Presence', icon: Globe },
    ],
  },
  {
    title: 'CUSTOMERS',
    items: [
      { to: '/app/customer-replies', label: 'Customer Replies', icon: MessageSquare },
      { to: '/app/customers', label: 'Customers', icon: Users },
      { to: '/app/leads', label: 'Leads', icon: Users },
    ],
  },
  {
    title: 'MANAGE',
    items: [
      { to: '/app/invoices', label: 'Invoices', icon: FileText },
      { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'SETTINGS',
    items: [{ to: '/app/settings', label: 'Settings', icon: Settings }],
  },
];

export function AppSidebar({ isOpen = true, onClose }: AppSidebarProps) {
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
      {isOpen && <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />}

      <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`} aria-label="Sidebar navigation">
        <div className="sidebar__header">
          <div className="brand brand--sidebar" aria-label="BizPilotAI workspace">
            <span className="brand__mark">B</span>
            <span className="brand__text">BizPilotAI</span>
          </div>
        </div>

        <div className="sidebar__workspace">
          <p className="label">Workspace</p>
          <button type="button" className="workspace-switcher" aria-label="Current workspace">
            <span className="workspace-switcher__name">{business?.businessName ?? 'No business selected'}</span>
            <ChevronDown size={14} />
          </button>
        </div>

        <nav className="sidebar__nav">
          {navGroups.map((group) => (
            <div key={group.title} className="nav-section">
              <p className="nav-section__title">{group.title}</p>
              <div className="nav-section__items">
                {group.items.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={`${group.title}-${label}`}
                    to={to}
                    className={({ isActive }) => `sidebar__link${isActive ? ' sidebar__link--active' : ''}`}
                    onClick={onClose}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="sidebar__footer">
          {user && (
            <button type="button" className="user-menu" aria-label="User menu">
              <Avatar name={user.name} />
              <div className="user-menu__info">
                <p className="user-menu__name">{user.name}</p>
                <p className="user-menu__email">{user.email}</p>
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
            leftIcon={<LogOut size={16} />}
          >
            Sign out
          </Button>
        </div>
      </aside>
    </>
  );
}

export default AppSidebar;
