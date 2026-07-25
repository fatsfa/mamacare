const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const jsonFetch = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...options.headers,
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
};

export const registerUser = (payload) => jsonFetch('/api/auth/register', { method: 'POST', body: payload });
export const loginUser = (payload) => jsonFetch('/api/auth/login', { method: 'POST', body: payload });
export const getMe = () => jsonFetch('/api/auth/me');
export const fetchBabies = () => jsonFetch('/api/babies');
export const createBaby = (payload) => jsonFetch('/api/babies', { method: 'POST', body: payload });
export const createLog = (payload) => jsonFetch('/api/logs', { method: 'POST', body: payload });
export const fetchVaccines = (babyId) => jsonFetch(`/api/vaccines?babyId=${babyId}`);
export const fetchArticles = () => jsonFetch('/api/articles');
