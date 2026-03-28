const API_URL = import.meta.env.VITE_API_URL || '';

export const apiFetch = async (path, method = 'GET', body, token) => {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.message || 'API error');

  return data;
};

export const authAPI = {
  register: (userData) => apiFetch('/api/auth/register', 'POST', userData),
  login: (credentials) => apiFetch('/api/auth/login', 'POST', credentials),
};

export const userAPI = {
  search: (query, token) => apiFetch(`/api/users/search?query=${encodeURIComponent(query)}`, 'GET', null, token),
};

export const transactionAPI = {
  create: (transactionData, token) => apiFetch('/api/transactions', 'POST', transactionData, token),
  getAll: (token) => apiFetch('/api/transactions', 'GET', null, token),
  settle: (id, token) => apiFetch(`/api/transactions/${id}/settle`, 'PATCH', null, token),
};