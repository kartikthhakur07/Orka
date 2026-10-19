'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Bell, UserCheck, ShieldCheck, LogIn, LogOut, KeyRound } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { RoleLoginModal } from '@/components/RoleLoginModal'

interface TopBarProps {
  onToggleSidebar?: () => void
  onSearchChange?: (val: string) => void
  searchValue?: string
}

export function TopBar({ onSearchChange, searchValue = '' }: TopBarProps) {
  const router = useRouter()
  const { user, isLoggedIn, logout, openAuthModal } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)

  const handleExit = () => {
    logout()
    router.push('/')
  }

  const notifications = [
    { id: 1, title: 'Burnout Warning', text: 'Anya Ivanova workload reached 91% (Watch List)', time: '10m ago', unread: true },
    { id: 2, title: 'Sprint Milestone', text: 'Sprint 47 burndown on track (6 pts remaining)', time: '1h ago', unread: true },
    { id: 3, title: 'AI Delegation Complete', text: 'Task #ORK-2851 delegated to Priya Sharma', time: '2h ago', unread: true },
  ]

  return (
    <>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        background: '#eeefe9',
        borderBottom: '1.5px solid #cbd5e1',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}>
        {/* Left: Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, maxWidth: 520 }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={15} color="#64748b" style={{ position: 'absolute', left: 12, top: 11 }} />
            <input
              type="text"
              placeholder="Ask ORKA AI or search tasks, engineers, metrics…"
              value={searchValue}
              onChange={e => onSearchChange?.(e.target.value)}
              className="bright-input"
              style={{
                width: '100%',
                paddingLeft: 36,
                paddingRight: 14,
                paddingTop: 8,
                paddingBottom: 8,
                fontSize: '13px',
                borderRadius: 8,
                border: '1.5px solid #cbd5e1',
                background: '#ffffff',
                color: '#23251d'
              }}
            />
          </div>
        </div>

        {/* Right: Notifications & User Session */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

          {/* Notification Bell Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                if (unreadCount > 0) setUnreadCount(0)
              }}
              style={{
                position: 'relative',
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                borderRadius: 8,
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#23251d',
                transition: 'all 120ms ease'
              }}
              aria-label="Notifications"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#f7a501',
                  border: '1.5px solid #23251d'
                }} />
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 44,
                width: 330,
                background: '#ffffff',
                borderRadius: 12,
                border: '1.5px solid #23251d',
                boxShadow: '4px 4px 0px #23251d',
                zIndex: 100,
                overflow: 'hidden'
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eeefe9' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#23251d' }}>System Alerts</span>
                  <span className="badge-bright badge-yellow">3 New</span>
                </div>
                <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                  {notifications.map(n => (
                    <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', background: n.unread ? '#fef08a15' : '#ffffff' }}>
                      <p style={{ fontSize: '13px', fontWeight: 800, color: '#23251d', margin: 0 }}>{n.title}</p>
                      <p style={{ fontSize: '12px', color: '#4d4f46', marginTop: 2, margin: '2px 0 0' }}>{n.text}</p>
                      <span style={{ fontSize: '10px', color: '#64748b', marginTop: 4, display: 'block' }}>{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Session Chip / Sign In Button */}
          {isLoggedIn && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '3px 12px 3px 4px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: 9999,
                }}
              >
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: user.avatarColor || '#4f46e5',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 800, color: '#23251d', lineHeight: 1.1, margin: 0 }}>{user.name}</p>
                  <p style={{ fontSize: '10px', color: '#059669', fontWeight: 700, margin: 0 }}>• {user.role}</p>
                </div>
              </div>

              <button
                onClick={handleExit}
                title="Log out and return to landing page"
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: 8,
                  padding: '6px 10px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <LogOut size={14} /> Exit
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#23251d',
                color: '#ffffff',
                padding: '7px 16px',
                borderRadius: 9999,
                fontSize: '13px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'none',
                boxShadow: '0 1px 3px rgba(35, 37, 29, 0.2)'
              }}
            >
              <LogIn size={15} /> Log In
            </Link>
          )}
        </div>
      </header>

      {/* Role Login Switcher Modal */}
      <RoleLoginModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onRoleSelect={() => {}}
      />
    </>
  )
}

export default TopBar
