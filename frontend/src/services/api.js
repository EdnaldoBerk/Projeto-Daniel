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
