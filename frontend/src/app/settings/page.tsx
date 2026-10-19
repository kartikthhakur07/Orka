'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import { AuthGuard } from '@/components/AuthGuard'
import {
  Settings,
  Shield,
  Sliders,
  Server,
  Bell,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  Database,
  Cpu,
  Layers,
  Activity,
  Flame,
  Building2,
  Calendar,
  Zap,
  CheckCircle,
  Download,
  Send,
  AlertTriangle,
  Info
} from 'lucide-react'
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts'
import { useSidebar } from '@/context/SidebarContext'

type SettingsTab = 'decision' | 'hybrid' | 'sprint' | 'infra' | 'alerts'

export default function SettingsPage() {
  const { isExpanded, collapsed, toggleSidebar } = useSidebar()
  const [activeTab, setActiveTab] = useState<SettingsTab>('decision')

  // Decision & Scoring Hyperparameters
  const [burnoutThreshold, setBurnoutThreshold] = useState(75)
  const [taskSplitHours, setTaskSplitHours] = useState(8)
  const [minMatchScore, setMinMatchScore] = useState(60)

  // 5-Factor AI Dispatch Weights (must sum to 100%)
  const [weightSkill, setWeightSkill] = useState(30)
  const [weightBurnout, setWeightBurnout] = useState(25)
  const [weightCapacity, setWeightCapacity] = useState(20)
  const [weightVelocity, setWeightVelocity] = useState(15)
  const [weightTimezone, setWeightTimezone] = useState(10)

  // WFH & Hybrid Attendance
  const [officeCoverage, setOfficeCoverage] = useState(40)
  const [commuteExemptionKm, setCommuteExemptionKm] = useState(35)
  const [anchorDay, setAnchorDay] = useState('tue_thu')

  // Sprint & Capacity
  const [maxHoursPerDay, setMaxHoursPerDay] = useState(8)
  const [sprintBufferPercent, setSprintBufferPercent] = useState(15)
  const [rebalanceSensitivity, setRebalanceSensitivity] = useState<'high' | 'medium' | 'low'>('medium')

  // Infra & Routing
  const [apiEndpoint, setApiEndpoint] = useState('local')
  const [pingLatency, setPingLatency] = useState<number | null>(null)
  const [pinging, setPinging] = useState(false)

  // Alerts & Notifications
  const [notifyBurnout, setNotifyBurnout] = useState(true)
  const [notifyDeadline, setNotifyDeadline] = useState(true)
  const [autoRebalance, setAutoRebalance] = useState(false)
  const [slackWebhookSent, setSlackWebhookSent] = useState(false)

  // Save state
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('orka_settings')
      if (stored) {
        const s = JSON.parse(stored)
        if (s.burnoutThreshold) setBurnoutThreshold(s.burnoutThreshold)
        if (s.taskSplitHours) setTaskSplitHours(s.taskSplitHours)
        if (s.minMatchScore) setMinMatchScore(s.minMatchScore)
        if (s.officeCoverage) setOfficeCoverage(s.officeCoverage)
        if (s.commuteExemptionKm) setCommuteExemptionKm(s.commuteExemptionKm)
        if (s.anchorDay) setAnchorDay(s.anchorDay)
        if (s.maxHoursPerDay) setMaxHoursPerDay(s.maxHoursPerDay)
        if (s.sprintBufferPercent) setSprintBufferPercent(s.sprintBufferPercent)
        if (s.apiEndpoint) setApiEndpoint(s.apiEndpoint)
        if (s.notifyBurnout !== undefined) setNotifyBurnout(s.notifyBurnout)
        if (s.notifyDeadline !== undefined) setNotifyDeadline(s.notifyDeadline)
        if (s.autoRebalance !== undefined) setAutoRebalance(s.autoRebalance)
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
  }, [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const settingsObj = {
      burnoutThreshold,
      taskSplitHours,
      minMatchScore,
      officeCoverage,
      commuteExemptionKm,
      anchorDay,
      maxHoursPerDay,
      sprintBufferPercent,
      rebalanceSensitivity,
      apiEndpoint,
      notifyBurnout,
      notifyDeadline,
      autoRebalance,
      weights: {
        skill: weightSkill,
        burnout: weightBurnout,
        capacity: weightCapacity,
        velocity: weightVelocity,
        timezone: weightTimezone
      }
    }
    try {
      localStorage.setItem('orka_settings', JSON.stringify(settingsObj))
      setSaved(true)
      setTimeout(() => setSaved(false), 2400)
    } catch (e) {
      console.error('Failed to save settings:', e)
    }
  }

  const handleReset = () => {
    setBurnoutThreshold(75)
    setTaskSplitHours(8)
    setMinMatchScore(60)
    setWeightSkill(30)
    setWeightBurnout(25)
    setWeightCapacity(20)
    setWeightVelocity(15)
    setWeightTimezone(10)
    setOfficeCoverage(40)
    setCommuteExemptionKm(35)
    setAnchorDay('tue_thu')
    setMaxHoursPerDay(8)
    setSprintBufferPercent(15)
    setRebalanceSensitivity('medium')
    setApiEndpoint('local')
    setNotifyBurnout(true)
    setNotifyDeadline(true)
    setAutoRebalance(false)
  }

  const testPing = () => {
    setPinging(true)
    setTimeout(() => {
      setPingLatency(Math.floor(Math.random() * 25) + 32)
      setPinging(false)
    }, 600)
  }

  const sendTestWebhook = () => {
    setSlackWebhookSent(true)
    setTimeout(() => setSlackWebhookSent(false), 3000)
  }

  // Calculate Policy Health Score based on balanced parameters
  const policyScore = useMemo(() => {
    let score = 95
    if (burnoutThreshold > 85) score -= 10
    if (officeCoverage > 60 || officeCoverage < 30) score -= 8
    if (maxHoursPerDay > 9) score -= 12
    return Math.max(score, 60)
  }, [burnoutThreshold, officeCoverage, maxHoursPerDay])

  const gaugeData = useMemo(() => [
    { name: 'Policy Harmony', value: policyScore, fill: policyScore >= 85 ? '#059669' : '#f7a501' }
  ], [policyScore])

  // Weight Allocator Bar Chart Data
  const weightsData = useMemo(() => [
    { factor: 'Skill Match', weight: weightSkill, fill: '#4f46e5' },
    { factor: 'Burnout Shield', weight: weightBurnout, fill: '#059669' },
    { factor: 'Capacity Margin', weight: weightCapacity, fill: '#0284c7' },
    { factor: 'Velocity History', weight: weightVelocity, fill: '#f7a501' },
    { factor: 'Async Harmony', weight: weightTimezone, fill: '#7c3aed' },
  ], [weightSkill, weightBurnout, weightCapacity, weightVelocity, weightTimezone])

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />

      <main className={`main-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <TopBar onToggleSidebar={toggleSidebar} />

        <AuthGuard moduleName="System Settings & Policy Engine">
          <div className="page-container">
            {/* Golden Ratio Header */}
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
                    System Settings & Policy Engine
                  </h1>
                  <span className="badge-bright badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669' }} /> Policy Synced
                  </span>
                  <span className="badge-bright badge-yellow" style={{ fontSize: '11px', fontWeight: 800 }}>
                    Φ Governance Matrix
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Configure AI 5-factor scoring weights, hybrid attendance floors, sprint capacity limits, and infrastructure telemetry
                </p>
              </div>

              {saved && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 16px',
                  borderRadius: 8,
                  background: '#dcfce7',
                  border: '1.5px solid #16a34a',
                  color: '#15803d',
                  fontWeight: 800,
                  fontSize: '12px',
                  boxShadow: '1px 1px 0px #16a34a'
                }}>
                  <Check size={14} /> Policies Successfully Saved!
                </div>
              )}
            </div>


            {/* Main Golden Ratio Layout (38.2% Minor : 61.8% Major) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(300px, 1fr) minmax(520px, 1.618fr)',
              gap: 21,
              alignItems: 'start'
            }}>
              {/* Left Column (38.2% Minor): Category Navigation & Live Policy Gauge */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 21 }}>
                {/* Policy Category Nav Menu */}
                <div className="bright-card" style={{ padding: 10, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                  <div style={{ padding: '8px 12px 12px', borderBottom: '1.5px solid #f1f5f9' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Governance Categories
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab('decision')}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: activeTab === 'decision' ? '#eeefe9' : 'transparent',
                        color: activeTab === 'decision' ? '#23251d' : '#475569',
                        fontWeight: activeTab === 'decision' ? 800 : 600,
                        fontSize: '13px',
                        transition: 'all 120ms ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Sliders size={16} color={activeTab === 'decision' ? '#f7a501' : '#64748b'} />
                        <span>AI Decision Engine</span>
                      </div>
                      <span className="badge-bright badge-yellow" style={{ fontSize: '10px' }}>5 Factors</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('hybrid')}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: activeTab === 'hybrid' ? '#eeefe9' : 'transparent',
                        color: activeTab === 'hybrid' ? '#23251d' : '#475569',
                        fontWeight: activeTab === 'hybrid' ? 800 : 600,
                        fontSize: '13px',
                        transition: 'all 120ms ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Building2 size={16} color={activeTab === 'hybrid' ? '#0284c7' : '#64748b'} />
                        <span>Hybrid & WFH Rules</span>
                      </div>
                      <span className="badge-bright badge-blue" style={{ fontSize: '10px' }}>{officeCoverage}% Quorum</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('sprint')}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: activeTab === 'sprint' ? '#eeefe9' : 'transparent',
                        color: activeTab === 'sprint' ? '#23251d' : '#475569',
                        fontWeight: activeTab === 'sprint' ? 800 : 600,
                        fontSize: '13px',
                        transition: 'all 120ms ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Calendar size={16} color={activeTab === 'sprint' ? '#059669' : '#64748b'} />
                        <span>Sprint & Capacity</span>
                      </div>
                      <span className="badge-bright badge-emerald" style={{ fontSize: '10px' }}>{maxHoursPerDay}h Cap</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('infra')}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: activeTab === 'infra' ? '#eeefe9' : 'transparent',
                        color: activeTab === 'infra' ? '#23251d' : '#475569',
                        fontWeight: activeTab === 'infra' ? 800 : 600,
                        fontSize: '13px',
                        transition: 'all 120ms ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Server size={16} color={activeTab === 'infra' ? '#4f46e5' : '#64748b'} />
                        <span>API & Cloud Infra</span>
                      </div>
                      <span className="badge-bright badge-purple" style={{ fontSize: '10px' }}>{apiEndpoint.toUpperCase()}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('alerts')}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: activeTab === 'alerts' ? '#eeefe9' : 'transparent',
                        color: activeTab === 'alerts' ? '#23251d' : '#475569',
                        fontWeight: activeTab === 'alerts' ? 800 : 600,
                        fontSize: '13px',
                        transition: 'all 120ms ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Bell size={16} color={activeTab === 'alerts' ? '#dc2626' : '#64748b'} />
                        <span>Alerts & Automation</span>
                      </div>
                      <span className="badge-bright badge-yellow" style={{ fontSize: '10px' }}>3 Active</span>
                    </button>
                  </div>
                </div>

                {/* Policy Harmony Radial Gauge Card */}
                <div className="bright-card" style={{ padding: 20, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                        Policy Health Ring
                      </h3>
                      <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>Computed configuration stability</p>
                    </div>
                    <span className="badge-bright badge-emerald">Enforced</span>
                  </div>

                  <div style={{ width: '100%', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={12} data={gaugeData} startAngle={90} endAngle={-270}>
                        <RadialBar background dataKey="value" cornerRadius={10} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div style={{ position: 'absolute', textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: '#23251d' }}>{policyScore}%</div>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#059669' }}>Optimal Balance</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', color: '#475569', background: '#f8fafc', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ color: '#64748b' }}>Compute Quotas:</span>
                      <strong>14,820 / 50k reqs</strong>
                    </div>
                    <div style={{ width: '100%', height: 5, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: '29.6%', height: '100%', background: '#059669', borderRadius: 3 }} />
                    </div>
                  </div>
                </div>

                {/* Quick Presets & Export Actions */}
                <div className="bright-card" style={{ padding: 18, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#23251d', display: 'block', marginBottom: 10 }}>
                    Policy Presets & Controls
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="btn-secondary"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        padding: '8px 12px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}
                    >
                      <RotateCcw size={13} /> Reset to Golden Ratio Defaults
                    </button>
                    <button
                      type="button"
                      onClick={() => alert('Policy configuration exported to orka_policy.json')}
                      className="btn-secondary"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        padding: '8px 12px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}
                    >
                      <Download size={13} /> Export Policy Spec (.json)
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column (61.8% Major): Active Policy Panel & Interactive Simulator */}
              <div>
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Category 1: AI Decision Engine */}
                  {activeTab === 'decision' && (
                    <div className="bright-card" style={{ padding: 22, background: '#ffffff', borderRadius: 14, border: '1.5px solid #cbd5e1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 12, borderBottom: '1.5px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Sliders size={20} color="#f7a501" />
                          <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                              AI Decision Engine Hyperparameters
                            </h3>
                            <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
                              Tune candidate disqualification criteria, automatic subtask breakdown, and match thresholds
                            </p>
                          </div>
                        </div>
                        <span className="badge-bright badge-yellow">5-Factor Engine</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        {/* Burnout Disqualification Slider */}
                        <div style={{ padding: 14, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <label style={{ fontSize: '12px', fontWeight: 800, color: '#23251d' }}>
                              Burnout Disqualification Threshold
                            </label>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: burnoutThreshold > 80 ? '#dc2626' : '#059669' }}>
                              {burnoutThreshold}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="95"
                            value={burnoutThreshold}
                            onChange={e => setBurnoutThreshold(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#f7a501' }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: '11px', color: '#64748b' }}>
                            <span>50% (Aggressive Protection)</span>
                            <span>95% (High Risk Tolerance)</span>
                          </div>
                          <div style={{ marginTop: 8, fontSize: '11px', color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Info size={13} color="#0284c7" />
                            <span>
                              <strong>Impact Simulator:</strong> Any developer with cognitive strain &gt; {burnoutThreshold}% is automatically excluded from new task delegation.
                            </span>
                          </div>
                        </div>

                        {/* Task Split Complexity Threshold */}
                        <div style={{ padding: 14, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <label style={{ fontSize: '12px', fontWeight: 800, color: '#23251d' }}>
                              Auto-Split Task Complexity Ceiling
                            </label>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#0284c7' }}>
                              {taskSplitHours} hours
                            </span>
                          </div>
                          <input
                            type="range"
                            min="4"
                            max="16"
                            step="2"
                            value={taskSplitHours}
                            onChange={e => setTaskSplitHours(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#0284c7' }}
                          />
                          <p style={{ fontSize: '11px', color: '#64748b', margin: '6px 0 0' }}>
                            Tasks exceeding {taskSplitHours} estimated hours will be automatically partitioned into micro-subtasks by the Orka Delegator LLM.
                          </p>
                        </div>

                        {/* 5-Factor Dispatch Weight Allocator */}
                        <div style={{ marginTop: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#23251d' }}>
                              5-Factor Dispatch Weight Allocation
                            </span>
                            <span className="badge-bright badge-purple" style={{ fontSize: '10px' }}>
                              Total: {weightSkill + weightBurnout + weightCapacity + weightVelocity + weightTimezone}%
                            </span>
                          </div>

                          <div style={{ width: '100%', height: 160 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={weightsData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                                <XAxis type="number" domain={[0, 50]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <YAxis type="category" dataKey="factor" tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }} />
                                <Tooltip contentStyle={{ background: '#23251d', border: 'none', borderRadius: 8, color: '#fff', fontSize: '11px' }} />
                                <Bar dataKey="weight" radius={[0, 4, 4, 0]}>
                                  {weightsData.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Category 2: Hybrid & WFH Rules */}
                  {activeTab === 'hybrid' && (
                    <div className="bright-card" style={{ padding: 22, background: '#ffffff', borderRadius: 14, border: '1.5px solid #cbd5e1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 12, borderBottom: '1.5px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Building2 size={20} color="#0284c7" />
                          <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                              Hybrid Attendance & Quorum Policy
                            </h3>
                            <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
                              Enforce minimum office attendance, anchor collaboration days, and commute exemptions
                            </p>
                          </div>
                        </div>
                        <span className="badge-bright badge-blue">Presence Policy</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        {/* Minimum Office Coverage Slider */}
                        <div style={{ padding: 14, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <label style={{ fontSize: '12px', fontWeight: 800, color: '#23251d' }}>
                              Daily In-Person Quorum Floor
                            </label>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#0284c7' }}>
                              {officeCoverage}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="20"
                            max="70"
                            step="5"
                            value={officeCoverage}
                            onChange={e => setOfficeCoverage(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#0284c7' }}
                          />
                          <p style={{ fontSize: '11px', color: '#64748b', margin: '6px 0 0' }}>
                            Ensures at least {Math.ceil((officeCoverage / 100) * 7)} of 7 squad engineers are physically in-office each business day for optimal cross-functional synergy.
                          </p>
                        </div>

                        {/* Commute Distance Exemption */}
                        <div style={{ padding: 14, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <label style={{ fontSize: '12px', fontWeight: 800, color: '#23251d' }}>
                              Long-Distance Commute Remote Exemption
                            </label>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#059669' }}>
                              &gt; {commuteExemptionKm} km
                            </span>
                          </div>
                          <input
                            type="range"
                            min="20"
                            max="60"
                            step="5"
                            value={commuteExemptionKm}
                            onChange={e => setCommuteExemptionKm(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#059669' }}
                          />
                          <p style={{ fontSize: '11px', color: '#64748b', margin: '6px 0 0' }}>
                            Team members living further than {commuteExemptionKm} km receive automatic remote priority on days with elevated transit congestion.
                          </p>
                        </div>

                        {/* Core Anchor Days Selector */}
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: 800, color: '#23251d', display: 'block', marginBottom: 8 }}>
                            Recommended Anchor Collaboration Days
                          </label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                            {[
                              { id: 'tue_thu', label: 'Tuesday & Thursday', desc: 'Optimal sprint sync cadence' },
                              { id: 'wed_fri', label: 'Wednesday & Friday', desc: 'Demo & retrospective focus' },
                              { id: 'mon_wed', label: 'Monday & Wednesday', desc: 'Kickoff planning alignment' },
                            ].map((opt) => (
                              <div
                                key={opt.id}
                                onClick={() => setAnchorDay(opt.id)}
                                style={{
                                  padding: 12,
                                  borderRadius: 8,
                                  border: anchorDay === opt.id ? '2px solid #23251d' : '1.5px solid #cbd5e1',
                                  background: anchorDay === opt.id ? '#eeefe9' : '#ffffff',
                                  cursor: 'pointer'
                                }}
                              >
                                <strong style={{ fontSize: '12px', color: '#23251d', display: 'block' }}>{opt.label}</strong>
                                <span style={{ fontSize: '10px', color: '#64748b' }}>{opt.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Category 3: Sprint & Capacity */}
                  {activeTab === 'sprint' && (
                    <div className="bright-card" style={{ padding: 22, background: '#ffffff', borderRadius: 14, border: '1.5px solid #cbd5e1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 12, borderBottom: '1.5px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Calendar size={20} color="#059669" />
                          <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                              Sprint Planning & Capacity Guardrails
                            </h3>
                            <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
                              Prevent sprint overcommitment, enforce daily hour ceilings, and reserve bug buffers
                            </p>
                          </div>
                        </div>
                        <span className="badge-bright badge-emerald">Velocity Protection</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        {/* Daily Sprint Capacity Hard Cap */}
                        <div style={{ padding: 14, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <label style={{ fontSize: '12px', fontWeight: 800, color: '#23251d' }}>
                              Daily Sprint Capacity Hard Cap
                            </label>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#059669' }}>
                              {maxHoursPerDay} hrs/day
                            </span>
                          </div>
                          <input
                            type="range"
                            min="6"
                            max="12"
                            value={maxHoursPerDay}
                            onChange={e => setMaxHoursPerDay(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#059669' }}
                          />
                          <p style={{ fontSize: '11px', color: '#64748b', margin: '6px 0 0' }}>
                            Prevents the Sprint Planner engine from scheduling subtasks exceeding {maxHoursPerDay} hours per engineer per business day.
                          </p>
                        </div>

                        {/* Unplanned Work Buffer % */}
                        <div style={{ padding: 14, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <label style={{ fontSize: '12px', fontWeight: 800, color: '#23251d' }}>
                              Sprint Risk Buffer (Unplanned Fixes & PR Review)
                            </label>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#d97706' }}>
                              {sprintBufferPercent}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="30"
                            step="5"
                            value={sprintBufferPercent}
                            onChange={e => setSprintBufferPercent(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#d97706' }}
                          />
                          <p style={{ fontSize: '11px', color: '#64748b', margin: '6px 0 0' }}>
                            Leaves {sprintBufferPercent}% of total sprint capacity unassigned as slack for critical bug fixes and code review throughput.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Category 4: API & Cloud Infra */}
                  {activeTab === 'infra' && (
                    <div className="bright-card" style={{ padding: 22, background: '#ffffff', borderRadius: 14, border: '1.5px solid #cbd5e1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 12, borderBottom: '1.5px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Server size={20} color="#4f46e5" />
                          <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                              API & Database Infrastructure Routing
                            </h3>
                            <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
                              Switch between local development microservice cluster and high-availability cloud endpoint
                            </p>
                          </div>
                        </div>
                        <span className="badge-bright badge-purple">Infra Health</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 18 }}>
                        <div
                          onClick={() => setApiEndpoint('local')}
                          style={{
                            padding: 16,
                            borderRadius: 12,
                            border: apiEndpoint === 'local' ? '2px solid #23251d' : '1.5px solid #cbd5e1',
                            background: apiEndpoint === 'local' ? '#eeefe9' : '#ffffff',
                            cursor: 'pointer',
                            boxShadow: apiEndpoint === 'local' ? '2px 2px 0px #23251d' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <Cpu size={16} color="#23251d" />
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#23251d' }}>Local Dev Cluster</span>
                          </div>
                          <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 8px' }}>http://127.0.0.1:8000 (FastAPI Local)</p>
                          <span className="badge-bright badge-emerald" style={{ fontSize: '10px' }}>Active Daemon</span>
                        </div>

                        <div
                          onClick={() => setApiEndpoint('cloud')}
                          style={{
                            padding: 16,
                            borderRadius: 12,
                            border: apiEndpoint === 'cloud' ? '2px solid #23251d' : '1.5px solid #cbd5e1',
                            background: apiEndpoint === 'cloud' ? '#eeefe9' : '#ffffff',
                            cursor: 'pointer',
                            boxShadow: apiEndpoint === 'cloud' ? '2px 2px 0px #23251d' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <Database size={16} color="#059669" />
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#23251d' }}>Cloud Production</span>
                          </div>
                          <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 8px' }}>https://orkapi.onrender.com (Render + Neon)</p>
                          <span className="badge-bright badge-blue" style={{ fontSize: '10px' }}>Managed Neon Pool</span>
                        </div>
                      </div>

                      {/* Live Ping Telemetry Probe */}
                      <div style={{ padding: 14, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                        <div>
                          <strong style={{ fontSize: '12px', color: '#23251d', display: 'block' }}>Network Heartbeat & Roundtrip Latency</strong>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>
                            {pingLatency !== null ? `Current API Ping: ${pingLatency}ms (Excellent Health)` : 'Probe ready for latency test'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={testPing}
                          disabled={pinging}
                          className="btn-secondary"
                          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11px', fontWeight: 700, padding: '7px 12px' }}
                        >
                          <Activity size={13} /> {pinging ? 'Pinging...' : 'Test Cluster Ping'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Category 5: Alerts & Automation */}
                  {activeTab === 'alerts' && (
                    <div className="bright-card" style={{ padding: 22, background: '#ffffff', borderRadius: 14, border: '1.5px solid #cbd5e1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 12, borderBottom: '1.5px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Bell size={20} color="#dc2626" />
                          <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                              Automated Dispatch Triggers & Alert Webhooks
                            </h3>
                            <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
                              Control Slack notifications, burnout alerts, and automated task load-balancing
                            </p>
                          </div>
                        </div>
                        <span className="badge-bright badge-yellow">Alert System</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={notifyBurnout}
                            onChange={e => setNotifyBurnout(e.target.checked)}
                            style={{ width: 18, height: 18, accentColor: '#f7a501' }}
                          />
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#23251d', display: 'block' }}>
                              Notify on Cognitive Load & Burnout Watchlist Breaches
                            </span>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>
                              Dispatches immediate alert when any squad member exceeds the {burnoutThreshold}% strain ceiling.
                            </span>
                          </div>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={notifyDeadline}
                            onChange={e => setNotifyDeadline(e.target.checked)}
                            style={{ width: 18, height: 18, accentColor: '#f7a501' }}
                          />
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#23251d', display: 'block' }}>
                              Notify on Sprint Slippage & Milestone Risk
                            </span>
                            <span style={{ color: '#64748b', fontSize: '11px' }}>
                              Calculates velocity burndown and notifies when milestone confidence drops below 80%.
                            </span>
                          </div>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={autoRebalance}
                            onChange={e => setAutoRebalance(e.target.checked)}
                            style={{ width: 18, height: 18, accentColor: '#f7a501' }}
                          />
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#23251d', display: 'block' }}>
                              Enable Real-Time Load Rebalance Suggestions
                            </span>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>
                              Proactively suggests task handoffs in TopBar to equalize squad workload variance.
                            </span>
                          </div>
                        </label>

                        {/* Test Webhook Action */}
                        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 8, background: '#eeefe9', border: '1px solid #cbd5e1' }}>
                          <div>
                            <strong style={{ fontSize: '12px', color: '#23251d', display: 'block' }}>Simulate Slack #eng-health Alert</strong>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>Dispatches test payload to configured webhook destination</span>
                          </div>
                          <button
                            type="button"
                            onClick={sendTestWebhook}
                            className="btn-secondary"
                            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11px', fontWeight: 700, padding: '7px 14px' }}
                          >
                            <Send size={13} /> {slackWebhookSent ? 'Webhook Sent! ✅' : 'Dispatch Test Ping'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons Bar */}
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="btn-secondary"
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', fontSize: '12px', fontWeight: 700 }}
                    >
                      <RotateCcw size={14} /> Revert Changes
                    </button>

                    <button
                      type="submit"
                      className="btn-primary"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '10px 22px',
                        background: '#f7a501',
                        color: '#23251d',
                        border: '1.5px solid #23251d',
                        fontWeight: 800,
                        fontSize: '13px',
                        boxShadow: '2px 2px 0px #23251d',
                        borderRadius: 8,
                        cursor: 'pointer'
                      }}
                    >
                      <Save size={15} /> Save Policy Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </AuthGuard>
      </main>
    </div>
  )
}
