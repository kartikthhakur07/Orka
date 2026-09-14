'use client'

import React, { useState } from 'react'
import { X, CheckCircle, ArrowRight, Mail, Lock, UserCheck, ShieldCheck, Briefcase, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface RoleLoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess?: (user: { email: string; name: string; role: string; roleTitle: string; avatar: string }) => void
}

export const PRESET_ROLES = [
  {
    id: 'employee',
    title: 'Employee / Engineer',
    name: 'Priya Sharma',
    email: 'priya.sharma@orka.ai',
    password: '••••••••••••',
    roleTitle: 'Senior Lead Engineer',
    badge: 'Engineer',
    badgeVariant: 'green' as const,
    avatar: 'PS',
    bg: '#d4e9e2',
    color: '#006241',
  },
  {
    id: 'manager',
    title: 'Manager / HR Lead',
    name: 'Marcus Chen',
    email: 'marcus.chen@orka.ai',
    password: '••••••••••••',
    roleTitle: 'Engineering Manager & HR',
    badge: 'Manager / HR',
    badgeVariant: 'blue' as const,
    avatar: 'MC',
    bg: '#eff6ff',
    color: '#1d4ed8',
  },
]

export function RoleLoginModal({ isOpen, onClose, onLoginSuccess }: RoleLoginModalProps) {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<'employee' | 'manager'>('employee')
  const [email, setEmail] = useState('priya.sharma@orka.ai')
  const [password, setPassword] = useState('orka2026pass')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState<any>(null)

  if (!isOpen) return null

  const handleRoleSelect = (roleId: 'employee' | 'manager') => {
    setSelectedRole(roleId)
    const preset = PRESET_ROLES.find(r => r.id === roleId)
    if (preset) {
      setEmail(preset.email)
    }
  }

  const handleLoginSubmit = (roleToAuth?: 'employee' | 'manager') => {
    const roleId = roleToAuth || selectedRole
    const preset = PRESET_ROLES.find(r => r.id === roleId) || PRESET_ROLES[0]

    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setSuccess(true)

      const userObj = {
        email: email || preset.email,
        name: preset.id === selectedRole ? preset.name : email.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase()),
        role: preset.id,
        roleTitle: preset.roleTitle,
        avatar: preset.avatar
      }

      setLoggedInUser(userObj)

      if (typeof window !== 'undefined') {
        localStorage.setItem('orka_user', JSON.stringify(userObj))
        window.dispatchEvent(new Event('orka_auth_change'))
      }

      if (onLoginSuccess) {
        onLoginSuccess(userObj)
      }

      setTimeout(() => {
        onClose()
        router.push('/dashboard')
      }, 1100)
    }, 800)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(6px)',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        className="glass-card animate-fade-in-up"
        style={{
          width: '100%',
          maxWidth: 460,
          background: '#ffffff',
          borderRadius: 20,
          padding: '28px 32px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-black-soft)',
            padding: 4,
            borderRadius: '50%'
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'var(--green-light)',
                color: '#006241',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <CheckCircle size={36} />
            </div>
            <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#006241', marginBottom: 6 }}>
              Welcome back, {loggedInUser?.name}!
            </h3>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)', marginBottom: 16 }}>
              Authenticated as <strong>{loggedInUser?.roleTitle}</strong> ({loggedInUser?.role?.toUpperCase()}). Opening dashboard...
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="typing-dot" style={{ background: '#00754A' }} />
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 22 }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: '50%',
                  background: '#006241',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px',
                  boxShadow: '0 4px 12px rgba(0, 98, 65, 0.3)'
                }}
              >
                O
              </div>
              <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: 'var(--text-black)', marginBottom: 4 }}>
                Sign in to ORKA v2
              </h2>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)' }}>
                Select a pre-filled role to sign in instantly
              </p>
            </div>

            {/* Role Quick Cards (1-Click Login Buttons) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {PRESET_ROLES.map(r => {
                const isSelected = selectedRole === r.id
                return (
                  <div
                    key={r.id}
                    onClick={() => handleRoleSelect(r.id as any)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 14,
                      border: `1.5px solid ${isSelected ? '#00754A' : '#e2e8f0'}`,
                      background: isSelected ? 'var(--green-light-dim)' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 2px 8px rgba(0,117,74,0.12)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: r.bg,
                          color: r.color,
                          fontWeight: 800,
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {r.avatar}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <p style={{ fontSize: 'var(--font-xs)', fontWeight: 800, color: 'var(--text-black)' }}>
                            {r.name}
                          </p>
                          <span
                            className={`badge badge-${r.badgeVariant}`}
                            style={{ fontSize: '10px', padding: '2px 8px' }}
                          >
                            {r.badge}
                          </span>
                        </div>
                        <p style={{ fontSize: '11px', color: 'var(--text-black-soft)', marginTop: 2 }}>
                          {r.email} · {r.roleTitle}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRoleSelect(r.id as any)
                        handleLoginSubmit(r.id as any)
                      }}
                      className="btn-primary"
                      disabled={loading}
                      style={{
                        padding: '6px 14px',
                        fontSize: '11px',
                        borderRadius: 'var(--radius-pill)',
                        flexShrink: 0
                      }}
                    >
                      Log In <ChevronRight size={12} />
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              <span style={{ fontSize: '10px', color: 'var(--text-black-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>or sign in with pre-filled ID</span>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            </div>

            {/* Pre-filled Login Form */}
            <form onSubmit={e => { e.preventDefault(); handleLoginSubmit() }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ position: 'relative' }}>
                <Mail size={15} color="var(--text-black-soft)" style={{ position: 'absolute', left: 14, top: 12 }} />
                <input
                  type="email"
                  className="orka-input"
                  placeholder="your.email@orka.ai"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: 38, borderRadius: 'var(--radius-pill)', fontSize: 'var(--font-xs)' }}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <Lock size={15} color="var(--text-black-soft)" style={{ position: 'absolute', left: 14, top: 12 }} />
                <input
                  type="password"
                  className="orka-input"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingLeft: 38, borderRadius: 'var(--radius-pill)', fontSize: 'var(--font-xs)' }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '11px 20px', fontSize: 'var(--font-xs)', marginTop: 4 }}
              >
                {loading ? 'Authenticating...' : `Sign In as ${selectedRole === 'employee' ? 'Employee (Engineer)' : 'Manager / HR'}`} <ArrowRight size={14} />
              </button>
            </form>

            <p style={{ fontSize: '10px', color: 'var(--text-black-soft)', textAlign: 'center', marginTop: 16 }}>
              Pre-filled role-based authentication · Instant access enabled
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
