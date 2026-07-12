const API = 'http://localhost:8000'

const post = (url: string, data: any) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json())

export const getDashboard   = ()           => fetch(`${API}/api/dashboard`).then(r => r.json())
export const assignTask     = (data: any)  => post(`${API}/api/tasks/assign`, data)
export const splitTask      = (data: any)  => post(`${API}/api/tasks/split`, data)
export const parseTask      = (data: any)  => post(`${API}/api/tasks/parse`, data)
export const getSprint      = ()           => fetch(`${API}/api/sprint`).then(r => r.json())
export const generateSprint = (data: any)  => post(`${API}/api/sprint/generate`, data)
export const getBurnout     = ()           => fetch(`${API}/api/burnout`).then(r => r.json())
export const getWFH         = ()           => fetch(`${API}/api/wfh`).then(r => r.json())
export const getDeadline    = ()           => fetch(`${API}/api/deadline`).then(r => r.json())
export const askCopilot     = (data: any)  => post(`${API}/api/copilot`, data)
export const getTeam        = ()           => fetch(`${API}/api/team`).then(r => r.json())
export const buildTeam      = (data: any)  => post(`${API}/api/team/build`, data)
export const getProductivity= ()           => fetch(`${API}/api/productivity`).then(r => r.json())
export const getSkillGap    = (skills?: string) =>
  fetch(`${API}/api/skill-gap${skills ? '?project_skills=' + encodeURIComponent(skills) : ''}`).then(r => r.json())
export const getHealthScore = ()           => fetch(`${API}/api/health-score`).then(r => r.json())
export const rebalance      = (data: any)  => post(`${API}/api/rebalance`, data)
export const getWorkDNA     = ()           => fetch(`${API}/api/work-dna`).then(r => r.json())
export const getMeetings    = ()           => fetch(`${API}/api/meetings`).then(r => r.json())