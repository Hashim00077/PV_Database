// Tiny fetch wrapper for the case API.

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null;
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new Error((data && data.error) || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  listCases: () => request('/api/cases'),
  getCase: (id) => request(`/api/cases/${id}`),
  createCase: (payload) =>
    request('/api/cases', { method: 'POST', body: JSON.stringify(payload) }),
  updateCase: (id, payload) =>
    request(`/api/cases/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteCase: (id) => request(`/api/cases/${id}`, { method: 'DELETE' }),
  nextCaseNumber: () => request('/api/next-case-number'),
};
