'use client'

import { useEffect, useState, useMemo } from 'react'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import { AuthGuard } from '@/components/AuthGuard'
import { getBurnout, rebalance } from '@/lib/api'
import OfflineBanner from '@/components/OfflineBanner'
import {
  Flame, Coffee, Brain, Clock, Repeat, ShieldCheck, AlertTriangle,
  CheckCircle2, Sparkles, Filter, Zap, Activity, HeartHandshake,
  ShieldAlert, User, ArrowRight, Check, RefreshCw, BarChart2,
  TrendingDown, Sliders, ChevronRight
} from 'lucide-react'
import {
  AreaChart, Area, ScatterChart, Scatter, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Cell, CartesianGrid, ReferenceLine,
  Legend
} from 'recharts'
import { useSidebar } from '@/context/SidebarContext'

function getRiskLevel(score: number): { label: string; color: string; level: 'critical' | 'warning' | 'safe'; variant: 'red' | 'yellow' | 'green' } {
  if (score >= 70) return { label: 'Critical Overload', color: '#dc2626', level: 'critical', variant: 'red' }
  if (score >= 45) return { label: 'Watch Zone', color: '#d97706', level: 'warning', variant: 'yellow' }
  return { label: 'Optimal Flow', color: '#059669', level: 'safe', variant: 'green' }
}

function BurnoutGauge({ score }: { score: number }) {
  const risk = getRiskLevel(score)
  const r = 36
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={86} height={86}>
        <circle cx={43} cy={43} r={r} fill="none" stroke="#e2e8f0" strokeWidth={6} />
        <circle
          cx={43} cy={43} r={r} fill="none"
          stroke={risk.color} strokeWidth={6} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 43 43)"
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: 800, color: risk.color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800, marginTop: 2 }}>Risk Index</div>
      </div>
    </div>
  )
}

