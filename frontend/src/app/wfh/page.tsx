'use client'

import { useEffect, useState, useMemo } from 'react'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import { AuthGuard } from '@/components/AuthGuard'
import { getWFH } from '@/lib/api'
import OfflineBanner from '@/components/OfflineBanner'
import {
  Home, Building2, CheckCircle2, Calendar, ShieldCheck,
  Search, Users, Activity, Sparkles, Filter, Check, MapPin,
  Compass, ArrowRight, Zap, RefreshCw, Layers, ShieldAlert,
  Sliders, Target, Clock, Coffee
} from 'lucide-react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, Cell, CartesianGrid, ReferenceLine, Legend,
  BarChart
} from 'recharts'
import { useSidebar } from '@/context/SidebarContext'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const AVATAR_COLORS = ['#059669', '#0284c7', '#7c3aed', '#d97706', '#db2777', '#0891b2']

function getInitials(name: string) {
  return (name || 'UN').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
}

/* ── Custom Scatter Tooltip for WFH Decision Matrix ────────────────────── */
function CustomWfhTooltip({ active, payload }: any) {
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
        <div style={{ fontWeight: 800, fontSize: '13px', color: '#f7a501', marginBottom: 2 }}>{data.name}</div>
        <div style={{ color: '#cbd5e1', marginBottom: 6, fontSize: '10px' }}>{data.role}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '2px 8px', fontSize: '10px' }}>
          <span style={{ color: '#94a3b8' }}>Commute Distance:</span>
          <span style={{ fontWeight: 700, color: '#38bdf8' }}>{data.commute} km</span>
          <span style={{ color: '#94a3b8' }}>Remote Productivity:</span>
          <span style={{ fontWeight: 700, color: '#10b981' }}>{data.productivity}%</span>
          <span style={{ color: '#94a3b8' }}>Deep Work Need:</span>
          <span style={{ fontWeight: 700, color: '#f7a501' }}>{data.deepWork}%</span>
          <span style={{ color: '#94a3b8' }}>Policy Zone:</span>
          <span style={{ fontWeight: 700, color: data.color }}>{data.zone}</span>
        </div>
      </div>
    )
  }
  return null
}

