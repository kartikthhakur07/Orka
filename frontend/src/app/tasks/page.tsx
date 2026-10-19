'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import { AuthGuard } from '@/components/AuthGuard'
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/api'
import OfflineBanner from '@/components/OfflineBanner'
import {
  ListTodo, Plus, Search, CheckCircle2, Clock, AlertCircle,
  Filter, Trash2, User, Sparkles, ArrowUpDown, Check, Flame, X,
  CheckSquare, Zap, BarChart3, Layers, Kanban, ArrowRight, ArrowLeft,
  RefreshCw, SlidersHorizontal, Activity, Target, ShieldCheck
} from 'lucide-react'
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, CartesianGrid, ReferenceLine, BarChart, Bar, AreaChart, Area
} from 'recharts'
import { useSidebar } from '@/context/SidebarContext'

interface TaskItem {
  id: number
  title: string
  required_skills: string[]
  priority: string
  status: string
  assigned_to: string | null
  assignment_score: number
  confidence: number
  estimated_hours: number
  complexity: number
  deadline_days: number
  created_at: string | null
}

const QUICK_SKILLS = ['React', 'Python', 'FastAPI', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'DevOps', 'Security']

/* ── Custom Scatter Tooltip for Triage Matrix ──────────────────────────── */
function CustomTriageTooltip({ active, payload }: any) {
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
          {data.title}
        </div>
        <div style={{ color: '#cbd5e1', marginBottom: 6, fontSize: '10px' }}>
          Assignee: <strong>{data.assigned_to || 'Unassigned'}</strong>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '2px 8px', fontSize: '10px' }}>
          <span style={{ color: '#94a3b8' }}>Effort:</span>
          <span style={{ fontWeight: 700, color: '#38bdf8' }}>{data.hours} Hours</span>
          <span style={{ color: '#94a3b8' }}>Complexity:</span>
          <span style={{ fontWeight: 700, color: '#f7a501' }}>{data.complexity}/10</span>
          <span style={{ color: '#94a3b8' }}>Priority:</span>
          <span style={{ fontWeight: 700, textTransform: 'capitalize', color: data.color }}>{data.priority}</span>
          <span style={{ color: '#94a3b8' }}>Quadrant:</span>
          <span style={{ fontWeight: 700, color: '#10b981' }}>{data.quadrant}</span>
        </div>
      </div>
    )
  }
  return null
}

