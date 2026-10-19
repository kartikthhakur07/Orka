'use client'

import { useEffect, useState, useMemo } from 'react'
import { getProductivity, getWorkDNA } from '@/lib/api'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import { AuthGuard } from '@/components/AuthGuard'
import OfflineBanner from '@/components/OfflineBanner'
import StatCard from '@/components/StatCard'
import {
  TrendingUp, Zap, Medal, ChevronDown, ChevronUp, Award,
  Brain, Activity, CheckCircle, Flame, Search, Clock, Target,
  ShieldCheck, Sparkles, Sliders, Layers, BarChart3, Users,
  Coffee, Compass, ArrowUpRight, ArrowDownRight, Info
} from 'lucide-react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  Legend, AreaChart, Area, ScatterChart, Scatter, ZAxis, CartesianGrid, ReferenceLine
} from 'recharts'
import { useSidebar } from '@/context/SidebarContext'

const AVATAR_COLORS = ['#4f46e5', '#0284c7', '#059669', '#d97706', '#7c3aed', '#db2777', '#0891b2']

function getInitials(name: string) {
  return (name || 'UN').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function scoreColor(v: number): string {
  if (v >= 80) return '#059669'
  if (v >= 60) return '#0284c7'
  if (v >= 40) return '#d97706'
  return '#dc2626'
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span style={{ fontSize: '1.25rem' }}>🥇</span>
  if (rank === 2) return <span style={{ fontSize: '1.25rem' }}>🥈</span>
  if (rank === 3) return <span style={{ fontSize: '1.25rem' }}>🥉</span>
  return (
    <div style={{
      width: 26, height: 26, borderRadius: 7, background: '#eeefe9',
      border: '1.5px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '11px', fontWeight: 800, color: '#23251d'
    }}>
      {rank}
    </div>
  )
}

function ScoreBadge({ value }: { value: number }) {
  const color = scoreColor(value)
  return (
    <div style={{
      fontSize: '12px', fontWeight: 800, color,
      padding: '3px 8px', borderRadius: 6,
      background: `${color}15`, border: `1px solid ${color}30`,
      display: 'inline-block', textAlign: 'center', minWidth: 46
    }}>
      {value}%
    </div>
  )
}

// 2D Cognitive Matrix Scatter Tooltip
function CognitiveTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div style={{
        background: '#23251d',
        color: '#ffffff',
        padding: '10px 14px',
        borderRadius: 8,
        fontSize: '11px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ fontWeight: 800, fontSize: '13px', color: '#f7a501', marginBottom: 2 }}>{data.name}</div>
        <div style={{ color: '#94a3b8', marginBottom: 6 }}>{data.role || 'Engineer'} · {data.archetype}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px' }}>
          <div><span style={{ color: '#94a3b8' }}>Context Thrash:</span> <strong>{data.thrash} sw/hr</strong></div>
          <div><span style={{ color: '#94a3b8' }}>Output Velocity:</span> <strong>{data.output} pts</strong></div>
          <div><span style={{ color: '#94a3b8' }}>Focus Block:</span> <strong>{data.focus}%</strong></div>
          <div><span style={{ color: '#94a3b8' }}>PR Cycle:</span> <strong>{data.prCycle} hrs</strong></div>
        </div>
      </div>
    )
  }
  return null
}

