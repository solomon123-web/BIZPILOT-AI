import { Link, Outlet, useLocation } from 'react-router-dom';

export function AuthLayout() {
  const location = useLocation();
  const isOnboarding = location.pathname === '/onboarding';

  return (
    <div className="shell shell--auth">
      <main className="auth-shell">
        <div className={isOnboarding ? 'auth-panel auth-panel--wide' : 'auth-panel'}>
          <div className="auth-brand">
            <Link to="/" className="brand" aria-label="BizPilotAI home">
              <span className="brand__mark">B</span>
              <span className="brand__text">BizPilotAI</span>
            </Link>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
