const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');

const getToken = () => localStorage.getItem('token');

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const jsonFetch = async (path, options = {}) => {
  try {
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
      throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${path}:`, error.message);
    throw error;
  }
};

// ===== AUTH =====
export const registerUser = (payload) => 
  jsonFetch('/api/auth/register', { method: 'POST', body: payload });

export const loginUser = (payload) => 
  jsonFetch('/api/auth/login', { method: 'POST', body: payload });

export const getMe = () => jsonFetch('/api/auth/me');

// ===== BABIES =====
export const fetchBabies = () => jsonFetch('/api/babies');

export const createBaby = (payload) => 
  jsonFetch('/api/babies', { method: 'POST', body: payload });

export const getBaby = (id) => jsonFetch(`/api/babies/${id}`);

export const updateBaby = (id, payload) => 
  jsonFetch(`/api/babies/${id}`, { method: 'PUT', body: payload });

export const deleteBaby = (id) => 
  jsonFetch(`/api/babies/${id}`, { method: 'DELETE' });

// ===== LOGS =====
export const createLog = (payload) => 
  jsonFetch('/api/logs', { method: 'POST', body: payload });

export const fetchLogs = (babyId, date) => {
  const params = new URLSearchParams({ babyId });
  if (date) params.append('date', date);
  return jsonFetch(`/api/logs?${params.toString()}`);
};

export const updateLog = (id, payload) => 
  jsonFetch(`/api/logs/${id}`, { method: 'PUT', body: payload });

export const deleteLog = (id) => 
  jsonFetch(`/api/logs/${id}`, { method: 'DELETE' });

// ===== VACCINES =====
export const fetchVaccines = (babyId) => 
  jsonFetch(`/api/vaccines?babyId=${babyId}`);

export const markVaccineDone = (payload) => 
  jsonFetch('/api/vaccines/mark-done', { method: 'POST', body: payload });

// ===== ARTICLES =====
export const fetchArticles = (category, search) => {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (search) params.append('search', search);
  const queryString = params.toString();
  return jsonFetch(`/api/articles${queryString ? '?' + queryString : ''}`);
};

export const getArticle = (id) => jsonFetch(`/api/articles/${id}`);

export const bookmarkArticle = (articleId) => 
  jsonFetch('/api/articles/bookmark', { method: 'POST', body: { articleId } });

export const fetchBookmarks = () => 
  jsonFetch('/api/articles/bookmarks/list');

// ===== AI ASSISTANT =====
export const askAI = (payload) => 
  jsonFetch('/api/ai/ask', { method: 'POST', body: payload });

export const fetchAIHistory = (babyId) => 
  jsonFetch(`/api/ai/history?babyId=${babyId}`);
