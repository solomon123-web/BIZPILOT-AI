import { Bell, ChevronDown, Menu, Search, Sparkles, X } from 'lucide-react';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { Avatar } from '../ui';

interface TopBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onMenuClick?: () => void;
  sidebarOpen?: boolean;
}

export function TopBar({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onMenuClick,
  sidebarOpen = false,
}: TopBarProps) {
  const { business, user } = useWorkspace();

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button
          type="button"
          className="app-header__menu-button"
          onClick={onMenuClick}
          aria-label="Toggle navigation"
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className="workspace-pill">
          <span className="workspace-pill__label">Workspace</span>
          <span className="workspace-pill__value">{business?.businessName ?? 'No workspace'}</span>
          <ChevronDown size={14} />
        </div>
      </div>

      <div className="topbar__search">
        <Search size={16} className="topbar__search-icon" />
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onSearchSubmit();
            }
          }}
          placeholder="Search business, route, customer, invoice..."
          aria-label="Global search"
        />
      </div>

      <div className="topbar__actions">
        <div className="ai-status">
          <Sparkles size={14} />
          <span>{business ? 'AI live' : 'AI unavailable'}</span>
        </div>

        <button type="button" className="app-header__notif" aria-label="Notifications">
          <Bell size={18} strokeWidth={1.5} />
          <span className="app-header__notif-badge">3</span>
        </button>

        <div className="user-mini">
          <Avatar name={user?.name ?? 'User'} />
          <div className="user-mini__details">
            <span>{user?.name ?? 'User'}</span>
            <small>{user?.email ?? ''}</small>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
