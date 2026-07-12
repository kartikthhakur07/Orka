'use client'

import { useEffect, useState } from 'react'
import { getProductivity, getWorkDNA } from '@/lib/api'
import { TrendingUp, AlertTriangle, Star, Target, Focus, Zap, Medal, ChevronDown, ChevronUp } from 'lucide-react'

/* ── helpers ──────────────────────────────────────────────────────────── */
function OfflineBanner() {
  return (
    <div className="offline-banner flex items-center gap-3 mb-4">
      <AlertTriangle size={16} />
      <p style={{ fontSize: '0.85rem' }}>Backend offline — run: <code style={{ background: 'rgba(239,68,68,0.15)', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace' }}>uvicorn main:app --reload</code></p>
    </div>
  )
}

const AVATAR_COLORS = ['#f97316', '#a855f7', '#14b8a6', '#22c55e', '#eab308', '#ef4444', '#3b82f6', '#ec4899']

function getInitials(name: string) {
  return (name || 'UN').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
}

function scoreColor(v: number): string {
  if (v >= 80) return '#22c55e'
  if (v >= 60) return '#eab308'
  if (v >= 40) return '#f97316'
  return '#ef4444'
}

function RankBadge({ rank }: { rank: number }) {
  const medals: Record<number, { emoji: string; color: string }> = {
    1: { emoji: '🥇', color: '#f97316' },
    2: { emoji: '🥈', color: '#94a3b8' },
    3: { emoji: '🥉', color: '#eab308' },
  }
  const m = medals[rank]
  if (m) return <span style={{ fontSize: '1.2rem' }}>{m.emoji}</span>
  return (
    <div style={{
      width: 24, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.06)',
      border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)'
    }}>
      {rank}
    </div>
  )
}

/* ── Score Badge Inline ───────────────────────────────────────────────── */
function ScoreBadge({ value, label }: { value: number; label: string }) {
  const color = scoreColor(value)
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: '1rem', fontWeight: 800, color,
        padding: '4px 10px', borderRadius: 8,
        background: `${color}15`, border: `1px solid ${color}25`,
        minWidth: 52
      }}>
        {value}
      </div>
      <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 3, whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  )
}