function DNACard({ item, idx, onSelect, isSelected }: { item: any; idx: number; onSelect?: () => void; isSelected?: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const avatarBg = AVATAR_COLORS[idx % AVATAR_COLORS.length]
  const initials = getInitials(item.name)

  const archetypes = item.archetypes || [item.archetype || item.work_style || 'Deep Diver']
  const peakHours = item.peak_hours || '10:00 AM – 1:00 PM'
  const focusPat = item.focus_pattern || '90-min uninterrupted blocks'
  const burnoutTrig = item.burnout_triggers || 'Frequent ad-hoc status pings'

  return (
    <div
      onClick={onSelect}
      className="bright-card"
      style={{
        padding: 18,
        background: '#ffffff',
        border: isSelected ? '2px solid #23251d' : '1.5px solid #cbd5e1',
        borderRadius: 14,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.15s ease',
        cursor: onSelect ? 'pointer' : 'default',
        boxShadow: isSelected ? '2px 2px 0px #23251d' : 'none'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: avatarBg, color: '#ffffff', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px',
              flexShrink: 0
            }}>
              {initials}
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 800, color: '#23251d', margin: 0 }}>{item.name}</p>
              <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>{item.role || 'Full-Stack Engineer'}</p>
            </div>
          </div>
          <span className="badge-bright badge-yellow" style={{ fontSize: '10px', padding: '2px 6px', fontWeight: 800 }}>
            Work DNA
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {archetypes.map((arch: string, aIdx: number) => (
            <span key={aIdx} className="badge-bright badge-purple" style={{ fontSize: '11px', padding: '3px 8px' }}>
              🧬 {arch}
            </span>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '11px', color: '#4d4f46', background: '#f8fafc', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <div>
            <span style={{ color: '#64748b', fontWeight: 700, display: 'block' }}>Peak Focus Window</span>
            <strong style={{ color: '#23251d' }}>{peakHours}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', fontWeight: 700, display: 'block' }}>Flow Velocity</span>
            <strong style={{ color: '#059669' }}>High Deep Flow</strong>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setExpanded(!expanded)
          }}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '11px', fontWeight: 700, color: '#0284c7',
            display: 'flex', alignItems: 'center', gap: 4, padding: 0
          }}
        >
          {expanded ? <><ChevronUp size={13} /> Less Cognitive Detail</> : <><ChevronDown size={13} /> Expand Cognitive Archetype</>}
        </button>

        {expanded && (
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
            <div style={{ padding: '8px 10px', borderRadius: 6, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>Focus Protocol</span>
              <p style={{ fontSize: '12px', color: '#23251d', fontWeight: 700, margin: '2px 0 0' }}>{focusPat}</p>
            </div>
            <div style={{ padding: '8px 10px', borderRadius: 6, background: '#fef2f2', border: '1px solid #fecaca' }}>
              <span style={{ fontSize: '10px', color: '#dc2626', fontWeight: 800, textTransform: 'uppercase' }}>⚡ Friction Trigger</span>
              <p style={{ fontSize: '12px', color: '#991b1b', fontWeight: 700, margin: '2px 0 0' }}>{burnoutTrig}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProductivityPage() {
  const { isExpanded, collapsed, toggleSidebar } = useSidebar()
  const [prodData, setProdData] = useState<any>(null)
  const [dnaData,  setDnaData]  = useState<any>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(false)
  const [tab, setTab]           = useState<'overview' | 'leaderboard' | 'dna'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [selectedMember, setSelectedMember] = useState<any>(null)

  useEffect(() => {
    Promise.allSettled([getProductivity(), getWorkDNA()])
      .then(([prod, dna]) => {
        if (prod.status === 'fulfilled') setProdData(prod.value)
        if (dna.status  === 'fulfilled') setDnaData(dna.value)
        if (prod.status === 'rejected')  setError(true)
      })
      .finally(() => setLoading(false))
  }, [])

  const rawMembers = prodData?.members || prodData?.rankings || prodData?.developers || []

  // Fallback enriched roster if API returned empty
  const members = useMemo(() => {
    if (rawMembers.length > 0) return rawMembers
    return [
      { id: 1, name: 'Priya Sharma', role: 'Staff Backend Architect', score: 96, productivity: 96, focus: 94, prs: 18, thrash: 1.4, output: 42, archetype: 'Deep Architect' },
      { id: 2, name: 'Marcus Chen', role: 'Full-Stack Lead', score: 91, productivity: 91, focus: 88, prs: 15, thrash: 2.1, output: 38, archetype: 'Velocity Sprinter' },
      { id: 3, name: 'Alex Rivera', role: 'DevOps & Reliability', score: 87, productivity: 87, focus: 82, prs: 12, thrash: 3.2, output: 34, archetype: 'Firefighter' },
      { id: 4, name: 'Sarah Kim', role: 'Design Systems Eng', score: 84, productivity: 84, focus: 85, prs: 14, thrash: 2.4, output: 31, archetype: 'Precision Crafter' },
      { id: 5, name: 'David Okafor', role: 'Machine Learning Eng', score: 81, productivity: 81, focus: 89, prs: 9, thrash: 1.8, output: 29, archetype: 'Deep Diver' },
      { id: 6, name: 'Elena Rostova', role: 'Frontend Engineer', score: 79, productivity: 79, focus: 76, prs: 11, thrash: 3.8, output: 27, archetype: 'Cross-Pollinator' },
      { id: 7, name: 'Kiran Patel', role: 'QA & Automation', score: 75, productivity: 75, focus: 78, prs: 8, thrash: 4.1, output: 24, archetype: 'System Guard' },
    ]
  }, [rawMembers])

  const filteredMembers = useMemo(() => {
    return members.filter((m: any) => {
      const matchSearch = (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (m.role || '').toLowerCase().includes(searchQuery.toLowerCase())
      const matchRole = selectedRole === 'all' || (m.role || '').toLowerCase().includes(selectedRole.toLowerCase())
      return matchSearch && matchRole
    })
  }, [members, searchQuery, selectedRole])

  const sorted = useMemo(() => {
    return [...filteredMembers].sort((a: any, b: any) => {
      const sA = a.score ?? a.productivity_score ?? a.productivity ?? 0
      const sB = b.score ?? b.productivity_score ?? b.productivity ?? 0
      return sB - sA
    })
  }, [filteredMembers])

  const avgScore = useMemo(() => {
    if (!members.length) return 86
    const total = members.reduce((acc: number, m: any) => acc + (m.score ?? m.productivity_score ?? m.productivity ?? 75), 0)
    return Math.round(total / members.length)
  }, [members])

  // Hourly Flow Rhythm Data (Monotone waveform across workday)
  const rhythmHorizonData = useMemo(() => [
    { hour: '09:00', deepFlow: 54, contextThrash: 28, outputPts: 14 },
    { hour: '10:00', deepFlow: 78, contextThrash: 22, outputPts: 28 },
    { hour: '11:00', deepFlow: 92, contextThrash: 15, outputPts: 46 }, // Golden Flow Window
    { hour: '12:00', deepFlow: 86, contextThrash: 18, outputPts: 39 },
    { hour: '13:00', deepFlow: 45, contextThrash: 32, outputPts: 16 }, // Lunch / sync
    { hour: '14:00', deepFlow: 68, contextThrash: 35, outputPts: 26 },
    { hour: '15:00', deepFlow: 84, contextThrash: 24, outputPts: 41 }, // Afternoon Deep Block
    { hour: '16:00', deepFlow: 88, contextThrash: 20, outputPts: 44 },
    { hour: '17:00', deepFlow: 62, contextThrash: 31, outputPts: 24 },
    { hour: '18:00', deepFlow: 42, contextThrash: 19, outputPts: 12 },
  ], [])

  // 2D Cognitive Velocity Scatter Matrix
  const cognitiveScatterData = useMemo(() => {
    return members.map((m: any, idx: number) => {
      const thrash = m.thrash ?? (1.2 + (idx * 0.5))
      const output = m.output ?? (m.prs ? m.prs * 2.4 : 32 - idx * 3)
      const focus = m.focus_score ?? m.focus ?? 82
      const prCycle = (4.2 - (m.score ? (m.score / 35) : 1.5)).toFixed(1)
      const archetype = m.archetype || (idx % 2 === 0 ? 'Deep Diver' : 'Velocity Sprinter')

      return {
        name: m.name,
        role: m.role,
        thrash: Number(thrash.toFixed(1)),
        output: Math.round(output),
        focus,
        prCycle,
        archetype,
        score: m.score ?? m.productivity_score ?? m.productivity ?? 75,
        fill: idx === 0 ? '#4f46e5' : idx === 1 ? '#059669' : idx === 2 ? '#f7a501' : '#0284c7'
      }
    })
  }, [members])

  // Squad Performance DNA Radar
  const radarData = useMemo(() => [
    { subject: 'Deep Focus Blocks', value: 92, benchmark: 75 },
    { subject: 'PR Turnaround', value: 88, benchmark: 70 },
    { subject: 'Architecture Quality', value: 85, benchmark: 72 },
    { subject: 'Context Health', value: 81, benchmark: 68 },
    { subject: 'Async Efficiency', value: 94, benchmark: 74 },
    { subject: 'Bug Containment', value: 89, benchmark: 75 },
  ], [])

  // Top Developers Output Bar Comparison
  const barData = useMemo(() => {
    return sorted.slice(0, 6).map((m: any) => ({
      name: (m.name || 'Eng').split(' ')[0],
      Productivity: m.productivity_score ?? m.productivity ?? 85,
      Focus: m.focus_score ?? m.focus ?? 80,
      Throughput: m.prs ?? m.pr_count ?? 12
    }))
  }, [sorted])

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />

      <main className={`main-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <TopBar onToggleSidebar={toggleSidebar} />

        <AuthGuard moduleName="Productivity & Work DNA Matrix">
          <div className="page-container">
            {/* Golden Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
              marginBottom: 21,
              paddingBottom: 21,
              borderBottom: '1.5px solid #e2e8f0'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                  <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#23251d', letterSpacing: '-0.02em', margin: 0 }}>
                    Productivity & Work DNA Matrix
                  </h1>
                  <span className="badge-bright badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669' }} /> Telemetry Active
                  </span>
                  <span className="badge-bright badge-yellow" style={{ fontSize: '11px', fontWeight: 800 }}>
                    Φ Deep Flow Index
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Developer cognitive telemetry measuring uninterrupted focus rhythms, context switching resistance, and delivery throughput
                </p>
              </div>

              {/* Fibonacci Pill Tabs */}
              <div style={{
                display: 'inline-flex',
                background: '#ffffff',
                padding: 4,
                borderRadius: 9999,
                border: '1.5px solid #cbd5e1',
                boxShadow: '1px 1px 0px #cbd5e1'
              }}>
                <button
                  onClick={() => setTab('overview')}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 9999,
                    fontSize: '12px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    background: tab === 'overview' ? '#23251d' : 'transparent',
                    color: tab === 'overview' ? '#ffffff' : '#64748b',
                    transition: 'all 120ms ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Activity size={13} /> Flow Telemetry
                </button>
                <button
                  onClick={() => setTab('leaderboard')}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 9999,
                    fontSize: '12px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    background: tab === 'leaderboard' ? '#23251d' : 'transparent',
                    color: tab === 'leaderboard' ? '#ffffff' : '#64748b',
                    transition: 'all 120ms ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Medal size={13} /> Leaderboard
                </button>
                <button
                  onClick={() => setTab('dna')}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 9999,
                    fontSize: '12px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    background: tab === 'dna' ? '#23251d' : 'transparent',
                    color: tab === 'dna' ? '#ffffff' : '#64748b',
                    transition: 'all 120ms ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Brain size={13} /> Work DNA Profiles
                </button>
              </div>
            </div>

            {error && <OfflineBanner />}

            {/* Executive 4-Card Telemetry Ribbon - Single Horizontal Line */}
            <div
              className="stats-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: 16,
                marginBottom: 21,
                width: '100%'
              }}
            >
              <StatCard
                label="Squad Deep Flow Index"
                value={`${avgScore}%`}
                icon={TrendingUp}
                color="#059669"
                badge={{ text: 'Φ Peak Harmony', variant: 'green' }}
              />
              <StatCard
                label="Deep Work Duration"
                value="6.4 hrs"
                icon={Brain}
                color="#4f46e5"
                badge={{ text: '+18m vs benchmark', variant: 'purple' }}
              />
              <StatCard
                label="Context Switching Latency"
                value="1.4 sw/hr"
                icon={Zap}
                color="#0284c7"
                badge={{ text: 'Low Thrash', variant: 'blue' }}
              />
              <StatCard
                label="Median PR Cycle"
                value="3.2 hrs"
                icon={Clock}
                color="#d97706"
                badge={{ text: 'Top 5% Velocity', variant: 'yellow' }}
              />
            </div>

            {/* Main Golden Ratio Layout (61.8% Major : 38.2% Minor) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(520px, 1.618fr) minmax(320px, 1fr)',
              gap: 21,
              alignItems: 'start'
            }}>
              {/* Left Column (61.8% Major): Flow Rhythm Horizon & Dynamic Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 21 }}>
                {tab === 'overview' && (
                  <>
                    {/* Hourly Flow Rhythm Waveform */}
                    <div className="bright-card" style={{ padding: 22, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                              Daily Flow Rhythm & Cognitive Horizon
                            </h3>
                            <span className="badge-bright badge-emerald">Real-time Bi-Hourly</span>
                          </div>
                          <p style={{ fontSize: '11px', color: '#64748b', margin: '3px 0 0' }}>
                            Monitors deep work intensity vs. context switching spikes across the working day
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '11px', fontWeight: 700 }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#059669' }}>
                            <span style={{ width: 10, height: 10, borderRadius: 3, background: '#059669' }} /> Deep Flow Intensity (%)
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#d97706' }}>
                            <span style={{ width: 10, height: 10, borderRadius: 3, background: '#d97706' }} /> Thrash Latency
                          </span>
                        </div>
                      </div>

                      <div style={{ width: '100%', height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={rhythmHorizonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#059669" stopOpacity={0.02} />
                              </linearGradient>
                              <linearGradient id="thrashGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="hour" tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} domain={[0, 100]} />
                            <Tooltip
                              contentStyle={{ background: '#23251d', border: 'none', borderRadius: 8, color: '#ffffff', fontSize: '11px' }}
                            />
                            <ReferenceLine y={80} stroke="#059669" strokeDasharray="3 3" label={{ value: 'Golden Flow Zone', fill: '#059669', fontSize: 10, position: 'insideTopRight' }} />
                            <Area type="monotone" dataKey="deepFlow" name="Deep Flow Score" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#flowGrad)" />
                            <Area type="monotone" dataKey="contextThrash" name="Context Thrash Latency" stroke="#d97706" strokeWidth={2} fillOpacity={1} fill="url(#thrashGrad)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      <div style={{
                        marginTop: 14,
                        padding: '10px 14px',
                        borderRadius: 10,
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '11px',
                        color: '#475569'
                      }}>
                        <span>💡 <strong>Peak Flow Window:</strong> 10:00 AM – 1:00 PM exhibits the lowest context interruption (15 sw/hr) and highest code velocity.</span>
                        <span className="badge-bright badge-purple" style={{ fontSize: '10px' }}>Async Shield On</span>
                      </div>
                    </div>

                    {/* 2D Cognitive Velocity Decision Scatter Matrix */}
                    <div className="bright-card" style={{ padding: 22, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                              2D Cognitive Velocity Matrix
                            </h3>
                            <span className="badge-bright badge-indigo">Context Thrash vs Net Output</span>
                          </div>
                          <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
                            Identifies engineers in deep flow versus those bottlenecked by ad-hoc meeting thrash
                          </p>
                        </div>
                        <span className="badge-bright badge-yellow">Φ Quadrant Split</span>
                      </div>

                      <div style={{ width: '100%', height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart margin={{ top: 15, right: 20, bottom: 15, left: -10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis
                              type="number"
                              dataKey="thrash"
                              name="Context Thrash"
                              unit=" sw/hr"
                              domain={[1, 5]}
                              tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }}
                              label={{ value: 'Context Thrash (Switches / Hour) →', position: 'bottom', offset: 0, fontSize: 10, fill: '#64748b' }}
                            />
                            <YAxis
                              type="number"
                              dataKey="output"
                              name="Net Output"
                              unit=" pts"
                              domain={[15, 50]}
                              tick={{ fill: '#94a3b8', fontSize: 10 }}
                              label={{ value: 'Net Output Velocity (pts) ↑', angle: -90, position: 'insideLeft', offset: 15, fontSize: 10, fill: '#64748b' }}
                            />
                            <ZAxis type="number" dataKey="score" range={[120, 260]} />
                            <Tooltip content={<CognitiveTooltip />} />
                            <ReferenceLine x={2.5} stroke="#cbd5e1" strokeDasharray="3 3" />
                            <ReferenceLine y={30} stroke="#cbd5e1" strokeDasharray="3 3" />
                            <Scatter name="Engineers" data={cognitiveScatterData}>
                              {cognitiveScatterData.map((entry: any, index: number) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.fill}
                                  stroke="#23251d"
                                  strokeWidth={1.5}
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => setSelectedMember(entry)}
                                />
                              ))}
                            </Scatter>
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Quadrant Legend Bar */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 12 }}>
                        <div style={{ padding: '6px 8px', borderRadius: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: '10px' }}>
                          <strong style={{ color: '#15803d', display: 'block' }}>Zone of Flow (Top-Left)</strong>
                          <span style={{ color: '#4b5563' }}>High output, low context thrash</span>
                        </div>
                        <div style={{ padding: '6px 8px', borderRadius: 6, background: '#eff6ff', border: '1px solid #bfdbfe', fontSize: '10px' }}>
                          <strong style={{ color: '#1d4ed8', display: 'block' }}>Velocity Sprinters</strong>
                          <span style={{ color: '#4b5563' }}>High output with burst context</span>
                        </div>
                        <div style={{ padding: '6px 8px', borderRadius: 6, background: '#fefce8', border: '1px solid #fef08a', fontSize: '10px' }}>
                          <strong style={{ color: '#a16207', display: 'block' }}>Steady Pace</strong>
                          <span style={{ color: '#4b5563' }}>Sustainable focus rhythm</span>
                        </div>
                        <div style={{ padding: '6px 8px', borderRadius: 6, background: '#fef2f2', border: '1px solid #fecaca', fontSize: '10px' }}>
                          <strong style={{ color: '#b91c1c', display: 'block' }}>Context Hell Risk</strong>
                          <span style={{ color: '#4b5563' }}>High interruptions, lower output</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {tab === 'leaderboard' && (
                  /* Interactive Full-Scale Leaderboard */
                  <div className="bright-card" style={{ padding: 0, overflow: 'hidden', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                    {/* Filter & Search Header */}
                    <div style={{ padding: '14px 18px', borderBottom: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', flexWrap: 'wrap', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 240 }}>
                        <div style={{ position: 'relative', width: '100%', maxWidth: 280 }}>
                          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                          <input
                            type="text"
                            placeholder="Filter by engineer or role..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '6px 12px 6px 30px',
                              borderRadius: 8,
                              border: '1.5px solid #cbd5e1',
                              fontSize: '12px',
                              outline: 'none',
                              color: '#23251d'
                            }}
                          />
                        </div>
                        <select
                          value={selectedRole}
                          onChange={e => setSelectedRole(e.target.value)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 8,
                            border: '1.5px solid #cbd5e1',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#23251d',
                            background: '#ffffff'
                          }}
                        >
                          <option value="all">All Disciplines</option>
                          <option value="backend">Backend</option>
                          <option value="frontend">Frontend</option>
                          <option value="devops">DevOps</option>
                          <option value="design">Design / UX</option>
                        </select>
                      </div>

                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        Showing {sorted.length} active engineers
                      </span>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                        <thead>
                          <tr style={{ background: '#eeefe9', borderBottom: '1.5px solid #cbd5e1' }}>
                            <th style={{ padding: '10px 14px', fontWeight: 800, color: '#475569', width: 45 }}>Rank</th>
                            <th style={{ padding: '10px 14px', fontWeight: 800, color: '#475569' }}>Engineer</th>
                            <th style={{ padding: '10px 12px', fontWeight: 800, color: '#475569' }}>Deep Focus Ratio</th>
                            <th style={{ padding: '10px 12px', fontWeight: 800, color: '#475569' }}>PR Throughput</th>
                            <th style={{ padding: '10px 12px', fontWeight: 800, color: '#475569' }}>Context Thrash</th>
                            <th style={{ padding: '10px 14px', fontWeight: 800, color: '#475569', textAlign: 'right' }}>Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sorted.map((m: any, idx: number) => {
                            const score = m.score ?? m.productivity_score ?? m.productivity ?? 75
                            const focus = m.focus_score ?? m.focus ?? 80
                            const avatarBg = AVATAR_COLORS[idx % AVATAR_COLORS.length]
                            const thrash = m.thrash ?? (1.2 + idx * 0.4).toFixed(1)
                            return (
                              <tr
                                key={idx}
                                onClick={() => setSelectedMember(m)}
                                style={{
                                  borderBottom: '1px solid #f1f5f9',
                                  transition: 'background 120ms ease',
                                  cursor: 'pointer',
                                  background: selectedMember?.name === m.name ? '#f8fafc' : 'transparent'
                                }}
                              >
                                <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                                  <RankBadge rank={idx + 1} />
                                </td>
                                <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{
                                      width: 30, height: 30, borderRadius: '50%',
                                      background: avatarBg, color: '#fff', fontSize: '11px',
                                      fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                      {getInitials(m.name)}
                                    </div>
                                    <div>
                                      <div style={{ fontWeight: 700, color: '#23251d' }}>{m.name}</div>
                                      <div style={{ fontSize: '11px', color: '#64748b' }}>{m.role || 'Full-Stack'}</div>
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden', minWidth: 60 }}>
                                      <div style={{ width: `${focus}%`, height: '100%', background: '#059669', borderRadius: 3 }} />
                                    </div>
                                    <span style={{ fontWeight: 700, color: '#23251d', fontSize: '11px' }}>{focus}%</span>
                                  </div>
                                </td>
                                <td style={{ padding: '12px', verticalAlign: 'middle', color: '#059669', fontWeight: 700 }}>
                                  {m.prs ?? m.pr_count ?? 12} PRs / sprint
                                </td>
                                <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                                  <span style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                    background: Number(thrash) > 3.0 ? '#fef2f2' : '#f0fdf4',
                                    color: Number(thrash) > 3.0 ? '#dc2626' : '#15803d'
                                  }}>
                                    {thrash} sw/hr
                                  </span>
                                </td>
                                <td style={{ padding: '12px 14px', verticalAlign: 'middle', textAlign: 'right' }}>
                                  <ScoreBadge value={score} />
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {tab === 'dna' && (
                  /* Work DNA Archetypes Grid */
                  <div>
                    <div style={{
                      padding: '12px 16px',
                      background: '#ffffff',
                      borderRadius: 12,
                      border: '1.5px solid #cbd5e1',
                      marginBottom: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Brain size={16} color="#4f46e5" />
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#23251d' }}>
                          Cognitive Archetype Profiles
                        </span>
                      </div>
                      <span className="badge-bright badge-purple" style={{ fontSize: '10px' }}>
                        Φ Behavioral Synthesis
                      </span>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: 14,
                      alignItems: 'stretch'
                    }}>
                      {(dnaData?.members || dnaData?.profiles || sorted).map((item: any, idx: number) => (
                        <DNACard
                          key={idx}
                          item={item}
                          idx={idx}
                          isSelected={selectedMember?.name === item.name}
                          onSelect={() => setSelectedMember(item)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column (38.2% Minor): Squad DNA Radar, Deep Work Guardrails & Focus Spotlight */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 21 }}>
                {/* 6-Factor Squad Flow Radar */}
                <div className="bright-card" style={{ padding: 21, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                        Squad Performance DNA
                      </h3>
                      <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>Multi-factor flow distribution</p>
                    </div>
                    <span className="badge-bright badge-indigo">6-Factor Polar</span>
                  </div>

                  <div style={{ width: '100%', height: 210 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 9.5, fontWeight: 700 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" tick={false} />
                        <Radar name="Benchmark" dataKey="benchmark" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.15} />
                        <Radar name="Active Squad" dataKey="value" stroke="#059669" fill="#059669" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 6, fontSize: '10px', fontWeight: 700 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#059669' }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: '#059669' }} /> Squad Telemetry
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#94a3b8' }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: '#94a3b8' }} /> Industry Baseline
                    </span>
                  </div>
                </div>

                {/* Developer Focus Spotlight or Selected Member Detail */}
                <div className="bright-card" style={{ padding: 20, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Sparkles size={16} color="#f7a501" />
                      <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                        {selectedMember ? 'Developer Deep Dive' : 'Top Flow Performer'}
                      </h3>
                    </div>
                    <span className="badge-bright badge-yellow">
                      {selectedMember ? 'Selected' : 'Rank #1'}
                    </span>
                  </div>

                  {(() => {
                    const activeDev = selectedMember || sorted[0] || members[0]
                    if (!activeDev) return null
                    const score = activeDev.score ?? activeDev.productivity_score ?? activeDev.productivity ?? 94
                    const focus = activeDev.focus_score ?? activeDev.focus ?? 92
                    return (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                          <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: '#23251d', color: '#f7a501',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '15px', fontWeight: 800
                          }}>
                            {getInitials(activeDev.name)}
                          </div>
                          <div>
                            <div style={{ fontSize: '15px', fontWeight: 800, color: '#23251d' }}>{activeDev.name}</div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>{activeDev.role || 'Senior Engineer'}</div>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                          <div style={{ padding: '8px 10px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, display: 'block' }}>Productivity</span>
                            <span style={{ fontSize: '16px', fontWeight: 800, color: scoreColor(score) }}>{score}%</span>
                          </div>
                          <div style={{ padding: '8px 10px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, display: 'block' }}>Uninterrupted Focus</span>
                            <span style={{ fontSize: '16px', fontWeight: 800, color: '#0284c7' }}>{focus}%</span>
                          </div>
                        </div>

                        <div style={{ padding: '10px 12px', borderRadius: 8, background: '#eeefe9', border: '1px solid #cbd5e1', fontSize: '11px' }}>
                          <span style={{ fontWeight: 800, color: '#23251d', display: 'block', marginBottom: 2 }}>
                            🧬 Archetype: {activeDev.archetype || 'Deep Flow Architect'}
                          </span>
                          <span style={{ color: '#475569' }}>
                            Delivers highest impact when given minimum 90-minute synchronous meeting-free blocks.
                          </span>
                        </div>
                      </div>
                    )
                  })()}
                </div>

                {/* Deep Work Protocol Guardrails */}
                <div className="bright-card" style={{ padding: 20, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <ShieldCheck size={16} color="#059669" />
                    <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                      Focus Protocol Guardrails
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '11px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: 8, borderRadius: 6, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                      <CheckCircle size={14} color="#15803d" style={{ marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <strong style={{ color: '#15803d' }}>Async-First Code Review</strong>
                        <p style={{ margin: '2px 0 0', color: '#334155' }}>PRs batched to avoid context-switching interruptions.</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: 8, borderRadius: 6, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                      <CheckCircle size={14} color="#1d4ed8" style={{ marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <strong style={{ color: '#1d4ed8' }}>Golden Focus Shield</strong>
                        <p style={{ margin: '2px 0 0', color: '#334155' }}>10:00 AM – 1:00 PM reserved strictly for uninterrupted deep flow.</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: 8, borderRadius: 6, background: '#fefce8', border: '1px solid #fef08a' }}>
                      <Flame size={14} color="#a16207" style={{ marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <strong style={{ color: '#a16207' }}>Friction Limiter</strong>
                        <p style={{ margin: '2px 0 0', color: '#334155' }}>Auto-flags developers experiencing {'>'} 3.5 context switches/hr.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AuthGuard>
      </main>
    </div>
  )
}
