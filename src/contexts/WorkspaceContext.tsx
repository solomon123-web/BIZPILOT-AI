import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { BusinessProfile } from '../types/business';

interface WorkspaceContextType {
  business: BusinessProfile | null;
  setBusiness: (business: BusinessProfile | null) => void;
  user: { name: string; email: string } | null;
  setUser: (user: { name: string; email: string } | null) => void;
  isDemoMode: boolean;
  setIsDemoMode: (isDemoMode: boolean) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const demoMode = sessionStorage.getItem('demoMode') === 'true';
    if (!demoMode) {
      return;
    }

    const demoDataStr = sessionStorage.getItem('demoData');
    if (!demoDataStr) {
      return;
    }

    try {
      const demoData = JSON.parse(demoDataStr);
      setBusiness(demoData.business ?? null);
      setUser(demoData.user ?? null);
      setIsDemoMode(true);
    } catch (error) {
      console.error('Failed to load demo data:', error);
      sessionStorage.removeItem('demoMode');
      sessionStorage.removeItem('demoData');
    }
  }, []);

  return (
    <WorkspaceContext.Provider value={{ business, setBusiness, user, setUser, isDemoMode, setIsDemoMode }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within WorkspaceProvider');
  }
  return context;
}
