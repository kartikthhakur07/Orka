// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function getTeam() {
  const res = await fetch(`${API_URL}/api/team`)
  return res.json()
}

export async function assignTask(taskData: {
  title: string
  required_skills: string[]
  priority?: string
}) {
  const res = await fetch(`${API_URL}/api/tasks/assign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData)
  })
  return res.json()
}

export async function getBurnoutStatus() {
  const res = await fetch(`${API_URL}/api/burnout`)
  return res.json()
}

export async function getWFHSchedule() {
  const res = await fetch(`${API_URL}/api/wfh`)
  return res.json()
}