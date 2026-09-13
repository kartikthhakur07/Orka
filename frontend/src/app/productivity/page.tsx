'use client'

import { useEffect, useState } from 'react'
import { getProductivity, getWorkDNA } from '@/lib/api'
import OfflineBanner from '@/components/OfflineBanner'
import Badge from '@/components/Badge'
import StatCard from '@/components/StatCard'
import { TrendingUp, Zap, Medal, ChevronDown, ChevronUp, Award, Target, Brain } from 'lucide-react'

const AVATAR_COLORS = ['#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#8b5cf6', '#ec4899']

function getInitials(name: string) {
  return (name || 'UN').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
}

function scoreColor(v: number): string {
  if (v >= 80) return '#10b981'
  if (v >= 60) return '#3b82f6'
  if (v >= 40) return '#f59e0b'
  return '#ef4444'
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span style={{ fontSize: 'var(--font-md)' }}>🥇</span>
  if (rank === 2) return <span style={{ fontSize: 'var(--font-md)' }}>🥈</span>
  if (rank === 3) return <span style={{ fontSize: 'var(--font-md)' }}>🥉</span>
  return (
    <div style={{
      width: 26, height: 26, borderRadius: 6, background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--text-muted)'
    }}>
      {rank}
    </div>
  )
}

function ScoreBadge({ value, label }: { value: number; label: string }) {
  const color = scoreColor(value)
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: 'var(--font-xs)', fontWeight: 800, color,
        padding: '5px 12px', borderRadius: 8,
        background: `${color}12`, border: `1px solid ${color}25`,
        minWidth: 54
      }}>
        {value}
      </div>
      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: 4, whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  )
}

