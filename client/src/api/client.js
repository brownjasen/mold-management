const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && window.API_BASE_URL) {
    return window.API_BASE_URL;
  }
  return import.meta.env.VITE_API_BASE_URL || '/api';
};

export const api = {
  async get(url) {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}${url}`);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },

  async post(url, data) {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },

  async put(url, data) {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },

  async delete(url) {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}${url}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  }
};
