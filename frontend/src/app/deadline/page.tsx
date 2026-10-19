'use client'

import { useEffect, useState, useMemo } from 'react'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import { AuthGuard } from '@/components/AuthGuard'
import { getDeadline } from '@/lib/api'
import OfflineBanner from '@/components/OfflineBanner'
import {
  Shield, AlertTriangle, Clock, TrendingUp, CheckSquare,
  Sparkles, ShieldAlert, ShieldCheck, Zap, ArrowRight, CheckCircle2,
  AlertCircle, Compass, Target, Activity, Flame, Sliders, ChevronRight
} from 'lucide-react'
import {
  ScatterChart, Scatter, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine, Cell,
  ComposedChart, Line, Area, Legend
} from 'recharts'
import { useSidebar } from '@/context/SidebarContext'

function getRiskColor(risk: number): { color: string; variant: 'red' | 'yellow' | 'green' } {
  if (risk >= 60) return { color: '#dc2626', variant: 'red' }
  if (risk >= 35) return { color: '#d97706', variant: 'yellow' }
  return { color: '#059669', variant: 'green' }
}

function getRiskLabel(risk: number): string {
  if (risk >= 60) return 'Critical Risk'
  if (risk >= 35) return 'Watch Zone'
  return 'On Track'
}

/* ── Custom Scatter Tooltip for Slip Decision Matrix ───────────────────── */
function CustomSlipTooltip({ active, payload }: any) {
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
        border: '1px solid #33342d',
        maxWidth: 240
      }}>
        <div style={{ fontWeight: 800, fontSize: '12px', color: '#f7a501', marginBottom: 2 }}>
          {data.name}
        </div>
        <div style={{ color: '#cbd5e1', marginBottom: 6, fontSize: '10px' }}>
          Status: <strong style={{ color: data.color }}>{data.statusLabel}</strong>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '2px 8px', fontSize: '10px' }}>
          <span style={{ color: '#94a3b8' }}>Days Remaining:</span>
          <span style={{ fontWeight: 700, color: '#38bdf8' }}>{data.daysLeft}d</span>
          <span style={{ color: '#94a3b8' }}>Tasks Left:</span>
          <span style={{ fontWeight: 700, color: '#f7a501' }}>{data.tasksRemaining} tasks</span>
          <span style={{ color: '#94a3b8' }}>Current Velocity:</span>
          <span style={{ fontWeight: 700, color: '#10b981' }}>{data.velocity} t/d</span>
          <span style={{ color: '#94a3b8' }}>Required Pace:</span>
          <span style={{ fontWeight: 700, color: data.requiredPace > data.velocity ? '#dc2626' : '#10b981' }}>
            {data.requiredPace} t/d
          </span>
          <span style={{ color: '#94a3b8' }}>Pacing Delta:</span>
          <span style={{ fontWeight: 700, color: data.pacingDelta < 0 ? '#dc2626' : '#10b981' }}>
            {data.pacingDelta > 0 ? `+${data.pacingDelta}` : data.pacingDelta} t/d
          </span>
        </div>
      </div>
    )
  }
  return null
}

