'use client'

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
  Sparkles
} from 'lucide-react'

export const navLinks = [
  { href: '/',            icon: Sparkles,         label: 'Landing Page'        },
  { href: '/dashboard',   icon: LayoutDashboard, label: 'Overview Dashboard' },
  { href: '/delegator',   icon: Brain,            label: 'Task Delegator'      },
  { href: '/sprint',      icon: CalendarDays,     label: 'Sprint Planner'      },
  { href: '/burnout',     icon: Flame,            label: 'Burnout Radar'       },
  { href: '/wfh',         icon: Home,             label: 'WFH Decider'         },
  { href: '/deadline',    icon: Shield,           label: 'Deadline Shield'     },
  { href: '/copilot',     icon: Bot,              label: 'AI Copilot'          },
  { href: '/team',        icon: Users,            label: 'Team Roster'         },
  { href: '/productivity',icon: TrendingUp,       label: 'Productivity'        },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-logo">
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: '#16a34a',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(22, 163, 74, 0.4)',
            }}
          >
            O
          </div>
          <div>
            <p style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc', lineHeight: 1.1 }}>
              ORKA <span style={{ color: '#4ade80' }}>v2</span>
            </p>
            <p style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: 2 }}>
              Engineering Intelligence
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <p
          style={{
            fontSize: '11px',
            color: '#64748b',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '4px 14px 8px',
            fontWeight: 700,
          }}
        >
          Core Modules
        </p>
        {navLinks.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="nav-icon" size={17} />
              <span>{label}</span>
              {isActive && (
                <span
                  style={{
                    marginLeft: 'auto',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#4ade80',
                    boxShadow: '0 0 8px #4ade80',
                    flexShrink: 0,
                  }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
          <span style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '0.02em' }}>
            v2.0 · Live IBM HR AI Sync
          </span>
        </div>
      </div>
    </aside>
  )
}
