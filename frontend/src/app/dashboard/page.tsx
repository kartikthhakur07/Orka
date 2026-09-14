'use client'

import { useState } from 'react'
import { TopBar } from '@/components/TopBar'
import { BurndownChart } from '@/components/BurndownChart'
import { BurnoutRadar } from '@/components/BurnoutRadar'
import { TaskTable, TaskItem } from '@/components/TaskTable'
import { TeamCapacityCard } from '@/components/TeamCapacityCard'
import { AIDelegateModal } from '@/components/AIDelegateModal'
import { Badge } from '@/components/Badge'
import { CheckSquare, Users, TrendingUp, Clock, Brain } from 'lucide-react'

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Interactive Tasks list state so AI Delegate modal can update assignments live!
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 'ORK-2851', title: 'Implement authentication flow', assignee: 'Priya Sharma', priority: 'Critical', status: 'In Progress', points: 5 },
    { id: 'ORK-2850', title: 'Optimize PostgreSQL Database Connection Pool', assignee: 'Anya Ivanova', priority: 'High', status: 'In Review', points: 8 },
    { id: 'ORK-2849', title: 'Build Executive Dashboard Stat Card Widgets', assignee: 'Marcus Chen', priority: 'Medium', status: 'Done', points: 3 },
    { id: 'ORK-2848', title: 'Implement IBM HR Dataset Preprocessing Pipeline', assignee: 'Priya Sharma', priority: 'High', status: 'Done', points: 5 },
    { id: 'ORK-2847', title: 'Setup GitHub Actions CI/CD Release Automation', assignee: 'Sara Kim', priority: 'Medium', status: 'Blocked', points: 2 },
    { id: 'ORK-2846', title: 'Design Responsive Mobile Navigation Menu', assignee: 'Leo Wang', priority: 'Low', status: 'In Progress', points: 3 },
  ])

  const handleAcceptAssignment = (newAssignee: string) => {
    setTasks(prev => prev.map(t =>
      t.id === 'ORK-2851' ? { ...t, assignee: newAssignee } : t
    ))
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', color: '#0f172a' }}>
      {/* Top Bar Header */}
      <TopBar
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Dashboard Container */}
      <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto' }}>
        {/* Dashboard Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="section-title" style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>
              Good morning, Priya ☀️
            </h1>
            <p className="section-subtitle">
              Sprint 47 · Sep 13, 2026 · 6 days remaining
            </p>
          </div>

          {/* Primary CTA Button */}
          <button
            className="btn-primary"
            onClick={() => setIsModalOpen(true)}
            style={{ padding: '12px 24px', fontSize: 'var(--font-xs)', borderRadius: 12, background: '#16a34a', boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)' }}
          >
            <Brain size={16} /> AI Delegate
          </button>
        </div>

        {/* 4 Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          <div className="glass-card p-5" style={{ borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 'var(--font-xs)', color: '#64748b', fontWeight: 600 }}>Active Tasks</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckSquare size={16} />
              </div>
            </div>
            <p style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
              47
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
              12 / 12
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

        {/* Main Grid: Sprint Burndown vs Burnout Radar */}
        <div className="golden-grid" style={{ marginBottom: 28 }}>
          <BurndownChart />
          <BurnoutRadar />
        </div>

        {/* Active Tasks Table Component */}
        <TaskTable searchQuery={searchQuery} tasks={tasks} />

        {/* Team Capacity Cards Component (1 col mobile, 2 col tablet, 5 col desktop) */}
        <TeamCapacityCard />
      </div>

      {/* AI Task Delegation Interactive Modal */}
      <AIDelegateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAccept={handleAcceptAssignment}
      />
    </div>
  )
}
