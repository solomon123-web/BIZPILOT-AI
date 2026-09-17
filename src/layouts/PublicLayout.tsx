import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Button } from '../components/ui';

const navItems = [
  { to: '/features', label: 'Features' },
  { to: '/#how-it-works', label: 'How It Works' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
];

export function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="shell shell--public">
      <header className="topbar">
        <div className="container topbar__inner">
          <NavLink to="/" className="brand" aria-label="BizPilotAI home">
            <span className="brand__mark">B</span>
            <span className="brand__text">BizPilotAI</span>
          </NavLink>

          <nav className="nav nav--desktop" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="topbar__actions topbar__actions--desktop">
            <Button variant="ghost" to="/login">
              Log in
            </Button>
            <Button variant="primary" to="/signup">
              Get started
            </Button>
          </div>

          <button
            type="button"
            className="mobile-menu-toggle"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen((value) => !value)}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {mobileMenuOpen ? (
          <div className="mobile-menu container">
            <nav className="mobile-menu__nav" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)} className="mobile-menu__link">
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="mobile-menu__actions">
              <Button variant="ghost" to="/login" onClick={() => setMobileMenuOpen(false)}>
                Log in
              </Button>
              <Button variant="primary" to="/signup" onClick={() => setMobileMenuOpen(false)}>
                Get started
              </Button>
            </div>
          </div>
        ) : null}
      </header>

      <main className="container page-shell">
        <Outlet />
      </main>
    </div>
  );
}
