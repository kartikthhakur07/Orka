'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/Badge'
import { ArrowRight, RefreshCw, CheckCircle } from 'lucide-react'

export function AlgorithmSection() {
  const [skillMatch, setSkillMatch] = useState(94)
  const [workload, setWorkload] = useState(72)
  const [availability, setAvailability] = useState(89)
  const [performance, setPerformance] = useState(95)

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
    <section id="algorithm" style={{ padding: 'var(--space-6) var(--space-4)', background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Badge variant="green" style={{ marginBottom: 12 }}>Decision Pipeline</Badge>
          <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: '#0f172a' }}>
            5-Factor Predictive Delegation Pipeline
          </h2>
          <p style={{ color: '#64748b', marginTop: 8, fontSize: 'var(--font-base)', maxWidth: 640, margin: '8px auto 0' }}>
            Every task assignment is calculated mathematically using real-time cognitive telemetry and workload capacity signals.
          </p>
        </div>

        {/* Visual Pipeline Diagram (Input Signals -> ... -> Recommended Assignee) */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 20,
          padding: '24px 20px', marginBottom: 40, overflowX: 'auto', gap: 12
        }}>
          {steps.map((step, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <div style={{
                padding: '10px 16px', borderRadius: 12,
                background: idx === steps.length - 1 ? '#16a34a' : '#ffffff',
                color: idx === steps.length - 1 ? '#ffffff' : '#0f172a',
                border: `1px solid ${idx === steps.length - 1 ? '#16a34a' : '#cbd5e1'}`,
                fontSize: 'var(--font-xs)', fontWeight: 800,
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}>
                {step}
              </div>
              {idx < steps.length - 1 && (
                <ArrowRight size={16} color="#94a3b8" />
              )}
            </div>
          ))}
        </div>

        {/* Example Real Data Card Box */}
        <div className="glass-card p-8 golden-grid" style={{ alignItems: 'center', borderRadius: 24 }}>
          {/* Metrics Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#0f172a' }}>
              Live Model Telemetry Weights
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              <div style={{ padding: 14, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Skill Match</span>
                <p style={{ fontSize: 'var(--font-lg)', fontWeight: 900, color: '#16a34a' }}>94%</p>
              </div>
              <div style={{ padding: 14, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Workload Analysis</span>
                <p style={{ fontSize: 'var(--font-lg)', fontWeight: 900, color: '#2563eb' }}>72%</p>
              </div>
              <div style={{ padding: 14, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Availability</span>
                <p style={{ fontSize: 'var(--font-lg)', fontWeight: 900, color: '#7c3aed' }}>89%</p>
              </div>
              <div style={{ padding: 14, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Burnout Risk</span>
                <p style={{ fontSize: 'var(--font-lg)', fontWeight: 900, color: '#16a34a' }}>Low</p>
              </div>
            </div>
          </div>

          {/* AI Confidence Box */}
          <div style={{
            background: '#0f172a', color: '#ffffff', padding: 28,
            borderRadius: 20, textAlign: 'center', boxShadow: '0 12px 30px rgba(15,23,42,0.2)'
          }}>
            <span className="badge badge-green" style={{ marginBottom: 12 }}>AI Confidence 96%</span>
            <p style={{ fontSize: 'var(--font-xs)', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              Recommended Assignee
            </p>
            <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: '#4ade80', margin: '6px 0' }}>
              Priya Sharma
            </div>
            <p style={{ fontSize: 'var(--font-xs)', color: '#94a3b8', marginBottom: 18 }}>
              Optimal fit for Task #ORK-2847 (3 story points)
            </p>
            <Link href="/delegator" className="btn-primary" style={{ width: '100%', textDecoration: 'none', background: '#16a34a', padding: '12px' }}>
              Test Live Delegator Engine
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
