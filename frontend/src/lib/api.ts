function getApiUrl(endpoint: string): string {
  let base = process.env.NEXT_PUBLIC_API_URL
  if (!base) {
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      base = 'http://localhost:8000'
    } else {
      base = 'https://orkapi.onrender.com'
    }
  }
  return `${base.replace(/\/$/, '')}${endpoint}`
}

async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 2, delayMs = 1500): Promise<any> {
  try {
    const res = await fetch(url, options)
    if (!res.ok) {
      const err = new Error(`HTTP ${res.status}: ${res.statusText}`) as any
      err.status = res.status
      throw err
    }
    return await res.json()
  } catch (err: any) {
    // Do not retry 4xx client errors (like 404 Not Found)
    if (err.status && err.status >= 400 && err.status < 500) {
      throw err
    }
    if (retries > 0) {
      await new Promise(r => setTimeout(r, delayMs))
      return fetchWithRetry(url, options, retries - 1, delayMs * 1.5)
    }
    throw err
  }
}

const get = (endpoint: string) => fetchWithRetry(getApiUrl(endpoint))

const post = (endpoint: string, data: any) =>
  fetchWithRetry(getApiUrl(endpoint), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

const patch = (endpoint: string, data: any) =>
  fetchWithRetry(getApiUrl(endpoint), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

const del = (endpoint: string) =>
  fetchWithRetry(getApiUrl(endpoint), {
    method: 'DELETE',
  })

export const getDashboard   = ()           => get('/api/dashboard')
export const assignTask     = (data: any)  => post('/api/tasks/assign', data)
export const splitTask      = (data: any)  => post('/api/tasks/split', data)
export const parseTask      = (data: any)  => post('/api/tasks/parse', data)
export const getTasks       = (params?: { status?: string; priority?: string; search?: string }) => {
  const query = new URLSearchParams()
  if (params?.status) query.append('status', params.status)
  if (params?.priority) query.append('priority', params.priority)
  if (params?.search) query.append('search', params.search)
  const qs = query.toString()
  return get(`/api/tasks${qs ? '?' + qs : ''}`)
}
export const createTask     = (data: any)  => post('/api/tasks', data)
export const updateTask     = (id: number, data: any) => patch(`/api/tasks/${id}`, data)
export const deleteTask     = (id: number) => del(`/api/tasks/${id}`)
export const getSprint      = ()           => get('/api/sprint')
export const generateSprint = (data: any)  => post('/api/sprint/generate', data)
export const getBurnout     = ()           => get('/api/burnout')
export const getWFH         = ()           => get('/api/wfh')
export const getDeadline    = ()           => get('/api/deadline')
export const askCopilot     = (data: any)  => post('/api/copilot', data)
export const getTeam        = ()           => get('/api/team')
export const createMember   = (data: any)  => post('/api/team', data)
export const buildTeam      = (data: any)  => post('/api/team/build', data)
export const getProductivity= ()           => get('/api/productivity')
export const getAnalytics   = ()           => get('/api/analytics')
export const getSkillGap    = (skills?: string) =>
  get(`/api/skill-gap${skills ? '?project_skills=' + encodeURIComponent(skills) : ''}`)
export const getHealthScore = ()           => get('/api/health-score')
export const rebalance      = (data: any)  => post('/api/rebalance', data)
export const getWorkDNA     = ()           => get('/api/work-dna')
export const getMeetings    = ()           => get('/api/meetings')
export const authenticateWithGoogle = (data: { credential?: string; token?: string; email?: string }) =>
  post('/api/auth/google', data)