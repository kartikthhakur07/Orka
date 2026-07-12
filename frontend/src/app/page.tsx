'use client'

import { useEffect, useState, useRef } from 'react'
import { getDashboard } from '@/lib/api'
import {
  Users, CalendarDays, Flame, Home,
  CheckSquare, AlertTriangle, TrendingUp,
  RefreshCw, Activity, BarChart2
} from 'lucide-react'

/* ── helpers ──────────────────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!target) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setVal(Math.floor(p * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return val
}

function getScoreColor(v: number, invertRisk = false): string {
  if (invertRisk) {
    if (v > 60) return '#ef4444'
    if (v > 35) return '#eab308'
    return '#22c55e'
  }
  if (v >= 75) return '#22c55e'
  if (v >= 45) return '#eab308'
  return '#ef4444'
}

/* ── Stat Card ────────────────────────────────────────────────────────── */
function StatCard({
  label, value, unit = '%', icon: Icon, color, delay = 0, invertRisk = false
}: {
  label: string; value: number; unit?: string; icon: any;
  color?: string; delay?: number; invertRisk?: boolean
}) {
  const displayed = useCountUp(value, 1000)
  const c = color || getScoreColor(value, invertRisk)

  return (
    <div
      className="glass-card p-5 flex flex-col gap-3 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, opacity: 0, animationFillMode: 'forwards' }}
    >
      <div className="flex items-center justify-between">
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {label}
        </span>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: `${c}18`,
          border: `1px solid ${c}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={16} color={c} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: '2.2rem', fontWeight: 800, color: c, lineHeight: 1, letterSpacing: '-0.03em' }}>
          {displayed}
        </span>
        <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>{unit}</span>
      </div>
      <div className="score-bar">
        <div
          className="score-bar-fill"
          style={{
            '--target-width': `${Math.min(value, 100)}%`,
            '--delay': `${delay}ms`,
            background: `linear-gradient(90deg, ${c}80, ${c})`,
          } as any}
        />
      </div>
    </div>
  )
}

/* ── Health Score Circle ──────────────────────────────────────────────── */
function HealthCircle({ score, name }: { score: number; name: string }) {
  const r = 28
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = getScoreColor(score)

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={72} height={72}>
        <circle cx={36} cy={36} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
        <circle
          cx={36} cy={36} r={r} fill="none"
          stroke={color} strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 36 36)"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)', filter: `drop-shadow(0 0 4px ${color}60)` }}
        />
      </svg>
      <span style={{
        position: 'absolute', fontSize: '0.85rem', fontWeight: 700, color,
      }}>
        {score}
      </span>
    </div>
  )
}

/* ── Project Health Card ──────────────────────────────────────────────── */
function ProjectCard({ project }: { project: any }) {
  const health = project.health_score ?? project.health ?? 0
  const color = getScoreColor(health)

  return (
    <div className="glass-card p-4 flex items-center gap-4">
      <HealthCircle score={health} name={project.name} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {project.name}
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>
          {project.status || 'Active'}
        </p>
        <div className="score-bar">
          <div
            className="score-bar-fill"
            style={{
              '--target-width': `${health}%`,
              background: `linear-gradient(90deg, ${color}70, ${color})`,
            } as any}
          />
        </div>
      </div>
      <div style={{
        fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px',
        borderRadius: 99, background: `${color}18`, color, border: `1px solid ${color}30`
      }}>
        {health >= 75 ? 'Healthy' : health >= 45 ? 'Watch' : 'At Risk'}
      </div>
    </div>
  )
}

/* ── Assignment Row ───────────────────────────────────────────────────── */
function AssignmentRow({ a, idx }: { a: any; idx: number }) {
  const initials = (a.assignee || a.assigned_to || 'UN')
    .split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)

  const colors = ['#f97316', '#a855f7', '#14b8a6', '#22c55e', '#eab308', '#ef4444']
  const bg = colors[idx % colors.length]

  return (
    <tr>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="avatar avatar-sm" style={{ background: `${bg}25`, color: bg }}>
            {initials}
          </div>
          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
            {a.assignee || a.assigned_to || '—'}
          </span>
        </div>
      </td>
      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {a.task || a.title || '—'}
      </td>
      <td>
        <span className={`badge badge-${
          a.priority === 'Critical' ? 'red' :
          a.priority === 'High' ? 'orange' :
          a.priority === 'Medium' ? 'yellow' : 'teal'
        }`}>
          {a.priority || 'Medium'}
        </span>
      </td>
      <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        {a.confidence ? `${Math.round(a.confidence * 100)}%` : '—'}
      </td>
    </tr>
  )
}

/* ── Offline Banner ───────────────────────────────────────────────────── */
function OfflineBanner() {
  return (
    <div className="offline-banner flex items-center gap-3">
      <AlertTriangle size={18} />
      <div>
        <p style={{ fontWeight: 600, marginBottom: 2 }}>Backend Offline</p>
        <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>
          Start backend with: <code style={{ background: 'rgba(239,68,68,0.15)', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace' }}>uvicorn main:app --reload</code>
        </p>
      </div>
    </div>
  )
}

/* ── Skeleton ─────────────────────────────────────────────────────────── */
function SkeletonCards() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass-card p-5" style={{ height: 120 }}>
          <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 16 }} />
          <div className="skeleton" style={{ height: 36, width: '40%', marginBottom: 16 }} />
          <div className="skeleton" style={{ height: 6, width: '100%' }} />
        </div>
      ))}
    </div>
  )
}

/* ── Main Page ────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const load = async () => {
    try {
      setError(false)
      const res = await getDashboard()
      setData(res)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { load() }, [])

  const refresh = () => { setRefreshing(true); load() }

  const stats = data ? [
    { label: 'Team Health',    value: data.team_health    ?? data.teamHealth    ?? 0, icon: Users,         delay: 0   },
    { label: 'Sprint Progress',value: data.sprint_progress ?? data.sprintProgress ?? 0, icon: CalendarDays, delay: 80  },
    { label: 'Burnout Index',  value: data.burnout_index  ?? data.burnoutIndex  ?? 0, icon: Flame,         delay: 160, invertRisk: true },
    { label: 'WFH Rate',       value: data.wfh_rate       ?? data.wfhRate       ?? 0, icon: Home,          delay: 240, color: '#a855f7' },
    { label: 'Active Tasks',   value: data.active_tasks   ?? data.activeTasks   ?? 0, icon: CheckSquare,   delay: 320, unit: '', color: '#14b8a6' },
    { label: 'Risk Score',     value: data.risk_score     ?? data.riskScore     ?? 0, icon: AlertTriangle, delay: 400, invertRisk: true },
  ] : []

  const projects  = data?.projects  || data?.project_health || []
  const assignments = data?.recent_assignments || data?.assignments || []

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '1.75rem' }}>
            🎯 Executive Dashboard
          </h1>
          <p className="section-subtitle" style={{ marginTop: 6 }}>
            Real-time intelligence across your entire organization
          </p>
        </div>
        <button className="btn-secondary" onClick={refresh} disabled={refreshing} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {/* ── Error ── */}
      {error && <div style={{ marginBottom: 20 }}><OfflineBanner /></div>}

      {/* ── Stat Cards ── */}
      {loading ? <SkeletonCards /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      )}

      {/* ── Project Health ── */}
      {!loading && projects.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Activity size={18} color="var(--accent-orange)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Project Health
            </h2>
            <span className="badge badge-orange">{projects.length} active</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {projects.map((p: any, i: number) => (
              <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms`, opacity: 0, animationFillMode: 'forwards' }}>
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Recent Assignments ── */}
      {!loading && assignments.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <BarChart2 size={18} color="var(--accent-purple)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Recent Task Assignments
            </h2>
          </div>
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <table className="orka-table">
              <thead>
                <tr>
                  <th>Assignee</th>
                  <th>Task</th>
                  <th>Priority</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {assignments.slice(0, 8).map((a: any, i: number) => (
                  <AssignmentRow key={i} a={a} idx={i} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && projects.length === 0 && assignments.length === 0 && (
        <div className="glass-card p-10 text-center">
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🚀</div>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
            Dashboard loaded — start your backend and add some data!
          </p>
        </div>
      )}
    </div>
  )
}