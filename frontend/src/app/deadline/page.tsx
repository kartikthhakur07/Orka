'use client'

import { useEffect, useState } from 'react'
import { getDeadline } from '@/lib/api'
import { Shield, AlertTriangle, Clock, TrendingUp, CheckSquare, Zap } from 'lucide-react'

/* ── helpers ──────────────────────────────────────────────────────────── */
function OfflineBanner() {
  return (
    <div className="offline-banner flex items-center gap-3 mb-4">
      <AlertTriangle size={16} />
      <p style={{ fontSize: '0.85rem' }}>Backend offline — run: <code style={{ background: 'rgba(239,68,68,0.15)', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace' }}>uvicorn main:app --reload</code></p>
    </div>
  )
}

function getRiskColor(risk: number): string {
  if (risk >= 70) return '#ef4444'
  if (risk >= 40) return '#eab308'
  return '#22c55e'
}

function getRiskLabel(risk: number): string {
  if (risk >= 70) return 'Critical Risk'
  if (risk >= 40) return 'At Risk'
  return 'On Track'
}

/* ── Gradient Risk Bar ────────────────────────────────────────────────── */
function RiskBar({ value }: { value: number }) {
  const color = getRiskColor(value)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Risk Level</span>
        <span style={{ fontSize: '0.85rem', color, fontWeight: 700 }}>{value}%</span>
      </div>
      <div className="risk-bar-track">
        <div
          className="risk-bar-fill"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

/* ── Project Card ─────────────────────────────────────────────────────── */
function ProjectCard({ project, idx }: { project: any; idx: number }) {
  const risk       = project.risk_percentage ?? project.risk ?? project.risk_score ?? 0
  const daysLeft   = project.days_remaining ?? project.days_left ?? 0
  const tasksTotal = project.total_tasks ?? project.tasks_total ?? 0
  const tasksDone  = project.completed_tasks ?? project.tasks_done ?? 0
  const velocity   = project.velocity ?? project.completion_rate ?? null
  const reco       = project.recommendation ?? project.ai_recommendation ?? ''
  const isAtRisk   = risk >= 40
  const isCritical = risk >= 70
  const riskColor  = getRiskColor(risk)

  return (
    <div
      className={`glass-card p-6 animate-fade-in-up ${isCritical ? 'glass-card-critical' : ''}`}
      style={{ opacity: 0, animationFillMode: 'forwards', animationDelay: `${idx * 80}ms` }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            {project.name || project.project || 'Unnamed Project'}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {project.team || ''}{project.manager ? ` · ${project.manager}` : ''}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <span style={{
            fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: 99,
            background: `${riskColor}15`, color: riskColor, border: `1px solid ${riskColor}30`,
            display: 'flex', alignItems: 'center', gap: 4
          }}>
            {isCritical ? '🔴' : risk >= 40 ? '🟡' : '🟢'} {getRiskLabel(risk)}
          </span>
          {daysLeft > 0 && (
            <span style={{
              fontSize: '0.7rem', padding: '3px 8px', borderRadius: 99,
              background: daysLeft < 5 ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.06)',
              color: daysLeft < 5 ? '#ef4444' : 'var(--text-muted)',
              border: `1px solid ${daysLeft < 5 ? 'rgba(239,68,68,0.25)' : 'var(--border-subtle)'}`,
              display: 'flex', alignItems: 'center', gap: 4
            }}>
              <Clock size={10} /> {daysLeft}d left
            </span>
          )}
        </div>
      </div>

      {/* Risk Bar */}
      <div style={{ marginBottom: 16 }}>
        <RiskBar value={risk} />
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
            <CheckSquare size={12} color="var(--accent-teal)" />
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Progress</span>
          </div>
          <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {tasksDone}<span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>/{tasksTotal}</span>
          </p>
          <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>tasks done</p>
        </div>
        {velocity !== null && (
          <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
              <TrendingUp size={12} color="var(--accent-purple)" />
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Velocity</span>
            </div>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {typeof velocity === 'number' ? velocity.toFixed(1) : velocity}
            </p>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>tasks/day</p>
          </div>
        )}
      </div>

      {/* Progress bar for tasks */}
      {tasksTotal > 0 && (
        <div style={{ marginBottom: reco ? 16 : 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Completion</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-teal)', fontWeight: 600 }}>
              {Math.round((tasksDone / tasksTotal) * 100)}%
            </span>
          </div>
          <div className="score-bar">
            <div className="score-bar-fill" style={{
              '--target-width': `${Math.round((tasksDone / tasksTotal) * 100)}%`,
              background: 'linear-gradient(90deg, var(--accent-teal)70, var(--accent-teal))'
            } as any} />
          </div>
        </div>
      )}

      {/* AI Recommendation */}
      {reco && (
        <div style={{
          marginTop: 12, padding: '12px 14px', borderRadius: 10,
          background: isAtRisk ? 'rgba(249,115,22,0.07)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${isAtRisk ? 'rgba(249,115,22,0.25)' : 'var(--border-subtle)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Zap size={12} color={isAtRisk ? 'var(--accent-orange)' : 'var(--text-muted)'} />
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: isAtRisk ? 'var(--accent-orange)' : 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              AI Recommendation
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{reco}</p>
        </div>
      )}
    </div>
  )
}

/* ── Summary Stats ────────────────────────────────────────────────────── */
function SummaryBar({ projects }: { projects: any[] }) {
  const critical = projects.filter(p => (p.risk_percentage ?? p.risk ?? 0) >= 70).length
  const atRisk   = projects.filter(p => { const r = p.risk_percentage ?? p.risk ?? 0; return r >= 40 && r < 70 }).length
  const onTrack  = projects.filter(p => (p.risk_percentage ?? p.risk ?? 0) < 40).length

  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
      {[
        { label: 'Critical', count: critical, color: '#ef4444' },
        { label: 'At Risk',  count: atRisk,   color: '#eab308' },
        { label: 'On Track', count: onTrack,  color: '#22c55e' },
      ].map(s => (
        <div key={s.label} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
          borderRadius: 99, background: `${s.color}10`, border: `1px solid ${s.color}25`
        }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: s.color }}>{s.count}</span>
          <span style={{ fontSize: '0.8rem', color: s.color, fontWeight: 500 }}>{s.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Skeleton ─────────────────────────────────────────────────────────── */
function DeadlineSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="glass-card p-6">
          <div className="skeleton" style={{ height: 16, width: '70%', marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 20 }} />
          <div className="skeleton" style={{ height: 8, marginBottom: 16 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            <div className="skeleton" style={{ height: 70, borderRadius: 10 }} />
            <div className="skeleton" style={{ height: 70, borderRadius: 10 }} />
          </div>
          <div className="skeleton" style={{ height: 60, borderRadius: 10 }} />
        </div>
      ))}
    </div>
  )
}

/* ── Main ─────────────────────────────────────────────────────────────── */
export default function DeadlinePage() {
  const [data, setData]     = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(false)

  useEffect(() => {
    getDeadline()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const projects = [...(data?.projects || data?.deadlines || (Array.isArray(data) ? data : []))]
    .sort((a: any, b: any) => (b.risk_percentage ?? b.risk ?? 0) - (a.risk_percentage ?? a.risk ?? 0))

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Shield size={28} color="var(--accent-orange)" />
          Deadline Shield
        </h1>
        <p className="section-subtitle">Predict project failures before they happen — AI-powered deadline intelligence</p>
      </div>

      {error && <OfflineBanner />}

      {!loading && projects.length > 0 && <SummaryBar projects={projects} />}

      {loading ? <DeadlineSkeleton /> : projects.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <Shield size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No deadline data available</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {projects.map((p: any, i: number) => (
            <ProjectCard key={i} project={p} idx={i} />
          ))}
        </div>
      )}
    </div>
  )
}
