'use client'

import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'

export function Navbar() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#ffffff',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '12px 0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        {/* Brand Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
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

        {/* Navigation Links */}
        <nav className="hidden md:flex" style={{ alignItems: 'center', gap: 32, fontSize: 'var(--font-sm)', fontWeight: 600 }}>
          <a href="#features" style={{ color: 'rgba(0,0,0,0.87)', textDecoration: 'none', transition: 'color 0.2s ease' }}>
            Features
          </a>
          <a href="#algorithm" style={{ color: 'rgba(0,0,0,0.87)', textDecoration: 'none', transition: 'color 0.2s ease' }}>
            Algorithm
          </a>
          <a href="#pricing" style={{ color: 'rgba(0,0,0,0.87)', textDecoration: 'none', transition: 'color 0.2s ease' }}>
            Pricing
          </a>
          <a
            href="https://orkapi.onrender.com/docs"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'rgba(0,0,0,0.87)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            API Docs <ExternalLink size={12} />
          </a>
        </nav>

        {/* Actions (50px full-pill buttons) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <a
            href="https://github.com/kartikthhakur07/Orka"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary hidden sm:inline-flex"
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
