'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/Badge'
import { ArrowRight } from 'lucide-react'

export function AlgorithmSection() {
  const [assigneeName, setAssigneeName] = useState('Priya Sharma')

  useEffect(() => {
    const updateAssignee = () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('orka_user')
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            if (parsed?.name) {
              setAssigneeName(parsed.name)
              return
            }
          } catch {}
        }
        setAssigneeName('Priya Sharma')
      }
    }

    updateAssignee()
    window.addEventListener('orka_auth_change', updateAssignee)
    window.addEventListener('storage', updateAssignee)
    return () => {
      window.removeEventListener('orka_auth_change', updateAssignee)
      window.removeEventListener('storage', updateAssignee)
    }
  }, [])

  const steps = [
    'Input Signals',
    'Skill Match',
    'Workload Analysis',
    'Availability',
    'Burnout Risk',
    'AI Confidence Score',
    'Recommended Assignee'
  ]

  return (
    <section id="algorithm" style={{ padding: 'var(--space-6) var(--space-5)', background: '#ffffff', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Badge variant="green" style={{ marginBottom: 12 }}>Decision Pipeline</Badge>
          <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, color: '#006241' }}>
            5-Factor Predictive Delegation Pipeline
          </h2>
          <p style={{ color: 'var(--text-black-soft)', marginTop: 8, fontSize: 'var(--font-base)', maxWidth: 640, margin: '8px auto 0' }}>
            Every task assignment is calculated mathematically using real-time cognitive telemetry and workload capacity signals.
          </p>
        </div>

        {/* Visual Pipeline Diagram (Input Signals -> ... -> Recommended Assignee) */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--bg-canvas)', border: '1px solid var(--border-card)', borderRadius: 16,
          padding: '24px 20px', marginBottom: 40, overflowX: 'auto', gap: 12
        }}>
          {steps.map((step, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <div style={{
                padding: '10px 18px', borderRadius: 'var(--radius-pill)',
                background: idx === steps.length - 1 ? '#00754A' : '#ffffff',
                color: idx === steps.length - 1 ? '#ffffff' : 'var(--text-black)',
                border: `1px solid ${idx === steps.length - 1 ? '#00754A' : 'var(--border-card)'}`,
                fontSize: 'var(--font-xs)', fontWeight: 700,
                boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
              }}>
                {step}
              </div>
              {idx < steps.length - 1 && (
                <ArrowRight size={16} color="var(--text-black-soft)" />
              )}
            </div>
          ))}
        </div>

        {/* Example Real Data Card Box (Clean Fit without side overflow) */}
        <div className="glass-card" style={{ padding: 28, borderRadius: 16, width: '100%', boxSizing: 'border-box' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 28,
            alignItems: 'center',
            width: '100%'
          }}>
            {/* Metrics Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: '#006241' }}>
                Live Model Telemetry Weights
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
                <div style={{ padding: 14, background: 'var(--bg-canvas)', borderRadius: 12, border: '1px solid var(--border-card)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-black-soft)', fontWeight: 600 }}>Skill Match</span>
                  <p style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: '#00754A' }}>94%</p>
                </div>
                <div style={{ padding: 14, background: 'var(--bg-canvas)', borderRadius: 12, border: '1px solid var(--border-card)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-black-soft)', fontWeight: 600 }}>Workload Analysis</span>
                  <p style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: '#1d4ed8' }}>72%</p>
                </div>
                <div style={{ padding: 14, background: 'var(--bg-canvas)', borderRadius: 12, border: '1px solid var(--border-card)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-black-soft)', fontWeight: 600 }}>Availability</span>
                  <p style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: '#6d28d9' }}>89%</p>
                </div>
                <div style={{ padding: 14, background: 'var(--bg-canvas)', borderRadius: 12, border: '1px solid var(--border-card)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-black-soft)', fontWeight: 600 }}>Burnout Risk</span>
                  <p style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: '#00754A' }}>Low</p>
                </div>
              </div>
            </div>

            {/* AI Confidence Box */}
            <div style={{
              background: 'var(--house-green)', color: '#ffffff', padding: '24px 28px',
              borderRadius: 16, textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              width: '100%', boxSizing: 'border-box'
            }}>
              <span className="badge badge-green" style={{ marginBottom: 12 }}>AI Confidence 96%</span>
              <p style={{ fontSize: 'var(--font-xs)', color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase' }}>
                RECOMMENDED ASSIGNEE
              </p>
              <div style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: '#d4e9e2', margin: '6px 0', lineHeight: 1.1, wordBreak: 'break-word' }}>
                {assigneeName}
              </div>
              <p style={{ fontSize: 'var(--font-xs)', color: 'rgba(255,255,255,0.7)', marginBottom: 18 }}>
                Optimal fit for Task #ORK-2847 (3 story points)
              </p>
              <Link href="/delegator" className="btn-primary" style={{ width: '100%', textDecoration: 'none', background: '#00754A', padding: '12px', justifyContent: 'center' }}>
                Test Live Delegator Engine
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