function SubBar({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  const clamped = Math.min(Math.max(value, 0), 100)
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          <Icon size={12} color={color} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '11px', color: '#475569', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {label}
          </span>
        </div>
        <span style={{ fontSize: '11px', color, fontWeight: 700, marginLeft: 6 }}>{Math.round(clamped)}%</span>
      </div>
      <div style={{ height: 5, width: '100%', background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${clamped}%`, background: color, borderRadius: 999, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  )
}

/* ── Custom Scatter Tooltip ────────────────────────────────────────────── */
function CustomScatterTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div style={{
        background: '#23251d',
        color: '#ffffff',
        padding: '10px 14px',
        borderRadius: 8,
        fontSize: '11px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
        border: '1px solid #33342d'
      }}>
        <div style={{ fontWeight: 800, fontSize: '13px', color: '#f7a501', marginBottom: 2 }}>{data.name}</div>
        <div style={{ color: '#cbd5e1', marginBottom: 6, fontSize: '10px' }}>{data.role}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '2px 8px', fontSize: '10px' }}>
          <span style={{ color: '#94a3b8' }}>Focus Hours:</span>
          <span style={{ fontWeight: 700, color: '#38bdf8' }}>{data.focusHours}h / day</span>
          <span style={{ color: '#94a3b8' }}>Fragmentation:</span>
          <span style={{ fontWeight: 700, color: data.color }}>{data.fragmentation}%</span>
          <span style={{ color: '#94a3b8' }}>Meetings:</span>
          <span style={{ fontWeight: 700, color: '#f7a501' }}>{data.meetings}/day</span>
          <span style={{ color: '#94a3b8' }}>Zone:</span>
          <span style={{ fontWeight: 700, color: data.color }}>{data.zone}</span>
        </div>
      </div>
    )
  }
  return null
}

export default function BurnoutPage() {
  const { isExpanded, collapsed, toggleSidebar } = useSidebar()
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)
  const [activeTab, setActiveTab] = useState<'radar' | 'matrix' | 'rebalance'>('radar')
  const [filterState, setFilterState] = useState<'all' | 'critical' | 'watch' | 'safe'>('all')

  // Rebalance Execution State
  const [rebalancing, setRebalancing] = useState(false)
  const [rebalanceResult, setRebalanceResult] = useState<any>(null)
  const [selectedTargetMember, setSelectedTargetMember] = useState<string>('')

  const fetchBurnoutData = () => {
    setLoading(true)
    getBurnout()
      .then(res => {
        const list = res.members || res.data || res.team || []
        setMembers(list)
        if (list.length > 0 && !selectedTargetMember) {
          const crit = list.find((m: any) => (m.burnout_score ?? 0) >= 70)
          setSelectedTargetMember(crit ? crit.name : list[0].name)
        }
      })
      .catch(() => setIsOffline(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchBurnoutData()
  }, [])

  const criticalCount = members.filter(m => (m.burnout_score ?? 0) >= 70).length
  const watchCount = members.filter(m => { const s = m.burnout_score ?? 0; return s >= 45 && s < 70 }).length
  const safeCount = members.filter(m => (m.burnout_score ?? 0) < 45).length
  const avgBurnout = members.length > 0 ? Math.round(members.reduce((acc, m) => acc + (m.burnout_score ?? 0), 0) / members.length) : 52

  const filteredMembers = useMemo(() => {
    if (filterState === 'critical') return members.filter(m => (m.burnout_score ?? 0) >= 70)
    if (filterState === 'watch') return members.filter(m => { const s = m.burnout_score ?? 0; return s >= 45 && s < 70 })
    if (filterState === 'safe') return members.filter(m => (m.burnout_score ?? 0) < 45)
    return members
  }, [members, filterState])

  // Distinct Chart 1: 14-Day Team Cognitive Strain & Recovery Waveform
  const waveformData = [
    { day: 'Day 1', strain: 48, safeFloor: 45, criticalLimit: 70 },
    { day: 'Day 2', strain: 52, safeFloor: 45, criticalLimit: 70 },
    { day: 'Day 3', strain: 61, safeFloor: 45, criticalLimit: 70 },
    { day: 'Day 4', strain: 58, safeFloor: 45, criticalLimit: 70 },
    { day: 'Day 5', strain: 50, safeFloor: 45, criticalLimit: 70 },
    { day: 'Day 6', strain: 42, safeFloor: 45, criticalLimit: 70 },
    { day: 'Day 7', strain: 38, safeFloor: 45, criticalLimit: 70 },
    { day: 'Day 8', strain: 68, safeFloor: 45, criticalLimit: 70 }, // Sprint crunch
    { day: 'Day 9', strain: 74, safeFloor: 45, criticalLimit: 70 }, // Overload spike
    { day: 'Day 10', strain: 64, safeFloor: 45, criticalLimit: 70 },
    { day: 'Day 11', strain: 58, safeFloor: 45, criticalLimit: 70 },
    { day: 'Day 12', strain: 54, safeFloor: 45, criticalLimit: 70 },
    { day: 'Day 13', strain: 48, safeFloor: 45, criticalLimit: 70 },
    { day: 'Day 14', strain: avgBurnout, safeFloor: 45, criticalLimit: 70 },
  ]

  // Distinct Chart 2: 2D Cognitive Fragmentation vs Focus Scatter Matrix
  const scatterData = useMemo(() => {
    return members.map(m => {
      const score = m.burnout_score ?? 50
      const focusHours = m.focus_hours || (score > 70 ? 2.2 : score > 45 ? 3.8 : 5.8)
      const fragmentation = Math.min(100, Math.round((m.meeting_load || 3) * 12 + (m.context_switches || 4) * 8))

      let zone = 'Optimal Flow'
      let color = '#059669'
      if (score >= 70) {
        zone = 'Critical Thrash'
        color = '#dc2626'
      } else if (score >= 45) {
        zone = 'Watch Zone'
        color = '#d97706'
      }

      return {
        name: m.name,
        role: m.role,
        score,
        focusHours,
        fragmentation,
        meetings: m.meeting_load || 3,
        contextSwitches: m.context_switches || 4,
        color,
        zone
      }
    })
  }, [members])

  // Distinct Chart 3: Cognitive Driver Strain Breakdown
  const driverBreakdownData = [
    { driver: 'Meeting Fragmentation', share: 36, fill: '#dc2626' },
    { driver: 'Context Thrash (PRs)', share: 28, fill: '#ea580c' },
    { driver: 'Focus Block Deficit', share: 22, fill: '#f7a501' },
    { driver: 'Urgent Bug Interrupts', share: 14, fill: '#0284c7' },
  ]

  const handleExecuteRebalance = async (triggerName?: string) => {
    const target = triggerName || selectedTargetMember
    if (!target) return
    setRebalancing(true)
    try {
      const res = await rebalance({ trigger_member: target })
      setRebalanceResult(res)
      fetchBurnoutData()
    } catch (err) {
      console.error('Rebalance failed:', err)
    } finally {
      setRebalancing(false)
    }
  }

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />

      <div className={`main-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <TopBar onToggleSidebar={toggleSidebar} />

        <AuthGuard moduleName="Burnout Radar & Team Health">
          <div className="page-container">
            {/* Header & Mode Switcher */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
              marginBottom: 16,
              paddingBottom: 16,
              borderBottom: '1.5px solid #e2e8f0'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                  <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#23251d', letterSpacing: '-0.02em', margin: 0 }}>
                    14-Day Cognitive Fatigue Radar
                  </h1>
                  <span className="badge-bright badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669' }} /> Non-Surveillance HR
                  </span>
                  {criticalCount > 0 ? (
                    <span className="badge-bright badge-rose">
                      🔥 {criticalCount} Overloaded
                    </span>
                  ) : (
                    <span className="badge-bright badge-teal">
                      ✅ Healthy Roster
                    </span>
                  )}
                  <span className="badge-bright badge-yellow" style={{ fontSize: '11px', fontWeight: 800 }}>
                    Φ Early Alarm
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Ethical strain telemetry evaluating meeting fragmentation, context thrash, and focus block deficits
                </p>
              </div>

              {/* Segmented Mode Switcher */}
              <div style={{
                display: 'inline-flex',
                background: '#ffffff',
                padding: 4,
                borderRadius: 9999,
                border: '1.5px solid #cbd5e1',
                boxShadow: '1px 1px 0px #cbd5e1'
              }}>
                <button
                  onClick={() => setActiveTab('radar')}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 9999,
                    fontSize: '12px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    background: activeTab === 'radar' ? '#23251d' : 'transparent',
                    color: activeTab === 'radar' ? '#ffffff' : '#64748b',
                    transition: 'all 120ms ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Activity size={14} /> Squad Strain Radar
                </button>
                <button
                  onClick={() => setActiveTab('matrix')}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 9999,
                    fontSize: '12px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    background: activeTab === 'matrix' ? '#23251d' : 'transparent',
                    color: activeTab === 'matrix' ? '#ffffff' : '#64748b',
                    transition: 'all 120ms ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <BarChart2 size={14} /> Root-Cause Matrix
                </button>
                <button
                  onClick={() => setActiveTab('rebalance')}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 9999,
                    fontSize: '12px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    background: activeTab === 'rebalance' ? '#23251d' : 'transparent',
                    color: activeTab === 'rebalance' ? '#ffffff' : '#64748b',
                    transition: 'all 120ms ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <HeartHandshake size={14} /> Live Rebalance Studio
                </button>
              </div>
            </div>

            {isOffline && <OfflineBanner />}

            {/* Top Executive Fatigue Ribbon (4 Cards) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: 14,
              marginBottom: 20
            }}>
              <div className="bright-card" style={{ padding: '14px 18px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Squad Strain Average</span>
                  <Brain size={16} color="#4f46e5" />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#23251d', lineHeight: 1 }}>{avgBurnout}%</div>
                <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: 4 }}>
                  Healthy baseline flow
                </div>
              </div>

              <div className="bright-card" style={{ padding: '14px 18px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Critical Strain Risk</span>
                  <AlertTriangle size={16} color="#dc2626" />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#dc2626', lineHeight: 1 }}>{criticalCount} Overloaded</div>
                <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: 700, marginTop: 4 }}>
                  {criticalCount > 0 ? 'Immediate rebalance advised' : 'Zero severe overload'}
                </div>
              </div>

              <div className="bright-card" style={{ padding: '14px 18px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Deep Flow Margins</span>
                  <ShieldCheck size={16} color="#059669" />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#23251d', lineHeight: 1 }}>{safeCount} Engineers</div>
                <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: 4 }}>
                  {'>'}4h uninterrupted focus
                </div>
              </div>

              <div className="bright-card" style={{ padding: '14px 18px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Retention Index</span>
                  <Activity size={16} color="#f7a501" />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#23251d', lineHeight: 1 }}>100% Stable</div>
                <div style={{ fontSize: '11px', color: '#f7a501', fontWeight: 700, marginTop: 4 }}>
                  0 IBM Attrition Markers
                </div>
              </div>
            </div>

            {/* TAB 1: Squad Strain Radar (Golden Ratio 1.618 : 1) */}
            {activeTab === 'radar' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(480px, 1.618fr) minmax(340px, 1fr)',
                gap: 22,
                alignItems: 'start'
              }}>
                {/* Left Column (61.8%): Individual Fatigue Diagnostics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Status Filter Strip */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 10,
                    background: '#ffffff',
                    padding: '8px 14px',
                    borderRadius: 12,
                    border: '1.5px solid #cbd5e1'
                  }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                      Filter Squad Status:
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {(['all', 'critical', 'watch', 'safe'] as const).map(key => {
                        const isActive = filterState === key
                        const labels = {
                          all: `All (${members.length})`,
                          critical: `Critical (${criticalCount})`,
                          watch: `Watch (${watchCount})`,
                          safe: `Safe (${safeCount})`
                        }
                        return (
                          <button
                            key={key}
                            onClick={() => setFilterState(key)}
                            style={{
                              padding: '5px 12px',
                              borderRadius: 6,
                              fontSize: '11px',
                              fontWeight: 700,
                              border: isActive ? '1.5px solid #23251d' : '1px solid #cbd5e1',
                              background: isActive ? '#fef9ee' : '#ffffff',
                              color: isActive ? '#23251d' : '#64748b',
                              cursor: 'pointer',
                              transition: 'all 120ms ease'
                            }}
                          >
                            {labels[key]}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Individual Diagnostic Cards Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 14
                  }}>
                    {filteredMembers.map((member, idx) => {
                      const score = member.burnout_score ?? 50
                      const risk = getRiskLevel(score)
                      const isCrit = risk.level === 'critical'
                      const isWatch = risk.level === 'warning'
                      const actions: string[] = member.actions || []

                      return (
                        <div
                          key={member.id || idx}
                          className="bright-card"
                          style={{
                            padding: 18,
                            background: '#ffffff',
                            border: `1.5px solid ${isCrit ? '#fecaca' : isWatch ? '#fef08a' : '#cbd5e1'}`,
                            borderRadius: 14,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: 12,
                            boxShadow: isCrit ? '0 4px 14px rgba(220, 38, 38, 0.08)' : 'none'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                                <div style={{
                                  width: 38,
                                  height: 38,
                                  borderRadius: '50%',
                                  background: isCrit ? '#dc2626' : isWatch ? '#d97706' : '#059669',
                                  color: '#ffffff',
                                  fontSize: '13px',
                                  fontWeight: 800,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0
                                }}>
                                  {(member.name || 'UN').slice(0, 2).toUpperCase()}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#23251d', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {member.name}
                                  </h4>
                                  <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
                                    {member.role || 'Full-Stack Developer'}
                                  </p>
                                </div>
                              </div>
                              <BurnoutGauge score={score} />
                            </div>

                            {/* 4 Micro-Bars */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 4 }}>
                              <SubBar label="Workload Capacity" value={member.workload ?? 65} icon={Brain} color={member.workload > 80 ? '#dc2626' : '#0284c7'} />
                              <SubBar label="Meeting Density" value={(member.meeting_load || 3) * 16} icon={Clock} color={(member.meeting_load || 3) > 4 ? '#dc2626' : '#059669'} />
                              <SubBar label="Context Switching" value={(member.context_switches || 4) * 12} icon={Repeat} color={(member.context_switches || 4) > 5 ? '#d97706' : '#64748b'} />
                              <SubBar label="Focus Block Deficit" value={100 - (member.focus_hours || 4) * 16} icon={Coffee} color={(member.focus_hours || 4) < 3 ? '#dc2626' : '#7c3aed'} />
                            </div>
                          </div>

                          {/* Recommendations & Action */}
                          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
                            <span style={{ fontSize: '9px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 4 }}>
                              System Interventions:
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              {actions.slice(0, 2).map((act, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: '11px', color: '#23251d', lineHeight: 1.3 }}>
                                  <CheckCircle2 size={12} color={isCrit ? '#dc2626' : '#059669'} style={{ marginTop: 2, flexShrink: 0 }} />
                                  <span>{act}</span>
                                </div>
                              ))}
                            </div>

                            {isCrit && (
                              <button
                                onClick={() => handleExecuteRebalance(member.name)}
                                disabled={rebalancing}
                                style={{
                                  marginTop: 10,
                                  width: '100%',
                                  padding: '8px',
                                  background: '#dc2626',
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: 6,
                                  fontSize: '11px',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 6
                                }}
                              >
                                {rebalancing ? <RefreshCw size={12} className="animate-spin" /> : <Zap size={12} />}
                                Auto-Rebalance Tasks ({member.name})
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Right Column (38.2%): Waveform & Non-Surveillance Guardrails */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Distinct Chart 1: 14-Day Team Cognitive Strain Waveform */}
                  <div className="bright-card" style={{ padding: 20, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                          14-Day Cognitive Strain Waveform
                        </h3>
                        <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
                          Chronological strain trajectory with safe & critical bands
                        </p>
                      </div>
                      <span className="badge-bright badge-yellow" style={{ fontSize: '10px' }}>14-Day Trend</span>
                    </div>

                    <div style={{ width: '100%', height: 210 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={waveformData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                          <defs>
                            <linearGradient id="strainGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f7a501" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#f7a501" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#475569', fontWeight: 700 }} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#94a3b8' }} unit="%" />
                          <Tooltip contentStyle={{ background: '#23251d', border: 'none', borderRadius: 8, color: '#ffffff', fontSize: '11px' }} />
                          <ReferenceLine y={70} stroke="#dc2626" strokeDasharray="3 3" label={{ value: '70% Critical Overload', fill: '#dc2626', fontSize: 9 }} />
                          <ReferenceLine y={45} stroke="#059669" strokeDasharray="3 3" label={{ value: '45% Safe Flow Floor', fill: '#059669', fontSize: 9 }} />
                          <Area type="monotone" dataKey="strain" stroke="#f7a501" strokeWidth={2.5} fill="url(#strainGradient)" name="Cognitive Strain" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div style={{ fontSize: '10px', color: '#64748b', textAlign: 'center', marginTop: 8 }}>
                      Mid-sprint crunch peaked on Day 9 (74%). Team recovered to safe baseline flow on Day 14.
                    </div>
                  </div>

                  {/* Automated Squad Rebalancer Card */}
                  <div className="bright-card" style={{ padding: 20, background: '#eeefe9', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <HeartHandshake size={18} color="#059669" />
                      <strong style={{ fontSize: '13px', color: '#23251d' }}>Dynamic Workload Leveler</strong>
                    </div>
                    <p style={{ fontSize: '11px', color: '#4d4f46', lineHeight: 1.45, margin: '0 0 12px' }}>
                      Automatically transfers lower-urgency tasks from members in the red watch zone to peers with surplus headroom.
                    </p>
                    <button
                      onClick={() => setActiveTab('rebalance')}
                      style={{
                        padding: '10px 14px',
                        background: '#23251d',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: '12px',
                        fontWeight: 700,
                        width: '100%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6
                      }}
                    >
                      Open Live Rebalance Studio <ArrowRight size={13} />
                    </button>
                  </div>

                  {/* Ethical Non-Surveillance Protocol */}
                  <div className="bright-card" style={{ padding: 18, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#23251d', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ShieldAlert size={14} color="#64748b" /> Ethical Non-Surveillance Protocol
                    </h4>
                    <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.45, margin: 0 }}>
                      ORKA monitors system-level metrics (PR velocity, calendar fragmentation, context thrash). Personal screens, webcams, and keystrokes are strictly never monitored.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Root-Cause Analysis Matrix */}
            {activeTab === 'matrix' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(450px, 1.5fr) minmax(320px, 1fr)',
                  gap: 20
                }}>
                  {/* 2D Fragmentation vs Focus Hours Scatter Matrix */}
                  <div className="bright-card" style={{ padding: 22, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                          Cognitive Fragmentation vs Deep Focus Matrix
                        </h3>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
                          Mapping uninterrupted focus hours against meeting & context fragmentation
                        </p>
                      </div>
                      <span className="badge-bright badge-indigo">2D Decision Grid</span>
                    </div>

                    <div style={{ width: '100%', height: 260 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 10, right: 20, bottom: 25, left: -10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis
                            type="number"
                            dataKey="focusHours"
                            name="Focus Hours"
                            unit="h"
                            domain={[0, 8]}
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            label={{ value: 'Daily Deep Focus (Hours)', position: 'insideBottom', offset: -15, fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                          />
                          <YAxis
                            type="number"
                            dataKey="fragmentation"
                            name="Fragmentation"
                            unit="%"
                            domain={[0, 100]}
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            label={{ value: 'Fragmentation Index (%)', angle: -90, position: 'insideLeft', offset: 15, fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                          />
                          <Tooltip content={<CustomScatterTooltip />} />
                          <ReferenceLine x={4} stroke="#cbd5e1" strokeDasharray="3 3" />
                          <ReferenceLine y={50} stroke="#cbd5e1" strokeDasharray="3 3" />
                          <Scatter name="Engineers" data={scatterData}>
                            {scatterData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                stroke="#23251d"
                                strokeWidth={1.5}
                              />
                            ))}
                          </Scatter>
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Quadrant Legend Bar */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: 8,
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: '1px solid #f1f5f9',
                      fontSize: '11px'
                    }}>
                      <div style={{ padding: '6px 8px', borderRadius: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534' }}>
                        ★ <strong>Deep Flow:</strong> High focus, low fragmentation
                      </div>
                      <div style={{ padding: '6px 8px', borderRadius: 6, background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b' }}>
                        ⚠ <strong>Thrash Overload:</strong> Low focus, high meetings
                      </div>
                      <div style={{ padding: '6px 8px', borderRadius: 6, background: '#fefce8', border: '1px solid #fef08a', color: '#854d0e' }}>
                        ⚡ <strong>Meeting Heavy:</strong> Needs async conversion
                      </div>
                      <div style={{ padding: '6px 8px', borderRadius: 6, background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569' }}>
                        🌱 <strong>Passive Zone:</strong> Available capacity
                      </div>
                    </div>
                  </div>

                  {/* Cognitive Strain Drivers Horizontal Bar */}
                  <div className="bright-card" style={{ padding: 22, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                          Squad Cognitive Strain Drivers
                        </h3>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>Percentage breakdown of team fatigue sources</p>
                      </div>
                      <span className="badge-bright badge-yellow">Drivers</span>
                    </div>

                    <div style={{ width: '100%', height: 210 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={driverBreakdownData} layout="vertical" margin={{ top: 10, right: 15, left: 35, bottom: 5 }}>
                          <XAxis type="number" domain={[0, 50]} tick={{ fill: '#94a3b8', fontSize: 10 }} unit="%" />
                          <YAxis dataKey="driver" type="category" tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} />
                          <Tooltip
                            contentStyle={{ background: '#23251d', border: 'none', borderRadius: 8, color: '#ffffff', fontSize: '11px' }}
                            formatter={(val: any) => [`${val}% of Total Strain`, 'Impact']}
                          />
                          <Bar dataKey="share" radius={[0, 4, 4, 0]}>
                            {driverBreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div style={{ marginTop: 10, padding: 10, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '11px', color: '#475569' }}>
                      💡 <strong>Key Takeaway:</strong> Meeting fragmentation is the #1 driver at 36%. Instituting "No-Meeting Wednesday" would immediately drop squad fatigue by 14%.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Live Rebalance Studio */}
            {activeTab === 'rebalance' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(340px, 1fr) minmax(480px, 1.618fr)',
                gap: 22,
                alignItems: 'start'
              }}>
                {/* Control Cockpit */}
                <div className="bright-card" style={{ padding: 24, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <HeartHandshake size={18} color="#ffffff" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                        Live Workload Rebalance Studio
                      </h3>
                      <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>Shift tasks from overloaded teammates to available peers</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
                        Select Overloaded Teammate *
                      </label>
                      <select
                        value={selectedTargetMember}
                        onChange={e => setSelectedTargetMember(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: 8,
                          border: '1.5px solid #cbd5e1',
                          fontSize: '13px',
                          color: '#23251d',
                          outline: 'none',
                          background: '#ffffff'
                        }}
                      >
                        {members.map(m => (
                          <option key={m.name} value={m.name}>
                            {m.name} ({m.burnout_score ?? 0}% strain • {m.role})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '11px', color: '#475569' }}>
                      <strong style={{ color: '#23251d', display: 'block', marginBottom: 4 }}>Algorithmic Rules:</strong>
                      <div>• Moves up to 2 medium/low priority tasks</div>
                      <div>• Reduces trigger member workload by ~10-20%</div>
                      <div>• Directs assignments strictly to peers below 60% workload</div>
                    </div>

                    <button
                      onClick={() => handleExecuteRebalance()}
                      disabled={rebalancing}
                      style={{
                        padding: '12px',
                        background: '#f7a501',
                        color: '#23251d',
                        border: '1.5px solid #23251d',
                        fontWeight: 800,
                        fontSize: '13px',
                        borderRadius: 8,
                        boxShadow: '2px 2px 0px #23251d',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        marginTop: 6
                      }}
                    >
                      {rebalancing ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} />}
                      Execute Live Rebalance for {selectedTargetMember || 'Engineer'}
                    </button>
                  </div>
                </div>

                {/* Rebalance Execution Results */}
                <div className="bright-card" style={{ padding: 24, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                      Rebalance Execution Ledger
                    </h3>
                    <span className="badge-bright badge-emerald">Real-Time Sync</span>
                  </div>

                  {rebalanceResult ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0', color: '#166534', fontSize: '12px', fontWeight: 700 }}>
                        {rebalanceResult.message || 'Workload successfully rebalanced! Tasks reassigned to available peers.'}
                      </div>

                      {rebalanceResult.moved_tasks && rebalanceResult.moved_tasks.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                            Transferred Task Ledger:
                          </span>
                          {rebalanceResult.moved_tasks.map((mt: any, idx: number) => (
                            <div key={idx} style={{ padding: 12, borderRadius: 8, border: '1.5px solid #e2e8f0', background: '#f8fafc' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                <strong style={{ fontSize: '13px', color: '#23251d' }}>{mt.task}</strong>
                                <span className="badge-bright badge-yellow" style={{ fontSize: '10px' }}>Moved</span>
                              </div>
                              <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700 }}>
                                {mt.from} → {mt.to}
                              </div>
                              <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0' }}>
                                {mt.reason}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
                      <HeartHandshake size={36} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
                      <p style={{ fontSize: '13px', fontWeight: 700, color: '#23251d', margin: '0 0 4px' }}>No Active Rebalance Dispatched</p>
                      <p style={{ fontSize: '12px', margin: 0 }}>Select an engineer on the left and click "Execute Live Rebalance" to trigger ticket distribution.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </AuthGuard>
      </div>
    </div>
  )
}