export default function TasksPage() {
  const { isExpanded, collapsed, toggleSidebar } = useSidebar()
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'matrix' | 'kanban' | 'analytics'>('matrix')

  // Filters
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // New task modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newSkills, setNewSkills] = useState('')
  const [newPriority, setNewPriority] = useState('medium')
  const [newComplexity, setNewComplexity] = useState(5)
  const [newHours, setNewHours] = useState(4)
  const [newDeadline, setNewDeadline] = useState(5)
  const [newAssignee, setNewAssignee] = useState('')

  const fetchTaskList = async () => {
    try {
      setLoading(true)
      const data = await getTasks({
        status: statusFilter,
        priority: priorityFilter,
        search: searchQuery
      })
      if (data && data.tasks) {
        setTasks(data.tasks)
      }
    } catch (err) {
      console.error('Failed to load tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTaskList()
  }, [statusFilter, priorityFilter])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchTaskList()
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    try {
      setCreating(true)
      const skillsArray = newSkills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)

      const payload = {
        title: newTitle.trim(),
        required_skills: skillsArray.length > 0 ? skillsArray : ['Frontend', 'React'],
        priority: newPriority.toLowerCase(),
        complexity: Number(newComplexity),
        estimated_hours: Number(newHours),
        deadline_days: Number(newDeadline),
        assigned_to: newAssignee.trim() || undefined
      }

      const res = await createTask(payload)
      if (res && res.task) {
        setTasks(prev => [res.task, ...prev])
      } else {
        await fetchTaskList()
      }

      // Reset form
      setNewTitle('')
      setNewSkills('')
      setNewPriority('medium')
      setNewComplexity(5)
      setNewHours(4)
      setNewDeadline(5)
      setNewAssignee('')
      setIsModalOpen(false)
    } catch (err) {
      console.error('Failed to create task:', err)
    } finally {
      setCreating(false)
    }
  }

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
      await updateTask(taskId, { status: newStatus })
    } catch (err) {
      console.error('Failed to update task status:', err)
    }
  }

  const handleDelete = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    try {
      setTasks(prev => prev.filter(t => t.id !== taskId))
      await deleteTask(taskId)
    } catch (err) {
      console.error('Failed to delete task:', err)
    }
  }

  const todoTasks = tasks.filter(t => t.status === 'todo')
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress')
  const doneTasks = tasks.filter(t => t.status === 'done')
  const totalHours = tasks.reduce((acc, t) => acc + (t.estimated_hours || 4), 0)

  // Triage Scatter Data (Effort Hours vs Complexity 1-10)
  const triageScatterData = useMemo(() => {
    return tasks.map(t => {
      const hours = t.estimated_hours || 4
      const complexity = t.complexity || 5
      const prio = (t.priority || 'medium').toLowerCase()

      const colors: Record<string, string> = {
        critical: '#dc2626',
        high: '#ea580c',
        medium: '#f7a501',
        low: '#059669'
      }

      let quadrant = 'Quick Win'
      if (hours > 6 && complexity >= 6) quadrant = 'Major Initiative'
      else if (hours > 6 && complexity < 6) quadrant = 'Labor Heavy'
      else if (hours <= 6 && complexity >= 6) quadrant = 'Deep Spike'
      else quadrant = 'Quick Win'

      return {
        id: t.id,
        title: t.title,
        hours,
        complexity,
        priority: prio,
        assigned_to: t.assigned_to,
        status: t.status,
        color: colors[prio] || '#f7a501',
        quadrant
      }
    })
  }, [tasks])

  // Assignee Workload Balance Data
  const assigneeWorkloadData = useMemo(() => {
    const map: Record<string, { name: string; hours: number; count: number }> = {}
    tasks.forEach(t => {
      const name = t.assigned_to || 'Unassigned'
      if (!map[name]) map[name] = { name, hours: 0, count: 0 }
      map[name].hours += (t.estimated_hours || 4)
      map[name].count += 1
    })
    return Object.values(map).sort((a, b) => b.hours - a.hours)
  }, [tasks])

  const getPriorityBadge = (prio: string) => {
    switch (prio.toLowerCase()) {
      case 'critical':
        return <span className="badge-bright badge-rose" style={{ fontSize: '11px', padding: '2px 8px', fontWeight: 800 }}>Critical</span>
      case 'high':
        return <span className="badge-bright badge-orange" style={{ fontSize: '11px', padding: '2px 8px', fontWeight: 800 }}>High</span>
      case 'medium':
        return <span className="badge-bright badge-yellow" style={{ fontSize: '11px', padding: '2px 8px', fontWeight: 800 }}>Medium</span>
      default:
        return <span className="badge-bright badge-neutral" style={{ fontSize: '11px', padding: '2px 8px', fontWeight: 800 }}>Low</span>
    }
  }

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />

      <div className={`main-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <TopBar onToggleSidebar={toggleSidebar} />

        <AuthGuard moduleName="Task History & Management">
          <div className="page-container">
            {/* Header with Mode Switcher & New Task Action */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
              paddingBottom: 16,
              borderBottom: '1.5px solid #e2e8f0',
              flexWrap: 'wrap',
              gap: 16
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                  <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#23251d', margin: 0, letterSpacing: '-0.02em' }}>
                    Engineering Task Registry & Pipeline
                  </h1>
                  <span className="badge-bright badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669' }} /> Live Synced Backlog
                  </span>
                  <span className="badge-bright badge-yellow" style={{ fontSize: '11px', fontWeight: 800 }}>
                    Sprint 14 Active
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Backlog management, visual effort/complexity triage matrix, and instant Kanban workflow
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Segmented View Switcher */}
                <div style={{
                  display: 'inline-flex',
                  background: '#ffffff',
                  padding: 4,
                  borderRadius: 9999,
                  border: '1.5px solid #cbd5e1',
                  boxShadow: '1px 1px 0px #cbd5e1'
                }}>
                  <button
                    onClick={() => setViewMode('matrix')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 9999,
                      fontSize: '12px',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      background: viewMode === 'matrix' ? '#23251d' : 'transparent',
                      color: viewMode === 'matrix' ? '#ffffff' : '#64748b',
                      transition: 'all 120ms ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <ListTodo size={14} /> Registry Matrix
                  </button>
                  <button
                    onClick={() => setViewMode('kanban')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 9999,
                      fontSize: '12px',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      background: viewMode === 'kanban' ? '#23251d' : 'transparent',
                      color: viewMode === 'kanban' ? '#ffffff' : '#64748b',
                      transition: 'all 120ms ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <Kanban size={14} /> Kanban Pipeline
                  </button>
                  <button
                    onClick={() => setViewMode('analytics')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 9999,
                      fontSize: '12px',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      background: viewMode === 'analytics' ? '#23251d' : 'transparent',
                      color: viewMode === 'analytics' ? '#ffffff' : '#64748b',
                      transition: 'all 120ms ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <BarChart3 size={14} /> Backlog Analytics
                  </button>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '9px 18px',
                    background: '#f7a501',
                    color: '#23251d',
                    border: '1.5px solid #23251d',
                    fontWeight: 800,
                    fontSize: '12px',
                    borderRadius: 8,
                    boxShadow: '2px 2px 0px #23251d',
                    cursor: 'pointer',
                    transition: 'transform 80ms ease'
                  }}
                >
                  <Plus size={15} /> New Task
                </button>
              </div>
            </div>

            {/* Interactive Telemetry & Quick Filters Strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: 14,
              marginBottom: 20
            }}>
              <div
                onClick={() => setStatusFilter('all')}
                className="bright-card"
                style={{
                  padding: '14px 18px',
                  background: statusFilter === 'all' ? '#fef9ee' : '#ffffff',
                  border: statusFilter === 'all' ? '2px solid #23251d' : '1.5px solid #cbd5e1',
                  borderRadius: 12,
                  cursor: 'pointer',
                  transition: 'all 120ms ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Total Backlog</span>
                  <ListTodo size={16} color="#4f46e5" />
                </div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#23251d', lineHeight: 1 }}>{tasks.length}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: 4 }}>
                  Cumulative: <strong>{totalHours} hrs pool</strong>
                </div>
              </div>

              <div
                onClick={() => setStatusFilter('todo')}
                className="bright-card"
                style={{
                  padding: '14px 18px',
                  background: statusFilter === 'todo' ? '#fef9ee' : '#ffffff',
                  border: statusFilter === 'todo' ? '2px solid #23251d' : '1.5px solid #cbd5e1',
                  borderRadius: 12,
                  cursor: 'pointer',
                  transition: 'all 120ms ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Queued (To Do)</span>
                  <Clock size={16} color="#0284c7" />
                </div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#23251d', lineHeight: 1 }}>{todoTasks.length}</div>
                <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700, marginTop: 4 }}>
                  Ready for assignment
                </div>
              </div>

              <div
                onClick={() => setStatusFilter('in-progress')}
                className="bright-card"
                style={{
                  padding: '14px 18px',
                  background: statusFilter === 'in-progress' ? '#fef9ee' : '#ffffff',
                  border: statusFilter === 'in-progress' ? '2px solid #23251d' : '1.5px solid #cbd5e1',
                  borderRadius: 12,
                  cursor: 'pointer',
                  transition: 'all 120ms ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>In Active Flow</span>
                  <Flame size={16} color="#ea580c" />
                </div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#23251d', lineHeight: 1 }}>{inProgressTasks.length}</div>
                <div style={{ fontSize: '11px', color: '#ea580c', fontWeight: 700, marginTop: 4 }}>
                  Active engineering work
                </div>
              </div>

              <div
                onClick={() => setStatusFilter('done')}
                className="bright-card"
                style={{
                  padding: '14px 18px',
                  background: statusFilter === 'done' ? '#fef9ee' : '#ffffff',
                  border: statusFilter === 'done' ? '2px solid #23251d' : '1.5px solid #cbd5e1',
                  borderRadius: 12,
                  cursor: 'pointer',
                  transition: 'all 120ms ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Shipped & Verified</span>
                  <CheckCircle2 size={16} color="#059669" />
                </div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#23251d', lineHeight: 1 }}>{doneTasks.length}</div>
                <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: 4 }}>
                  Completed this sprint
                </div>
              </div>
            </div>

            {/* VIEW MODE 1: Registry Matrix (Golden Ratio 1.618 : 1) */}
            {viewMode === 'matrix' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(480px, 1.618fr) minmax(340px, 1fr)',
                gap: 22,
                alignItems: 'start'
              }}>
                {/* Left Column (61.8%): Task Registry Table & Filter */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Search and Filters Strip */}
                  <div className="bright-card" style={{
                    padding: '12px 16px',
                    background: '#ffffff',
                    borderRadius: 12,
                    border: '1.5px solid #cbd5e1',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 12,
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200 }}>
                      <div style={{ position: 'relative', width: '100%' }}>
                        <Search size={14} color="#64748b" style={{ position: 'absolute', left: 10, top: 9 }} />
                        <input
                          type="text"
                          placeholder="Search tasks, required skills, assignees..."
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
                      <button type="submit" className="btn-secondary" style={{ padding: '7px 14px', fontSize: '12px', fontWeight: 700 }}>
                        Search
                      </button>
                    </form>

                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '12px', color: '#23251d', outline: 'none', background: '#ffffff' }}
                      >
                        <option value="all">All Status</option>
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>

                      <select
                        value={priorityFilter}
                        onChange={e => setPriorityFilter(e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '12px', color: '#23251d', outline: 'none', background: '#ffffff' }}
                      >
                        <option value="all">All Priority</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>

                  {/* Task Registry Table */}
                  <div className="bright-card" style={{ padding: 0, overflow: 'hidden', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
                    <div style={{ padding: '12px 18px', borderBottom: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#23251d', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Registered Pipeline Items ({tasks.length})
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        Showing filtered selection
                      </span>
                    </div>

                    {loading ? (
                      <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
                        <Clock size={28} className="animate-spin" style={{ margin: '0 auto 8px', color: '#f7a501' }} />
                        <p style={{ fontSize: '12px' }}>Loading registry tasks...</p>
                      </div>
                    ) : tasks.length === 0 ? (
                      <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
                        <ListTodo size={32} color="#94a3b8" style={{ margin: '0 auto 8px' }} />
                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#23251d' }}>No engineering tasks match filters</p>
                        <p style={{ fontSize: '12px' }}>Try resetting search query or status filter.</p>
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                          <thead>
                            <tr style={{ background: '#eeefe9', borderBottom: '1.5px solid #cbd5e1' }}>
                              <th style={{ padding: '10px 14px', fontWeight: 800, color: '#475569' }}>Task Description</th>
                              <th style={{ padding: '10px 12px', fontWeight: 800, color: '#475569' }}>Priority</th>
                              <th style={{ padding: '10px 12px', fontWeight: 800, color: '#475569' }}>Assignee</th>
                              <th style={{ padding: '10px 12px', fontWeight: 800, color: '#475569' }}>Status</th>
                              <th style={{ padding: '10px 14px', fontWeight: 800, color: '#475569', textAlign: 'right' }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tasks.map(t => (
                              <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 120ms ease' }}>
                                <td style={{ padding: '12px 14px', verticalAlign: 'top', minWidth: 200 }}>
                                  <div style={{ fontWeight: 700, color: '#23251d', lineHeight: 1.3 }}>{t.title}</div>
                                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                                    {(t.required_skills || []).slice(0, 3).map((s, i) => (
                                      <span key={i} style={{ fontSize: '10px', padding: '1px 6px', background: '#e2e8f0', borderRadius: 4, color: '#475569' }}>
                                        {s}
                                      </span>
                                    ))}
                                    <span style={{ fontSize: '10px', color: '#94a3b8', padding: '1px 4px' }}>
                                      {t.estimated_hours || 4}h • {t.complexity || 5}/10 complexity
                                    </span>
                                  </div>
                                </td>
                                <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                                  {getPriorityBadge(t.priority || 'medium')}
                                </td>
                                <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                                  {t.assigned_to ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#0284c7', color: '#fff', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {t.assigned_to.slice(0, 2).toUpperCase()}
                                      </div>
                                      <span style={{ fontWeight: 600, color: '#23251d' }}>{t.assigned_to}</span>
                                    </div>
                                  ) : (
                                    <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '11px' }}>Unassigned</span>
                                  )}
                                </td>
                                <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                                  <select
                                    value={t.status}
                                    onChange={e => handleStatusChange(t.id, e.target.value)}
                                    style={{
                                      fontSize: '11px',
                                      fontWeight: 700,
                                      padding: '4px 8px',
                                      borderRadius: 6,
                                      border: '1.5px solid #cbd5e1',
                                      outline: 'none',
                                      background: t.status === 'done' ? '#dcfce7' : t.status === 'in-progress' ? '#fef3c7' : '#f1f5f9',
                                      color: t.status === 'done' ? '#166534' : t.status === 'in-progress' ? '#92400e' : '#475569'
                                    }}
                                  >
                                    <option value="todo">To Do</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="done">Done</option>
                                  </select>
                                </td>
                                <td style={{ padding: '12px 14px', verticalAlign: 'middle', textAlign: 'right' }}>
                                  <button
                                    onClick={() => handleDelete(t.id)}
                                    title="Delete task"
                                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column (38.2%): Triage Scatter Matrix & Workload */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Distinct Chart 1: Effort vs Complexity 2D Triage Matrix */}
                  <div className="bright-card" style={{ padding: 20, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                          Backlog Triage Matrix
                        </h3>
                        <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>Effort (Hours) vs Technical Complexity</p>
                      </div>
                      <span className="badge-bright badge-indigo" style={{ fontSize: '10px' }}>2D Matrix</span>
                    </div>

                    <div style={{ width: '100%', height: 210 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 10, right: 15, bottom: 20, left: -15 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis
                            type="number"
                            dataKey="hours"
                            name="Effort Hours"
                            unit="h"
                            domain={[0, 20]}
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            label={{ value: 'Effort (Hours)', position: 'insideBottom', offset: -12, fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                          />
                          <YAxis
                            type="number"
                            dataKey="complexity"
                            name="Complexity"
                            domain={[0, 10]}
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            label={{ value: 'Complexity (1-10)', angle: -90, position: 'insideLeft', offset: 15, fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                          />
                          <Tooltip content={<CustomTriageTooltip />} />
                          <ReferenceLine x={6} stroke="#cbd5e1" strokeDasharray="3 3" />
                          <ReferenceLine y={5} stroke="#cbd5e1" strokeDasharray="3 3" />
                          <Scatter name="Tasks" data={triageScatterData}>
                            {triageScatterData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                stroke="#23251d"
                                strokeWidth={1}
                              />
                            ))}
                          </Scatter>
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Quadrant Legend Bar */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: 6,
                      marginTop: 8,
                      fontSize: '10px',
                      color: '#475569'
                    }}>
                      <div style={{ padding: '4px 6px', borderRadius: 4, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                        ★ <strong>Quick Wins:</strong> Low hours, low complexity
                      </div>
                      <div style={{ padding: '4px 6px', borderRadius: 4, background: '#fef2f2', border: '1px solid #fecaca' }}>
                        🚀 <strong>Major Epics:</strong> High hours, high complexity
                      </div>
                    </div>
                  </div>

                  {/* Distinct Chart 2: Assignee Workload Balance Bar Chart */}
                  <div className="bright-card" style={{ padding: 20, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                          Workload by Assignee
                        </h3>
                        <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>Committed engineering hours</p>
                      </div>
                      <span className="badge-bright badge-yellow" style={{ fontSize: '10px' }}>Capacity</span>
                    </div>

                    <div style={{ width: '100%', height: 160 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={assigneeWorkloadData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#475569', fontWeight: 700 }} />
                          <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} unit="h" />
                          <Tooltip
                            contentStyle={{ background: '#23251d', border: 'none', borderRadius: 8, color: '#ffffff', fontSize: '11px' }}
                            formatter={(val: any) => [`${val} Hours Assigned`, 'Workload']}
                          />
                          <Bar dataKey="hours" fill="#0284c7" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Delegator Shortcut Banner */}
                  <div className="bright-card" style={{ padding: 18, background: '#eeefe9', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Zap size={16} color="#f7a501" />
                      <strong style={{ fontSize: '12px', color: '#23251d' }}>AI Task Delegator Available</strong>
                    </div>
                    <p style={{ fontSize: '11px', color: '#4d4f46', lineHeight: 1.4, margin: '0 0 10px' }}>
                      Assign unallocated backlog items instantly using 5-Factor mathematical developer matching.
                    </p>
                    <a
                      href="/delegator"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: '11px',
                        fontWeight: 800,
                        color: '#23251d',
                        textDecoration: 'underline'
                      }}
                    >
                      Open 5-Factor Allocator →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW MODE 2: Kanban Pipeline (3 Columns) */}
            {viewMode === 'kanban' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 18,
                alignItems: 'start'
              }}>
                {/* Column 1: To Do */}
                <div style={{
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: 12,
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  minHeight: 500
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1.5px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#64748b' }} />
                      <strong style={{ fontSize: '13px', color: '#23251d' }}>Queued Backlog</strong>
                    </div>
                    <span className="badge-bright badge-neutral" style={{ fontSize: '11px' }}>
                      {todoTasks.length}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {todoTasks.length === 0 ? (
                      <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                        No queued tasks
                      </div>
                    ) : (
                      todoTasks.map(t => (
                        <div
                          key={t.id}
                          className="bright-card"
                          style={{
                            padding: 12,
                            background: '#ffffff',
                            border: '1.5px solid #cbd5e1',
                            borderRadius: 10,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                            boxShadow: '1px 1px 0px #cbd5e1'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            {getPriorityBadge(t.priority || 'medium')}
                            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>
                              {t.estimated_hours || 4}h effort
                            </span>
                          </div>

                          <div style={{ fontSize: '13px', fontWeight: 800, color: '#23251d', lineHeight: 1.3 }}>
                            {t.title}
                          </div>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {(t.required_skills || []).slice(0, 3).map((s, idx) => (
                              <span key={idx} style={{ fontSize: '10px', padding: '1px 5px', background: '#f1f5f9', borderRadius: 4, color: '#475569' }}>
                                {s}
                              </span>
                            ))}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6, borderTop: '1px solid #f1f5f9' }}>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>
                              {t.assigned_to ? <strong>{t.assigned_to}</strong> : <em style={{ color: '#94a3b8' }}>Unassigned</em>}
                            </span>
                            <button
                              onClick={() => handleStatusChange(t.id, 'in-progress')}
                              style={{
                                padding: '4px 8px',
                                borderRadius: 6,
                                background: '#fef3c7',
                                border: '1px solid #f7a501',
                                color: '#92400e',
                                fontSize: '10px',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                            >
                              Start Flow <ArrowRight size={10} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Column 2: In Progress */}
                <div style={{
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: 12,
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  minHeight: 500
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1.5px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f7a501' }} />
                      <strong style={{ fontSize: '13px', color: '#23251d' }}>In Active Flow</strong>
                    </div>
                    <span className="badge-bright badge-yellow" style={{ fontSize: '11px' }}>
                      {inProgressTasks.length}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {inProgressTasks.length === 0 ? (
                      <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                        No tasks in progress
                      </div>
                    ) : (
                      inProgressTasks.map(t => (
                        <div
                          key={t.id}
                          className="bright-card"
                          style={{
                            padding: 12,
                            background: '#ffffff',
                            border: '1.5px solid #f7a501',
                            borderRadius: 10,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                            boxShadow: '1px 1px 0px #f7a501'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            {getPriorityBadge(t.priority || 'medium')}
                            <span style={{ fontSize: '10px', color: '#d97706', fontWeight: 800 }}>
                              Active Development
                            </span>
                          </div>

                          <div style={{ fontSize: '13px', fontWeight: 800, color: '#23251d', lineHeight: 1.3 }}>
                            {t.title}
                          </div>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {(t.required_skills || []).slice(0, 3).map((s, idx) => (
                              <span key={idx} style={{ fontSize: '10px', padding: '1px 5px', background: '#fef3c7', borderRadius: 4, color: '#92400e' }}>
                                {s}
                              </span>
                            ))}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6, borderTop: '1px solid #f1f5f9' }}>
                            <button
                              onClick={() => handleStatusChange(t.id, 'todo')}
                              style={{
                                padding: '3px 6px',
                                borderRadius: 4,
                                background: '#f1f5f9',
                                border: '1px solid #cbd5e1',
                                color: '#475569',
                                fontSize: '10px',
                                cursor: 'pointer'
                              }}
                            >
                              <ArrowLeft size={10} /> Queue
                            </button>
                            <button
                              onClick={() => handleStatusChange(t.id, 'done')}
                              style={{
                                padding: '4px 8px',
                                borderRadius: 6,
                                background: '#dcfce7',
                                border: '1px solid #059669',
                                color: '#166534',
                                fontSize: '10px',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                            >
                              <Check size={11} /> Mark Shipped
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Column 3: Shipped & Done */}
                <div style={{
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: 12,
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  minHeight: 500
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1.5px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} />
                      <strong style={{ fontSize: '13px', color: '#23251d' }}>Shipped & Verified</strong>
                    </div>
                    <span className="badge-bright badge-emerald" style={{ fontSize: '11px' }}>
                      {doneTasks.length}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {doneTasks.length === 0 ? (
                      <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                        No shipped tasks yet
                      </div>
                    ) : (
                      doneTasks.map(t => (
                        <div
                          key={t.id}
                          className="bright-card"
                          style={{
                            padding: 12,
                            background: '#f8fafc',
                            border: '1.5px solid #bbf7d0',
                            borderRadius: 10,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                            opacity: 0.95
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '10px', color: '#059669', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <CheckCircle2 size={12} color="#059669" /> Shipped
                            </span>
                            <span style={{ fontSize: '10px', color: '#64748b' }}>
                              {t.estimated_hours || 4}h
                            </span>
                          </div>

                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#23251d', lineHeight: 1.3, textDecoration: 'line-through' }}>
                            {t.title}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6, borderTop: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '10px', color: '#64748b' }}>
                              By {t.assigned_to || 'Team'}
                            </span>
                            <button
                              onClick={() => handleStatusChange(t.id, 'in-progress')}
                              style={{
                                padding: '3px 6px',
                                borderRadius: 4,
                                background: '#ffffff',
                                border: '1px solid #cbd5e1',
                                color: '#475569',
                                fontSize: '10px',
                                cursor: 'pointer'
                              }}
                            >
                              Reopen
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW MODE 3: Backlog Analytics Deep Dive */}
            {viewMode === 'analytics' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(450px, 1.4fr) minmax(350px, 1fr)',
                  gap: 20
                }}>
                  {/* Expanded Triage Scatter Chart */}
                  <div className="bright-card" style={{ padding: 22, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                          Strategic Effort vs Complexity Quadrants
                        </h3>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
                          Map every task by cognitive load and time footprint to balance sprint velocity
                        </p>
                      </div>
                      <span className="badge-bright badge-indigo">Triage View</span>
                    </div>

                    <div style={{ width: '100%', height: 260 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 10, right: 20, bottom: 25, left: -10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis
                            type="number"
                            dataKey="hours"
                            name="Effort Hours"
                            unit="h"
                            domain={[0, 20]}
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            label={{ value: 'Effort (Hours)', position: 'insideBottom', offset: -15, fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                          />
                          <YAxis
                            type="number"
                            dataKey="complexity"
                            name="Complexity"
                            domain={[0, 10]}
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            label={{ value: 'Technical Complexity (1-10)', angle: -90, position: 'insideLeft', offset: 15, fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                          />
                          <Tooltip content={<CustomTriageTooltip />} />
                          <ReferenceLine x={6} stroke="#cbd5e1" strokeDasharray="3 3" />
                          <ReferenceLine y={5} stroke="#cbd5e1" strokeDasharray="3 3" />
                          <Scatter name="Tasks" data={triageScatterData}>
                            {triageScatterData.map((entry, index) => (
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
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: 8,
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: '1px solid #f1f5f9',
                      fontSize: '11px'
                    }}>
                      <div style={{ padding: '6px 8px', borderRadius: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534' }}>
                        ★ <strong>Quick Wins:</strong> Low hours, low complexity
                      </div>
                      <div style={{ padding: '6px 8px', borderRadius: 6, background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b' }}>
                        🚀 <strong>Major Epics:</strong> High hours, high complexity
                      </div>
                      <div style={{ padding: '6px 8px', borderRadius: 6, background: '#f5f3ff', border: '1px solid #ddd6fe', color: '#5b21b6' }}>
                        🧠 <strong>Deep Spikes:</strong> High complexity, low hours
                      </div>
                      <div style={{ padding: '6px 8px', borderRadius: 6, background: '#fefce8', border: '1px solid #fef08a', color: '#854d0e' }}>
                        ⚙ <strong>Labor Heavy:</strong> Low complexity, high hours
                      </div>
                    </div>
                  </div>

                  {/* Assignee Workload Balance */}
                  <div className="bright-card" style={{ padding: 22, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                          Workload Allocation by Engineer
                        </h3>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
                          Cumulative task hours per team member
                        </p>
                      </div>
                      <span className="badge-bright badge-yellow">Capacity Headroom</span>
                    </div>

                    <div style={{ width: '100%', height: 230 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={assigneeWorkloadData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#475569', fontWeight: 700 }} />
                          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} unit="h" />
                          <Tooltip
                            contentStyle={{ background: '#23251d', border: 'none', borderRadius: 8, color: '#ffffff', fontSize: '11px' }}
                            formatter={(val: any) => [`${val} Hours Assigned`, 'Workload']}
                          />
                          <Bar dataKey="hours" fill="#f7a501" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', marginTop: 10 }}>
                      Tip: Keep individual engineer workload below 24h per sprint to prevent burnout.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal: Queue New Engineering Task */}
            {isModalOpen && (
              <div style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(35, 37, 29, 0.4)',
                backdropFilter: 'blur(3px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                padding: 16
              }}>
                <div className="bright-card" style={{
                  background: '#ffffff',
                  width: '100%',
                  maxWidth: 500,
                  padding: 24,
                  borderRadius: 14,
                  border: '2px solid #23251d',
                  boxShadow: '4px 4px 0px #23251d'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1.5px solid #e2e8f0', paddingBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                        Queue New Engineering Task
                      </h3>
                      <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>Add item directly to the backlog registry</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: 4 }}>
                        TASK TITLE *
                      </label>
                      <input
                        placeholder="e.g. Implement Webhook Deduplication Layer"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        required
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: 4 }}>
                        REQUIRED SKILLS (comma-separated)
                      </label>
                      <input
                        placeholder="e.g. Go, Redis, Kafka"
                        value={newSkills}
                        onChange={e => setNewSkills(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                      />
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                        {QUICK_SKILLS.slice(0, 6).map(sk => (
                          <button
                            key={sk}
                            type="button"
                            onClick={() => setNewSkills(prev => prev ? `${prev}, ${sk}` : sk)}
                            style={{
                              padding: '2px 6px',
                              borderRadius: 4,
                              background: '#f8fafc',
                              border: '1px dashed #cbd5e1',
                              fontSize: '10px',
                              color: '#475569',
                              cursor: 'pointer'
                            }}
                          >
                            + {sk}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: 4 }}>
                          PRIORITY
                        </label>
                        <select
                          value={newPriority}
                          onChange={e => setNewPriority(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: 4 }}>
                          ESTIMATED HOURS
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="40"
                          value={newHours}
                          onChange={e => setNewHours(Number(e.target.value))}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: 4 }}>
                          TECHNICAL COMPLEXITY (1-10)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={newComplexity}
                          onChange={e => setNewComplexity(Number(e.target.value))}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: 4 }}>
                          ASSIGN DEVELOPER (Optional)
                        </label>
                        <input
                          placeholder="e.g. Alex Rivera"
                          value={newAssignee}
                          onChange={e => setNewAssignee(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={creating}
                      style={{
                        marginTop: 6,
                        padding: '12px',
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
                      {creating ? 'Saving...' : 'Add Task to Registry'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </AuthGuard>
      </div>
    </div>
  )
}
