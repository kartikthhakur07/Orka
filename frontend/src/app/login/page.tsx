'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth, DEMO_PERSONAS, UserPersona } from '@/context/AuthContext'
import {
  LogIn,
  ArrowRight,
  ShieldCheck,
  User,
  Sparkles,
  Lock,
  ChevronRight,
  CheckCircle2,
  X,
  Minus,
  Maximize2
} from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoggedIn, isInitialized } = useAuth()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'Admin' | 'Manager' | 'Lead' | 'Developer'>('Lead')
  const [loading, setLoading] = useState(false)

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isInitialized && isLoggedIn) {
      router.replace('/dashboard')
    }
  }, [isInitialized, isLoggedIn, router])

  // ESC key to dismiss floating window to landing page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        router.push('/')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])

  const handlePersonaSelect = (persona: UserPersona) => {
    login(persona)
    router.push('/dashboard')
  }

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const userObj: UserPersona = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@orka.ai`,
      role: role,
      avatarColor: role === 'Manager' ? '#1d4ed8' : '#059669'
    }

    login(userObj)
    router.push('/dashboard')
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      {/* ── Ambient Under-Surface (Simulated blurred workspace behind modal) ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: '#eeefe9',
        zIndex: 0,
        display: 'flex',
        flexDirection: 'column',
        filter: 'blur(10px)',
        transform: 'scale(1.04)',
        opacity: 0.85,
        pointerEvents: 'none'
      }}>
        {/* Ambient Topbar silhouette */}
        <div style={{ height: 60, background: '#ffffff', borderBottom: '1.5px solid #cbd5e1', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f7a501' }} />
            <div style={{ width: 80, height: 16, background: '#23251d', borderRadius: 4 }} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 140, height: 32, background: '#eeefe9', borderRadius: 8 }} />
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#4f46e5' }} />
          </div>
        </div>

        {/* Ambient Grid silhouette */}
        <div style={{ padding: 36, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          <div style={{ height: 120, background: '#ffffff', borderRadius: 12, border: '1px solid #cbd5e1' }} />
          <div style={{ height: 120, background: '#ffffff', borderRadius: 12, border: '1px solid #cbd5e1' }} />
          <div style={{ height: 120, background: '#ffffff', borderRadius: 12, border: '1px solid #cbd5e1' }} />
          <div style={{ height: 120, background: '#ffffff', borderRadius: 12, border: '1px solid #cbd5e1' }} />
          <div style={{ gridColumn: 'span 3', height: 360, background: '#ffffff', borderRadius: 14, border: '1px solid #cbd5e1' }} />
          <div style={{ height: 360, background: '#ffffff', borderRadius: 14, border: '1px solid #cbd5e1' }} />
        </div>
      </div>

      {/* ── Frosted Backdrop with Heavy Gaussian Blur ── */}
      <div
        onClick={() => router.push('/')}
        title="Click to dismiss and return to landing page"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(35, 37, 29, 0.45)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          zIndex: 1,
          cursor: 'pointer'
        }}
      />

      {/* ── Sleek Floating Window Modal ── */}
      <div
        className="animate-fade-in-up"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 550,
          width: '92%',
          maxHeight: '92vh',
          background: '#ffffff',
          borderRadius: 16,
          border: '2px solid #23251d',
          boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.35), 8px 8px 0px #23251d',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Floating Window Titlebar */}
        <div style={{
          height: 44,
          background: '#eeefe9',
          borderBottom: '1.5px solid #23251d',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          userSelect: 'none'
        }}>
          {/* OS-Style Window Dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Link
              href="/"
              title="Close window (Return to Landing Page)"
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#ef4444',
                border: '1px solid #b91c1c',
                display: 'inline-block',
                cursor: 'pointer'
              }}
            />
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#f59e0b',
                border: '1px solid #d97706',
                display: 'inline-block'
              }}
            />
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#10b981',
                border: '1px solid #059669',
                display: 'inline-block'
              }}
            />
          </div>

          {/* Window Center Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '12px', fontWeight: 800, color: '#23251d' }}>
            <img src="/orka-badge.png" alt="ORKA Logo" style={{ width: 18, height: 18, borderRadius: '50%' }} />
            <span>ORKA Session Gateway · v2.0</span>
          </div>

          {/* Window Close Cross */}
          <Link
            href="/"
            title="Close and return to landing page"
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#23251d',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 120ms ease'
            }}
          >
            <X size={14} />
          </Link>
        </div>

        {/* Scrollable Window Body */}
        <div style={{ padding: '28px 32px 32px', overflowY: 'auto' }}>
          {/* Title Header */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <span className="badge-bright badge-yellow" style={{ marginBottom: 10, fontSize: '11px', fontWeight: 800 }}>
              ⚡ Enterprise Telemetry Portal
            </span>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#23251d', margin: '8px 0 6px', letterSpacing: '-0.02em' }}>
              Sign in to ORKA Decision Engine
            </h1>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Access AI Task Delegator, Sprint Capacity Boards, and Burnout Telemetry
            </p>
          </div>

          {/* 1-Click Quick Demo Persona Grid */}
          <div style={{ marginBottom: 22 }}>
            <p style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              1-Click Instant Persona Sign In
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {DEMO_PERSONAS.map(persona => (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => handlePersonaSelect(persona)}
                  style={{
                    padding: '11px 13px',
                    borderRadius: 10,
                    border: '1.5px solid #cbd5e1',
                    background: '#eeefe9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 120ms ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#23251d'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#cbd5e1'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: persona.avatarColor,
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {persona.name.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{ fontSize: '13px', fontWeight: 800, color: '#23251d', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {persona.name}
                    </p>
                    <p style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, margin: 0 }}>
                      {persona.role}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              OR CUSTOM WORKSPACE LOGIN
            </span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleCustomLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: 4 }}>
                Full Name *
              </label>
              <input
                required
                placeholder="e.g. Alex Rivera"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  fontSize: '13px',
                  borderRadius: 8,
                  border: '1.5px solid #cbd5e1',
                  outline: 'none',
                  color: '#23251d',
                  background: '#ffffff'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Work Email
                </label>
                <input
                  type="email"
                  placeholder="alex@orka.dev"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    fontSize: '13px',
                    borderRadius: 8,
                    border: '1.5px solid #cbd5e1',
                    outline: 'none',
                    color: '#23251d',
                    background: '#ffffff'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Role Level
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    fontSize: '13px',
                    borderRadius: 8,
                    border: '1.5px solid #cbd5e1',
                    outline: 'none',
                    color: '#23251d',
                    background: '#ffffff',
                    fontWeight: 600
                  }}
                >
                  <option value="Admin">Admin / Executive</option>
                  <option value="Manager">Engineering Manager</option>
                  <option value="Lead">Tech Lead / Architect</option>
                  <option value="Developer">Senior Developer</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                marginTop: 8,
                padding: '11px',
                justifyContent: 'center',
                background: '#f7a501',
                color: '#23251d',
                border: '1.5px solid #23251d',
                fontWeight: 800,
                fontSize: '13px',
                borderRadius: 8,
                boxShadow: '3px 3px 0px #23251d',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <LogIn size={15} /> Enter ORKA Workspace
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
