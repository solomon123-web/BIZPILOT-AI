import { Bell, Menu, X } from 'lucide-react';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { Button } from '../ui';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onMenuClick?: () => void;
  sidebarOpen?: boolean;
}

export function Header({
  title = 'Dashboard',
  subtitle,
  onMenuClick,
  sidebarOpen = true,
}: HeaderProps) {
  const { business } = useWorkspace();

  return (
    <header className="app-header">
      <div className="app-header__left">
        <button
          className="app-header__menu-button"
          onClick={onMenuClick}
          aria-label="Toggle navigation"
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="app-header__content">
          <h1 className="h2">{title}</h1>
          {subtitle && <p className="small">{subtitle}</p>}
          {business && !subtitle && (
            <p className="small">{business.businessName}</p>
          )}
        </div>
      </div>

      <div className="app-header__right">
        <Button
          variant="ghost"
          size="sm"
          aria-label="Notifications"
          className="app-header__notif"
        >
          <Bell size={18} strokeWidth={1.5} />
          <span className="app-header__notif-badge">3</span>
        </Button>
      </div>
    </header>
  );
}
