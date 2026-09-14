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
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px var(--space-4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Logo */}
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
            boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)',
          }}
        >
          O
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>
          ORKA <span style={{ color: '#16a34a' }}>v2</span>
        </span>
      </Link>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 'var(--font-sm)', fontWeight: 600 }}>
        <a href="#features" style={{ color: '#475569', textDecoration: 'none', transition: 'color 150ms' }}>
          Features
        </a>
        <a href="#algorithm" style={{ color: '#475569', textDecoration: 'none', transition: 'color 150ms' }}>
          Algorithm
        </a>
        <a href="#pricing" style={{ color: '#475569', textDecoration: 'none', transition: 'color 150ms' }}>
          Pricing
        </a>
        <a
          href="https://orkapi.onrender.com/docs"
          target="_blank"
          rel="noreferrer"
          style={{ color: '#475569', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
        >
          API Docs <ExternalLink size={12} />
        </a>
      </nav>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <a
          href="https://github.com/kartikthhakur07/Orka"
          target="_blank"
          rel="noreferrer"
          className="btn-secondary"
          style={{ textDecoration: 'none', fontSize: 'var(--font-xs)', padding: '8px 16px' }}
        >
          GitHub Repo
        </a>
        <Link href="/dashboard" className="btn-primary" style={{ textDecoration: 'none', fontSize: 'var(--font-xs)', padding: '8px 18px' }}>
          Open dashboard <ArrowRight size={14} />
        </Link>
      </div>
    </header>
  )
}
