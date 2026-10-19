'use client'

import React, { useState } from 'react'
import { X, Settings, Shield, Server, Bell, Palette, CheckCircle2 } from 'lucide-react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiEndpoint, setApiEndpoint] = useState('remote')
  const [themeMode, setThemeMode] = useState('cream')
  const [burnoutThreshold, setBurnoutThreshold] = useState(80)
  const [enableSound, setEnableSound] = useState(true)
  const [saved, setSaved] = useState(false)

  if (!isOpen) return null

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 800)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(35, 37, 29, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 20
    }}>
      <div className="bright-card animate-fade-in-up" style={{
        width: '100%',
        maxWidth: 500,
        background: 'var(--colors-surface-card)',
        borderRadius: 'var(--rounded-md)',
        border: '1px solid var(--colors-hairline)',
        boxShadow: '0 12px 36px rgba(35, 37, 29, 0.16)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          background: 'var(--colors-surface-soft)',
          borderBottom: '1px solid var(--colors-hairline)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--colors-primary)',
              color: 'var(--colors-ink)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Settings size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--colors-ink)' }}>ORKA Preferences &amp; Settings</h3>
              <p style={{ fontSize: '11px', color: 'var(--colors-mute)' }}>Configure engine telemetry, theme, and API endpoint</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--colors-mute)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Section 1: API Endpoint */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--colors-ink)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Server size={14} color="var(--colors-mute)" /> Backend API Endpoint
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                onClick={() => setApiEndpoint('remote')}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--rounded-md)',
                  border: apiEndpoint === 'remote' ? '2px solid var(--colors-ink)' : '1px solid var(--colors-hairline)',
                  background: apiEndpoint === 'remote' ? 'var(--colors-surface-soft)' : 'var(--colors-surface-card)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--colors-ink)' }}>Live Production API</p>
                <p style={{ fontSize: '11px', color: 'var(--colors-mute)', marginTop: 2 }}>orkapi.onrender.com</p>
              </button>
              <button
                onClick={() => setApiEndpoint('local')}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--rounded-md)',
                  border: apiEndpoint === 'local' ? '2px solid var(--colors-ink)' : '1px solid var(--colors-hairline)',
                  background: apiEndpoint === 'local' ? 'var(--colors-surface-soft)' : 'var(--colors-surface-card)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--colors-ink)' }}>Local Dev Backend</p>
                <p style={{ fontSize: '11px', color: 'var(--colors-mute)', marginTop: 2 }}>localhost:8000</p>
              </button>
            </div>
          </div>

          {/* Section 2: Theme Settings */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--colors-ink)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Palette size={14} color="var(--colors-mute)" /> Canvas &amp; Brand Theme
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                onClick={() => setThemeMode('cream')}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--rounded-md)',
                  border: themeMode === 'cream' ? '2px solid var(--colors-ink)' : '1px solid var(--colors-hairline)',
                  background: '#eeefe9',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#23251d' }}>🏢 Warm Cream (Default)</p>
                <p style={{ fontSize: '11px', color: '#6c6e63', marginTop: 2 }}>#eeefe9 Canvas</p>
              </button>
              <button
                onClick={() => setThemeMode('slate')}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--rounded-md)',
                  border: themeMode === 'slate' ? '2px solid var(--colors-ink)' : '1px solid var(--colors-hairline)',
                  background: '#f8fafc',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Light Slate</p>
                <p style={{ fontSize: '11px', color: '#64748b', marginTop: 2 }}>#f8fafc Canvas</p>
              </button>
            </div>
          </div>

          {/* Section 3: Burnout Radar Sensitivity */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--colors-ink)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Shield size={14} color="var(--colors-mute)" /> Burnout Threshold Alert
              </label>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--colors-ink)' }}>{burnoutThreshold}% Capacity</span>
            </div>
            <input
              type="range"
              min={60}
              max={95}
              value={burnoutThreshold}
              onChange={e => setBurnoutThreshold(+e.target.value)}
              style={{ width: '100%', accentColor: 'var(--colors-primary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: '10px', color: 'var(--colors-mute)' }}>60% Strict</span>
              <span style={{ fontSize: '10px', color: 'var(--colors-mute)' }}>80% Recommended</span>
              <span style={{ fontSize: '10px', color: 'var(--colors-mute)' }}>95% Relaxed</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '14px 20px',
          background: 'var(--colors-surface-soft)',
          borderTop: '1px solid var(--colors-hairline)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {saved ? (
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--colors-accent-green)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} /> Preferences Saved!
            </span>
          ) : (
            <span style={{ fontSize: '12px', color: 'var(--colors-mute)' }}>DevOverlay: Disabled (`devIndicators: false`)</span>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-secondary" onClick={onClose} style={{ height: 36, padding: '6px 14px', fontSize: '13px' }}>
              Cancel
            </button>
            <button className="btn-primary-yellow" onClick={handleSave} style={{ height: 36, padding: '6px 18px', fontSize: '13px' }}>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
