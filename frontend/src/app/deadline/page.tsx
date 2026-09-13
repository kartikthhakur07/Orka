'use client'

import { useEffect, useState } from 'react'
import { getDeadline } from '@/lib/api'
import OfflineBanner from '@/components/OfflineBanner'
import Badge from '@/components/Badge'
import StatCard from '@/components/StatCard'
import { Shield, AlertTriangle, Clock, TrendingUp, CheckSquare, Zap, CheckCircle2 } from 'lucide-react'

function getRiskColor(risk: number): { color: string; variant: 'red' | 'yellow' | 'green' } {
  if (risk >= 70) return { color: '#ef4444', variant: 'red' }
  if (risk >= 40) return { color: '#f59e0b', variant: 'yellow' }
  return { color: '#10b981', variant: 'green' }
}

function getRiskLabel(risk: number): string {
  if (risk >= 70) return 'Critical Risk'
  if (risk >= 40) return 'At Risk'
  return 'On Track'
}

function RiskBar({ value }: { value: number }) {
  const riskObj = getRiskColor(value)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 500 }}>Slippage Risk Level</span>
        <span style={{ fontSize: 'var(--font-xs)', color: riskObj.color, fontWeight: 700 }}>{value}%</span>
      </div>
      <div className="risk-bar-track">
        <div
          className="risk-bar-fill"
          style={{ width: `${value}%`, background: `linear-gradient(90deg, ${riskObj.color}60, ${riskObj.color})` }}
        />
      </div>
    </div>
  )
}

function ProjectCard({ project, idx }: { project: any; idx: number }) {
  const risk       = project.risk_percentage ?? project.risk ?? project.risk_score ?? 0
  const daysLeft   = project.days_remaining ?? project.days_left ?? 0
  const tasksTotal = project.total_tasks ?? project.tasks_total ?? 0
  const tasksDone  = project.completed_tasks ?? project.tasks_done ?? 0
  const velocity   = project.velocity ?? project.completion_rate ?? null
  const reco       = project.recommendation ?? project.ai_recommendation ?? ''
  const isAtRisk   = risk >= 40
  const isCritical = risk >= 70
  const riskObj    = getRiskColor(risk)

  return (
    <div
      className={`glass-card p-6 animate-fade-in-up ${isCritical ? 'glass-card-critical' : ''}`}
      style={{ opacity: 0, animationFillMode: 'forwards', animationDelay: `${idx * 80}ms` }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            {project.name || project.project || 'Unnamed Project'}
          </h3>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
            {project.team || ''}{project.manager ? ` · ${project.manager}` : ''}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <Badge variant={riskObj.variant}>{getRiskLabel(risk)}</Badge>
          {daysLeft > 0 && (
            <span style={{
              fontSize: 'var(--font-xs)', padding: '3px 8px', borderRadius: 99,
              background: daysLeft < 5 ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)',
              color: daysLeft < 5 ? '#ef4444' : 'var(--text-muted)',
              border: `1px solid ${daysLeft < 5 ? 'rgba(239,68,68,0.2)' : 'var(--border-subtle)'}`,
              display: 'flex', alignItems: 'center', gap: 4
            }}>
              <Clock size={10} /> {daysLeft}d left
            </span>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <RiskBar value={risk} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <CheckSquare size={12} color="var(--accent-primary)" />
            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tasks</span>
          </div>
          <p style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
            {tasksDone}<span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 400 }}>/{tasksTotal}</span>
          </p>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>completed</p>
        </div>
        {velocity !== null && (
          <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <TrendingUp size={12} color="#3b82f6" />
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Velocity</span>
            </div>
            <p style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
              {typeof velocity === 'number' ? velocity.toFixed(1) : velocity}
            </p>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>tasks / day</p>
          </div>
        )}
      </div>

      {tasksTotal > 0 && (
        <div style={{ marginBottom: reco ? 16 : 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Completion Rate</span>
            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--accent-primary)', fontWeight: 600 }}>
              {Math.round((tasksDone / tasksTotal) * 100)}%
            </span>
          </div>
          <div className="score-bar">
            <div className="score-bar-fill" style={{
              '--target-width': `${Math.round((tasksDone / tasksTotal) * 100)}%`,
              background: 'linear-gradient(90deg, var(--accent-primary)70, var(--accent-primary))'
            } as any} />
          </div>
        </div>
      )}

      {reco && (
        <div style={{
          marginTop: 14, padding: '12px 14px', borderRadius: 10,
          background: isAtRisk ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.02)',
          border: `1px solid ${isAtRisk ? 'rgba(99,102,241,0.2)' : 'var(--border-subtle)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Zap size={12} color="var(--accent-primary)" />
            <span style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              AI Intelligence Note
            </span>
          </div>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{reco}</p>
        </div>
      )}
    </div>
  )
}

function DeadlineSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 21 }}>
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

  const critical = projects.filter(p => (p.risk_percentage ?? p.risk ?? 0) >= 70).length
  const atRisk   = projects.filter(p => { const r = p.risk_percentage ?? p.risk ?? 0; return r >= 40 && r < 70 }).length
  const onTrack  = projects.filter(p => (p.risk_percentage ?? p.risk ?? 0) < 40).length

  return (
    <div>
      <div style={{ marginBottom: 34 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <h1 className="section-title">Deadline Shield</h1>
          <Badge variant="blue">Predictive Intelligence</Badge>
        </div>
        <p className="section-subtitle">Predict project bottlenecks before they occur — AI risk modeling & velocity forecasting</p>
      </div>

      {error && <OfflineBanner />}

      {!loading && projects.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 13, marginBottom: 34 }}>
          <StatCard title="Critical Risk Projects" value={critical} icon={AlertTriangle} badge={{ text: 'Action Needed', variant: 'red' }} />
          <StatCard title="At Risk Warnings" value={atRisk} icon={Clock} badge={{ text: 'Monitoring', variant: 'yellow' }} />
          <StatCard title="On Track Projects" value={onTrack} icon={CheckCircle2} badge={{ text: 'Healthy', variant: 'green' }} />
        </div>
      )}

      {loading ? <DeadlineSkeleton /> : projects.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <Shield size={36} color="var(--text-muted)" style={{ margin: '0 auto 13px' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No deadline monitoring telemetry available</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 21 }}>
          {projects.map((p: any, i: number) => (
            <ProjectCard key={i} project={p} idx={i} />
          ))}
        </div>
      )}
    </div>
  )
}

