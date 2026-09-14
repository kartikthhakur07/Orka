'use client'

import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'

export function Navbar() {
  const navTabs = [
    { label: 'Features', href: '#features', external: false },
    { label: 'AI Engine', href: '#algorithm', external: false },
    { label: 'Pricing', href: '#pricing', external: false },
    { label: 'Delegator', href: '/delegator', isPage: true },
    { label: 'Burnout Radar', href: '/burnout', isPage: true },
    { label: 'API Docs', href: 'https://orkapi.onrender.com/docs', external: true },
  ]

  return (
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

        {/* Actions (50px full-pill buttons) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <a
            href="https://github.com/kartikthhakur07/Orka"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
            style={{ fontSize: 'var(--font-xs)', padding: '8px 20px' }}
          >
            GitHub Repo
          </a>
          <Link href="/dashboard" className="btn-primary" style={{ fontSize: 'var(--font-xs)', padding: '8px 22px' }}>
            Open dashboard <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </header>
  )
}

