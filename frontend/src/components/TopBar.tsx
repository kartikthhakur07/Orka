'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Bell, Menu, ArrowLeft, Check, Sparkles } from 'lucide-react'

interface TopBarProps {
  onToggleSidebar: () => void
  onSearchChange?: (val: string) => void
  searchValue?: string
}

export function TopBar({ onToggleSidebar, onSearchChange, searchValue = '' }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)

  const notifications = [
    { id: 1, title: 'Burnout Warning', text: 'Anya Ivanova load reached 91% (Watch List)', time: '10m ago', unread: true },
    { id: 2, title: 'Sprint Milestone', text: 'Sprint 47 burndown on track (6 pts remaining)', time: '1h ago', unread: true },
    { id: 3, title: 'AI Delegation Complete', text: 'Task #ORK-2851 delegated to Priya Sharma', time: '2h ago', unread: true },
  ]

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Left: Mobile Menu Button & Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, maxWidth: 500 }}>
        <button
          onClick={onToggleSidebar}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#475569', display: 'flex', alignItems: 'center', padding: 6,
            borderRadius: 8
          }}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: 12 }} />
          <input
            type="text"
            className="orka-input"
            placeholder="Search tasks, people…"
            value={searchValue}
            onChange={e => onSearchChange?.(e.target.value)}
            style={{
              paddingLeft: 38,
              fontSize: 'var(--font-xs)',
              borderRadius: 99,
              background: '#f8fafc',
              border: '1px solid #e2e8f0'
            }}
          />
        </div>
      </div>

      {/* Right: Back to Site, Notification Bell, User Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link
          href="/"
          className="btn-secondary"
          style={{ textDecoration: 'none', fontSize: 'var(--font-xs)', padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <ArrowLeft size={14} /> Back to site
        </Link>

        {/* Notification Bell with Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications)
              if (unreadCount > 0) setUnreadCount(0)
            }}
            style={{
              position: 'relative',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '50%',
              width: 38, height: 38,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#475569'
            }}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: 2, right: 2,
                width: 10, height: 10, borderRadius: '50%',
                background: '#dc2626', border: '2px solid #ffffff'
              }} />
            )}
          </button>

          {/* Notifications Dropdown Popover */}
          {showNotifications && (
            <div style={{
              position: 'absolute', right: 0, top: 48,
              width: 320, background: '#ffffff',
              borderRadius: 16, border: '1px solid #e2e8f0',
              boxShadow: '0 12px 30px rgba(15, 23, 42, 0.15)',
              zIndex: 100, overflow: 'hidden'
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--font-xs)', fontWeight: 800, color: '#0f172a' }}>Notifications</span>
                <span className="badge badge-green">3 New</span>
              </div>
              <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', background: n.unread ? '#f0fdf4' : '#fff' }}>
                    <p style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: '#0f172a' }}>{n.title}</p>
                    <p style={{ fontSize: '11px', color: '#475569', marginTop: 2 }}>{n.text}</p>
                    <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: 4, display: 'block' }}>{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#16a34a', color: '#ffffff',
            fontWeight: 800, fontSize: 'var(--font-xs)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            PS
          </div>
          <div>
            <p style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }}>Priya Sharma</p>
            <p style={{ fontSize: '10px', color: '#64748b' }}>Admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}
