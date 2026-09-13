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
  Sparkles,
  Zap
} from 'lucide-react'

export const navLinks = [
  { href: '/',            icon: Sparkles,         label: 'Landing Page'        },
  { href: '/dashboard',   icon: LayoutDashboard, label: 'Executive Dashboard' },
  { href: '/delegator',   icon: Brain,            label: 'Task Delegator'      },
  { href: '/sprint',      icon: CalendarDays,     label: 'Sprint Planner'      },
  { href: '/burnout',     icon: Flame,            label: 'Burnout Radar'       },
  { href: '/wfh',         icon: Home,             label: 'WFH Decider'         },
  { href: '/deadline',    icon: Shield,           label: 'Deadline Shield'     },
  { href: '/copilot',     icon: Bot,              label: 'AI Copilot'          },
  { href: '/team',        icon: Users,            label: 'Team Builder'        },
  { href: '/productivity',icon: TrendingUp,       label: 'Productivity'        },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
              boxShadow: '0 0 16px rgba(99, 102, 241, 0.40)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Zap size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            ORK<span style={{ color: 'var(--accent-indigo)' }}>A</span>
          </span>
        </div>
        <p
          style={{
            fontSize: 'var(--font-xs)',
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginLeft: 44,
          }}
        >
          AI Decision Engine
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <p
          style={{
            fontSize: 'var(--font-xs)',
            color: 'var(--text-faint)',
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            padding: '4px 13px 8px',
            fontWeight: 600,
          }}
        >
          Modules
        </p>
        {navLinks.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="nav-icon" size={16} strokeWidth={isActive ? 2.5 : 2} />
              <span>{label}</span>
              {isActive && (
                <span
                  style={{
                    marginLeft: 'auto',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--accent-indigo)',
                    boxShadow: '0 0 6px rgba(99, 102, 241, 0.6)',
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
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.16)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-indigo)', boxShadow: '0 0 6px rgba(99, 102, 241, 0.8)' }} />
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            v2.0 · Supernova Hacks
          </span>
        </div>
      </div>
    </aside>
  )
}
