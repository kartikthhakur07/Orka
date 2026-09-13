const API = (process.env.NEXT_PUBLIC_API_URL || 'https://orkapi.onrender.com').replace(/\/$/, '')

async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 2, delayMs = 1500): Promise<any> {
  try {
    const res = await fetch(url, options)
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }
    return await res.json()
  } catch (err) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, delayMs))
      return fetchWithRetry(url, options, retries - 1, delayMs * 1.5)
    }
    throw err
  }
}

const get = (endpoint: string) => fetchWithRetry(`${API}${endpoint}`)

const post = (endpoint: string, data: any) =>
  fetchWithRetry(`${API}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

export const getDashboard   = ()           => get('/api/dashboard')
export const assignTask     = (data: any)  => post('/api/tasks/assign', data)
export const splitTask      = (data: any)  => post('/api/tasks/split', data)
export const parseTask      = (data: any)  => post('/api/tasks/parse', data)
export const getSprint      = ()           => get('/api/sprint')
export const generateSprint = (data: any)  => post('/api/sprint/generate', data)
export const getBurnout     = ()           => get('/api/burnout')
export const getWFH         = ()           => get('/api/wfh')
export const getDeadline    = ()           => get('/api/deadline')
export const askCopilot     = (data: any)  => post('/api/copilot', data)
export const getTeam        = ()           => get('/api/team')
export const buildTeam      = (data: any)  => post('/api/team/build', data)
export const getProductivity= ()           => get('/api/productivity')
export const getSkillGap    = (skills?: string) =>
  get(`/api/skill-gap${skills ? '?project_skills=' + encodeURIComponent(skills) : ''}`)
export const getHealthScore = ()           => get('/api/health-score')
export const rebalance      = (data: any)  => post('/api/rebalance', data)
export const getWorkDNA     = ()           => get('/api/work-dna')
export const getMeetings    = ()           => get('/api/meetings')