'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/Badge'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true)

  return (
    <section id="pricing" style={{ padding: 'clamp(48px, 7vw, 96px) 0', background: '#ffffff', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ marginBottom: 44 }}>
          <Badge variant="green" style={{ marginBottom: 12 }}>Pricing</Badge>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 700, color: '#006241' }}>
            Plans Built to Scale with Your Engineering
          </h2>
          <p style={{ color: 'var(--text-black-soft)', marginTop: 8, fontSize: 'var(--font-base)', maxWidth: 640, margin: '8px auto 0' }}>
            Transparent pricing for dev teams of all sizes. Upgrade or cancel anytime.
          </p>

          {/* Toggle Switch */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: 24, background: 'var(--bg-canvas)', padding: '6px 10px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-card)', maxWidth: '100%' }}>
            <button
              onClick={() => setIsAnnual(false)}
              style={{
                padding: '8px 20px', borderRadius: 'var(--radius-pill)', border: 'none',
                background: !isAnnual ? '#00754A' : 'transparent',
                color: !isAnnual ? '#fff' : 'var(--text-black-soft)',
                fontSize: 'var(--font-xs)', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease'
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              style={{
                padding: '8px 20px', borderRadius: 'var(--radius-pill)', border: 'none',
                background: isAnnual ? '#00754A' : 'transparent',
                color: isAnnual ? '#fff' : 'var(--text-black-soft)',
                fontSize: 'var(--font-xs)', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              Annual
              <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: 99, background: 'var(--green-light)', color: '#006241', fontWeight: 800 }}>
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="pricing-grid">
          {/* FREE Plan */}
          <div className="glass-card pricing-card p-8 flex flex-col justify-between" style={{ borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: '#006241' }}>FREE</h3>
                <Badge variant="gray">Free Tier</Badge>
              </div>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)', marginBottom: 24, minHeight: 36 }}>
                For solo engineers and small side projects.
              </p>
              <div style={{ marginBottom: 28 }}>
                <span style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-black)' }}>$0</span>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)' }}> / month</span>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Up to 3 team members',
                  'Basic task board',
                  'Manual assignments',
                  '7-day activity log',
                  'Community support'
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--font-xs)', color: 'var(--text-black)' }}>
                    <CheckCircle2 size={16} color="#00754A" />
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
          <div className="glass-card pricing-card p-8 flex flex-col justify-between" style={{
            borderRadius: 12,
            border: '2px solid #00754A',
            boxShadow: 'var(--shadow-hover)',
            position: 'relative',
            background: 'var(--green-light)'
          }}>
            {/* Recommended Badge */}
            <div style={{
              position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
              background: '#ffffff', color: '#006241', fontSize: 'var(--font-xs)', fontWeight: 800, padding: '4px 16px', borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(0,98,65,0.2)', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', whiteSpace: 'nowrap'
            }}>
              RECOMMENDED
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 4 }}>
                <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: '#006241' }}>PRO</h3>
                <Badge variant="green">Automation</Badge>
              </div>
              <p style={{ fontSize: 'var(--font-xs)', color: '#006241', marginBottom: 24, minHeight: 36, fontWeight: 500 }}>
                For growing engineering teams that need automation.
              </p>
              <div style={{ marginBottom: 28 }}>
                <span style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: '#006241' }}>
                  {isAnnual ? '$39' : '$49'}
                </span>
                <span style={{ fontSize: 'var(--font-xs)', color: '#006241' }}> / month</span>
                {isAnnual && <p style={{ fontSize: '11px', color: '#00754A', marginTop: 4, fontWeight: 700 }}>Billed annually ($468/yr)</p>}
              </div>

              <div style={{ borderTop: '1px solid rgba(0,98,65,0.2)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Up to 25 team members',
                  'AI task delegation',
                  'Burnout Radar (14d)',
                  'Sprint analytics',
                  'Unlimited integrations',
                  'Priority email support'
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--font-xs)', color: '#006241', fontWeight: 600 }}>
                    <CheckCircle2 size={16} color="#00754A" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/dashboard" className="btn-primary" style={{ width: '100%', marginTop: 32, textDecoration: 'none', padding: '14px', fontSize: 'var(--font-xs)', background: '#00754A' }}>
              Start free trial <ArrowRight size={16} />
            </Link>
          </div>

          {/* ENTERPRISE Plan */}
          <div className="glass-card pricing-card p-8 flex flex-col justify-between" style={{ borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: '#006241' }}>ENTERPRISE</h3>
                <Badge variant="gold">Custom AI</Badge>
              </div>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)', marginBottom: 24, minHeight: 36 }}>
                For orgs that need compliance, SSO, and SLAs.
              </p>
              <div style={{ marginBottom: 28 }}>
                <span style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-black)' }}>Custom</span>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)' }}> / contact sales</span>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Unlimited members',
                  'Everything in Pro',
                  'SSO & SCIM provisioning',
                  'Audit-ready logs',
                  'Dedicated CSM',
                  'Custom SLA'
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--font-xs)', color: 'var(--text-black)' }}>
                    <CheckCircle2 size={16} color="var(--gold)" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <a href="mailto:enterprise@orka.ai" className="btn-secondary" style={{ width: '100%', marginTop: 32, textDecoration: 'none', textAlign: 'center', background: 'var(--house-green)', color: '#ffffff', border: 'none' }}>
              Contact sales
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
