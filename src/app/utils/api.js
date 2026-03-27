const BASE_URL = 'http://localhost:8080/api';

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Read response as text first
  const text = await response.text();

  // Try to parse as JSON, fall back to wrapping plain text
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    // Plain text response — wrap it so callers get a consistent object
    data = { success: response.ok, message: text };
  }

  if (!response.ok) {
    const errorMessage = data.message || data.error || text || `Request failed (${response.status})`;
    throw new Error(errorMessage);
  }

  return data;
};
