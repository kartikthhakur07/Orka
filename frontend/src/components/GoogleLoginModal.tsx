'use client'

import React, { useState } from 'react'
import { X, CheckCircle, ArrowRight, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface GoogleLoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess?: (user: { email: string; name: string }) => void
}

export function GoogleLoginModal({ isOpen, onClose, onLoginSuccess }: GoogleLoginModalProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [authName, setAuthName] = useState('')

  if (!isOpen) return null

  const handleGoogleSignIn = (userEmail?: string) => {
    setLoading(true)
    const targetEmail = userEmail || email.trim() || 'priya.sharma@gmail.com'
    const nameFromEmail = targetEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase())

    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setAuthName(nameFromEmail)

      const userObj = {
        email: targetEmail,
        name: nameFromEmail,
        avatar: nameFromEmail.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('orka_user', JSON.stringify(userObj))
      }

      if (onLoginSuccess) {
        onLoginSuccess(userObj)
      }

      setTimeout(() => {
        onClose()
        router.push('/dashboard')
      }, 1200)
    }, 1000)
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
          maxWidth: 420,
          background: '#ffffff',
          borderRadius: 20,
          padding: 32,
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
            <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#006241', marginBottom: 8 }}>
              Authenticated with Gmail!
            </h3>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)', marginBottom: 16 }}>
              Welcome back, <strong>{authName}</strong>. Redirecting to your ORKA v2 Dashboard...
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="typing-dot" style={{ background: '#00754A' }} />
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: '#006241',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  boxShadow: '0 4px 12px rgba(0, 98, 65, 0.3)'
                }}
              >
                O
              </div>
              <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: 'var(--text-black)', marginBottom: 4 }}>
                Sign in to ORKA v2
              </h2>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)' }}>
                Access AI Decision Engine telemetry & project workspaces
              </p>
            </div>

            {/* Google / Gmail Sign In Button */}
            <button
              onClick={() => handleGoogleSignIn('priya.sharma@gmail.com')}
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                padding: '12px 20px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid #dadce0',
                background: '#ffffff',
                color: '#3c4043',
                fontSize: 'var(--font-sm)',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                marginBottom: 20
              }}
              onMouseEnter={e => {
                if (!loading) {
                  e.currentTarget.style.background = '#f8f9fa'
                  e.currentTarget.style.borderColor = '#d2e3fc'
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#ffffff'
                e.currentTarget.style.borderColor = '#dadce0'
              }}
            >
              {/* Google Multicolored SVG Logo */}
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              {loading ? 'Authenticating with Google...' : 'Continue with Google (Gmail)'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              <span style={{ fontSize: '11px', color: 'var(--text-black-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>or enter Gmail</span>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            </div>

            {/* Manual Email Entry */}
            <form onSubmit={e => { e.preventDefault(); handleGoogleSignIn() }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-black-soft)" style={{ position: 'absolute', left: 14, top: 12 }} />
                <input
                  type="email"
                  className="orka-input"
                  placeholder="your.name@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: 38, borderRadius: 'var(--radius-pill)', fontSize: 'var(--font-xs)' }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '12px 20px', fontSize: 'var(--font-xs)' }}
              >
                Sign In with Gmail <ArrowRight size={14} />
              </button>
            </form>

            <p style={{ fontSize: '11px', color: 'var(--text-black-soft)', textAlign: 'center', marginTop: 20 }}>
              By signing in, you agree to ORKA's Terms of Service & Privacy Policy.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
