'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Brain,
  CalendarDays,
  Flame,
  Home,
  Shield,
  Bot,
  Users,
  TrendingUp,
  Pin,
  PinOff,
  ListTodo,
  BarChart3,
  Settings
} from 'lucide-react'
import { useSidebar } from '@/context/SidebarContext'

export const navLinks = [
  { href: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard'          },
  { href: '/delegator',   icon: Brain,            label: 'Task Delegator'      },
  { href: '/tasks',       icon: ListTodo,         label: 'Task History'        },
  { href: '/sprint',      icon: CalendarDays,     label: 'Sprint Planner'      },
  { href: '/burnout',     icon: Flame,            label: 'Burnout Radar'       },
  { href: '/wfh',         icon: Home,             label: 'WFH Decider'         },
  { href: '/deadline',    icon: Shield,           label: 'Deadline Shield'     },
  { href: '/copilot',     icon: Bot,              label: 'AI Copilot'          },
  { href: '/team',        icon: Users,            label: 'Team Roster'         },
  { href: '/productivity',icon: TrendingUp,       label: 'Productivity'        },
  { href: '/analytics',   icon: BarChart3,        label: 'Analytics'           },
  { href: '/settings',    icon: Settings,         label: 'Settings'            },
]

export function Sidebar({ collapsed: _propCollapsed }: { collapsed?: boolean; onToggle?: () => void }) {
  const pathname = usePathname()
  const { isHovered, setIsHovered, isPinned, togglePinned, isExpanded } = useSidebar()

  return (
    <aside
      className="floating-sidebar"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: isExpanded ? '240px' : '68px',
        position: 'fixed',
        top: '14px',
        bottom: '14px',
        left: '14px',
        height: 'calc(100vh - 28px)',
        background: '#ffffff',
        border: '1.5px solid #cbd5e1',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
        transition: 'width 220ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 220ms ease',
        overflow: 'hidden',
        boxShadow: isExpanded
          ? '0 12px 36px rgba(35, 37, 29, 0.14), 0 2px 8px rgba(35, 37, 29, 0.06)'
          : '0 4px 16px rgba(35, 37, 29, 0.06)'
      }}
    >
      {/* Brand Header */}
      <div style={{
        padding: isExpanded ? '14px 16px' : '14px 12px',
        borderBottom: '1.5px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isExpanded ? 'space-between' : 'center',
        height: 60,
        boxSizing: 'border-box'
      }}>
        <Link
          href="/"
          title="Return to ORKA Landing Page"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            justifyContent: isExpanded ? 'flex-start' : 'center',
            minWidth: 0,
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#f7a501',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px solid #23251d',
            boxShadow: '1.5px 1.5px 0px #23251d',
            flexShrink: 0,
            overflow: 'hidden',
            padding: 4
          }}>
            <img src="/orka-logo.png" alt="ORKA Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          {isExpanded && (
            <div style={{ whiteSpace: 'nowrap', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '17px', fontWeight: 800, color: '#23251d', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  ORKA
                </span>
                <span className="badge-bright badge-yellow" style={{ fontSize: '9px', padding: '1px 5px', fontWeight: 800 }}>
                  v2.0
                </span>
              </div>
              <p style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                AI Decision Engine
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: isExpanded ? '12px 10px' : '12px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
        {isExpanded && (
          <p style={{
            fontSize: '10px',
            color: '#64748b',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '2px 8px 8px',
            fontWeight: 800,
            whiteSpace: 'nowrap'
          }}>
            Operations
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {navLinks.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                title={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: isExpanded ? '8px 12px' : '9px',
                  justifyContent: isExpanded ? 'flex-start' : 'center',
                  borderRadius: 10,
                  fontSize: '13px',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? '#23251d' : '#4d4f46',
                  background: isActive ? '#eeefe9' : 'transparent',
                  border: isActive ? '1.5px solid #23251d' : '1.5px solid transparent',
                  boxShadow: isActive ? '2px 2px 0px #23251d' : 'none',
                  transition: 'background 120ms ease, border-color 120ms ease',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={18} color={isActive ? '#23251d' : '#64748b'} style={{ flexShrink: 0 }} />
                {isExpanded && <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
                {isExpanded && isActive && (
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#f7a501',
                    boxShadow: '0 0 6px #f7a501',
                    flexShrink: 0
                  }} />
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Floating Footer: Pin / Hover control */}
      <div style={{
        padding: isExpanded ? '10px 12px' : '10px 8px',
        borderTop: '1.5px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isExpanded ? 'space-between' : 'center',
        background: '#f8fafc'
      }}>
        <button
          onClick={togglePinned}
          title={isPinned ? 'Unpin sidebar (auto-collapse on mouse-out)' : 'Pin sidebar open'}
          style={{
            background: isPinned ? '#eeefe9' : '#ffffff',
            border: isPinned ? '1.5px solid #23251d' : '1.5px solid #cbd5e1',
            borderRadius: 8,
            padding: isExpanded ? '6px 10px' : '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 700,
            color: '#23251d',
            width: isExpanded ? '100%' : 36,
            height: 32,
            transition: 'all 120ms ease'
          }}
        >
          {isPinned ? (
            <>
              <PinOff size={14} color="#23251d" />
              {isExpanded && <span>Unpin Sidebar</span>}
            </>
          ) : (
            <>
              <Pin size={14} color="#64748b" />
              {isExpanded && <span style={{ color: '#64748b' }}>Pin Expanded</span>}
            </>
          )}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
