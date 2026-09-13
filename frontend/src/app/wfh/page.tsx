'use client'

import { useEffect, useState } from 'react'
import { getWFH } from '@/lib/api'
import OfflineBanner from '@/components/OfflineBanner'
import Badge from '@/components/Badge'
import StatCard from '@/components/StatCard'
import { Home, Building2, CheckCircle, Info, Calendar } from 'lucide-react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const AVATAR_COLORS = ['#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#8b5cf6', '#ec4899']

function getInitials(name: string) {
  return (name || 'UN').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
}

function getDecisionColor(d: string): { color: string; variant: 'green' | 'blue' | 'purple' } {
  const lower = d?.toLowerCase() || ''
  if (lower.includes('wfh') || lower.includes('home') || lower.includes('remote')) return { color: '#10b981', variant: 'green' }
  if (lower.includes('office') || lower.includes('in-person')) return { color: '#6366f1', variant: 'blue' }
  return { color: '#8b5cf6', variant: 'purple' }
}

function WeeklyGrid({ members }: { members: any[] }) {
  return (
    <div className="glass-card mb-8" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '16px 21px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <CheckCircle size={18} color="var(--accent-primary)" />
          <span style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>Weekly WFH Schedule Grid</span>
        </div>
        <Badge variant="blue">Current Week</Badge>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
          <thead>
            <tr>
              <th style={{ padding: '12px 21px', textAlign: 'left', fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid var(--border-subtle)', width: 180 }}>
                Member
              </th>
              {DAYS.map(d => (
                <th key={d} style={{ padding: '12px 10px', textAlign: 'center', fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid var(--border-subtle)' }}>
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
                  <td style={{ padding: '12px 21px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar avatar-sm" style={{ background: `${avatarBg}20`, color: avatarBg }}>
                        {getInitials(m.name)}
                      </div>
                      <div>
                        <p style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{m.name}</p>
                        <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{m.role || ''}</p>
                      </div>
                    </div>
                  </td>
                  {DAYS.map(day => {
                    const isWFH = schedule[day] === true ||
                      schedule[day.toLowerCase()] === true ||
                      wfhDays.some((d: string) => d.toLowerCase().startsWith(day.toLowerCase()))

                    return (
                      <td key={day} style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
                        <div className={`wfh-cell ${isWFH ? 'wfh' : 'office'}`}>
                          {isWFH ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                              <Home size={11} /> WFH
                            </span>
                          ) : (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                              <Building2 size={11} /> Office
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

function WFHMemberCard({ member, idx }: { member: any; idx: number }) {
  const score = member.wfh_score ?? member.score ?? 0
  const decision = member.decision || member.recommendation || 'WFH'
  const decObj = getDecisionColor(decision)
  const avatarBg = AVATAR_COLORS[idx % AVATAR_COLORS.length]
  const initials = getInitials(member.name)

  const factors = member.factors || []
  const recommendedDays: string[] = member.recommended_days || member.wfh_days || []

  return (
    <div
      className="glass-card p-6 animate-fade-in-up"
      style={{ opacity: 0, animationFillMode: 'forwards', animationDelay: `${idx * 70}ms` }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="avatar" style={{ background: `${avatarBg}20`, color: avatarBg }}>
            {initials}
          </div>
          <div>
            <p style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>{member.name}</p>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{member.role || 'Team Member'}</p>
          </div>
        </div>
        <Badge variant={decObj.variant}>{decision}</Badge>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 500 }}>Suitability Score</span>
          <span style={{ fontSize: 'var(--font-xs)', color: decObj.color, fontWeight: 700 }}>{score}%</span>
        </div>
        <div className="score-bar" style={{ height: 8 }}>
          <div className="score-bar-fill" style={{
            '--target-width': `${score}%`,
            background: `linear-gradient(90deg, ${decObj.color}60, ${decObj.color})`
          } as any} />
        </div>
      </div>

      {recommendedDays.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
            Recommended Remote Days
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {recommendedDays.map((d: string) => (
              <Badge key={d} variant="cyan">
                <Home size={10} style={{ marginRight: 4 }} /> {d}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {factors.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
            Factor Analysis
          </p>
          {factors.slice(0, 4).map((f: any, i: number) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
                  {typeof f === 'string' ? f : f.name || f.factor}
                </span>
                {typeof f === 'object' && f.score !== undefined && (
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--accent-primary)', fontWeight: 600 }}>{f.score}%</span>
                )}
              </div>
              {typeof f === 'object' && f.score !== undefined && (
                <div className="score-bar">
                  <div className="score-bar-fill" style={{
                    '--target-width': `${f.score}%`,
                    '--delay': `${i * 80}ms`,
                    background: 'linear-gradient(90deg, var(--accent-primary)60, var(--accent-primary))'
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

function WFHSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 21 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card p-6">
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 12, width: '40%' }} />
            </div>
          </div>
          <div className="skeleton" style={{ height: 8, marginBottom: 16 }} />
          {Array.from({ length: 3 }).map((_, j) => (
            <div key={j} style={{ marginBottom: 12 }}>
              <div className="skeleton" style={{ height: 10, marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 6 }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

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
  const policy  = data?.policy || 'Government 2-Day Hybrid WFH Policy Active'
  const wfhTotal = members.filter((m: any) => (m.decision || '').toLowerCase().includes('wfh') || (m.decision || '').toLowerCase().includes('home')).length

  return (
    <div>
      <div style={{ marginBottom: 34 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <h1 className="section-title">WFH Decider</h1>
          <Badge variant="cyan">Policy Engine</Badge>
        </div>
        <p className="section-subtitle">AI-powered remote work optimization & policy-compliant hybrid scheduling</p>
      </div>

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 13, marginBottom: 34 }}>
          <StatCard title="Active Team Roster" value={members.length} icon={Building2} badge={{ text: 'Total', variant: 'blue' }} />
          <StatCard title="Remote Days Allocated" value={wfhTotal * 2} icon={Home} badge={{ text: 'Optimal', variant: 'green' }} />
          <StatCard title="Compliance Policy" value="100%" icon={Calendar} badge={{ text: 'Compliant', variant: 'purple' }} />
        </div>
      )}

      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 21px', borderRadius: 12, marginBottom: 34,
        background: 'rgba(99,102,241,0.06)',
        border: '1px solid var(--border-subtle)'
      }}>
        <Info size={18} color="var(--accent-primary)" />
        <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Policy Note:</strong> {policy}
        </span>
      </div>

      {error && <OfflineBanner />}

      {loading ? (
        <>
          <div className="skeleton" style={{ height: 220, borderRadius: 12, marginBottom: 34 }} />
          <WFHSkeleton />
        </>
      ) : members.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <Home size={36} color="var(--text-muted)" style={{ margin: '0 auto 13px' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No WFH schedule data available</p>
        </div>
      ) : (
        <>
          <WeeklyGrid members={members} />

          <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 21, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Home size={18} color="var(--accent-primary)" /> Member Telemetry & Breakdown
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 21 }}>
            {members.map((m: any, i: number) => (
              <WFHMemberCard key={i} member={m} idx={i} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