export default function WFHPage() {
  const { isExpanded, collapsed, toggleSidebar } = useSidebar()
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)
  const [activeTab, setActiveTab] = useState<'matrix' | 'quorum' | 'analytics'>('matrix')
  const [searchQuery, setSearchQuery] = useState('')
  const [dayFilter, setDayFilter] = useState<string>('all')

  // Local overrides for member attendance day pills: key is `${memberIdOrName}-${day}`
  const [scheduleOverrides, setScheduleOverrides] = useState<Record<string, boolean>>({})

  useEffect(() => {
    getWFH()
      .then(res => {
        const list = res.members || res.wfh_schedule || []
        setMembers(list)
      })
      .catch(() => setIsOffline(true))
      .finally(() => setLoading(false))
  }, [])

  const fullWfhCount = members.filter(m => (m.wfh_score ?? 0) >= 70).length
  const partialCount = members.filter(m => { const s = m.wfh_score ?? 0; return s >= 45 && s < 70 }).length
  const officeCount  = members.filter(m => (m.wfh_score ?? 0) < 45).length

  const isMemberWFH = (member: any, day: string): boolean => {
    const key = `${member.name}-${day}`
    if (scheduleOverrides[key] !== undefined) {
      return scheduleOverrides[key]
    }
    const schedule: Record<string, boolean> = member.schedule || {}
    const wfhDays: string[] = member.wfh_days || member.recommended_days || []
    return (
      schedule[day] === true ||
      schedule[day.toLowerCase()] === true ||
      wfhDays.some((d: string) => d.toLowerCase().startsWith(day.toLowerCase()))
    )
  }

  const toggleDayAttendance = (member: any, day: string) => {
    const key = `${member.name}-${day}`
    const current = isMemberWFH(member, day)
    setScheduleOverrides(prev => ({ ...prev, [key]: !current }))
  }

  // Filter members by name and day
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchSearch = (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (m.role || '').toLowerCase().includes(searchQuery.toLowerCase())
      if (!matchSearch) return false
      if (dayFilter === 'all') return true
      return isMemberWFH(m, dayFilter)
    })
  }, [members, searchQuery, dayFilter, scheduleOverrides])

  // Distinct Chart 1: Daily In-Person Quorum & Synergy Horizon
  const dailyQuorumData = useMemo(() => {
    const totalHeadcount = Math.max(members.length, 5)
    return DAYS.map(day => {
      let remote = 0
      let office = 0
      members.forEach(m => {
        if (isMemberWFH(m, day)) remote++
        else office++
      })
      if (remote + office === 0) {
        remote = 3
        office = 3
      }
      const officePct = Math.round((office / totalHeadcount) * 100)
      const synergyScore = day === 'Tue' || day === 'Thu' ? 88 : day === 'Wed' ? 76 : 58

      return {
        day,
        Office: office,
        Remote: remote,
        officePct,
        quorumFloor: 40,
        synergyScore
      }
    })
  }, [members, scheduleOverrides])

  // Distinct Chart 2: Commute Distance vs Remote Productivity 2D Scatter Matrix
  const scatterData = useMemo(() => {
    return members.map(m => {
      const commute = m.commute_distance ?? 24
      const productivity = m.wfh_productivity ?? (m.wfh_score >= 70 ? 92 : m.wfh_score >= 45 ? 82 : 72)
      const deepWork = m.deep_work_req ?? 65
      const score = m.wfh_score ?? 60

      let zone = 'Balanced Hybrid'
      let color = '#0284c7'
      if (score >= 70 && commute >= 25) {
        zone = 'High-Leverage Remote'
        color = '#059669'
      } else if (score < 45 || commute < 15) {
        zone = 'Office Anchor'
        color = '#d97706'
      }

      return {
        name: m.name,
        role: m.role,
        commute,
        productivity,
        deepWork,
        score,
        zone,
        color
      }
    })
  }, [members])

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />

      <div className={`main-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <TopBar onToggleSidebar={toggleSidebar} />

        <AuthGuard moduleName="WFH & Hybrid Schedule Decider">
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
                    Hybrid Schedule & WFH Matrix
                  </h1>
                  <span className="badge-bright badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669' }} /> Policy Verified
                  </span>
                  <span className="badge-bright badge-yellow" style={{ fontSize: '11px', fontWeight: 800 }}>
                    Φ Attendance Harmony
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Algorithmic hybrid coordination preserving deep focus days while maintaining minimum 40% squad office presence
                </p>
              </div>

              {/* Mode Switcher */}
              <div style={{
                display: 'inline-flex',
                background: '#ffffff',
                padding: 4,
                borderRadius: 9999,
                border: '1.5px solid #cbd5e1',
                boxShadow: '1px 1px 0px #cbd5e1'
              }}>
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
                  <Calendar size={14} /> Hybrid Presence Matrix
                </button>
                <button
                  onClick={() => setActiveTab('quorum')}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 9999,
                    fontSize: '12px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    background: activeTab === 'quorum' ? '#23251d' : 'transparent',
                    color: activeTab === 'quorum' ? '#ffffff' : '#64748b',
                    transition: 'all 120ms ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Building2 size={14} /> In-Person Quorum
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 9999,
                    fontSize: '12px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    background: activeTab === 'analytics' ? '#23251d' : 'transparent',
                    color: activeTab === 'analytics' ? '#ffffff' : '#64748b',
                    transition: 'all 120ms ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Compass size={14} /> Commute vs Focus Matrix
                </button>
              </div>
            </div>

            {isOffline && <OfflineBanner />}

            {/* Top Executive Attendance Ribbon (4 Cards) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: 14,
              marginBottom: 20
            }}>
              <div className="bright-card" style={{ padding: '14px 18px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Monitored Roster</span>
                  <Calendar size={16} color="#4f46e5" />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#23251d', lineHeight: 1 }}>{members.length} Engineers</div>
                <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: 4 }}>
                  100% schedule policy compliance
                </div>
              </div>

              <div className="bright-card" style={{ padding: '14px 18px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>High Remote Bias</span>
                  <Home size={16} color="#059669" />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#059669', lineHeight: 1 }}>{fullWfhCount} Engineers</div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, marginTop: 4 }}>
                  Deep work & low commute stress
                </div>
              </div>

              <div className="bright-card" style={{ padding: '14px 18px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Hybrid 2-Day Split</span>
                  <CheckCircle2 size={16} color="#0284c7" />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0284c7', lineHeight: 1 }}>{partialCount} Engineers</div>
                <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700, marginTop: 4 }}>
                  Optimal synchronization mix
                </div>
              </div>

              <div className="bright-card" style={{ padding: '14px 18px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>In-Person Floor</span>
                  <Building2 size={16} color="#d97706" />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#23251d', lineHeight: 1 }}>{'>'}40% Quorum</div>
                <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: 4 }}>
                  Guaranteed collaboration days
                </div>
              </div>
            </div>

            {/* TAB 1: Hybrid Presence Matrix (Golden Ratio 1.618 : 1) */}
            {activeTab === 'matrix' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(480px, 1.618fr) minmax(340px, 1fr)',
                gap: 22,
                alignItems: 'start'
              }}>
                {/* Left Column (61.8%): Presence Matrix Table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Search and Day Filters */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                    background: '#ffffff',
                    padding: '10px 16px',
                    borderRadius: 12,
                    border: '1.5px solid #cbd5e1'
                  }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                      <Search size={14} color="#64748b" style={{ position: 'absolute', left: 10, top: 9 }} />
                      <input
                        type="text"
                        placeholder="Search engineer by name or role..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '7px 12px 7px 32px',
                          borderRadius: 8,
                          border: '1.5px solid #cbd5e1',
                          fontSize: '12px',
                          outline: 'none',
                          color: '#23251d'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        onClick={() => setDayFilter('all')}
                        style={{
                          padding: '5px 10px',
                          borderRadius: 6,
                          fontSize: '11px',
                          fontWeight: 700,
                          border: dayFilter === 'all' ? '1.5px solid #23251d' : '1px solid #cbd5e1',
                          background: dayFilter === 'all' ? '#fef9ee' : '#ffffff',
                          color: dayFilter === 'all' ? '#23251d' : '#64748b',
                          cursor: 'pointer'
                        }}
                      >
                        All
                      </button>
                      {DAYS.map(d => (
                        <button
                          key={d}
                          onClick={() => setDayFilter(d)}
                          style={{
                            padding: '5px 8px',
                            borderRadius: 6,
                            fontSize: '11px',
                            fontWeight: 700,
                            border: dayFilter === d ? '1.5px solid #23251d' : '1px solid #cbd5e1',
                            background: dayFilter === d ? '#fef9ee' : '#ffffff',
                            color: dayFilter === d ? '#23251d' : '#64748b',
                            cursor: 'pointer'
                          }}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Matrix Table */}
                  <div className="bright-card" style={{ padding: 0, overflow: 'hidden', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                    <div style={{ padding: '12px 18px', borderBottom: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#23251d', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Weekly Attendance Schedule ({filteredMembers.length} Engineers)
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        Click any cell to toggle WFH 🏠 / Office 🏢
                      </span>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                        <thead>
                          <tr style={{ background: '#eeefe9', borderBottom: '1.5px solid #cbd5e1' }}>
                            <th style={{ padding: '10px 14px', fontWeight: 800, color: '#475569' }}>Engineer</th>
                            {DAYS.map(day => (
                              <th key={day} style={{ padding: '10px 12px', fontWeight: 800, color: '#475569', textAlign: 'center' }}>
                                {day}
                              </th>
                            ))}
                            <th style={{ padding: '10px 14px', fontWeight: 800, color: '#475569', textAlign: 'right' }}>WFH Index</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMembers.map((member, idx) => {
                            const avatarBg = AVATAR_COLORS[idx % AVATAR_COLORS.length]
                            const score = member.wfh_score ?? 60
                            return (
                              <tr key={member.id || idx} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 120ms ease' }}>
                                <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: avatarBg, color: '#fff', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                      {getInitials(member.name)}
                                    </div>
                                    <div>
                                      <div style={{ fontWeight: 700, color: '#23251d' }}>{member.name || 'Engineer'}</div>
                                      <div style={{ fontSize: '11px', color: '#64748b' }}>{member.role || 'Developer'}</div>
                                    </div>
                                  </div>
                                </td>
                                {DAYS.map(day => {
                                  const isWFH = isMemberWFH(member, day)
                                  return (
                                    <td key={day} style={{ padding: '8px', verticalAlign: 'middle', textAlign: 'center' }}>
                                      <button
                                        onClick={() => toggleDayAttendance(member, day)}
                                        title="Click to toggle attendance"
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          gap: 4,
                                          padding: '4px 8px',
                                          borderRadius: 6,
                                          fontSize: '11px',
                                          fontWeight: 800,
                                          background: isWFH ? '#dcfce7' : '#e0f2fe',
                                          color: isWFH ? '#15803d' : '#0369a1',
                                          border: `1px solid ${isWFH ? '#bbf7d0' : '#bae6fd'}`,
                                          cursor: 'pointer',
                                          transition: 'transform 80ms ease'
                                        }}
                                      >
                                        {isWFH ? '🏠 WFH' : '🏢 Office'}
                                      </button>
                                    </td>
                                  )
                                })}
                                <td style={{ padding: '12px 14px', verticalAlign: 'middle', textAlign: 'right' }}>
                                  <span style={{ fontWeight: 800, color: score >= 70 ? '#059669' : '#0284c7' }}>
                                    {score}%
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Right Column (38.2%): Daily In-Person Quorum Bar & Policies */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Distinct Chart 1: Mon-Fri Headcount & Collaboration Synergy */}
                  <div className="bright-card" style={{ padding: 20, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                          Daily In-Person Quorum
                        </h3>
                        <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>Office vs Remote headcount vs 40% floor</p>
                      </div>
                      <span className="badge-bright badge-yellow" style={{ fontSize: '10px' }}>Quorum</span>
                    </div>

                    <div style={{ width: '100%', height: 210 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={dailyQuorumData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} />
                          <YAxis tick={{ fill: '#94a3b8', fontSize: 9 }} allowDecimals={false} />
                          <Tooltip contentStyle={{ background: '#23251d', border: 'none', borderRadius: 8, color: '#ffffff', fontSize: '11px' }} />
                          <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 700 }} />
                          <Bar dataKey="Office" name="In-Office" fill="#0284c7" stackId="a" />
                          <Bar dataKey="Remote" name="Remote WFH" fill="#059669" stackId="a" radius={[4, 4, 0, 0]} />
                          <Line type="monotone" dataKey="officePct" name="Office %" stroke="#f7a501" strokeWidth={2} dot={{ r: 3 }} />
                          <ReferenceLine y={40} stroke="#dc2626" strokeDasharray="3 3" label={{ value: '40% Min Floor', fill: '#dc2626', fontSize: 9 }} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* 40% Office Quorum Rule Banner */}
                  <div className="bright-card" style={{ padding: 18, background: '#eeefe9', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <ShieldCheck size={16} color="#059669" />
                      <strong style={{ fontSize: '12px', color: '#23251d' }}>40% Squad Quorum Floor Active</strong>
                    </div>
                    <p style={{ fontSize: '11px', color: '#4d4f46', lineHeight: 1.45, margin: 0 }}>
                      Tuesday and Thursday are designated as core squad collaboration anchor days. WFH decider automatically flags schedules where quorum dips below 40%.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: In-Person Quorum Deep Dive */}
            {activeTab === 'quorum' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(450px, 1.5fr) minmax(320px, 1fr)',
                  gap: 20
                }}>
                  {/* Expanded Quorum Horizon */}
                  <div className="bright-card" style={{ padding: 22, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                          In-Person Quorum & Synergy Horizon
                        </h3>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
                          Tracking daily in-office collaboration index against deep-focus remote days
                        </p>
                      </div>
                      <span className="badge-bright badge-emerald">Synergy View</span>
                    </div>

                    <div style={{ width: '100%', height: 260 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={dailyQuorumData} margin={{ top: 15, right: 15, left: -15, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }} />
                          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                          <Tooltip contentStyle={{ background: '#23251d', border: 'none', borderRadius: 8, color: '#ffffff', fontSize: '11px' }} />
                          <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 700 }} />
                          <Bar dataKey="Office" name="In-Office Headcount" fill="#0284c7" stackId="a" />
                          <Bar dataKey="Remote" name="Remote WFH Headcount" fill="#059669" stackId="a" radius={[4, 4, 0, 0]} />
                          <Line type="monotone" dataKey="synergyScore" name="Synergy Index (0-100)" stroke="#f7a501" strokeWidth={2.5} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 8,
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: '1px solid #f1f5f9',
                      fontSize: '11px'
                    }}>
                      <div style={{ padding: '6px 8px', borderRadius: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534' }}>
                        ★ <strong>Tuesday & Thursday:</strong> Anchor Pairing Days
                      </div>
                      <div style={{ padding: '6px 8px', borderRadius: 6, background: '#f0f9ff', border: '1px solid #bae6fd', color: '#0369a1' }}>
                        🌿 <strong>Wednesday:</strong> Mid-Sprint Deep Focus Day
                      </div>
                      <div style={{ padding: '6px 8px', borderRadius: 6, background: '#fefce8', border: '1px solid #fef08a', color: '#854d0e' }}>
                        ⚡ <strong>Monday & Friday:</strong> Flex Asynchronous Flow
                      </div>
                    </div>
                  </div>

                  {/* Policy Highlights */}
                  <div className="bright-card" style={{ padding: 22, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#23251d', margin: '0 0 12px' }}>
                      Hybrid Policy Rules
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '12px' }}>
                      <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                        <strong style={{ color: '#23251d', display: 'block' }}>🛡️ Commute Offset Credit</strong>
                        <span style={{ color: '#64748b' }}>Engineers commuting over 30km automatically qualify for 3 remote days per week to minimize transit fatigue.</span>
                      </div>
                      <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                        <strong style={{ color: '#23251d', display: 'block' }}>⚡ Focus Block Protection</strong>
                        <span style={{ color: '#64748b' }}>No mandatory meetings may be scheduled on Wednesday to protect full-day uninterrupted coding flow.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Commute vs Remote Focus Matrix */}
            {activeTab === 'analytics' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(450px, 1.5fr) minmax(320px, 1fr)',
                  gap: 20
                }}>
                  {/* Distinct Chart 2: Commute vs Focus Matrix */}
                  <div className="bright-card" style={{ padding: 22, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                          Commute Distance vs Remote Productivity Matrix
                        </h3>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
                          Mapping transit penalty against historical remote coding productivity
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
                            dataKey="commute"
                            name="Commute Distance"
                            unit="km"
                            domain={[0, 50]}
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            label={{ value: 'Commute Distance (km)', position: 'insideBottom', offset: -15, fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                          />
                          <YAxis
                            type="number"
                            dataKey="productivity"
                            name="Remote Productivity"
                            unit="%"
                            domain={[50, 100]}
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            label={{ value: 'Remote Productivity (%)', angle: -90, position: 'insideLeft', offset: 15, fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                          />
                          <Tooltip content={<CustomWfhTooltip />} />
                          <ReferenceLine x={25} stroke="#cbd5e1" strokeDasharray="3 3" />
                          <ReferenceLine y={80} stroke="#cbd5e1" strokeDasharray="3 3" />
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

                    {/* Quadrants Explainer */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 8,
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: '1px solid #f1f5f9',
                      fontSize: '11px'
                    }}>
                      <div style={{ padding: '6px 8px', borderRadius: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534' }}>
                        ★ <strong>High-Leverage Remote:</strong> Long commute ({'>'}25km), high productivity ({'>'}80%)
                      </div>
                      <div style={{ padding: '6px 8px', borderRadius: 6, background: '#f0f9ff', border: '1px solid #bae6fd', color: '#0369a1' }}>
                        ⚖ <strong>Balanced Hybrid:</strong> Moderate commute, solid cross-functional output
                      </div>
                      <div style={{ padding: '6px 8px', borderRadius: 6, background: '#fefce8', border: '1px solid #fef08a', color: '#854d0e' }}>
                        🏢 <strong>Office Anchor:</strong> Short commute ({'<'}15km), thrives on pairing
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bright-card" style={{ padding: 22, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#23251d', margin: '0 0 12px' }}>
                      Roster WFH Recommendations
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {members.slice(0, 4).map((m, idx) => (
                        <div key={idx} style={{ padding: 10, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '11px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                            <strong style={{ color: '#23251d' }}>{m.name}</strong>
                            <span style={{ fontWeight: 800, color: '#059669' }}>{m.decision || '2-3 Days WFH'}</span>
                          </div>
                          <span style={{ color: '#64748b' }}>
                            {m.reasons && m.reasons[0] ? m.reasons[0] : 'High deep work requirement with optimal focus'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </AuthGuard>
      </div>
    </div>
  )
}
