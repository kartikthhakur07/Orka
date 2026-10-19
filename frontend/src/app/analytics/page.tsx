'use client'

import React, { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import { AuthGuard } from '@/components/AuthGuard'
import { getAnalytics } from '@/lib/api'
import {
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import {
  BarChart3,
  TrendingUp,
  Flame,
  Zap,
  Layers,
  Sparkles,
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react'

import { useSidebar } from '@/context/SidebarContext'

// Radar Dimensions for Engineering Health
const RADAR_DATA = [
  { metric: 'Workload Equity', score: 82, fullMark: 100 },
  { metric: 'Burnout Safety', score: 78, fullMark: 100 },
  { metric: 'Delivery Velocity', score: 88, fullMark: 100 },
  { metric: 'Skill Coverage', score: 92, fullMark: 100 },
  { metric: 'WFH Balance', score: 85, fullMark: 100 },
  { metric: 'Meeting Efficiency', score: 74, fullMark: 100 },
]

// 6-Sprint Velocity Trend
const VELOCITY_TREND = [
  { sprint: 'Sprint 9', velocity: 24, target: 28 },
  { sprint: 'Sprint 10', velocity: 29, target: 28 },
  { sprint: 'Sprint 11', velocity: 33, target: 30 },
  { sprint: 'Sprint 12', velocity: 31, target: 30 },
  { sprint: 'Sprint 13', velocity: 36, target: 32 },
  { sprint: 'Sprint 14', velocity: 38, target: 34 },
]

const PIE_COLORS = ['#059669', '#f7a501', '#0284c7', '#dc2626']

export default function AnalyticsPage() {
  const { isExpanded, collapsed, toggleSidebar } = useSidebar()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const res = await getAnalytics()
        setData(res)
      } catch (err) {
        console.error('Failed to load analytics:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const pieData = data ? [
    { name: 'Done', value: data.status_breakdown?.done || 6 },
    { name: 'In Progress', value: data.status_breakdown?.['in-progress'] || 4 },
    { name: 'To Do', value: data.status_breakdown?.todo || 3 },
  ] : []

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
      <div className={`main-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <TopBar onToggleSidebar={toggleSidebar} />
        <AuthGuard moduleName="Engineering Telemetry & Analytics">
          <div className="page-container">
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f7a501', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #23251d', boxShadow: '2px 2px 0px #23251d' }}>
                  <BarChart3 size={20} color="#23251d" />
                </div>
                <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                  Engineering Intelligence & Analytics
                </h1>
              </div>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                Multi-dimensional team health signals, delivery velocity curves, and cognitive workload balance
              </p>
            </div>

            {/* Top KPI Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
              <div className="bright-card" style={{ padding: 20, background: '#ffffff', borderRadius: 12, border: '1.5px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Avg Velocity</span>
                  <Zap size={16} color="#f7a501" />
                </div>
                <p style={{ fontSize: '28px', fontWeight: 800, color: '#23251d', margin: '4px 0' }}>
                  38.0 <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>pts / sprint</span>
                </p>
                <span style={{ fontSize: '12px', color: '#059669', fontWeight: 700 }}>+15% velocity improvement</span>
              </div>

              <div className="bright-card" style={{ padding: 20, background: '#ffffff', borderRadius: 12, border: '1.5px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Burnout Risk Score</span>
                  <Flame size={16} color="#dc2626" />
                </div>
                <p style={{ fontSize: '28px', fontWeight: 800, color: '#dc2626', margin: '4px 0' }}>
                  {loading ? '...' : `${data?.avg_burnout || 60}%`}
                </p>
                <span style={{ fontSize: '12px', color: '#64748b' }}>IBM HR Attrition weighted</span>
              </div>

              <div className="bright-card" style={{ padding: 20, background: '#ffffff', borderRadius: 12, border: '1.5px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Delivery Adherence</span>
                  <ShieldCheck size={16} color="#059669" />
                </div>
                <p style={{ fontSize: '28px', fontWeight: 800, color: '#059669', margin: '4px 0' }}>
                  92.4%
                </p>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Sprint milestone accuracy</span>
              </div>

              <div className="bright-card" style={{ padding: 20, background: '#ffffff', borderRadius: 12, border: '1.5px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Stories</span>
                  <Layers size={16} color="#0284c7" />
                </div>
                <p style={{ fontSize: '28px', fontWeight: 800, color: '#0284c7', margin: '4px 0' }}>
                  {loading ? '...' : data?.total_tasks || 14}
                </p>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Across all squad members</span>
              </div>
            </div>

            {/* Diverse Charts Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: 24, marginBottom: 24 }}>
              {/* Chart 1: Multi-Axis RadarChart for Engineering Health */}
              <div className="bright-card" style={{ padding: 24, background: '#ffffff', borderRadius: 12, border: '1.5px solid #e2e8f0' }}>
                <div style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                    Operational Balance Radar
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0' }}>
                    Multi-dimensional assessment of team wellness and throughput
                  </p>
                </div>

                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={RADAR_DATA}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#334155', fontWeight: 700 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <Radar name="Team Index" dataKey="score" stroke="#059669" fill="#059669" fillOpacity={0.4} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: '1.5px solid #23251d' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Velocity Curve AreaChart */}
              <div className="bright-card" style={{ padding: 24, background: '#ffffff', borderRadius: 12, border: '1.5px solid #e2e8f0' }}>
                <div style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                    Velocity Throughput Trend (6 Sprints)
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0' }}>
                    Story points completed per sprint vs target baseline
                  </p>
                </div>

                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={VELOCITY_TREND}>
                      <defs>
                        <linearGradient id="velocityColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[15, 45]} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: '1.5px solid #23251d' }} />
                      <Legend wrapperStyle={{ fontSize: 12, fontWeight: 700 }} />
                      <Area type="monotone" dataKey="velocity" name="Completed Points" stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill="url(#velocityColor)" />
                      <Area type="monotone" dataKey="target" name="Target Plan" stroke="#f7a501" strokeWidth={2} strokeDasharray="4 4" fill="transparent" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 3: Workload Equity & Burnout BarChart */}
              <div className="bright-card" style={{ padding: 24, background: '#ffffff', borderRadius: 12, border: '1.5px solid #e2e8f0' }}>
                <div style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                    Workload Distribution vs Burnout Risk
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0' }}>
                    Compares individual load percentage against cognitive overload scores
                  </p>
                </div>

                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.workload_distribution || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#334155', fontWeight: 700 }} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: '1.5px solid #23251d' }} />
                      <Legend wrapperStyle={{ fontSize: 12, fontWeight: 700 }} />
                      <Bar dataKey="workload" name="Workload %" fill="#0284c7" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="burnout" name="Burnout Index" fill="#dc2626" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 4: Skill Matrix Coverage */}
              <div className="bright-card" style={{ padding: 24, background: '#ffffff', borderRadius: 12, border: '1.5px solid #e2e8f0' }}>
                <div style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                    Core Technology Competency Depth
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0' }}>
                    Number of qualified engineers available per technology skill
                  </p>
                </div>

                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.skill_coverage || []} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 5]} />
                      <YAxis dataKey="skill" type="category" width={90} tick={{ fontSize: 11, fill: '#23251d', fontWeight: 700 }} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: '1.5px solid #23251d' }} />
                      <Bar dataKey="engineers" name="Qualified Engineers" fill="#059669" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </AuthGuard>
      </div>
    </div>
  )
}
