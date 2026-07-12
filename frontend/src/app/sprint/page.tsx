'use client'

import { useEffect, useState } from 'react'
import { getSprint, generateSprint } from '@/lib/api'
import { CalendarDays, Loader2, Zap, AlertTriangle, Plus, User } from 'lucide-react'

/* ── helpers ──────────────────────────────────────────────────────────── */
function OfflineBanner() {
  return (
    <div className="offline-banner flex items-center gap-3 mb-4">
      <AlertTriangle size={16} />
      <p style={{ fontSize: '0.85rem' }}>Backend offline — run: <code style={{ background: 'rgba(239,68,68,0.15)', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace' }}>uvicorn main:app --reload</code></p>
    </div>
  )
}

function getInitials(name: string) {
  return (name || 'UN').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const AVATAR_COLORS = ['#f97316', '#a855f7', '#14b8a6', '#22c55e', '#eab308', '#ef4444', '#3b82f6']

/* ── Day Card ─────────────────────────────────────────────────────────── */
function DayCard({ day, idx }: { day: any; idx: number }) {
  const tasks = day.tasks || day.items || []
  const dateStr = day.date || day.day || `Day ${idx + 1}`
  const isToday = idx === 0

  return (
    <div
      className="glass-card p-4 animate-fade-in-up"
      style={{
        minWidth: 200, flex: '0 0 auto',
        borderColor: isToday ? 'rgba(249,115,22,0.30)' : undefined,
        opacity: 0, animationFillMode: 'forwards',
        animationDelay: `${idx * 60}ms`
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {typeof dateStr === 'string' && dateStr.includes('-')
              ? new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' })
              : dateStr}
          </p>
          <p style={{ fontSize: '0.85rem', fontWeight: 700, color: isToday ? 'var(--accent-orange)' : 'var(--text-primary)' }}>
            {typeof dateStr === 'string' && dateStr.includes('-')
              ? new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : ''}
          </p>
        </div>
        {isToday && (
          <span className="badge badge-orange" style={{ fontSize: '0.6rem' }}>TODAY</span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {tasks.length === 0 ? (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', textAlign: 'center', padding: '8px 0' }}>No tasks</p>
        ) : tasks.map((task: any, ti: number) => {
          const assignee = task.assignee || task.assigned_to || ''
          const bg = AVATAR_COLORS[ti % AVATAR_COLORS.length]
          return (
            <div key={ti} style={{
              padding: '8px 10px', borderRadius: 8,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              <div className="avatar avatar-sm" style={{ background: `${bg}20`, color: bg, flexShrink: 0 }}>
                {assignee ? getInitials(assignee) : <User size={10} />}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.3 }}>
                {task.title || task.name || task}
              </span>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}

/* ── Sprint View ──────────────────────────────────────────────────────── */
function SprintView({ sprint }: { sprint: any }) {
  const days = sprint.days || sprint.schedule || sprint.plan || []

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <CalendarDays size={18} color="var(--accent-orange)" />
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {sprint.name || 'Current Sprint'}
        </h2>
        {sprint.velocity && (
          <span className="badge badge-teal">Velocity: {sprint.velocity}</span>
        )}
        {sprint.completion && (
          <span className="badge badge-green">{sprint.completion}% done</span>
        )}
      </div>

      {days.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p style={{ color: 'var(--text-muted)' }}>No sprint days found in response</p>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 12 }}>
          {days.map((d: any, i: number) => (
            <DayCard key={i} day={d} idx={i} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Generate Form ────────────────────────────────────────────────────── */
function GenerateForm() {
  const [tasks, setTasks] = useState('')
  const [duration, setDuration] = useState(7)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState(false)

  const submit = async () => {
    setLoading(true); setError(false)
    try {
      const taskList = tasks.split('\n').map(t => t.trim()).filter(Boolean)
      const res = await generateSprint({ tasks: taskList, duration_days: duration })
      setResult(res)
    } catch { setError(true) }
    finally { setLoading(false) }
  }

  return (
    <div>
      <div className="glass-card p-6 mb-5">
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={16} color="var(--accent-purple)" /> Generate New Sprint
        </h3>

        {error && <OfflineBanner />}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Task List <span style={{ color: 'var(--text-faint)' }}>(one per line)</span>
            </label>
            <textarea className="orka-textarea" rows={6}
              placeholder={"Build login UI\nSetup JWT auth\nCreate dashboard\nPayment integration\nWrite unit tests"}
              value={tasks} onChange={e => setTasks(e.target.value)} />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'flex', justifyContent: 'space-between', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span>Sprint Duration</span>
              <span style={{ color: 'var(--accent-orange)', fontWeight: 700 }}>{duration} days</span>
            </label>
            <input type="range" min={3} max={14} value={duration} onChange={e => setDuration(+e.target.value)} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>3 days</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>14 days</span>
            </div>
          </div>

          <button className="btn-primary" onClick={submit} disabled={loading || !tasks.trim()}>
            {loading
              ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Generating…</>
              : <><Zap size={14} /> Generate Sprint</>
            }
          </button>
        </div>
      </div>

      {result && <SprintView sprint={result} />}
    </div>
  )
}

/* ── Skeleton ─────────────────────────────────────────────────────────── */
function SprintSkeleton() {
  return (
    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 12 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="glass-card p-4" style={{ minWidth: 180, flex: '0 0 auto' }}>
          <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 50, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 50, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 24, width: '40%' }} />
        </div>
      ))}
    </div>
  )
}

/* ── Main ─────────────────────────────────────────────────────────────── */
export default function SprintPage() {
  const [sprint, setSprint] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [tab, setTab] = useState(0)

  useEffect(() => {
    getSprint()
      .then(setSprint)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 className="section-title">📅 AI Sprint Planner</h1>
        <p className="section-subtitle">Intelligent sprint scheduling and daily task distribution</p>
      </div>

      <div className="tab-bar mb-6" style={{ maxWidth: 320 }}>
        <button className={`tab-btn ${tab === 0 ? 'active' : ''}`} onClick={() => setTab(0)}>Current Sprint</button>
        <button className={`tab-btn ${tab === 1 ? 'active' : ''}`} onClick={() => setTab(1)}>Generate New</button>
      </div>

      {tab === 0 && (
        <div>
          {error && <OfflineBanner />}
          {loading ? <SprintSkeleton /> : sprint ? <SprintView sprint={sprint} /> : (
            <div className="glass-card p-8 text-center">
              <CalendarDays size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--text-secondary)' }}>No active sprint found. Generate one!</p>
            </div>
          )}
        </div>
      )}

      {tab === 1 && <GenerateForm />}
    </div>
  )
}
