'use client'

import React, { useState } from 'react'
import { useAuth, DEMO_PERSONAS, UserPersona } from '@/context/AuthContext'
import { X, LogIn, UserCheck, Shield, Sparkles, ArrowRight } from 'lucide-react'

export function LoginModal() {
  const { isAuthModalOpen, closeAuthModal, login } = useAuth()
  const [customName, setCustomName] = useState('')
  const [customEmail, setCustomEmail] = useState('')
  const [customRole, setCustomRole] = useState<'Admin' | 'Manager' | 'Lead' | 'Developer'>('Lead')

  if (!isAuthModalOpen) return null

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customName.trim()) return
    const newUser: UserPersona = {
      id: `usr-${Date.now()}`,
      name: customName.trim(),
      email: customEmail.trim() || `${customName.toLowerCase().replace(/\s+/g, '.')}@orka.ai`,
      role: customRole,
      avatarColor: '#4f46e5'
    }
    login(newUser)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(35, 37, 29, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 16
    }}>
      <div className="bright-card animate-fade-in-up" style={{
        width: '100%',
        maxWidth: 520,
        background: '#ffffff',
        border: '2px solid #23251d',
        borderRadius: 16,
        padding: 28,
        boxShadow: '6px 6px 0px #23251d',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: '#eeefe9',
            border: '1px solid #cbd5e1',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#23251d'
          }}
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            background: '#f7a501',
            border: '2px solid #23251d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: '2px 2px 0px #23251d',
            overflow: 'hidden',
            padding: 7
          }}>
            <img src="/orka-logo.png" alt="ORKA Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#23251d', margin: 0 }}>
            Log in to ORKA Workspace
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: 6, margin: '6px 0 0' }}>
            Select a demo persona or enter credentials to access internal AI Decision Engine tools
          </p>
        </div>

        {/* Quick Demo Personas */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            ⚡ 1-Click Demo Persona Sign In
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {DEMO_PERSONAS.map(persona => (
              <button
                key={persona.id}
                onClick={() => login(persona)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '1.5px solid #cbd5e1',
                  background: '#eeefe9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 150ms ease'
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: persona.avatarColor,
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '12px',
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
                  <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                    {persona.role}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>OR CUSTOM SIGN IN</span>
          <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
        </div>

        {/* Custom Credentials Form */}
        <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
              Full Name
            </label>
            <input
              placeholder="e.g. Rahul Verma"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '14px',
                borderRadius: 8,
                border: '1.5px solid #e2e8f0',
                background: '#ffffff',
                outline: 'none',
                color: '#23251d'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                Work Email
              </label>
              <input
                type="email"
                placeholder="rahul@company.com"
                value={customEmail}
                onChange={e => setCustomEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '14px',
                  borderRadius: 8,
                  border: '1.5px solid #e2e8f0',
                  background: '#ffffff',
                  outline: 'none',
                  color: '#23251d'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                Organizational Role
              </label>
              <select
                value={customRole}
                onChange={e => setCustomRole(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '14px',
                  borderRadius: 8,
                  border: '1.5px solid #e2e8f0',
                  background: '#ffffff',
                  outline: 'none',
                  color: '#23251d'
                }}
              >
                <option value="Admin">Admin / Director</option>
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
              marginTop: 6,
              padding: '12px',
              justifyContent: 'center',
              background: '#f7a501',
              color: '#23251d',
              border: '1.5px solid #23251d',
              fontWeight: 800,
              boxShadow: '2px 2px 0px #23251d'
            }}
          >
            <LogIn size={16} /> Enter Workspace
          </button>
        </form>
      </div>
    </div>
  )
}
