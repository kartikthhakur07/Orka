'use client'

import './globals.css'
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
  Zap
} from 'lucide-react'

const navLinks = [
  { href: '/',            icon: LayoutDashboard, label: 'Executive Dashboard' },
  { href: '/delegator',   icon: Brain,            label: 'Task Delegator'      },
  { href: '/sprint',      icon: CalendarDays,     label: 'Sprint Planner'      },
  { href: '/burnout',     icon: Flame,            label: 'Burnout Radar'       },
  { href: '/wfh',         icon: Home,             label: 'WFH Decider'         },
  { href: '/deadline',    icon: Shield,           label: 'Deadline Shield'     },
  { href: '/copilot',     icon: Bot,              label: 'AI Copilot'          },
  { href: '/team',        icon: Users,            label: 'Team Builder'        },
  { href: '/productivity',icon: TrendingUp,       label: 'Productivity'        },
]

function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea6c0a 100%)', boxShadow: '0 0 16px rgba(249,115,22,0.40)' }}>
            <Zap size={16} color="#fff" strokeWidth={2.5} />
          </div>
          <span className="logo-text" style={{ color: '#f1f5f9' }}>
            ORK<span className="logo-a">A</span>
          </span>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginLeft: '40px' }}>
          AI Decision Engine
        </p>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <p style={{ fontSize: '0.65rem', color: 'var(--text-faint)', letterSpacing: '0.10em', textTransform: 'uppercase', padding: '4px 12px 8px', fontWeight: 600 }}>
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
                <span style={{
                  marginLeft: 'auto',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--accent-orange)',
                  boxShadow: '0 0 6px rgba(249,115,22,0.6)',
                  flexShrink: 0
                }} />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 10px',
          background: 'rgba(249,115,22,0.06)',
          border: '1px solid rgba(249,115,22,0.12)',
          borderRadius: 8,
        }}>
          <div className="glow-dot" style={{ width: 6, height: 6 }} />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            v2.0 · Supernova Hacks
          </span>
        </div>
      </div>
    </aside>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ORKA — AI Decision Engine</title>
        <meta name="description" content="ORKA v2 — Premium AI Project Management Platform" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Sidebar />
        <main className="main-content">
          <div className="page-container">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
