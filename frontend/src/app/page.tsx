"use client"
import { useState, useEffect } from "react"
import { assignTask, getBurnoutStatus, getWFHSchedule } from "@/lib/api"

export default function Home() {
  const [taskInput, setTaskInput] = useState("")
  const [skills, setSkills] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [burnout, setBurnout] = useState<any[]>([])
  const [wfh, setWfh] = useState<any[]>([])

  useEffect(() => {
    getBurnoutStatus().then(d => setBurnout(d.burnout_status))
    getWFHSchedule().then(d => setWfh(d.wfh_schedule))
  }, [])

  const handleAssign = async () => {
    if (!taskInput) return
    setLoading(true)
    const data = await assignTask({
      title: taskInput,
      required_skills: skills.split(",").map(s => s.trim()).filter(Boolean),
      priority: "high"
    })
    setResult(data)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-black">
          ORK<span className="text-orange-500">A</span>
        </h1>
        <p className="text-gray-400 mt-1">AI-Powered Project Intelligence — Supernova Hacks 2.0</p>
      </div>

      {/* Task Assignment */}
      <div className="bg-gray-900 border border-purple-600 rounded-xl p-6 mb-6">
        <h2 className="text-purple-400 font-bold mb-4">🤖 AI Task Delegator</h2>
        <input
          className="w-full bg-gray-800 rounded-lg px-4 py-3 mb-3 text-white border border-gray-700 focus:border-purple-500 outline-none"
          placeholder="Task title (e.g., Build JWT Login System)"
          value={taskInput}
          onChange={e => setTaskInput(e.target.value)}
        />
        <input
          className="w-full bg-gray-800 rounded-lg px-4 py-3 mb-3 text-white border border-gray-700 focus:border-purple-500 outline-none"
          placeholder="Required skills (e.g., Backend, API, Security)"
          value={skills}
          onChange={e => setSkills(e.target.value)}
        />
        <button
          onClick={handleAssign}
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-400 px-6 py-3 rounded-lg font-bold transition-all w-full"
        >
          {loading ? "🔄 AI is deciding..." : "⚡ AI Assign Task"}
        </button>

        {result && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-green-500">
            <p className="text-green-400 font-bold text-lg mb-2">
              ✅ Assigned to: {result.assigned_to} ({result.assignment_score}%)
            </p>
            <p className="text-gray-400 text-sm">Backup: {result.backup}</p>
            <div className="mt-3 space-y-1">
              {result.all_scores?.map((s: any) => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="text-gray-300 w-20 text-sm">{s.name}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-orange-500 transition-all"
                      style={{ width: `${s.score}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-sm w-12 text-right">
                    {s.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Burnout + WFH Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Burnout Radar */}
        <div className="bg-gray-900 border border-red-900 rounded-xl p-6">
          <h2 className="text-red-400 font-bold mb-4">🔥 Burnout Radar</h2>
          <div className="space-y-3">
            {burnout.map((m: any) => (
              <div key={m.name} className="flex items-center gap-3">
                <span className="text-gray-300 w-20 text-sm">{m.name}</span>
                <div className="flex-1 bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      m.risk_score > 80 ? "bg-red-500" :
                      m.risk_score > 60 ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    style={{ width: `${m.risk_score}%` }}
                  />
                </div>
                <span className={`text-xs font-bold w-16 text-right ${
                  m.risk_level === "critical" ? "text-red-400" :
                  m.risk_level === "watch" ? "text-yellow-400" : "text-green-400"
                }`}>
                  {m.risk_level === "critical" ? "🔴 Critical" :
                   m.risk_level === "watch" ? "🟡 Watch" : "🟢 Safe"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* WFH Schedule */}
        <div className="bg-gray-900 border border-teal-900 rounded-xl p-6">
          <h2 className="text-teal-400 font-bold mb-4">🏠 WFH Decider</h2>
          <div className="space-y-3">
            {wfh.map((m: any) => (
              <div key={m.name} className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">{m.name}</span>
                <div className="text-right">
                  <p className={`text-xs font-bold ${
                    m.wfh_score > 70 ? "text-teal-400" :
                    m.wfh_score > 50 ? "text-yellow-400" : "text-gray-400"
                  }`}>
                    {m.decision}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {m.recommended_days.join(", ") || "Office week"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-600 text-sm">
        Team Bugged Bhature · Supernova Hacks 2.0 ·
        <span className="text-orange-500"> h90519495@gmail.com</span>
      </div>
    </main>
  )
}