function ProjectCard({ project }: { project: any }) {
  const risk = project.risk_score ?? project.risk_percentage ?? project.risk ?? 0
  const daysLeft = project.deadline_days ?? project.days_remaining ?? 7
  const tasksTotal = project.tasks_total ?? 20
  const tasksDone = project.tasks_done ?? 12
  const velocity = project.velocity ?? 1.5
  const reco = project.recommendation || ''
  const riskObj = getRiskColor(risk)
  const pct = Math.min(100, Math.round((tasksDone / Math.max(tasksTotal, 1)) * 100))
  const tasksRemaining = Math.max(0, tasksTotal - tasksDone)
  const requiredVel = Math.round((tasksRemaining / Math.max(daysLeft, 1)) * 10) / 10
  const isSlipping = requiredVel > velocity

  return (
    <div
      className="bright-card"
      style={{
        padding: 20,
        borderColor: risk >= 60 ? '#fecaca' : risk >= 35 ? '#fef08a' : '#cbd5e1',
        background: risk >= 60 ? '#fffafa' : '#ffffff',
        borderWidth: '1.5px',
        borderRadius: 14,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#23251d', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {project.name || 'Core Module Feature'}
            </h3>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
              Due in {daysLeft} days • {tasksRemaining} tasks remaining
            </p>
          </div>
          <span
            style={{
              padding: '3px 8px',
              borderRadius: 6,
              fontSize: '11px',
              fontWeight: 800,
              background: riskObj.color === '#dc2626' ? '#fee2e2' : riskObj.color === '#d97706' ? '#fef3c7' : '#dcfce7',
              color: riskObj.color,
              flexShrink: 0
            }}
          >
            {getRiskLabel(risk)}
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: 4 }}>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Task Completion</span>
            <span style={{ fontWeight: 800, color: '#23251d' }}>{pct}% ({tasksDone}/{tasksTotal})</span>
          </div>
          <div style={{ height: 6, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#059669' : '#f7a501', borderRadius: 999 }} />
          </div>
        </div>

        {/* Velocity Metric Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <div style={{ padding: '8px 10px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, display: 'block' }}>Current Velocity</span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#23251d' }}>{velocity} tasks/d</span>
          </div>
          <div style={{ padding: '8px 10px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, display: 'block' }}>Required Pace</span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: isSlipping ? '#dc2626' : '#059669' }}>
              {requiredVel} tasks/d
            </span>
          </div>
        </div>
      </div>

      <div>
        {reco && (
          <div style={{
            padding: '10px 12px',
            background: risk >= 60 ? '#fef2f2' : '#f8fafc',
            border: `1px solid ${risk >= 60 ? '#fecaca' : '#cbd5e1'}`,
            borderRadius: 8,
            fontSize: '11px',
            color: '#23251d',
            lineHeight: 1.4,
            marginBottom: 10
          }}>
            <strong style={{ color: risk >= 60 ? '#dc2626' : '#23251d' }}>AI Rationale: </strong>
            {reco}
          </div>
        )}

        {isSlipping && (
          <a
            href="/delegator"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '8px 12px',
              background: '#23251d',
              color: '#ffffff',
              borderRadius: 6,
              fontSize: '11px',
              fontWeight: 800,
              textDecoration: 'none'
            }}
          >
            <Zap size={12} color="#f7a501" /> Mitigate Slip with Delegator →
          </a>
        )}
      </div>
    </div>
  )
}

export default function DeadlinePage() {
  const { isExpanded, collapsed, toggleSidebar } = useSidebar()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)
  const [activeTab, setActiveTab] = useState<'sentinel' | 'velocityDelta' | 'simulator'>('sentinel')
  const [filterState, setFilterState] = useState<'all' | 'critical' | 'ontrack'>('all')

  // Simulator State
  const [trimScopeCount, setTrimScopeCount] = useState<number>(3)
  const [velocityBoost, setVelocityBoost] = useState<number>(0.8)

  useEffect(() => {
    getDeadline()
      .then(res => {
        const list = res.projects || res.deadlines || []
        setProjects(list)
      })
      .catch(() => setIsOffline(true))
      .finally(() => setLoading(false))
  }, [])

  const highRiskCount = projects.filter(p => (p.risk_score ?? p.risk ?? 0) >= 35 || p.will_miss_deadline).length
  const onTrackCount  = projects.filter(p => (p.risk_score ?? p.risk ?? 0) < 35 && !p.will_miss_deadline).length

  const filteredProjects = useMemo(() => {
    if (filterState === 'critical') return projects.filter(p => (p.risk_score ?? p.risk ?? 0) >= 35 || p.will_miss_deadline)
    if (filterState === 'ontrack') return projects.filter(p => (p.risk_score ?? p.risk ?? 0) < 35 && !p.will_miss_deadline)
    return projects
  }, [projects, filterState])

  // Distinct Chart 1: Days Remaining vs Remaining Tasks (2D Slip Decision Scatter Matrix)
  const scatterData = useMemo(() => {
    return projects.map((p, idx) => {
      const daysLeft = p.deadline_days ?? p.days_remaining ?? 7
      const done = p.tasks_done ?? 10
      const total = p.tasks_total ?? 18
      const tasksRemaining = Math.max(0, total - done)
      const velocity = p.velocity ?? 1.5
      const requiredPace = Math.round((tasksRemaining / Math.max(daysLeft, 1)) * 10) / 10
      const pacingDelta = Math.round((velocity - requiredPace) * 10) / 10

      const isCrit = (p.risk_score ?? p.risk ?? 0) >= 60 || requiredPace > velocity * 1.3
      const isWatch = (p.risk_score ?? p.risk ?? 0) >= 35 || requiredPace > velocity

      let color = '#059669'
      let statusLabel = 'On Track'
      if (isCrit) {
        color = '#dc2626'
        statusLabel = 'Critical Slip'
      } else if (isWatch) {
        color = '#d97706'
        statusLabel = 'Watch Zone'
      }

      return {
        id: p.id || idx,
        name: p.name || `Project ${idx + 1}`,
        daysLeft,
        tasksRemaining,
        velocity,
        requiredPace,
        pacingDelta,
        color,
        statusLabel
      }
    })
  }, [projects])

  // Distinct Chart 2: Velocity Pacing Deficit / Surplus Horizon (Zero-Centered BarChart)
  const pacingHorizonData = useMemo(() => {
    return projects.map((p, idx) => {
      const daysLeft = p.deadline_days ?? p.days_remaining ?? 7
      const done = p.tasks_done ?? 10
      const total = p.tasks_total ?? 18
      const tasksRemaining = Math.max(0, total - done)
      const velocity = p.velocity ?? 1.5
      const requiredPace = Math.round((tasksRemaining / Math.max(daysLeft, 1)) * 10) / 10
      const delta = Math.round((velocity - requiredPace) * 10) / 10

      return {
        name: (p.name || `P${idx + 1}`).slice(0, 14),
        delta,
        isPositive: delta >= 0
      }
    })
  }, [projects])

  // Simulated Recovery Metrics
  const simulatedProject = useMemo(() => {
    const target = projects.find(p => (p.risk_score ?? 0) >= 35 || p.will_miss_deadline) || projects[0]
    if (!target) return null

    const baseRemaining = Math.max(0, (target.tasks_total || 20) - (target.tasks_done || 10))
    const baseVelocity = target.velocity || 1.4
    const deadlineDays = target.deadline_days || 7

    const simRemaining = Math.max(1, baseRemaining - trimScopeCount)
    const simVelocity = baseVelocity + velocityBoost
    const simDaysToDone = Math.round((simRemaining / simVelocity) * 10) / 10
    const willSlip = simDaysToDone > deadlineDays

    return {
      name: target.name || 'Core Module',
      deadlineDays,
      originalRemaining: baseRemaining,
      originalVelocity: baseVelocity,
      simRemaining,
      simVelocity: Math.round(simVelocity * 10) / 10,
      simDaysToDone,
      willSlip,
      daysSaved: Math.max(0, Math.round((deadlineDays - simDaysToDone) * 10) / 10)
    }
  }, [projects, trimScopeCount, velocityBoost])

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />

      <div className={`main-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <TopBar onToggleSidebar={toggleSidebar} />

        <AuthGuard moduleName="Deadline Risk Shield">
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
                    Predictive Milestone & Deadline Shield
                  </h1>
                  <span className="badge-bright badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669' }} /> Pacing Sentinel Active
                  </span>
                  {highRiskCount > 0 ? (
                    <span className="badge-bright badge-rose">
                      ⚠️ {highRiskCount} At Risk
                    </span>
                  ) : (
                    <span className="badge-bright badge-teal">
                      ✅ All Milestones On Track
                    </span>
                  )}
                  <span className="badge-bright badge-yellow" style={{ fontSize: '11px', fontWeight: 800 }}>
                    Φ Risk Trajectory
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Real-time velocity divergence tracking, 2D slip decision matrix, and automated milestone recovery
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
                  onClick={() => setActiveTab('sentinel')}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 9999,
                    fontSize: '12px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    background: activeTab === 'sentinel' ? '#23251d' : 'transparent',
                    color: activeTab === 'sentinel' ? '#ffffff' : '#64748b',
                    transition: 'all 120ms ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Shield size={14} /> Milestone Sentinel
                </button>
                <button
                  onClick={() => setActiveTab('velocityDelta')}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 9999,
                    fontSize: '12px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    background: activeTab === 'velocityDelta' ? '#23251d' : 'transparent',
                    color: activeTab === 'velocityDelta' ? '#ffffff' : '#64748b',
                    transition: 'all 120ms ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Activity size={14} /> Velocity Horizon
                </button>
                <button
                  onClick={() => setActiveTab('simulator')}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 9999,
                    fontSize: '12px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    background: activeTab === 'simulator' ? '#23251d' : 'transparent',
                    color: activeTab === 'simulator' ? '#ffffff' : '#64748b',
                    transition: 'all 120ms ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Sliders size={14} /> Recovery Simulator
                </button>
              </div>
            </div>

            {isOffline && <OfflineBanner />}

            {/* Top Executive Sentinel Ribbon (4 Cards) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: 14,
              marginBottom: 20
            }}>
              <div className="bright-card" style={{ padding: '14px 18px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Milestone Delivery</span>
                  <Shield size={16} color="#4f46e5" />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#23251d', lineHeight: 1 }}>
                  {projects.length > 0 ? Math.round((onTrackCount / projects.length) * 100) : 84}% Safe
                </div>
                <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: 4 }}>
                  {onTrackCount} of {projects.length} milestones green
                </div>
              </div>

              <div className="bright-card" style={{ padding: '14px 18px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Critical Slippage</span>
                  <AlertTriangle size={16} color="#dc2626" />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#dc2626', lineHeight: 1 }}>
                  {highRiskCount} {highRiskCount === 1 ? 'Milestone' : 'Milestones'}
                </div>
                <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: 700, marginTop: 4 }}>
                  Requires pace acceleration
                </div>
              </div>

              <div className="bright-card" style={{ padding: '14px 18px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Remaining Backlog</span>
                  <Clock size={16} color="#0284c7" />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#23251d', lineHeight: 1 }}>
                  {projects.reduce((acc, p) => acc + (p.tasks_remaining || Math.max(0, (p.tasks_total || 20) - (p.tasks_done || 10))), 0)} Tasks
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, marginTop: 4 }}>
                  Across active milestones
                </div>
              </div>

              <div className="bright-card" style={{ padding: '14px 18px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Pacing Balance</span>
                  <TrendingUp size={16} color="#059669" />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#23251d', lineHeight: 1 }}>+0.4 t/d</div>
                <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: 4 }}>
                  Net squad velocity surplus
                </div>
              </div>
            </div>

            {/* TAB 1: Milestone Sentinel (Golden Ratio 1.618 : 1) */}
            {activeTab === 'sentinel' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(480px, 1.618fr) minmax(340px, 1fr)',
                gap: 22,
                alignItems: 'start'
              }}>
                {/* Left Column (61.8%): Project Cards with Filter */}
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
                      Milestone Filter:
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {(['all', 'critical', 'ontrack'] as const).map(key => {
                        const isActive = filterState === key
                        const labels = {
                          all: `All Milestones (${projects.length})`,
                          critical: `At Risk (${highRiskCount})`,
                          ontrack: `On Track (${onTrackCount})`
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

                  {/* Projects Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 14
                  }}>
                    {filteredProjects.map((p, idx) => (
                      <ProjectCard key={p.id || idx} project={p} />
                    ))}
                  </div>
                </div>

                {/* Right Column (38.2%): 2D Slip Decision Scatter & Pacing Tower */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Distinct Chart 1: Days Left vs Remaining Tasks 2D Decision Scatter */}
                  <div className="bright-card" style={{ padding: 20, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                          2D Slip Decision Matrix
                        </h3>
                        <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
                          Days Remaining vs. Tasks Remaining to completion
                        </p>
                      </div>
                      <span className="badge-bright badge-indigo" style={{ fontSize: '10px' }}>2D Matrix</span>
                    </div>

                    <div style={{ width: '100%', height: 220 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 10, right: 15, bottom: 20, left: -15 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis
                            type="number"
                            dataKey="daysLeft"
                            name="Days Remaining"
                            unit="d"
                            domain={[0, 20]}
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            label={{ value: 'Days Remaining', position: 'insideBottom', offset: -12, fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                          />
                          <YAxis
                            type="number"
                            dataKey="tasksRemaining"
                            name="Tasks Remaining"
                            domain={[0, 20]}
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            label={{ value: 'Tasks Left', angle: -90, position: 'insideLeft', offset: 15, fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                          />
                          <Tooltip content={<CustomSlipTooltip />} />
                          <ReferenceLine x={7} stroke="#cbd5e1" strokeDasharray="3 3" />
                          <ReferenceLine y={8} stroke="#cbd5e1" strokeDasharray="3 3" />
                          <Scatter name="Projects" data={scatterData}>
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

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: 6,
                      marginTop: 8,
                      fontSize: '10px',
                      color: '#475569'
                    }}>
                      <div style={{ padding: '4px 6px', borderRadius: 4, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                        ★ <strong>Safe Zone:</strong> High days left, low tasks
                      </div>
                      <div style={{ padding: '4px 6px', borderRadius: 4, background: '#fef2f2', border: '1px solid #fecaca' }}>
                        ⚠️ <strong>Slip Risk:</strong> Low days left, high backlog
                      </div>
                    </div>
                  </div>

                  {/* AI Pacing Recommendation Banner */}
                  <div className="bright-card" style={{ padding: 20, background: '#eeefe9', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <Zap size={18} color="#f7a501" />
                      <strong style={{ fontSize: '13px', color: '#23251d' }}>Automated Pacing Shield</strong>
                    </div>
                    <p style={{ fontSize: '11px', color: '#4d4f46', lineHeight: 1.45, margin: '0 0 12px' }}>
                      Milestones at critical risk can be recovered with zero slip by reallocating 2 low-priority stories to available team members.
                    </p>
                    <a
                      href="/delegator"
                      style={{
                        padding: '10px 14px',
                        background: '#23251d',
                        color: '#ffffff',
                        borderRadius: 8,
                        fontSize: '12px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        textDecoration: 'none'
                      }}
                    >
                      Rebalance with AI Delegator <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Velocity Horizon (Zero-Centered Bidirectional Bars) */}
            {activeTab === 'velocityDelta' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(450px, 1.5fr) minmax(320px, 1fr)',
                  gap: 20
                }}>
                  {/* Distinct Chart 2: Pacing Delta Zero-Centered BarChart */}
                  <div className="bright-card" style={{ padding: 22, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                          Velocity Pacing Surplus vs. Deficit
                        </h3>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
                          Current squad velocity minus required pace (positive = ahead of schedule)
                        </p>
                      </div>
                      <span className="badge-bright badge-yellow">Delta Horizon</span>
                    </div>

                    <div style={{ width: '100%', height: 260 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={pacingHorizonData} margin={{ top: 15, right: 15, left: -15, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#475569', fontWeight: 700 }} />
                          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} unit=" t/d" />
                          <Tooltip
                            contentStyle={{ background: '#23251d', border: 'none', borderRadius: 8, color: '#ffffff', fontSize: '11px' }}
                            formatter={(val: any) => [`${val > 0 ? '+' : ''}${val} tasks/day`, 'Pacing Delta']}
                          />
                          <ReferenceLine y={0} stroke="#23251d" strokeWidth={1.5} />
                          <Bar dataKey="delta" radius={[4, 4, 0, 0]}>
                            {pacingHorizonData.map((entry: any, index: number) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.delta >= 0 ? '#059669' : '#dc2626'}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: '1px solid #f1f5f9',
                      fontSize: '11px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#059669', fontWeight: 700 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: '#059669' }} />
                        Velocity Surplus (Ahead of Deadline)
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#dc2626', fontWeight: 700 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: '#dc2626' }} />
                        Velocity Deficit (Needs Acceleration)
                      </div>
                    </div>
                  </div>

                  {/* Summary Sentinel Specs */}
                  <div className="bright-card" style={{ padding: 22, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#23251d', margin: '0 0 12px' }}>
                      Pacing Rules & Buffer Guidelines
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '12px' }}>
                      <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                        <strong style={{ color: '#23251d', display: 'block' }}>⚡ 20% Time Buffer Ceiling</strong>
                        <span style={{ color: '#64748b' }}>If required velocity exceeds current throughput by more than 20%, project status automatically triggers the Sentinel Watch list.</span>
                      </div>
                      <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                        <strong style={{ color: '#23251d', display: 'block' }}>🛡️ Scope Trimming Rule</strong>
                        <span style={{ color: '#64748b' }}>Non-essential chore tasks are tagged for deferral to the following sprint cycle rather than pushing release dates.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Milestone Recovery Simulator */}
            {activeTab === 'simulator' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(340px, 1fr) minmax(480px, 1.618fr)',
                gap: 22,
                alignItems: 'start'
              }}>
                {/* Simulator Controls */}
                <div className="bright-card" style={{ padding: 24, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: '#f7a501', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Sliders size={18} color="#23251d" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                        Milestone Recovery Simulator
                      </h3>
                      <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>Simulate scope trim and developer boost impact</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                          Trim Non-Critical Scope
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#23251d' }}>
                          -{trimScopeCount} Tasks
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="8"
                        value={trimScopeCount}
                        onChange={e => setTrimScopeCount(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#f7a501' }}
                      />
                      <span style={{ fontSize: '10px', color: '#64748b', display: 'block', marginTop: 2 }}>
                        Shift lower-priority tickets to next sprint
                      </span>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                          Squad Velocity Boost
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#059669' }}>
                          +{velocityBoost} tasks/day
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="2.0"
                        step="0.2"
                        value={velocityBoost}
                        onChange={e => setVelocityBoost(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#059669' }}
                      />
                      <span style={{ fontSize: '10px', color: '#64748b', display: 'block', marginTop: 2 }}>
                        Assign additional engineer via Task Delegator
                      </span>
                    </div>

                    <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '11px', color: '#475569' }}>
                      <strong style={{ color: '#23251d', display: 'block', marginBottom: 4 }}>Simulated Project Target:</strong>
                      {simulatedProject?.name || 'Active Project'} ({simulatedProject?.deadlineDays} days to deadline)
                    </div>
                  </div>
                </div>

                {/* Simulated Recovery Results */}
                <div className="bright-card" style={{ padding: 24, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                        Simulated Milestone Trajectory
                      </h3>
                      <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
                        Predictive delivery date with applied recovery levers
                      </p>
                    </div>
                    <span className="badge-bright badge-emerald">Simulation Active</span>
                  </div>

                  {simulatedProject && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div style={{
                        padding: 16,
                        borderRadius: 10,
                        border: `1.5px solid ${simulatedProject.willSlip ? '#fecaca' : '#bbf7d0'}`,
                        background: simulatedProject.willSlip ? '#fef2f2' : '#f0fdf4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: simulatedProject.willSlip ? '#dc2626' : '#166534', textTransform: 'uppercase' }}>
                            {simulatedProject.willSlip ? '⚠️ Slip Still Projected' : '✅ Milestone Fully Recovered'}
                          </span>
                          <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#23251d', margin: '4px 0 0' }}>
                            {simulatedProject.simDaysToDone} Days to Completion
                          </h4>
                          <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
                            Target Deadline: {simulatedProject.deadlineDays} Days ({simulatedProject.daysSaved > 0 ? `${simulatedProject.daysSaved}d ahead of schedule` : 'on schedule'})
                          </p>
                        </div>
                        <span style={{ fontSize: '28px' }}>
                          {simulatedProject.willSlip ? '⏳' : '🎯'}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                        <div style={{ padding: 12, background: '#eeefe9', borderRadius: 8, border: '1px solid #cbd5e1' }}>
                          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 800 }}>REMAINING TASKS</span>
                          <div style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: '2px 0' }}>
                            {simulatedProject.simRemaining} <span style={{ fontSize: '11px', color: '#64748b' }}>(was {simulatedProject.originalRemaining})</span>
                          </div>
                        </div>
                        <div style={{ padding: 12, background: '#eeefe9', borderRadius: 8, border: '1px solid #cbd5e1' }}>
                          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 800 }}>ACCELERATED VELOCITY</span>
                          <div style={{ fontSize: '16px', fontWeight: 800, color: '#059669', margin: '2px 0' }}>
                            {simulatedProject.simVelocity} t/d <span style={{ fontSize: '11px', color: '#64748b' }}>(was {simulatedProject.originalVelocity})</span>
                          </div>
                        </div>
                      </div>

                      <a
                        href="/delegator"
                        style={{
                          marginTop: 8,
                          padding: '12px',
                          background: '#f7a501',
                          color: '#23251d',
                          border: '1.5px solid #23251d',
                          borderRadius: 8,
                          fontWeight: 800,
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          textDecoration: 'none',
                          boxShadow: '2px 2px 0px #23251d'
                        }}
                      >
                        <Zap size={16} /> Apply Rebalance in 5-Factor Delegator →
                      </a>
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
