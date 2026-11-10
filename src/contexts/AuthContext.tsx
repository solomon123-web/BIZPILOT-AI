import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useWorkspace } from './WorkspaceContext';
import authService from '../services/authService';
import { getAuthToken, setAuthToken } from '../services/api';
import businessService, { mapBusinessToProfile } from '../services/businessService';

type User = {
  id: string;
  name?: string | null;
  email: string;
} | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string | undefined,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const {
    setUser: setWorkspaceUser,
    setBusiness: setWorkspaceBusiness,
    setIsDemoMode,
  } = useWorkspace();

  const hydrateUserProfile = async (authenticatedUser: User) => {
    if (!authenticatedUser) {
      setWorkspaceBusiness(null);
      sessionStorage.removeItem('demoMode');
      sessionStorage.removeItem('demoData');
      return;
    }

    sessionStorage.removeItem('demoMode');
    sessionStorage.removeItem('demoData');

    setWorkspaceUser({
      name: authenticatedUser.name ?? '',
      email: authenticatedUser.email,
    });

    try {
      const response = await businessService.getBusinesses();
      const businesses = response?.data?.businesses ?? [];
      const nextBusiness = businesses[0] ?? null;
      const mappedBusiness = mapBusinessToProfile(nextBusiness);
      setWorkspaceBusiness(mappedBusiness);
    } catch (error) {
      console.error('Failed to restore business profile:', error);
      setWorkspaceBusiness(null);
    }
  };

  useEffect(() => {
    const restore = async () => {
      const token = getAuthToken();

      if (!token) {
        setWorkspaceBusiness(null);
        setWorkspaceUser(null);
        setIsDemoMode(false);
        setLoading(false);
        return;
      }

      try {
        const res = await authService.getCurrentUser();
        const u = res?.data?.user ?? null;
        setUser(u);

        if (u) {
          await hydrateUserProfile(u);
        } else {
          setWorkspaceUser(null);
          setWorkspaceBusiness(null);
        }
      } catch (err) {
        console.error('Failed to restore authentication:', err);
        setAuthToken(null);
        setUser(null);
        setWorkspaceUser(null);
        setWorkspaceBusiness(null);
      } finally {
        setLoading(false);
      }
    };

    restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (
    email: string,
    password: string,
  ) => {
    const res = await authService.login(email, password);
    const u = res?.data?.user ?? null;
    setUser(u);

    if (u) {
      await hydrateUserProfile(u);
    }
  };

  const signup = async (
    name: string | undefined,
    email: string,
    password: string,
  ) => {
    const res = await authService.signup(name ?? '', email, password);
    const u = res?.data?.user ?? null;
    setUser(u);

    if (u) {
      await hydrateUserProfile(u);
    }
  };

  const logout = async () => {
    setAuthToken(null);
    setUser(null);
    setWorkspaceUser(null);
    setWorkspaceBusiness(null);
    setIsDemoMode(false);
    sessionStorage.removeItem('demoMode');
    sessionStorage.removeItem('demoData');

    try {
      await authService.logout();
    } catch (error) {
      console.error('Backend logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      'useAuth must be used within AuthProvider',
    );
  }

  return ctx;
}

export default {
  AuthProvider,
  useAuth,
};
