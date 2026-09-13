'use client'

import { useEffect, useState } from 'react'
import { getDashboard } from '@/lib/api'
import { StatCard } from '@/components/StatCard'
import { OfflineBanner } from '@/components/OfflineBanner'
import { Badge } from '@/components/Badge'
import {
  Users, CalendarDays, Flame, Home,
  CheckSquare, AlertTriangle, RefreshCw, Activity, BarChart2
} from 'lucide-react'

function getScoreColor(v: number, invertRisk = false): string {
  if (invertRisk) {
    if (v > 60) return '#ef4444'
    if (v > 35) return '#f59e0b'
    return '#10b981'
  }
  if (v >= 75) return '#10b981'
  if (v >= 45) return '#f59e0b'
  return '#ef4444'
}

/* ── Health Score Circle ──────────────────────────────────────────────── */
function HealthCircle({ score }: { score: number }) {
  const r = 28
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = getScoreColor(score)

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={72} height={72}>
        <circle cx={36} cy={36} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={5} />
        <circle
          cx={36} cy={36} r={r} fill="none"
          stroke={color} strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 36 36)"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)', filter: `drop-shadow(0 0 4px ${color}40)` }}
        />
      </svg>
      <span style={{
        position: 'absolute', fontSize: 'var(--font-sm)', fontWeight: 700, color,
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
      <HealthCircle score={health} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {project.name}
        </p>
        <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginBottom: 8 }}>
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
      <Badge variant={health >= 75 ? 'emerald' : health >= 45 ? 'amber' : 'crimson'}>
        {health >= 75 ? 'Healthy' : health >= 45 ? 'Watch' : 'At Risk'}
      </Badge>
    </div>
  )
}

/* ── Assignment Row ───────────────────────────────────────────────────── */
function AssignmentRow({ a, idx }: { a: any; idx: number }) {
  const initials = (a.assignee || a.assigned_to || 'UN')
    .split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)

  const colors = ['#6366f1', '#3b82f6', '#0d9488', '#10b981', '#f59e0b', '#ef4444']
  const bg = colors[idx % colors.length]

  return (
    <tr>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="avatar avatar-sm" style={{ background: `${bg}20`, color: bg, borderColor: `${bg}40` }}>
            {initials}
          </div>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            {a.assignee || a.assigned_to || '—'}
          </span>
        </div>
      </td>
      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {a.task || a.title || '—'}
      </td>
      <td>
        <Badge variant={
          a.priority === 'Critical' ? 'crimson' :
          a.priority === 'High' ? 'amber' :
          a.priority === 'Medium' ? 'cobalt' : 'teal'
        }>
          {a.priority || 'Medium'}
        </Badge>
      </td>
      <td style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
        {a.confidence ? `${Math.round(a.confidence * 100)}%` : '—'}
      </td>
    </tr>
  )
}

/* ── Main Dashboard Page ──────────────────────────────────────────────── */
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
    { label: 'WFH Rate',       value: data.wfh_rate       ?? data.wfhRate       ?? 0, icon: Home,          delay: 240, color: '#6366f1' },
    { label: 'Active Tasks',   value: data.active_tasks   ?? data.activeTasks   ?? 0, icon: CheckSquare,   delay: 320, unit: '', color: '#0d9488' },
    { label: 'Risk Score',     value: data.risk_score     ?? data.riskScore     ?? 0, icon: AlertTriangle, delay: 400, invertRisk: true },
  ] : []

  const projects  = data?.projects  || data?.project_health || []
  const assignments = data?.recent_assignments || data?.assignments || []

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
        <div>
          <h1 className="section-title">
            🎯 Executive Dashboard
          </h1>
          <p className="section-subtitle">
            Real-time organizational intelligence powered by IBM HR Analytics & 5-Factor AI algorithms
          </p>
        </div>
        <button className="btn-secondary" onClick={refresh} disabled={refreshing} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {/* Connection Offline Banner */}
      {error && <div style={{ marginBottom: 'var(--space-3)' }}><OfflineBanner /></div>}

      {/* Stat Cards Grid (Golden Ratio Spacing) */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-5" style={{ height: 120 }}>
              <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 16 }} />
              <div className="skeleton" style={{ height: 36, width: '40%' }} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      )}

      {/* Golden Ratio Split Grid: Projects vs Recent Assignments */}
      {!loading && (
        <div className="golden-grid">
          {/* Main 61.8% Column: Project Health */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Activity size={18} color="var(--accent-indigo)" />
              <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
                Project Health
              </h2>
              <Badge variant="indigo">{projects.length} active</Badge>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-2)' }}>
              {projects.map((p: any, i: number) => (
                <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms`, opacity: 0, animationFillMode: 'forwards' }}>
                  <ProjectCard project={p} />
                </div>
              ))}
            </div>
          </div>

          {/* Side 38.2% Column: Recent Assignments */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <BarChart2 size={18} color="var(--accent-cobalt)" />
              <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
                Task Assignments
              </h2>
            </div>
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <table className="orka-table">
                <thead>
                  <tr>
                    <th>Assignee</th>
                    <th>Task</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.slice(0, 6).map((a: any, i: number) => (
                    <AssignmentRow key={i} a={a} idx={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
