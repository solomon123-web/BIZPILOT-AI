import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWorkspace } from '../contexts/WorkspaceContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { business, isDemoMode } = useWorkspace();
  const location = useLocation();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (!isDemoMode && user && !business && location.pathname.startsWith('/app')) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
