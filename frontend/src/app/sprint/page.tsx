'use client'

import { useEffect, useState } from 'react'
import { getSprint, generateSprint } from '@/lib/api'
import OfflineBanner from '@/components/OfflineBanner'
import Badge from '@/components/Badge'
import { CalendarDays, Loader2, Zap, Plus, User } from 'lucide-react'

function getInitials(name: string) {
  return (name || 'UN').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const AVATAR_COLORS = ['#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#8b5cf6', '#ec4899']

function DayCard({ day, idx }: { day: any; idx: number }) {
  const tasks = day.tasks || day.items || []
  const dateStr = day.date || day.day || `Day ${idx + 1}`
  const isToday = idx === 0

  return (
    <div
      className="glass-card p-5 animate-fade-in-up"
      style={{
        minWidth: 220, flex: '1 0 220px',
        borderColor: isToday ? 'rgba(99, 102, 241, 0.4)' : undefined,
        opacity: 0, animationFillMode: 'forwards',
        animationDelay: `${idx * 60}ms`
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {typeof dateStr === 'string' && dateStr.includes('-')
              ? new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' })
              : dateStr}
          </p>
          <p style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: isToday ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
            {typeof dateStr === 'string' && dateStr.includes('-')
              ? new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : ''}
          </p>
        </div>
        {isToday && (
          <Badge variant="blue">TODAY</Badge>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tasks.length === 0 ? (
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>No tasks scheduled</p>
        ) : tasks.map((task: any, ti: number) => {
          const assignee = task.assignee || task.assigned_to || ''
          const bg = AVATAR_COLORS[ti % AVATAR_COLORS.length]
          return (
            <div key={ti} style={{
              padding: '10px 12px', borderRadius: 8,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', gap: 10
            }}>
              <div className="avatar avatar-sm" style={{ background: `${bg}20`, color: bg, flexShrink: 0 }}>
                {assignee ? getInitials(assignee) : <User size={12} />}
              </div>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.4 }}>
                {task.title || task.name || task}
              </span>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
        <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}

function SprintView({ sprint }: { sprint: any }) {
  const days = sprint.days || sprint.schedule || sprint.plan || []

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 21 }}>
        <CalendarDays size={20} color="var(--accent-primary)" />
        <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
          {sprint.name || 'Current Sprint Plan'}
        </h2>
        {sprint.velocity && (
          <Badge variant="cyan">Velocity: {sprint.velocity}</Badge>
        )}
        {sprint.completion && (
          <Badge variant="green">{sprint.completion}% done</Badge>
        )}
      </div>

      {days.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p style={{ color: 'var(--text-muted)' }}>No sprint days found in response</p>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 13, overflowX: 'auto', paddingBottom: 13 }}>
          {days.map((d: any, i: number) => (
            <DayCard key={i} day={d} idx={i} />
          ))}
        </div>
      )}
    </div>
  )
}

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
    <div className="golden-grid mb-8">
      <div>
        <div className="glass-card p-6">
          <h3 style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 21, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={16} color="var(--accent-primary)" /> Generate New Sprint
          </h3>

          {error && <OfflineBanner />}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Task List <span style={{ color: 'var(--text-muted)' }}>(one per line)</span>
              </label>
              <textarea className="orka-textarea" rows={6}
                placeholder={"Build login UI\nSetup JWT auth\nCreate dashboard\nPayment integration\nWrite unit tests"}
                value={tasks} onChange={e => setTasks(e.target.value)} />
            </div>

            <div>
              <label style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 500, display: 'flex', justifyContent: 'space-between', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <span>Sprint Duration</span>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{duration} days</span>
              </label>
              <input type="range" min={3} max={14} value={duration} onChange={e => setDuration(+e.target.value)} style={{ accentColor: 'var(--accent-primary)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>3 days</span>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>14 days</span>
              </div>
            </div>

            <button className="btn-primary" onClick={submit} disabled={loading || !tasks.trim()}>
              {loading
                ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Generating…</>
                : <><Zap size={14} /> Generate Sprint Schedule</>
              }
            </button>
          </div>
        </div>

        {result && (
          <div style={{ marginTop: 21 }}>
            <SprintView sprint={result} />
          </div>
        )}
      </div>

      <div>
        <div className="glass-card p-6">
          <h3 style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 13 }}>
            Sprint Optimizations
          </h3>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
            ORKA's sprint scheduling balances workload capacity, cognitive context switching, and deadline critical paths automatically.
          </p>
          <div style={{ padding: 13, background: 'rgba(99,102,241,0.06)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: 4 }}>💡 Pro Tip</p>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Group similar tasks on adjacent days to minimize context switching overhead across team members.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SprintSkeleton() {
  return (
    <div style={{ display: 'flex', gap: 13, overflowX: 'auto', paddingBottom: 13 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="glass-card p-5" style={{ minWidth: 200, flex: '1 0 200px' }}>
          <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 13 }} />
          <div className="skeleton" style={{ height: 60, marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 60, marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 24, width: '40%' }} />
        </div>
      ))}
    </div>
  )
}

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
      <div style={{ marginBottom: 34 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <h1 className="section-title">AI Sprint Planner</h1>
          <Badge variant="blue">Automated Schedule</Badge>
        </div>
        <p className="section-subtitle">Intelligent sprint scheduling and daily task capacity distribution</p>
      </div>

      <div className="tab-bar mb-6" style={{ maxWidth: 340 }}>
        <button className={`tab-btn ${tab === 0 ? 'active' : ''}`} onClick={() => setTab(0)}>Current Sprint</button>
        <button className={`tab-btn ${tab === 1 ? 'active' : ''}`} onClick={() => setTab(1)}>Generate New</button>
      </div>

      {tab === 0 && (
        <div>
          {error && <OfflineBanner />}
          {loading ? <SprintSkeleton /> : sprint ? <SprintView sprint={sprint} /> : (
            <div className="glass-card p-8 text-center">
              <CalendarDays size={36} color="var(--text-muted)" style={{ margin: '0 auto 13px' }} />
              <p style={{ color: 'var(--text-secondary)' }}>No active sprint found. Generate one!</p>
            </div>
          )}
        </div>
      )}

      {tab === 1 && <GenerateForm />}
    </div>
  )
}

