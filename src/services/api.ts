const API_BASE_URL = 'http://localhost:5000/api';

const AUTH_TOKEN_KEY = 'bizpilot_auth_token';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

type ApiOptions = RequestInit & {
  token?: string;
};

export async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const { token, headers, ...requestOptions } = options;

  const authToken = token ?? getAuthToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken
        ? { Authorization: `Bearer ${authToken}` }
        : {}),
      ...headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `Request failed with status ${response.status}`,
    );
  }

  return data as T;
}

const api = {
  apiRequest,

  get: <T>(endpoint: string, token?: string) =>
    apiRequest<T>(endpoint, {
      method: 'GET',
      token,
    }),

  getWithQuery: <T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>, token?: string) => {
    const query = new URLSearchParams();
    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value));
      }
    });
    const url = query.toString() ? `${endpoint}?${query.toString()}` : endpoint;
    return apiRequest<T>(url, { method: 'GET', token });
  },

  post: <T>(
    endpoint: string,
    body?: unknown,
    token?: string,
  ) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      token,
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    }),

  patch: <T>(
    endpoint: string,
    body?: unknown,
    token?: string,
  ) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      token,
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    }),

  put: <T>(
    endpoint: string,
    body?: unknown,
    token?: string,
  ) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      token,
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    }),

  delete: <T>(endpoint: string, token?: string) =>
    apiRequest<T>(endpoint, {
      method: 'DELETE',
      token,
    }),
};

export default api;