/* ── Leaderboard Row ──────────────────────────────────────────────────── */
function LeaderboardRow({ member, rank, idx }: { member: any; rank: number; idx: number }) {
  const avatarBg = AVATAR_COLORS[idx % AVATAR_COLORS.length]
  const prod     = member.productivity_score ?? member.productivity ?? 0
  const focus    = member.focus_score        ?? member.focus        ?? 0
  const consist  = member.consistency_score  ?? member.consistency  ?? 0
  const delivery = member.delivery_score     ?? member.delivery     ?? 0

  return (
    <tr
      style={{ cursor: 'pointer', transition: 'background 150ms' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RankBadge rank={rank} />
        </div>
      </td>
      <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="avatar" style={{ background: `${avatarBg}25`, color: avatarBg }}>
            {getInitials(member.name)}
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{member.name}</p>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{member.role || ''}</p>
          </div>
        </div>
      </td>
      <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <ScoreBadge value={prod} label="Productivity" />
      </td>
      <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <ScoreBadge value={focus} label="Focus" />
      </td>
      <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <ScoreBadge value={consist} label="Consistency" />
      </td>
      <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <ScoreBadge value={delivery} label="Delivery" />
      </td>
    </tr>
  )
}

/* ── DNA Profile Card ─────────────────────────────────────────────────── */
function DNACard({ member, dnaData, idx }: { member: any; dnaData: any; idx: number }) {
  const [expanded, setExpanded] = useState(false)
  const avatarBg = AVATAR_COLORS[idx % AVATAR_COLORS.length]

  // Merge dna data
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
      {/* Header */}
      <div
        style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}
      >
        <div className="avatar avatar-lg" style={{ background: `${avatarBg}25`, color: avatarBg }}>
          {getInitials(member.name)}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{member.name}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.role || 'Team Member'}</p>
        </div>
        {/* Mini score row */}
        <div style={{ display: 'flex', gap: 8, marginRight: 12 }}>
          {[
            { v: prod,    l: 'P' },
            { v: focus,   l: 'F' },
            { v: consist, l: 'C' },
            { v: delivery,l: 'D' },
          ].map(({ v, l }) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: scoreColor(v) }}>{v}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{l}</div>
            </div>
          ))}
        </div>
        {expanded ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
      </div>

      {/* Scores bars */}
      <div style={{ padding: '0 20px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { label: 'Productivity', value: prod },
          { label: 'Focus',        value: focus },
          { label: 'Consistency',  value: consist },
          { label: 'Delivery',     value: delivery },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{label}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: scoreColor(value) }}>{value}</span>
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

      {/* Expanded DNA Profile */}
      {expanded && (
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(168,85,247,0.04)',
          animation: 'fadeInUp 0.3s ease forwards'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <Zap size={14} color="var(--accent-purple)" />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-purple)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Work DNA Profile
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { icon: '⏰', label: 'Best Hours',        value: bestHours },
              { icon: '✅', label: 'Preferred Tasks',   value: prefTasks },
              { icon: '🧠', label: 'Focus Pattern',     value: focusPat },
              { icon: '⚡', label: 'Burnout Triggers',  value: burnoutTrig },
              { icon: '💼', label: 'Work Style',        value: workStyle },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>
                  {icon} {label}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {typeof value === 'object' ? JSON.stringify(value) : value}
                </p>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <div style={{
            marginTop: 14, padding: '10px 14px', borderRadius: 10,
            background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.20)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--accent-purple)', fontStyle: 'italic', fontWeight: 500 }}>
              "Other tools know <strong>what</strong> you do. ORKA knows <strong>how</strong> you work."
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Skeleton ─────────────────────────────────────────────────────────── */
function ProductivitySkeleton() {
  return (
    <>
      <div className="glass-card mb-5" style={{ overflow: 'hidden' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: 12, alignItems: 'center' }}>
            <div className="skeleton" style={{ width: 24, height: 24, borderRadius: 6 }} />
            <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 10, width: '25%' }} />
            </div>
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="skeleton" style={{ width: 52, height: 40, borderRadius: 8 }} />
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

/* ── Main ─────────────────────────────────────────────────────────────── */
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

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 className="section-title">📈 Productivity Intelligence</h1>
          <p className="section-subtitle">Deep performance insights — beyond metrics, into how your team actually works</p>
        </div>
        {!loading && sorted.length > 0 && (
          <div style={{
            padding: '8px 16px', borderRadius: 12,
            background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.20)',
            fontSize: '0.82rem', color: 'var(--accent-orange)', fontWeight: 600
          }}>
            🏆 Top: {sorted[0]?.name || '—'}
          </div>
        )}
      </div>

      <div className="tab-bar mb-6" style={{ maxWidth: 320 }}>
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
            <TrendingUp size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-secondary)' }}>No productivity data available</p>
          </div>
        ) : (
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Medal size={16} color="var(--accent-orange)" />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Performance Leaderboard</span>
              <span className="badge badge-orange">{sorted.length} members</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="orka-table" style={{ minWidth: 700 }}>
                <thead>
                  <tr>
                    <th style={{ width: 60, textAlign: 'center' }}>Rank</th>
                    <th>Member</th>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card p-5">
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%' }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 10, width: '25%' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j}>
                      <div className="skeleton" style={{ height: 10, marginBottom: 6 }} />
                      <div className="skeleton" style={{ height: 6 }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <Zap size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-secondary)' }}>No Work DNA data available</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sorted.map((m: any, i: number) => (
              <DNACard key={i} member={m} dnaData={dnaData} idx={i} />
            ))}
          </div>
        )
      )}
    </div>
  )
}
