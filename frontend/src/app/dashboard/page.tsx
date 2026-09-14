'use client'

import { useState } from 'react'
import { TopBar } from '@/components/TopBar'
import { BurndownChart } from '@/components/BurndownChart'
import { BurnoutRadar } from '@/components/BurnoutRadar'
import { TaskTable, TaskItem } from '@/components/TaskTable'
import { TeamCapacityCard } from '@/components/TeamCapacityCard'
import { AIDelegateModal } from '@/components/AIDelegateModal'
import { CheckSquare, Users, TrendingUp, Clock, Brain, Plus } from 'lucide-react'

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
    <div style={{ background: 'var(--bg-canvas)', minHeight: '100vh', color: 'var(--text-black)' }}>
      {/* Top Bar Header */}
      <TopBar
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Dashboard Container (Golden Ratio Spacing) */}
      <div className="page-container">
        {/* Dashboard Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="section-title" style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>
              Good morning, Priya ☀️
            </h1>
            <p className="section-subtitle">
              Sprint 47 · Sep 13, 2026 · 6 days remaining
            </p>
          </div>

          {/* Primary CTA Button (50px Full Pill) */}
          <button
            className="btn-primary"
            onClick={() => setIsModalOpen(true)}
            style={{ padding: '12px 28px', fontSize: 'var(--font-xs)' }}
          >
            <Brain size={16} /> AI Delegate
          </button>
        </div>

        {/* 4 Stat Cards */}
        <div className="stats-grid" style={{ marginBottom: 32 }}>
          <div className="glass-card p-5" style={{ borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)', fontWeight: 600 }}>Active Tasks</span>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--green-light)', color: '#006241', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckSquare size={16} />
              </div>
            </div>
            <p style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'rgba(0,0,0,0.87)', lineHeight: 1 }}>
              47
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <span className="badge badge-green">+8 this sprint</span>
              <span style={{ fontSize: '11px', color: 'var(--text-black-soft)' }}>vs last week</span>
            </div>
          </div>

          <div className="glass-card p-5" style={{ borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)', fontWeight: 600 }}>Active Engineers</span>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={16} />
              </div>
            </div>
            <p style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'rgba(0,0,0,0.87)', lineHeight: 1 }}>
              12 / 12
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <span className="badge badge-blue">100% Online</span>
              <span style={{ fontSize: '11px', color: 'var(--text-black-soft)' }}>2 on leave</span>
            </div>
          </div>

          <div className="glass-card p-5" style={{ borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)', fontWeight: 600 }}>Sprint Velocity</span>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f5f3ff', color: '#6d28d9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={16} />
              </div>
            </div>
            <p style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'rgba(0,0,0,0.87)', lineHeight: 1 }}>
              94%
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <span className="badge badge-indigo">+6% vs target</span>
              <span style={{ fontSize: '11px', color: 'var(--text-black-soft)' }}>Optimal speed</span>
            </div>
          </div>

          <div className="glass-card p-5" style={{ borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)', fontWeight: 600 }}>Avg Response Time</span>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#fffbeb', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={16} />
              </div>
            </div>
            <p style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'rgba(0,0,0,0.87)', lineHeight: 1 }}>
              2.4h
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <span className="badge badge-amber">-0.8h this week</span>
              <span style={{ fontSize: '11px', color: 'var(--text-black-soft)' }}>Fast triage</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Sprint Burndown vs Burnout Radar */}
        <div className="golden-grid" style={{ marginBottom: 32 }}>
          <BurndownChart />
          <BurnoutRadar />
        </div>

        {/* Active Tasks Table Component */}
        <TaskTable searchQuery={searchQuery} tasks={tasks} />

        {/* Team Capacity Cards Component (1 col mobile, 2 col tablet, 5 col desktop) */}
        <TeamCapacityCard />
      </div>

      {/* Signature Floating Circular "Frap" Button (56px #00754A Green Accent) */}
      <button
        className="frap-btn"
        onClick={() => setIsModalOpen(true)}
        aria-label="Open AI Delegation"
        title="Open AI Delegation"
      >
        <Plus size={24} />
      </button>

      {/* AI Task Delegation Interactive Modal */}
      <AIDelegateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAccept={handleAcceptAssignment}
      />
    </div>
  )
}
