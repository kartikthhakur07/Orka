'use client'

import { useEffect, useState } from 'react'
import { getDashboard } from '@/lib/api'
import { OfflineBanner } from '@/components/OfflineBanner'
import { Badge } from '@/components/Badge'
import {
  CheckSquare, Users, TrendingUp, Clock,
  RefreshCw, Activity, Layers, AlertCircle, ArrowUpRight, Search, Bell
} from 'lucide-react'

function getStatusBadge(status: string) {
  if (status === 'Done') return <Badge variant="green">Done</Badge>
  if (status === 'In Progress') return <Badge variant="blue">In Progress</Badge>
  return <Badge variant="gray">To Do</Badge>
}

function getPriorityBadge(priority: string) {
  if (priority === 'Critical') return <Badge variant="crimson">Critical</Badge>
  if (priority === 'High') return <Badge variant="amber">High</Badge>
  if (priority === 'Medium') return <Badge variant="indigo">Medium</Badge>
  return <Badge variant="gray">Low</Badge>
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')

  const load = async () => {
    try {
      setError(false)
      const res = await getDashboard()
      setData(res)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { load() }, [])

  const refresh = () => { setRefreshing(true); load() }

  // Figma Make Sample Team Capacity Members
  const teamMembers = [
    { name: 'Priya Sharma', role: 'Senior Lead Engineer', load: 78, tasks: 4, burnout: 'Low', color: '#16a34a' },
    { name: 'Marcus Chen', role: 'Full Stack Engineer', load: 62, tasks: 3, burnout: 'Low', color: '#2563eb' },
    { name: 'Anya Ivanova', role: 'Backend Engineer', load: 91, tasks: 6, burnout: 'Medium (Watch)', color: '#d97706' },
    { name: 'Leo Wang', role: 'Frontend Developer', load: 45, tasks: 2, burnout: 'Low', color: '#16a34a' },
    { name: 'Sara Kim', role: 'DevOps Engineer', load: 55, tasks: 3, burnout: 'Low', color: '#7c3aed' },
  ]

  // Figma Make Sample Tasks Table
  const sampleTasks = [
    { id: 'ORK-2851', title: 'Refactor Auth Middleware & JWT Validation', assignee: 'Priya Sharma', priority: 'Critical', status: 'In Progress', hours: '4.5h' },
    { id: 'ORK-2850', title: 'Optimize PostgreSQL Database Connection Pool', assignee: 'Anya Ivanova', priority: 'High', status: 'In Progress', hours: '6.0h' },
    { id: 'ORK-2849', title: 'Build Executive Dashboard Stat Card Widgets', assignee: 'Marcus Chen', priority: 'Medium', status: 'Done', hours: '3.0h' },
    { id: 'ORK-2848', title: 'Implement IBM HR Dataset Preprocessing Pipeline', assignee: 'Priya Sharma', priority: 'High', status: 'Done', hours: '5.2h' },
    { id: 'ORK-2847', title: 'Setup GitHub Actions CI/CD Release Automation', assignee: 'Sara Kim', priority: 'Medium', status: 'To Do', hours: '2.0h' },
    { id: 'ORK-2846', title: 'Design Responsive Mobile Navigation Menu', assignee: 'Leo Wang', priority: 'Low', status: 'To Do', hours: '1.5h' },
  ]

  const filteredTasks = sampleTasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.assignee.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  )

  // Burndown heights
  const burndownData = [90, 78, 65, 60, 52, 44, 38, 30, 24, 18, 12, 6]

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Top Header Bar with Search & Notifications (Figma Make Style) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="section-title" style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>
            Executive Operations Dashboard
          </h1>
          <p className="section-subtitle">
            Real-time team velocity, 5-factor task delegation, and cognitive capacity monitoring
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Search Box */}
          <div style={{ position: 'relative', width: 260 }}>
            <Search size={15} color="#64748b" style={{ position: 'absolute', left: 12, top: 11 }} />
            <input
              type="text"
              className="orka-input"
              placeholder="Search tasks or members..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 34, fontSize: 'var(--font-xs)', borderRadius: 99 }}
            />
          </div>

          <button className="btn-secondary" onClick={refresh} disabled={refreshing} style={{ padding: '8px 16px', fontSize: 'var(--font-xs)' }}>
            <RefreshCw size={13} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && <div style={{ marginBottom: 20 }}><OfflineBanner /></div>}

      {/* 4 Metric Cards Grid (Figma Make Layout) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <div className="glass-card p-5" style={{ borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 'var(--font-xs)', color: '#64748b', fontWeight: 600 }}>Active Tasks</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckSquare size={16} />
            </div>
          </div>
          <p style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
            {data?.active_tasks ?? 47}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <span className="badge badge-green">+8 this sprint</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>vs last week</span>
          </div>
        </div>

        <div className="glass-card p-5" style={{ borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 'var(--font-xs)', color: '#64748b', fontWeight: 600 }}>Active Engineers</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={16} />
            </div>
          </div>
          <p style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
            {data?.team_health ? '12 / 12' : '12'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <span className="badge badge-blue">100% Online</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>2 on leave</span>
          </div>
        </div>

        <div className="glass-card p-5" style={{ borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 'var(--font-xs)', color: '#64748b', fontWeight: 600 }}>Sprint Velocity</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <p style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
            94%
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <span className="badge badge-indigo">+6% vs target</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Optimal speed</span>
          </div>
        </div>

        <div className="glass-card p-5" style={{ borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 'var(--font-xs)', color: '#64748b', fontWeight: 600 }}>Avg Response Time</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fffbeb', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={16} />
            </div>
          </div>
          <p style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
            2.4h
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <span className="badge badge-amber">-0.8h this week</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Fast triage</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Sprint Burndown vs Team Capacity Radar */}
      <div className="golden-grid" style={{ marginBottom: 28 }}>
        {/* Left Column (61.8%): Sprint Burndown Chart */}
        <div className="glass-card p-6" style={{ borderRadius: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#0f172a' }}>
                Sprint 47 Burndown Velocity
              </h2>
              <p style={{ fontSize: 'var(--font-xs)', color: '#64748b', marginTop: 2 }}>
                Daily remaining story points vs ideal velocity baseline
              </p>
            </div>
            <Badge variant="green">ON TRACK</Badge>
          </div>

          {/* Bar Chart Visualization */}
          <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', gap: 12, padding: '16px 8px 0', borderBottom: '1px solid #e2e8f0' }}>
            {burndownData.map((val, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                <div
                  style={{
                    width: '100%',
                    height: `${val}%`,
                    background: idx >= 8 ? '#16a34a' : 'rgba(22, 163, 74, 0.25)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'height 800ms cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
                <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'DM Mono, monospace' }}>
                  D{idx + 1}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 'var(--font-xs)', color: '#64748b' }}>
            <span>Day 1 (90 pts)</span>
            <span style={{ color: '#16a34a', fontWeight: 700 }}>Day 12 (6 pts remaining)</span>
          </div>
        </div>

        {/* Right Column (38.2%): Team Capacity & Burnout Monitor */}
        <div className="glass-card p-6" style={{ borderRadius: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#0f172a' }}>
              Cognitive Capacity
            </h2>
            <Badge variant="indigo">5 Members</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {teamMembers.map((m, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--font-xs)', marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{m.name}</span>
                  <span style={{ fontWeight: 700, color: m.color }}>{m.load}% ({m.tasks} tasks)</span>
                </div>
                <div className="score-bar">
                  <div
                    className="score-bar-fill"
                    style={{
                      '--target-width': `${m.load}%`,
                      background: m.color
                    } as any}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Management Table (Figma Make Style) */}
      <div className="glass-card" style={{ borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#0f172a' }}>
              Active Task Telemetry
            </h2>
            <p style={{ fontSize: 'var(--font-xs)', color: '#64748b', marginTop: 2 }}>
              Showing {filteredTasks.length} active assignments with AI confidence ratings
            </p>
          </div>
          <Badge variant="gray">Live Sync</Badge>
        </div>

        <table className="orka-table">
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Task Description</th>
              <th>Assignee</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Est. Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((row, idx) => (
              <tr key={idx}>
                <td style={{ fontFamily: 'DM Mono, monospace', fontWeight: 600, color: '#16a34a' }}>
                  {row.id}
                </td>
                <td style={{ fontWeight: 600, color: '#0f172a' }}>
                  {row.title}
                </td>
                <td>{row.assignee}</td>
                <td>{getPriorityBadge(row.priority)}</td>
                <td>{getStatusBadge(row.status)}</td>
                <td style={{ color: '#64748b', fontFamily: 'DM Mono, monospace' }}>{row.hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
