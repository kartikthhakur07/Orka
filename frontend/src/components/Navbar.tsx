'use client'

import Link from 'next/link'
import { Zap, ArrowRight, ExternalLink } from 'lucide-react'

export function Navbar() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(12, 12, 16, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '16px var(--space-4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.40)',
          }}
        >
          <Zap size={20} color="#fff" strokeWidth={2.5} />
        </div>
        <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          ORK<span style={{ color: 'var(--accent-indigo)' }}>A</span>
        </span>
        <span className="badge badge-indigo" style={{ marginLeft: 8 }}>
          v2.0 AI Engine
        </span>
      </div>

      <nav style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 'var(--font-sm)', fontWeight: 500 }}>
        <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          Features
        </a>
        <a href="#algorithm" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          AI Algorithm
        </a>
        <a href="#roi" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          ROI Calculator
        </a>
        <a href="#pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          Pricing
        </a>
        <a
          href="https://orkapi.onrender.com/docs"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
        >
          API Docs <ExternalLink size={12} />
        </a>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <a
          href="https://github.com/kartikthhakur07/Orka"
          target="_blank"
          rel="noreferrer"
          className="btn-secondary"
          style={{ textDecoration: 'none', fontSize: 'var(--font-sm)' }}
        >
          GitHub Repo
        </a>
        <Link href="/dashboard" className="btn-primary" style={{ textDecoration: 'none', fontSize: 'var(--font-sm)' }}>
          Launch App <ArrowRight size={16} />
        </Link>
      </div>
    </header>
  )
}
