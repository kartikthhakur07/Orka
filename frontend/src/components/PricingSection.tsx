'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/Badge'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true)

  return (
    <section id="pricing" style={{ padding: 'var(--space-6) var(--space-4)', background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <Badge variant="blue" style={{ marginBottom: 12 }}>Pricing</Badge>
          <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: '#0f172a' }}>
            Plans Built to Scale with Your Engineering
          </h2>
          <p style={{ color: '#64748b', marginTop: 8, fontSize: 'var(--font-base)', maxWidth: 640, margin: '8px auto 0' }}>
            Transparent pricing for dev teams of all sizes. Upgrade or cancel anytime.
          </p>

          {/* Toggle Switch */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: 24, background: '#f1f5f9', padding: '6px 10px', borderRadius: 99, border: '1px solid #e2e8f0' }}>
            <button
              onClick={() => setIsAnnual(false)}
              style={{
                padding: '8px 20px', borderRadius: 99, border: 'none',
                background: !isAnnual ? '#16a34a' : 'transparent',
                color: !isAnnual ? '#fff' : '#64748b',
                fontSize: 'var(--font-xs)', fontWeight: 700, cursor: 'pointer', transition: 'all 200ms'
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              style={{
                padding: '8px 20px', borderRadius: 99, border: 'none',
                background: isAnnual ? '#16a34a' : 'transparent',
                color: isAnnual ? '#fff' : '#64748b',
                fontSize: 'var(--font-xs)', fontWeight: 700, cursor: 'pointer', transition: 'all 200ms',
                display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              Annual
              <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: 99, background: '#f0fdf4', color: '#16a34a', fontWeight: 800 }}>
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'stretch' }}>
          {/* FREE Plan */}
          <div className="glass-card p-8 flex flex-col justify-between" style={{ borderRadius: 24, border: '1px solid #e2e8f0' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#0f172a' }}>FREE</h3>
                <Badge variant="gray">Free Tier</Badge>
              </div>
              <p style={{ fontSize: 'var(--font-xs)', color: '#64748b', marginBottom: 24, minHeight: 36 }}>
                For solo engineers and small side projects.
              </p>
              <div style={{ marginBottom: 28 }}>
                <span style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: '#0f172a' }}>$0</span>
                <span style={{ fontSize: 'var(--font-xs)', color: '#64748b' }}> / month</span>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Up to 3 team members',
                  'Basic task board',
                  'Manual assignments',
                  '7-day activity log',
                  'Community support'
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--font-xs)', color: '#334155' }}>
                    <CheckCircle2 size={16} color="#16a34a" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/dashboard" className="btn-secondary" style={{ width: '100%', marginTop: 32, textDecoration: 'none', textAlign: 'center' }}>
              Get started
            </Link>
          </div>

          {/* PRO Plan (HIGHLIGHTED RECOMMENDED PLAN) */}
          <div className="glass-card p-8 flex flex-col justify-between" style={{
            borderRadius: 24,
            border: '2px solid #16a34a',
            boxShadow: 'var(--shadow-green-glow)',
            position: 'relative',
            background: '#f0fdf4'
          }}>
            {/* Recommended Badge */}
            <div style={{
              position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
              background: '#ffffff', color: '#15803d', fontSize: 'var(--font-xs)', fontWeight: 800, padding: '4px 16px', borderRadius: 99,
              border: '1px solid #bbf7d0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              RECOMMENDED
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 4 }}>
                <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#0f172a' }}>PRO</h3>
                <Badge variant="green">Automation</Badge>
              </div>
              <p style={{ fontSize: 'var(--font-xs)', color: '#15803d', marginBottom: 24, minHeight: 36 }}>
                For growing engineering teams that need automation.
              </p>
              <div style={{ marginBottom: 28 }}>
                <span style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: '#0f172a' }}>
                  {isAnnual ? '$39' : '$49'}
                </span>
                <span style={{ fontSize: 'var(--font-xs)', color: '#64748b' }}> / month</span>
                {isAnnual && <p style={{ fontSize: '11px', color: '#16a34a', marginTop: 4, fontWeight: 700 }}>Billed annually ($468/yr)</p>}
              </div>

              <div style={{ borderTop: '1px solid #bbf7d0', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Up to 25 team members',
                  'AI task delegation',
                  'Burnout Radar (14d)',
                  'Sprint analytics',
                  'Unlimited integrations',
                  'Priority email support'
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--font-xs)', color: '#0f172a', fontWeight: 600 }}>
                    <CheckCircle2 size={16} color="#16a34a" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/dashboard" className="btn-primary" style={{ width: '100%', marginTop: 32, textDecoration: 'none', padding: '14px', fontSize: 'var(--font-xs)', background: '#16a34a' }}>
              Start free trial <ArrowRight size={16} />
            </Link>
          </div>

          {/* ENTERPRISE Plan */}
          <div className="glass-card p-8 flex flex-col justify-between" style={{ borderRadius: 24, border: '1px solid #e2e8f0' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#0f172a' }}>ENTERPRISE</h3>
                <Badge variant="purple">Custom AI</Badge>
              </div>
              <p style={{ fontSize: 'var(--font-xs)', color: '#64748b', marginBottom: 24, minHeight: 36 }}>
                For orgs that need compliance, SSO, and SLAs.
              </p>
              <div style={{ marginBottom: 28 }}>
                <span style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: '#0f172a' }}>Custom</span>
                <span style={{ fontSize: 'var(--font-xs)', color: '#64748b' }}> / contact sales</span>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Unlimited members',
                  'Everything in Pro',
                  'SSO & SCIM provisioning',
                  'Audit-ready logs',
                  'Dedicated CSM',
                  'Custom SLA'
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--font-xs)', color: '#334155' }}>
                    <CheckCircle2 size={16} color="#7c3aed" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <a href="mailto:enterprise@orka.ai" className="btn-secondary" style={{ width: '100%', marginTop: 32, textDecoration: 'none', textAlign: 'center', background: '#0f172a', color: '#ffffff', border: 'none' }}>
              Contact sales
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
