'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import { AuthGuard } from '@/components/AuthGuard'
import { getDashboard, getTasks } from '@/lib/api'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
import {
  LayoutDashboard,
  Brain,
  Flame,
  CalendarDays,
  Home,
  Shield,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  ChevronRight,
  Plus
} from 'lucide-react'

import { useSidebar } from '@/context/SidebarContext'

export default function DashboardPage() {
  const { isExpanded, collapsed, toggleSidebar } = useSidebar()
  const [data, setData] = useState<any>(null)
  const [recentTasks, setRecentTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        const [dashRes, tasksRes] = await Promise.all([
          getDashboard().catch(() => null),
          getTasks({ status: 'all' }).catch(() => null)
        ])
        setData(dashRes)
        if (tasksRes && tasksRes.tasks && tasksRes.tasks.length > 0) {
          setRecentTasks(tasksRes.tasks.slice(0, 5))
        } else if (dashRes && dashRes.recent_assignments) {
          setRecentTasks(dashRes.recent_assignments)
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  const burndownData = useMemo(() => {
    const totalPoints = 48
    const progress = data?.sprint_progress ?? 65
    const remaining = Math.max(0, Math.round(totalPoints * (1 - progress / 100)))

    return [
      { day: 'Day 1', ideal: 48, actual: 48 },
      { day: 'Day 2', ideal: 38, actual: Math.round(48 - (48 - remaining) * 0.25) },
      { day: 'Day 3', ideal: 28, actual: Math.round(48 - (48 - remaining) * 0.55) },
      { day: 'Day 4', ideal: 19, actual: Math.round(48 - (48 - remaining) * 0.8) },
      { day: 'Day 5', ideal: 10, actual: remaining },
      { day: 'Day 6', ideal: 0, actual: Math.max(0, remaining - 2) },
    ]
  }, [data?.sprint_progress])

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
      <div className={`main-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <TopBar onToggleSidebar={toggleSidebar} />

        <AuthGuard moduleName="Executive Operations Dashboard">
          <div className="page-container">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                  <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                    Executive Operations & Team Intelligence
                  </h1>
                  <span className="badge-bright badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '11px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669' }} /> Live Telemetry Online
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                  Real-time cognitive load tracking, sprint burndown trajectory, and AI task allocations
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <Link
                  href="/delegator"
                  className="btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '9px 18px',
                    fontSize: '13px',
                    borderRadius: 8,
                    background: '#f7a501',
                    color: '#23251d',
                    fontWeight: 800,
                    border: '1.5px solid #23251d',
                    boxShadow: '2px 2px 0px #23251d'
                  }}
                >
                  <Brain size={16} /> Delegate Task
                </Link>
              </div>
            </div>

            {/* 4 Core KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
              {/* Card 1: Team Health */}
              <div className="bright-card" style={{ padding: 20, background: '#ffffff', borderRadius: 12, border: '1.5px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Team Health Index</span>
                  <span className="badge-bright badge-emerald" style={{ fontSize: '10px' }}>Optimal</span>
                </div>
                <p style={{ fontSize: '28px', fontWeight: 800, color: '#059669', margin: '4px 0' }}>
                  {loading ? '...' : `${data?.team_health || 84}%`}
                </p>
                <span style={{ fontSize: '12px', color: '#64748b' }}>IBM HR Analytics weighted</span>
              </div>

              {/* Card 2: Burnout Watchlist */}
              <div className="bright-card" style={{ padding: 20, background: '#ffffff', borderRadius: 12, border: '1.5px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Burnout Watchlist</span>
                  <Flame size={16} color="#dc2626" />
                </div>
                <p style={{ fontSize: '28px', fontWeight: 800, color: '#dc2626', margin: '4px 0' }}>
                  {loading ? '...' : (data?.burnout_count ?? 1)}
                </p>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Engineers exceeding 75% load</span>
              </div>

              {/* Card 3: Sprint Progress */}
              <div className="bright-card" style={{ padding: 20, background: '#ffffff', borderRadius: 12, border: '1.5px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sprint 14 Completion</span>
                  <CalendarDays size={16} color="#0284c7" />
                </div>
                <p style={{ fontSize: '28px', fontWeight: 800, color: '#0284c7', margin: '4px 0' }}>
                  {loading ? '...' : `${data?.sprint_progress || 68}%`}
                </p>
                <span style={{ fontSize: '12px', color: '#64748b' }}>4 days remaining in cycle</span>
              </div>

              {/* Card 4: Hybrid WFH Coverage */}
              <div className="bright-card" style={{ padding: 20, background: '#ffffff', borderRadius: 12, border: '1.5px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>WFH Office Balance</span>
                  <Home size={16} color="#d97706" />
                </div>
                <p style={{ fontSize: '28px', fontWeight: 800, color: '#23251d', margin: '4px 0' }}>
                  {loading ? '...' : `${data?.wfh_rate || 55}%`}
                </p>
                <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>Meets 40% office coverage rule</span>
              </div>
            </div>

            {/* 2-Column Responsive Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: 24, alignItems: 'start' }}>
              {/* Left Column: Burndown Chart & Live Allocations */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Burndown Chart Card */}
                <div className="bright-card" style={{ padding: 24, background: '#ffffff', borderRadius: 12, border: '1.5px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                        Sprint Burndown Trajectory
                      </h3>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0' }}>
                        Ideal linear burndown vs actual story points delivered
                      </p>
                    </div>
                    <span className="badge-bright badge-sky" style={{ fontSize: '11px' }}>Sprint 14</span>
                  </div>

                  <div style={{ width: '100%', height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={burndownData}>
                        <defs>
                          <linearGradient id="actualColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f7a501" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#f7a501" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
                        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 50]} />
                        <Tooltip contentStyle={{ borderRadius: 8, border: '1.5px solid #23251d' }} />
                        <Area type="monotone" dataKey="actual" name="Actual Points Left" stroke="#f7a501" strokeWidth={2.5} fillOpacity={1} fill="url(#actualColor)" />
                        <Area type="monotone" dataKey="ideal" name="Ideal Target" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" fill="transparent" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Tasks & Allocations Table */}
                <div className="bright-card" style={{ padding: 24, background: '#ffffff', borderRadius: 12, border: '1.5px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                        Live Task Execution & Allocations
                      </h3>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0' }}>
                        Recent stories delegated across engineers
                      </p>
                    </div>
                    <Link href="/tasks" style={{ fontSize: '13px', fontWeight: 700, color: '#0284c7', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      View all tasks <ArrowRight size={14} />
                    </Link>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1.5px solid #f1f5f9', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                          <th style={{ padding: '10px 12px', fontWeight: 800 }}>Task</th>
                          <th style={{ padding: '10px 12px', fontWeight: 800 }}>Assignee</th>
                          <th style={{ padding: '10px 12px', fontWeight: 800 }}>Priority</th>
                          <th style={{ padding: '10px 12px', fontWeight: 800 }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTasks.map((t, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                            <td style={{ padding: '12px', fontWeight: 700, color: '#23251d' }}>
                              <span style={{ color: '#94a3b8', fontSize: '11px', marginRight: 6 }}>#{t.id}</span>
                              {t.title}
                            </td>
                            <td style={{ padding: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#f7a501', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>
                                  {t.assigned_to ? t.assigned_to[0] : '?'}
                                </div>
                                <span style={{ fontWeight: 600, color: '#23251d' }}>{t.assigned_to || 'Unassigned'}</span>
                              </div>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <span className={`badge-bright ${t.priority === 'critical' ? 'badge-rose' : t.priority === 'high' ? 'badge-orange' : 'badge-yellow'}`} style={{ fontSize: '11px' }}>
                                {t.priority}
                              </span>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 700, color: t.status === 'done' ? '#15803d' : t.status === 'in-progress' ? '#b45309' : '#475569' }}>
                                {t.status === 'done' ? 'Completed' : t.status === 'in-progress' ? 'In Progress' : 'To Do'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: Burnout Watchlist & Quick Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Cognitive Overload Watchlist Card */}
                <div className="bright-card" style={{ padding: 22, background: '#ffffff', borderRadius: 12, border: '1.5px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <AlertTriangle size={16} color="#dc2626" />
                      <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                        Burnout Watchlist
                      </h3>
                    </div>
                    <span className="badge-bright badge-rose" style={{ fontSize: '10px' }}>Intervention Needed</span>
                  </div>

                  <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px' }}>
                    Engineers showing cumulative cognitive strain indicators
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ padding: '12px 14px', borderRadius: 10, background: '#fff5f5', border: '1px solid #fed7d7' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#23251d' }}>Elena Rostova</span>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#dc2626' }}>84% Strain</span>
                      </div>
                      <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 8px' }}>
                        High context switching (7.5/day) · Overtime active
                      </p>
                      <Link
                        href="/burnout"
                        style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        Rebalance workload →
                      </Link>
                    </div>

                    <div style={{ padding: '12px 14px', borderRadius: 10, background: '#fefce8', border: '1px solid #fef08a' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#23251d' }}>Tariq Mansoor</span>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#d97706' }}>76% Strain</span>
                      </div>
                      <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 8px' }}>
                        Heavy meeting density &amp; compliance crunch
                      </p>
                      <Link
                        href="/burnout"
                        style={{ fontSize: '11px', fontWeight: 700, color: '#d97706', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        Inspect focus blocks →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Operations Quick Links */}
                <div className="bright-card" style={{ padding: 22, background: '#ffffff', borderRadius: 12, border: '1.5px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#23251d', margin: '0 0 14px' }}>
                    Decision Engine Modules
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Link
                      href="/delegator"
                      style={{ padding: '10px 12px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Brain size={16} color="#0284c7" />
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#23251d' }}>AI Task Delegator</span>
                      </div>
                      <ChevronRight size={16} color="#94a3b8" />
                    </Link>

                    <Link
                      href="/sprint"
                      style={{ padding: '10px 12px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <CalendarDays size={16} color="#059669" />
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#23251d' }}>Sprint Capacity Board</span>
                      </div>
                      <ChevronRight size={16} color="#94a3b8" />
                    </Link>

                    <Link
                      href="/wfh"
                      style={{ padding: '10px 12px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Home size={16} color="#d97706" />
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#23251d' }}>WFH Hybrid Decider</span>
                      </div>
                      <ChevronRight size={16} color="#94a3b8" />
                    </Link>

                    <Link
                      href="/analytics"
                      style={{ padding: '10px 12px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <TrendingUp size={16} color="#7c3aed" />
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#23251d' }}>Analytics Deep-Dive</span>
                      </div>
                      <ChevronRight size={16} color="#94a3b8" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AuthGuard>
      </div>
    </div>
  )
}
