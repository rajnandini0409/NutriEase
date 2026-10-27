const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Something went wrong. Please try again.');
  return payload;
}

export const getMeals = (params = {}) => {
  const query = new URLSearchParams(params);
  return request(`/meals${query.size ? `?${query}` : ''}`);
};

export const getHealth = () => request('/health');

export const getRecommendations = (preferences) =>
  request('/ai/recommendations', { method: 'POST', body: JSON.stringify(preferences) });
