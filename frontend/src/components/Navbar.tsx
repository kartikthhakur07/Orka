'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ExternalLink, LogOut, User } from 'lucide-react'
import { RoleLoginModal } from '@/components/RoleLoginModal'

export function Navbar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState<{ email: string; name: string; role?: string; avatar?: string } | null>(null)

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

          {/* Actions: Sign In / User Profile */}
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
                <User size={15} /> Sign In / Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Role-Based Quick Sign In Modal */}
      <RoleLoginModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={userObj => setUser(userObj)}
      />
    </>
  )
}


