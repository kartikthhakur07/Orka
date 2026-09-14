'use client'

import { X, Check, RefreshCw, Brain } from 'lucide-react'

interface AIDelegateModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: (assignee: string) => void
}

export function AIDelegateModal({ isOpen, onClose, onAccept }: AIDelegateModalProps) {
  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 24,
        width: '100%',
        maxWidth: 520,
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        animation: 'fadeInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#f0fdf4', color: '#16a34a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid #bbf7d0'
            }}>
              <Brain size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 800, color: '#0f172a' }}>
                AI Task Delegation
              </h3>
              <p style={{ fontSize: 'var(--font-xs)', color: '#64748b' }}>
                5-Factor Predictive Match Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4 }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: 24 }}>
          {/* Target Task */}
          <div style={{
            padding: 14, borderRadius: 12,
            background: '#f8fafc', border: '1px solid #e2e8f0',
            marginBottom: 20
          }}>
            <p style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Target Task
            </p>
            <p style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: '#0f172a', marginTop: 4 }}>
              Implement authentication flow
            </p>
          </div>

          {/* AI Recommendation Box */}
          <div style={{
            padding: 18, borderRadius: 16,
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
            border: '2px solid #16a34a',
            marginBottom: 20
          }}>
            <p style={{ fontSize: '11px', color: '#16a34a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              AI Recommendation
            </p>
            <p style={{ fontSize: 'var(--font-lg)', fontWeight: 900, color: '#0f172a', marginTop: 2 }}>
              Assign to Priya Sharma
            </p>
            <p style={{ fontSize: 'var(--font-xs)', color: '#15803d', fontWeight: 600, marginTop: 2 }}>
              Senior Lead Engineer · 94% Overall Confidence
            </p>
          </div>

          {/* Reasoning Grid */}
          <p style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>
            Match Factor Reasoning:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24 }}>
            <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Skill Match</span>
              <p style={{ fontSize: 'var(--font-sm)', fontWeight: 800, color: '#16a34a' }}>96%</p>
            </div>
            <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Current Workload</span>
              <p style={{ fontSize: 'var(--font-sm)', fontWeight: 800, color: '#2563eb' }}>68%</p>
            </div>
            <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Availability</span>
              <p style={{ fontSize: 'var(--font-sm)', fontWeight: 800, color: '#7c3aed' }}>91%</p>
            </div>
            <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Burnout Risk</span>
              <p style={{ fontSize: 'var(--font-sm)', fontWeight: 800, color: '#16a34a' }}>Low</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              className="btn-primary"
              onClick={() => {
                onAccept('Priya Sharma')
                onClose()
              }}
              style={{ flex: 1, padding: '12px', fontSize: 'var(--font-xs)', borderRadius: 12 }}
            >
              <Check size={16} /> Accept Assignment
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                onAccept('Marcus Chen')
                onClose()
              }}
              style={{ padding: '12px 16px', fontSize: 'var(--font-xs)', borderRadius: 12 }}
            >
              <RefreshCw size={14} /> Reassign
            </button>
            <button
              className="btn-secondary"
              onClick={onClose}
              style={{ padding: '12px 16px', fontSize: 'var(--font-xs)', borderRadius: 12, color: '#64748b' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