function LeaderboardRow({ member, rank, idx }: { member: any; rank: number; idx: number }) {
  const avatarBg = AVATAR_COLORS[idx % AVATAR_COLORS.length]
  const prod     = member.productivity_score ?? member.productivity ?? 0
  const focus    = member.focus_score        ?? member.focus        ?? 0
  const consist  = member.consistency_score  ?? member.consistency  ?? 0
  const delivery = member.delivery_score     ?? member.delivery     ?? 0

  return (
    <tr
      style={{ cursor: 'pointer', transition: 'background 150ms' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <td style={{ padding: '14px 21px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RankBadge rank={rank} />
        </div>
      </td>
      <td style={{ padding: '14px 21px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="avatar" style={{ background: `${avatarBg}20`, color: avatarBg }}>
            {getInitials(member.name)}
          </div>
          <div>
            <p style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>{member.name}</p>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{member.role || ''}</p>
          </div>
        </div>
      </td>
      <td style={{ padding: '14px 21px', borderBottom: '1px solid var(--border-subtle)' }}>
        <ScoreBadge value={prod} label="Productivity" />
      </td>
      <td style={{ padding: '14px 21px', borderBottom: '1px solid var(--border-subtle)' }}>
        <ScoreBadge value={focus} label="Focus" />
      </td>
      <td style={{ padding: '14px 21px', borderBottom: '1px solid var(--border-subtle)' }}>
        <ScoreBadge value={consist} label="Consistency" />
      </td>
      <td style={{ padding: '14px 21px', borderBottom: '1px solid var(--border-subtle)' }}>
        <ScoreBadge value={delivery} label="Delivery" />
      </td>
    </tr>
  )
}

function DNACard({ member, dnaData, idx }: { member: any; dnaData: any; idx: number }) {
  const [expanded, setExpanded] = useState(false)
  const avatarBg = AVATAR_COLORS[idx % AVATAR_COLORS.length]

  const memberDNA = dnaData?.members?.find((d: any) => d.name === member.name)
    || dnaData?.team?.find((d: any) => d.name === member.name)
    || member.work_dna || {}

  const bestHours    = memberDNA.best_hours    || member.best_hours    || '—'
  const prefTasks    = memberDNA.preferred_tasks || member.preferred_tasks || '—'
  const focusPat     = memberDNA.focus_pattern  || member.focus_pattern  || '—'
  const burnoutTrig  = memberDNA.burnout_triggers || member.burnout_triggers || '—'
  const workStyle    = memberDNA.work_style       || member.work_style       || '—'

  const prod   = member.productivity_score ?? member.productivity ?? 0
  const focus  = member.focus_score        ?? member.focus        ?? 0
  const consist = member.consistency_score ?? member.consistency  ?? 0
  const delivery = member.delivery_score   ?? member.delivery     ?? 0

  return (
    <div
      className="glass-card animate-fade-in-up"
      style={{ opacity: 0, animationFillMode: 'forwards', animationDelay: `${idx * 60}ms`, overflow: 'hidden' }}
    >
      <div
        style={{ padding: '18px 21px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}
      >
        <div className="avatar avatar-lg" style={{ background: `${avatarBg}20`, color: avatarBg }}>
          {getInitials(member.name)}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>{member.name}</p>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{member.role || 'Team Member'}</p>
        </div>

        <div style={{ display: 'flex', gap: 10, marginRight: 12 }}>
          {[
            { v: prod,    l: 'P' },
            { v: focus,   l: 'F' },
            { v: consist, l: 'C' },
            { v: delivery,l: 'D' },
          ].map(({ v, l }) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: scoreColor(v) }}>{v}</div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{l}</div>
            </div>
          ))}
        </div>
        {expanded ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
      </div>

      <div style={{ padding: '0 21px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { label: 'Productivity', value: prod },
          { label: 'Focus Hours',  value: focus },
          { label: 'Consistency',  value: consist },
          { label: 'Delivery',     value: delivery },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{label}</span>
              <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: scoreColor(value) }}>{value}</span>
            </div>
            <div className="score-bar">
              <div className="score-bar-fill" style={{
                '--target-width': `${value}%`,
                background: `linear-gradient(90deg, ${scoreColor(value)}60, ${scoreColor(value)})`
              } as any} />
            </div>
          </div>
        ))}
      </div>

      {expanded && (
        <div style={{
          padding: '18px 21px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(99,102,241,0.04)',
          animation: 'fadeInUp 0.3s ease forwards'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Zap size={16} color="var(--accent-primary)" />
            <span style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Work DNA Telemetry Profile
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { icon: '⏰', label: 'Optimal Hours',    value: bestHours },
              { icon: '🎯', label: 'Task Alignment',   value: prefTasks },
              { icon: '🧠', label: 'Cognitive Rhythm', value: focusPat },
              { icon: '⚡', label: 'Stress Factors',   value: burnoutTrig },
              { icon: '💼', label: 'Work Archetype',   value: workStyle },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>
                  {icon} {label}
                </p>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {typeof value === 'object' ? JSON.stringify(value) : value}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 16, padding: '12px 16px', borderRadius: 10,
            background: 'rgba(99,102,241,0.08)', border: '1px solid var(--border-subtle)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--accent-primary)', fontStyle: 'italic', fontWeight: 500 }}>
              "Other tools track <strong>what</strong> gets done. ORKA optimizes <strong>how</strong> engineers thrive."
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function ProductivitySkeleton() {
  return (
    <div className="glass-card mb-6" style={{ overflow: 'hidden' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{ padding: '16px 21px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="skeleton" style={{ width: 26, height: 26, borderRadius: 6 }} />
          <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 6 }} />
            <div className="skeleton" style={{ height: 12, width: '25%' }} />
          </div>
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} className="skeleton" style={{ width: 54, height: 40, borderRadius: 8 }} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default function ProductivityPage() {
  const [prodData, setProdData] = useState<any>(null)
  const [dnaData,  setDnaData]  = useState<any>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(false)
  const [tab, setTab]           = useState(0)

  useEffect(() => {
    Promise.allSettled([getProductivity(), getWorkDNA()])
      .then(([prod, dna]) => {
        if (prod.status === 'fulfilled') setProdData(prod.value)
        if (dna.status  === 'fulfilled') setDnaData(dna.value)
        if (prod.status === 'rejected')  setError(true)
      })
      .finally(() => setLoading(false))
  }, [])

  const members: any[] = prodData?.members || prodData?.team || (Array.isArray(prodData) ? prodData : [])
  const sorted = [...members].sort((a, b) =>
    (b.productivity_score ?? b.productivity ?? 0) - (a.productivity_score ?? a.productivity ?? 0)
  )

  const tabs = ['Leaderboard', 'Work DNA Profiles']

  const avgScore = sorted.length > 0
    ? Math.round(sorted.reduce((acc, m) => acc + (m.productivity_score ?? m.productivity ?? 0), 0) / sorted.length)
    : 0

  return (
    <div>
      <div style={{ marginBottom: 34 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <h1 className="section-title">Productivity Telemetry</h1>
          <Badge variant="blue">Work DNA Engine</Badge>
        </div>
        <p className="section-subtitle">Deep performance analytics — beyond raw metrics, into cognitive focus and output behavior</p>
      </div>

      {!loading && !error && sorted.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 13, marginBottom: 34 }}>
          <StatCard title="Top Performer" value={sorted[0]?.name || '—'} icon={Award} badge={{ text: 'Rank #1', variant: 'green' }} />
          <StatCard title="Team Avg Productivity" value={`${avgScore}%`} icon={TrendingUp} badge={{ text: 'High Efficiency', variant: 'blue' }} />
          <StatCard title="Focus Consistency" value="92%" icon={Brain} badge={{ text: 'Optimal', variant: 'purple' }} />
        </div>
      )}

      <div className="tab-bar mb-6" style={{ maxWidth: 340 }}>
        {tabs.map((t, i) => (
          <button key={t} className={`tab-btn ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>
            {t}
          </button>
        ))}
      </div>

      {error && <OfflineBanner />}

      {tab === 0 && (
        loading ? <ProductivitySkeleton /> : sorted.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <TrendingUp size={36} color="var(--text-muted)" style={{ margin: '0 auto 13px' }} />
            <p style={{ color: 'var(--text-secondary)' }}>No productivity telemetry data available</p>
          </div>
        ) : (
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px 21px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Medal size={18} color="var(--accent-primary)" />
                <span style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>Performance Leaderboard</span>
              </div>
              <Badge variant="blue">{sorted.length} active engineers</Badge>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="orka-table" style={{ minWidth: 700 }}>
                <thead>
                  <tr>
                    <th style={{ width: 60, textAlign: 'center' }}>Rank</th>
                    <th>Engineer</th>
                    <th>Productivity</th>
                    <th>Focus</th>
                    <th>Consistency</th>
                    <th>Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((m: any, i: number) => (
                    <LeaderboardRow key={i} member={m} rank={i + 1} idx={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {tab === 1 && (
        loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card p-6">
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%' }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 12, width: '25%' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j}>
                      <div className="skeleton" style={{ height: 12, marginBottom: 6 }} />
                      <div className="skeleton" style={{ height: 6 }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <Zap size={36} color="var(--text-muted)" style={{ margin: '0 auto 13px' }} />
            <p style={{ color: 'var(--text-secondary)' }}>No Work DNA telemetry available</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {sorted.map((m: any, i: number) => (
              <DNACard key={i} member={m} dnaData={dnaData} idx={i} />
            ))}
          </div>
        )
      )}
    </div>
  )
}

