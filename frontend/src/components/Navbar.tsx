'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ExternalLink, LogOut, User } from 'lucide-react'
import { GoogleLoginModal } from '@/components/GoogleLoginModal'

export function Navbar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState<{ email: string; name: string; avatar?: string } | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('orka_user')
      if (stored) {
        try {
          setUser(JSON.parse(stored))
        } catch {
          setUser(null)
        }
      }
    }
  }, [])

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('orka_user')
    }
    setUser(null)
  }

  const navTabs = [
    { label: 'Features', href: '#features', external: false },
    { label: 'AI Engine', href: '#algorithm', external: false },
    { label: 'Pricing', href: '#pricing', external: false },
    { label: 'Delegator', href: '/delegator', isPage: true },
    { label: 'Burnout Radar', href: '/burnout', isPage: true },
    { label: 'API Docs', href: 'https://orkapi.onrender.com/docs', external: true },
  ]

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: '#ffffff',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '12px 0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          {/* Brand Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#006241',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0, 98, 65, 0.3)',
              }}
            >
              O
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.01em', color: '#006241' }}>
              ORKA <span style={{ color: '#00754A' }}>v2</span>
            </span>
          </Link>

          {/* Navigation Tabs Bar */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {navTabs.map((tab, idx) => {
              const styleProps = {
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                color: 'var(--text-black)',
                textDecoration: 'none',
                fontSize: 'var(--font-xs)',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: 'transparent',
              }

              if (tab.isPage) {
                return (
                  <Link
                    key={idx}
                    href={tab.href}
                    style={styleProps}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'var(--green-light)'
                      e.currentTarget.style.color = '#006241'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'var(--text-black)'
                    }}
                  >
                    {tab.label}
                  </Link>
                )
              }

              return (
                <a
                  key={idx}
                  href={tab.href}
                  target={tab.external ? '_blank' : undefined}
                  rel={tab.external ? 'noreferrer' : undefined}
                  style={styleProps}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--green-light)'
                    e.currentTarget.style.color = '#006241'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--text-black)'
                  }}
                >
                  {tab.label}
                  {tab.external && <ExternalLink size={12} style={{ color: '#00754A' }} />}
                </a>
              )
            })}
          </nav>

          {/* Actions: Gmail Sign In / User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Logged in user pill */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '4px 12px 4px 6px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--green-light)',
                  border: '1px solid rgba(0, 98, 65, 0.2)'
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: '#006241', color: '#ffffff',
                    fontSize: '11px', fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {user.avatar || 'PS'}
                  </div>
                  <span style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: '#006241' }}>
                    {user.name}
                  </span>
                </div>

                <Link href="/dashboard" className="btn-primary" style={{ fontSize: 'var(--font-xs)', padding: '8px 20px' }}>
                  Dashboard <ArrowRight size={14} />
                </Link>

                <button
                  onClick={handleSignOut}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-black-soft)',
                    padding: 6,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="btn-primary"
                style={{
                  fontSize: 'var(--font-xs)',
                  padding: '8px 22px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                {/* Google Multicolored SVG Icon inside button */}
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Sign in / Login with Gmail
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Gmail OAuth Sign In Modal */}
      <GoogleLoginModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={userObj => setUser(userObj)}
      />
    </>
  )
}


