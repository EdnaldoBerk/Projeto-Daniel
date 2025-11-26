const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function handleResponse(res) {
  let data = null;
  const text = await res.text();
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const message = (data && (data.error || data.message)) || `Erro ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

export async function registerUser({ nome, email, telefone, cpf, senha }) {
  const res = await fetch(`${BASE_URL}/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, telefone, cpf, senha })
  });
  return handleResponse(res);
}

export async function loginUser({ email, senha }) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });
  return handleResponse(res);
}

export async function fetchUserByEmail(email) {
  const res = await fetch(`${BASE_URL}/usuario/${encodeURIComponent(email)}`);
  return handleResponse(res);
}

// API object para importação default
const api = {
  get: async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`);
    return handleResponse(res);
  },
  post: async (endpoint, data, config = {}) => {
    const headers = config.headers || { 'Content-Type': 'application/json' };
    const body = headers['Content-Type'] === 'application/json' 
      ? JSON.stringify(data) 
      : data;
    
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: headers['Content-Type'] === 'multipart/form-data' ? {} : headers,
      body
    });
    return handleResponse(res);
  },
  put: async (endpoint, data, config = {}) => {
    const headers = config.headers || { 'Content-Type': 'application/json' };
    const body = headers['Content-Type'] === 'application/json' 
      ? JSON.stringify(data) 
      : data;
    
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: headers['Content-Type'] === 'multipart/form-data' ? {} : headers,
      body
    });
    return handleResponse(res);
  },
  delete: async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  }
};

export default api;
