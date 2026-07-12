'use client'

import { useEffect, useState } from 'react'
import { getBurnout } from '@/lib/api'
import { Flame, AlertTriangle, Coffee, Brain, Clock, Repeat } from 'lucide-react'

/* ── helpers ──────────────────────────────────────────────────────────── */
function OfflineBanner() {
  return (
    <div className="offline-banner flex items-center gap-3 mb-4">
      <AlertTriangle size={16} />
      <p style={{ fontSize: '0.85rem' }}>Backend offline — run: <code style={{ background: 'rgba(239,68,68,0.15)', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace' }}>uvicorn main:app --reload</code></p>
    </div>
  )
}

function getRiskLevel(score: number): { label: string; color: string; emoji: string; level: string } {
  if (score >= 70) return { label: 'Critical', color: '#ef4444', emoji: '🔴', level: 'critical' }
  if (score >= 45) return { label: 'Watch',    color: '#eab308', emoji: '🟡', level: 'warning' }
  return               { label: 'Safe',     color: '#22c55e', emoji: '🟢', level: 'safe' }
}

/* ── Circular Gauge ───────────────────────────────────────────────────── */
function BurnoutGauge({ score }: { score: number }) {
  const risk = getRiskLevel(score)
  const r = 42; const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={108} height={108}>
        {/* Background track */}
        <circle cx={54} cy={54} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
        {/* Progress */}
        <circle
          cx={54} cy={54} r={r} fill="none"
          stroke={risk.color} strokeWidth={8} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 54 54)"
          style={{
            transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)',
            filter: `drop-shadow(0 0 8px ${risk.color}50)`
          }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: risk.color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>score</div>
      </div>
    </div>
  )
}

/* ── Score Sub-bar ────────────────────────────────────────────────────── */
function SubBar({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon size={12} color={color} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
        </div>
        <span style={{ fontSize: '0.75rem', color, fontWeight: 700 }}>{value}</span>
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

/* ── Member Card ──────────────────────────────────────────────────────── */
function MemberCard({ member, idx }: { member: any; idx: number }) {
  const score  = member.burnout_score ?? member.score ?? 0
  const risk   = getRiskLevel(score)
  const isCrit = risk.level === 'critical'

  const avatarColors = ['#f97316', '#a855f7', '#14b8a6', '#22c55e', '#eab308']
  const avatarBg = avatarColors[idx % avatarColors.length]
  const initials = (member.name || 'UN').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)

  const recommendations: string[] = member.recommendations || member.actions || []

  return (
    <div
      className={`glass-card p-5 animate-fade-in-up ${isCrit ? 'glass-card-critical' : ''}`}
      style={{ opacity: 0, animationFillMode: 'forwards', animationDelay: `${idx * 80}ms` }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="avatar" style={{ background: `${avatarBg}25`, color: avatarBg }}>
            {initials}
          </div>
          <div>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{member.name || '—'}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.role || 'Team Member'}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isCrit && <span className="status-dot critical" />}
          <span style={{
            fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: 99,
            background: `${risk.color}15`, color: risk.color, border: `1px solid ${risk.color}30`
          }}>
            {risk.emoji} {risk.label}
          </span>
        </div>
      </div>

      {/* Gauge centered */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <BurnoutGauge score={score} />
      </div>

      {/* Sub-scores */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        <SubBar label="Stress Score"      value={member.stress_score      ?? member.stress    ?? 0}  icon={Flame}  color="#ef4444" />
        <SubBar label="Focus Hours"       value={member.focus_hours       ?? member.focus     ?? 0}  icon={Brain}  color="#a855f7" />
        <SubBar label="Meeting Load"      value={member.meeting_load      ?? member.meetings  ?? 0}  icon={Clock}  color="#eab308" />
        <SubBar label="Context Switches"  value={member.context_switches  ?? member.switches  ?? 0}  icon={Repeat} color="#f97316" />
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div style={{
          padding: '10px 12px', borderRadius: 10,
          background: isCrit ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${isCrit ? 'rgba(239,68,68,0.15)' : 'var(--border-subtle)'}`,
        }}>
          <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
            AI Recommendations
          </p>
          {recommendations.slice(0, 3).map((r: string, i: number) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
              <Coffee size={11} color={risk.color} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{r}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Skeleton ─────────────────────────────────────────────────────────── */
function BurnoutSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card p-5">
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 10, width: '40%' }} />
            </div>
          </div>
          <div className="skeleton" style={{ width: 108, height: 108, borderRadius: '50%', margin: '0 auto 16px' }} />
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} style={{ marginBottom: 10 }}>
              <div className="skeleton" style={{ height: 10, marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 6 }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/* ── Main ─────────────────────────────────────────────────────────────── */
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
  const critCount = members.filter((m: any) => (m.burnout_score ?? m.score ?? 0) >= 70).length

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 className="section-title">🔥 Burnout Radar</h1>
          <p className="section-subtitle">Real-time team wellness monitoring and intervention signals</p>
        </div>
        {critCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <span className="status-dot critical" />
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ef4444' }}>
              {critCount} Critical
            </span>
          </div>
        )}
      </div>

      {/* Summary badges */}
      {!loading && !error && members.length > 0 && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 99, background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.20)' }}>
            <span className="status-dot safe" />
            <span style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: 600 }}>
              {members.filter((m: any) => (m.burnout_score ?? m.score ?? 0) < 45).length} Safe
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 99, background: 'rgba(234,179,8,0.10)', border: '1px solid rgba(234,179,8,0.20)' }}>
            <span className="status-dot warning" />
            <span style={{ fontSize: '0.8rem', color: '#eab308', fontWeight: 600 }}>
              {members.filter((m: any) => { const s = m.burnout_score ?? m.score ?? 0; return s >= 45 && s < 70 }).length} Watch
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 99, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.20)' }}>
            <span className="status-dot critical" />
            <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>
              {critCount} Critical
            </span>
          </div>
        </div>
      )}

      {error && <OfflineBanner />}

      {loading ? <BurnoutSkeleton /> : (
        members.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <Flame size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-secondary)' }}>No burnout data available</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
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
