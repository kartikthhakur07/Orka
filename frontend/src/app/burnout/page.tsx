'use client'

import { useEffect, useState } from 'react'
import { getBurnout } from '@/lib/api'
import OfflineBanner from '@/components/OfflineBanner'
import Badge from '@/components/Badge'
import StatCard from '@/components/StatCard'
import { Flame, Coffee, Brain, Clock, Repeat, ShieldCheck, AlertTriangle } from 'lucide-react'

function getRiskLevel(score: number): { label: string; color: string; level: 'critical' | 'warning' | 'safe'; variant: 'red' | 'yellow' | 'green' } {
  if (score >= 70) return { label: 'Critical', color: '#ef4444', level: 'critical', variant: 'red' }
  if (score >= 45) return { label: 'Watch',    color: '#f59e0b', level: 'warning', variant: 'yellow' }
  return               { label: 'Safe',     color: '#10b981', level: 'safe',     variant: 'green' }
}

function BurnoutGauge({ score }: { score: number }) {
  const risk = getRiskLevel(score)
  const r = 42; const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={108} height={108}>
        <circle cx={54} cy={54} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
        <circle
          cx={54} cy={54} r={r} fill="none"
          stroke={risk.color} strokeWidth={8} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 54 54)"
          style={{
            transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)',
            filter: `drop-shadow(0 0 8px ${risk.color}40)`
          }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: risk.color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>score</div>
      </div>
    </div>
  )
}

function SubBar({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon size={13} color={color} />
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
        </div>
        <span style={{ fontSize: 'var(--font-xs)', color, fontWeight: 700 }}>{value}</span>
      </div>
      <div className="score-bar">
        <div className="score-bar-fill" style={{
          '--target-width': `${Math.min(value, 100)}%`,
          background: `linear-gradient(90deg, ${color}60, ${color})`
        } as any} />
      </div>
    </div>
  )
}

function MemberCard({ member, idx }: { member: any; idx: number }) {
  const score  = member.burnout_score ?? member.score ?? 0
  const risk   = getRiskLevel(score)
  const isCrit = risk.level === 'critical'

  const avatarColors = ['#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#8b5cf6']
  const avatarBg = avatarColors[idx % avatarColors.length]
  const initials = (member.name || 'UN').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)

  const recommendations: string[] = member.recommendations || member.actions || []

  return (
    <div
      className={`glass-card p-6 animate-fade-in-up ${isCrit ? 'glass-card-critical' : ''}`}
      style={{ opacity: 0, animationFillMode: 'forwards', animationDelay: `${idx * 80}ms` }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 21 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="avatar" style={{ background: `${avatarBg}20`, color: avatarBg }}>
            {initials}
          </div>
          <div>
            <p style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>{member.name || '—'}</p>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{member.role || 'Team Member'}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isCrit && <span className="status-dot critical" />}
          <Badge variant={risk.variant}>{risk.label}</Badge>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 21 }}>
        <BurnoutGauge score={score} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 21 }}>
        <SubBar label="Stress Score"      value={member.stress_score      ?? member.stress    ?? 0}  icon={Flame}  color="#ef4444" />
        <SubBar label="Focus Hours"       value={member.focus_hours       ?? member.focus     ?? 0}  icon={Brain}  color="#6366f1" />
        <SubBar label="Meeting Load"      value={member.meeting_load      ?? member.meetings  ?? 0}  icon={Clock}  color="#f59e0b" />
        <SubBar label="Context Switches"  value={member.context_switches  ?? member.switches  ?? 0}  icon={Repeat} color="#3b82f6" />
      </div>

      {recommendations.length > 0 && (
        <div style={{
          padding: '12px 14px', borderRadius: 10,
          background: isCrit ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.02)',
          border: `1px solid ${isCrit ? 'rgba(239,68,68,0.15)' : 'var(--border-subtle)'}`,
        }}>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
            AI Recommendations
          </p>
          {recommendations.slice(0, 3).map((r: string, i: number) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
              <Coffee size={12} color={risk.color} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{r}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function BurnoutSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 21 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card p-6">
          <div style={{ display: 'flex', gap: 12, marginBottom: 21 }}>
            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 12, width: '40%' }} />
            </div>
          </div>
          <div className="skeleton" style={{ width: 108, height: 108, borderRadius: '50%', margin: '0 auto 21px' }} />
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} style={{ marginBottom: 12 }}>
              <div className="skeleton" style={{ height: 12, marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 6 }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function BurnoutPage() {
  const [data, setData]     = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(false)

  useEffect(() => {
    getBurnout()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const members = data?.members || data?.team || (Array.isArray(data) ? data : [])
  const safeCount = members.filter((m: any) => (m.burnout_score ?? m.score ?? 0) < 45).length
  const watchCount = members.filter((m: any) => { const s = m.burnout_score ?? m.score ?? 0; return s >= 45 && s < 70 }).length
  const critCount = members.filter((m: any) => (m.burnout_score ?? m.score ?? 0) >= 70).length

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 34 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <h1 className="section-title">Burnout Radar</h1>
            <Badge variant="purple">Wellness AI</Badge>
          </div>
          <p className="section-subtitle">Real-time team cognitive overload monitoring & proactive intervention signals</p>
        </div>
        {critCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <span className="status-dot critical" />
            <span style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: '#ef4444' }}>
              {critCount} Action Required
            </span>
          </div>
        )}
      </div>

      {!loading && !error && members.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 13, marginBottom: 34 }}>
          <StatCard title="Healthy Team Members" value={safeCount} icon={ShieldCheck} badge={{ text: 'Safe', variant: 'green' }} />
          <StatCard title="Moderate Stress Watch" value={watchCount} icon={Brain} badge={{ text: 'Monitoring', variant: 'yellow' }} />
          <StatCard title="High Risk Critical" value={critCount} icon={AlertTriangle} badge={{ text: 'Immediate Action', variant: 'red' }} />
        </div>
      )}

      {error && <OfflineBanner />}

      {loading ? <BurnoutSkeleton /> : (
        members.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <Flame size={36} color="var(--text-muted)" style={{ margin: '0 auto 13px' }} />
            <p style={{ color: 'var(--text-secondary)' }}>No burnout telemetry data available</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 21 }}>
            {[...members]
              .sort((a: any, b: any) => (b.burnout_score ?? b.score ?? 0) - (a.burnout_score ?? a.score ?? 0))
              .map((m: any, i: number) => (
                <MemberCard key={i} member={m} idx={i} />
              ))
            }
          </div>
        )
      )}
    </div>
  )
}

