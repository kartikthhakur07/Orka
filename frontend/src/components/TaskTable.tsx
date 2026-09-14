'use client'

import { useState } from 'react'
import { Badge } from '@/components/Badge'

export interface TaskItem {
  id: string
  title: string
  assignee: string
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  status: 'Done' | 'In Progress' | 'In Review' | 'Blocked'
  points: number
}

interface TaskTableProps {
  searchQuery?: string
  tasks?: TaskItem[]
}

export function TaskTable({ searchQuery = '', tasks }: TaskTableProps) {
  const [activeFilter, setActiveFilter] = useState<'All' | 'My tasks' | 'In Review' | 'Blocked'>('All')

  const defaultTasks: TaskItem[] = [
    { id: 'ORK-2851', title: 'Implement authentication flow', assignee: 'Priya Sharma', priority: 'Critical', status: 'In Progress', points: 5 },
    { id: 'ORK-2850', title: 'Optimize PostgreSQL Database Connection Pool', assignee: 'Anya Ivanova', priority: 'High', status: 'In Review', points: 8 },
    { id: 'ORK-2849', title: 'Build Executive Dashboard Stat Card Widgets', assignee: 'Marcus Chen', priority: 'Medium', status: 'Done', points: 3 },
    { id: 'ORK-2848', title: 'Implement IBM HR Dataset Preprocessing Pipeline', assignee: 'Priya Sharma', priority: 'High', status: 'Done', points: 5 },
    { id: 'ORK-2847', title: 'Setup GitHub Actions CI/CD Release Automation', assignee: 'Sara Kim', priority: 'Medium', status: 'Blocked', points: 2 },
    { id: 'ORK-2846', title: 'Design Responsive Mobile Navigation Menu', assignee: 'Leo Wang', priority: 'Low', status: 'In Progress', points: 3 },
  ]

  const rawList = tasks && tasks.length > 0 ? tasks : defaultTasks

  const filteredTasks = rawList.filter(task => {
    // Search query filter
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    // Tab filter
    if (activeFilter === 'My tasks') return task.assignee.includes('Priya')
    if (activeFilter === 'In Review') return task.status === 'In Review'
    if (activeFilter === 'Blocked') return task.status === 'Blocked'
    return true
  })

  function getStatusBadge(s: TaskItem['status']) {
    if (s === 'Done') return <Badge variant="green">Done</Badge>
    if (s === 'In Progress') return <Badge variant="blue">In Progress</Badge>
    if (s === 'In Review') return <Badge variant="indigo">In Review</Badge>
    return <Badge variant="crimson">Blocked</Badge>
  }

  function getPriorityBadge(p: TaskItem['priority']) {
    if (p === 'Critical') return <Badge variant="crimson">Critical</Badge>
    if (p === 'High') return <Badge variant="amber">High</Badge>
    if (p === 'Medium') return <Badge variant="indigo">Medium</Badge>
    return <Badge variant="gray">Low</Badge>
  }

  return (
    <div className="glass-card" style={{ borderRadius: 20, overflow: 'hidden' }}>
      {/* Table Header & Filters */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#0f172a' }}>
            Active Tasks
          </h3>
          <p style={{ fontSize: 'var(--font-xs)', color: '#64748b', marginTop: 2 }}>
            Showing {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 6, background: '#f1f5f9', padding: 4, borderRadius: 10 }}>
          {(['All', 'My tasks', 'In Review', 'Blocked'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: 'none',
                background: activeFilter === tab ? '#ffffff' : 'transparent',
                color: activeFilter === tab ? '#0f172a' : '#64748b',
                fontSize: 'var(--font-xs)',
                fontWeight: activeFilter === tab ? 700 : 500,
                cursor: 'pointer',
                boxShadow: activeFilter === tab ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 150ms'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      <div style={{ overflowX: 'auto' }}>
        <table className="orka-table">
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Title</th>
              <th>Assignee</th>
              <th>Priority</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                  No tasks found matching filter "{activeFilter}"
                </td>
              </tr>
            ) : filteredTasks.map(row => (
              <tr key={row.id}>
                <td style={{ fontFamily: 'DM Mono, monospace', fontWeight: 700, color: '#16a34a' }}>
                  {row.id}
                </td>
                <td style={{ fontWeight: 600, color: '#0f172a' }}>
                  {row.title}
                </td>
                <td>{row.assignee}</td>
                <td>{getPriorityBadge(row.priority)}</td>
                <td>{getStatusBadge(row.status)}</td>
                <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'DM Mono, monospace', color: '#0f172a' }}>
                  {row.points} pts
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
