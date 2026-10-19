'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ExternalLink, LogOut, User, Zap } from 'lucide-react'
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
      window.dispatchEvent(new Event('orka_auth_change'))
    }
    setUser(null)
  }

  const navTabs: { label: string; href: string; external?: boolean }[] = [
    { label: 'About', href: '#about' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 18,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 36px)',
          maxWidth: 1120,
          zIndex: 100,
          background: 'rgba(20, 21, 16, 0.72)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: 9999,
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06)',
          padding: '8px 14px 8px 10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, width: '100%' }}>
          {/* Brand Logo - Only Hedgehog Icon, No Written Text */}
          <Link
            href="/"
            title="ORKA Home"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'var(--colors-primary)',
              border: '1.5px solid rgba(255, 255, 255, 0.35)',
              boxShadow: '0 2px 10px rgba(247, 165, 1, 0.4)',
              transition: 'transform 180ms ease, box-shadow 180ms ease',
              flexShrink: 0,
              cursor: 'pointer',
              overflow: 'hidden',
              padding: 5
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)'
              e.currentTarget.style.boxShadow = '0 0 16px rgba(247, 165, 1, 0.65)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(247, 165, 1, 0.4)'
            }}
          >
            <img src="/orka-logo.png" alt="ORKA Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </Link>

          {/* Navigation Links */}
          <nav className="landing-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {navTabs.map((tab, idx) => {
              if (tab.external) {
                return (
                  <a
                    key={idx}
                    href={tab.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '13.5px',
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.82)',
                      padding: '6px 12px',
                      borderRadius: 9999,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      transition: 'all 140ms ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#f7a501'
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.82)'
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    {tab.label} <ExternalLink size={12} color="rgba(255, 255, 255, 0.45)" />
                  </a>
                )
              }
              return (
                <Link
                  key={idx}
                  href={tab.href}
                  style={{
                    fontSize: '13.5px',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.82)',
                    padding: '6px 12px',
                    borderRadius: 9999,
                    transition: 'all 140ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#f7a501'
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.82)'
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  {tab.label}
                </Link>
              )
            })}
          </nav>

          {/* Action CTAs & Yellow Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 14px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 9999,
                }}>
                  <User size={13} color="#f7a501" />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>{user.name}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(255, 255, 255, 0.65)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '12.5px',
                    fontWeight: 600,
                    transition: 'color 120ms ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#f7a501')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)')}
                >
                  <LogOut size={13} /> Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                style={{
                  height: 36,
                  padding: '0 20px',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  borderRadius: 9999,
                  background: 'var(--colors-primary)',
                  color: 'var(--colors-on-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  boxShadow: '0 2px 12px rgba(247, 165, 1, 0.4)',
                  transition: 'transform 140ms ease, box-shadow 140ms ease',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 18px rgba(247, 165, 1, 0.6)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(247, 165, 1, 0.4)'
                }}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Role Login Modal */}
      <RoleLoginModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onRoleSelect={(name, role) => {
          const userObj = { name, role, email: `${name.toLowerCase().replace(/\s+/g, '.')}@orka.dev` }
          setUser(userObj)
          if (typeof window !== 'undefined') {
            localStorage.setItem('orka_user', JSON.stringify(userObj))
            window.dispatchEvent(new Event('orka_auth_change'))
          }
        }}
      />
    </>
  )
}
