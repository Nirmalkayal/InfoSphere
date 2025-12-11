const BASE_URL: string = (import.meta as unknown as { env?: { VITE_BACKEND_URL?: string } })
  ?.env?.VITE_BACKEND_URL || 'http://localhost:3000';

function authHeaders() {
  const headers: Record<string,string> = { 'content-type': 'application/json' };
  return headers;
}

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...(options.headers || {}), ...authHeaders() },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function login(username: string, password: string) {
  const data = await request('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
  return data as { token: string };
}

export async function getStats() { return request('/admin/stats'); }
export async function getApiKeys() { return request('/admin/api-keys'); }
export async function getTurfs() { return request('/admin/turfs'); }
export async function getUsers() { return request('/admin/users'); }
export async function getLogs() { return request('/admin/logs'); }
export async function getSlots(fromISO: string, toISO: string, turfId?: string) {
  const params = new URLSearchParams({ from: fromISO, to: toISO });
  if (turfId) params.set('turfId', turfId);
  return request(`/admin/slots?${params.toString()}`);
}
export async function getDashboard() { return request('/admin/dashboard-metrics'); }
