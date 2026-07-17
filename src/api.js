// Central API client. Same-origin: in dev, Vite proxies /api -> :3001 (see
// vite.config.js); in production the Express server serves both API and site.

const TOKEN_KEY = 'inphint_admin_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY) || ''
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

async function req(method, path, body, auth = false) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) headers.Authorization = `Bearer ${getToken()}`

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  let data = null
  try { data = await res.json() } catch { /* empty body */ }

  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

// ── Public ──────────────────────────────────────────────────
export const api = {
  getServices: () => req('GET', '/services'),
  getAiChips: () => req('GET', '/ai-chips'),
  getProjects: () => req('GET', '/projects'),
  getAiProjects: () => req('GET', '/ai-projects'),
  submitContact: (payload) => req('POST', '/contact', payload),
  sendChat: (messages, sessionId) => req('POST', '/chat', { messages, sessionId }),

  // ── Auth ──
  login: (username, password) => req('POST', '/auth/login', { username, password }),
  me: () => req('GET', '/auth/me', undefined, true),
}

// ── Admin CRUD (token-protected) ────────────────────────────
// Generic factory so every resource shares the same shape.
function adminResource(base) {
  return {
    list: () => req('GET', `${base}/admin`, undefined, true),
    create: (payload) => req('POST', `${base}/admin`, payload, true),
    update: (id, payload) => req('PATCH', `${base}/admin/${id}`, payload, true),
    remove: (id) => req('DELETE', `${base}/admin/${id}`, undefined, true),
  }
}

export const adminApi = {
  contacts: {
    list: (status) => req('GET', `/contact/admin${status ? `?status=${encodeURIComponent(status)}` : ''}`, undefined, true),
    setStatus: (id, status) => req('PATCH', `/contact/admin/${id}`, { status }, true),
    remove: (id) => req('DELETE', `/contact/admin/${id}`, undefined, true),
  },
  services: adminResource('/services'),
  aiChips: adminResource('/ai-chips'),
  projects: adminResource('/projects'),
  aiProjects: adminResource('/ai-projects'),
  conversations: {
    list: () => req('GET', '/chat/admin', undefined, true),
    get: (id) => req('GET', `/chat/admin/${id}`, undefined, true),
    remove: (id) => req('DELETE', `/chat/admin/${id}`, undefined, true),
  },
}
