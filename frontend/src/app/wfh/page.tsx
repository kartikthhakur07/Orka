'use client'

import { useEffect, useState } from 'react'
import { getWFH } from '@/lib/api'
import { Home, Building2, AlertTriangle, CheckCircle, Info } from 'lucide-react'

/* ── helpers ──────────────────────────────────────────────────────────── */
function OfflineBanner() {
  return (
    <div className="offline-banner flex items-center gap-3 mb-4">
      <AlertTriangle size={16} />
      <p style={{ fontSize: '0.85rem' }}>Backend offline — run: <code style={{ background: 'rgba(239,68,68,0.15)', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace' }}>uvicorn main:app --reload</code></p>
    </div>
  )
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

const AVATAR_COLORS = ['#f97316', '#a855f7', '#14b8a6', '#22c55e', '#eab308', '#ef4444', '#3b82f6']

function getInitials(name: string) {
  return (name || 'UN').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
}

function getDecisionColor(d: string): string {
  const lower = d?.toLowerCase() || ''
  if (lower.includes('wfh') || lower.includes('home') || lower.includes('remote')) return '#22c55e'
  if (lower.includes('office') || lower.includes('in-person')) return '#94a3b8'
  if (lower.includes('hybrid')) return '#a855f7'
  return '#94a3b8'
}

/* ── Weekly Calendar Grid ─────────────────────────────────────────────── */
function WeeklyGrid({ members }: { members: any[] }) {
  return (
    <div className="glass-card" style={{ overflow: 'hidden', marginBottom: 24 }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <CheckCircle size={16} color="var(--accent-teal)" />
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Weekly Schedule</span>
        <span className="badge badge-teal ml-2">This Week</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
          <thead>
            <tr>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid var(--border-subtle)', width: 160 }}>
                Member
              </th>
              {DAYS.map(d => (
                <th key={d} style={{ padding: '10px 8px', textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid var(--border-subtle)' }}>
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((m: any, i: number) => {
              const schedule: Record<string, boolean> = m.schedule || {}
              const wfhDays: string[] = m.wfh_days || m.recommended_days || []
              const avatarBg = AVATAR_COLORS[i % AVATAR_COLORS.length]

              return (
                <tr key={i} style={{ transition: 'background 150ms' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="avatar avatar-sm" style={{ background: `${avatarBg}25`, color: avatarBg }}>
                        {getInitials(m.name)}
                      </div>
                      <div>
                        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{m.name}</p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{m.role || ''}</p>
                      </div>
                    </div>
                  </td>
                  {DAYS.map(day => {
                    const isWFH = schedule[day] === true ||
                      schedule[day.toLowerCase()] === true ||
                      wfhDays.some((d: string) => d.toLowerCase().startsWith(day.toLowerCase()))

                    return (
                      <td key={day} style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
                        <div className={`wfh-cell ${isWFH ? 'wfh' : 'office'}`}>
                          {isWFH ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                              <Home size={10} /> WFH
                            </span>
                          ) : (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                              <Building2 size={10} /> Office
                            </span>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Member WFH Card ──────────────────────────────────────────────────── */
function WFHMemberCard({ member, idx }: { member: any; idx: number }) {
  const score = member.wfh_score ?? member.score ?? 0
  const decision = member.decision || member.recommendation || 'WFH'
  const decColor = getDecisionColor(decision)
  const avatarBg = AVATAR_COLORS[idx % AVATAR_COLORS.length]
  const initials = getInitials(member.name)

  const factors = member.factors || []
  const recommendedDays: string[] = member.recommended_days || member.wfh_days || []

  return (
    <div
      className="glass-card p-5 animate-fade-in-up"
      style={{ opacity: 0, animationFillMode: 'forwards', animationDelay: `${idx * 70}ms` }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="avatar" style={{ background: `${avatarBg}25`, color: avatarBg }}>
            {initials}
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{member.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.role || 'Team Member'}</p>
          </div>
        </div>
        <div style={{
          padding: '5px 12px', borderRadius: 99,
          background: `${decColor}15`, color: decColor,
          border: `1px solid ${decColor}30`,
          fontSize: '0.75rem', fontWeight: 700
        }}>
          {decision}
        </div>
      </div>

      {/* Score */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>WFH Suitability Score</span>
          <span style={{ fontSize: '0.85rem', color: decColor, fontWeight: 700 }}>{score}%</span>
        </div>
        <div className="score-bar" style={{ height: 8 }}>
          <div className="score-bar-fill" style={{
            '--target-width': `${score}%`,
            background: `linear-gradient(90deg, ${decColor}60, ${decColor})`
          } as any} />
        </div>
      </div>

      {/* Recommended Days */}
      {recommendedDays.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
            Recommended Days
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {recommendedDays.map((d: string) => (
              <span key={d} className="chip chip-green" style={{ fontSize: '0.72rem' }}>
                <Home size={9} /> {d}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Factors */}
      {factors.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
            Factor Breakdown
          </p>
          {factors.slice(0, 4).map((f: any, i: number) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {typeof f === 'string' ? f : f.name || f.factor}
                </span>
                {typeof f === 'object' && f.score !== undefined && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-teal)', fontWeight: 600 }}>{f.score}%</span>
                )}
              </div>
              {typeof f === 'object' && f.score !== undefined && (
                <div className="score-bar">
                  <div className="score-bar-fill" style={{
                    '--target-width': `${f.score}%`,
                    '--delay': `${i * 80}ms`,
                    background: 'linear-gradient(90deg, var(--accent-teal)60, var(--accent-teal))'
                  } as any} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Skeleton ─────────────────────────────────────────────────────────── */
function WFHSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card p-5">
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 10, width: '40%' }} />
            </div>
          </div>
          <div className="skeleton" style={{ height: 8, marginBottom: 16 }} />
          {Array.from({ length: 3 }).map((_, j) => (
            <div key={j} style={{ marginBottom: 10 }}>
              <div className="skeleton" style={{ height: 8, marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 6 }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/* ── Main ─────────────────────────────────────────────────────────────── */
export default function WFHPage() {
  const [data, setData]     = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(false)

  useEffect(() => {
    getWFH()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const members = data?.members || data?.team || (Array.isArray(data) ? data : [])
  const policy  = data?.policy || 'Government 2-Day WFH Policy Active'

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 className="section-title">🏠 WFH Decider</h1>
        <p className="section-subtitle">AI-powered work-from-home scheduling and optimization</p>
      </div>

      {/* Policy Banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 18px', borderRadius: 12, marginBottom: 24,
        background: 'rgba(20,184,166,0.08)',
        border: '1px solid rgba(20,184,166,0.20)'
      }}>
        <Info size={16} color="var(--accent-teal)" />
        <span style={{ fontSize: '0.875rem', color: 'var(--accent-teal)', fontWeight: 600 }}>
          📋 {policy}
        </span>
      </div>

      {error && <OfflineBanner />}

      {loading ? (
        <>
          <div className="skeleton" style={{ height: 200, borderRadius: 12, marginBottom: 24 }} />
          <WFHSkeleton />
        </>
      ) : members.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <Home size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No WFH data available</p>
        </div>
      ) : (
        <>
          {/* Weekly Grid */}
          <WeeklyGrid members={members} />

          {/* Member cards */}
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Home size={16} color="var(--accent-teal)" /> Member Details
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {members.map((m: any, i: number) => (
              <WFHMemberCard key={i} member={m} idx={i} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
