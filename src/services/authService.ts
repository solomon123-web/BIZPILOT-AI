import api, { setAuthToken } from './api';

interface AuthResponse {
  success: boolean;
  data: {
    user?: {
      id: string;
      name: string | null;
      email: string;
      createdAt?: string;
      updatedAt?: string;
    };
    token?: string;
  };
  message?: string;
}

export const signup = async (
  name: string,
  email: string,
  password: string,
) => {
  const res = await api.apiRequest<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const token = res.data?.token;

  if (token) {
    setAuthToken(token);
  }

  return res;
};

export const login = async (
  email: string,
  password: string,
) => {
  const res = await api.apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const token = res.data?.token;

  if (token) {
    setAuthToken(token);
  }

  return res;
};

export const logout = async () => {
  try {
    await api.apiRequest('/auth/logout', {
      method: 'POST',
    });
  } finally {
    setAuthToken(null);
  }
};

export const getCurrentUser = async () => {
  return api.apiRequest<AuthResponse>('/auth/me', {
    method: 'GET',
  });
};

export default {
  signup,
  login,
  logout,
  getCurrentUser,
};
