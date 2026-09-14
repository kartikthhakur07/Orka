'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/Badge'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true)

  return (
    <section id="pricing" style={{ padding: 'clamp(56px, 8vw, 110px) 0', background: '#ffffff', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container" style={{ maxWidth: 1140 }}>
        {/* Header */}
        <div className="section-header" style={{ marginBottom: 52 }}>
          <Badge variant="green" style={{ marginBottom: 14 }}>Pricing</Badge>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800, color: '#006241', letterSpacing: '-0.01em' }}>
            Plans Built to Scale with Your Engineering
          </h2>
          <p style={{ color: 'var(--text-black-soft)', marginTop: 10, fontSize: 'var(--font-base)', maxWidth: 600, margin: '10px auto 0' }}>
            Transparent pricing for dev teams of all sizes. Upgrade or cancel anytime.
          </p>

          {/* Toggle Switch */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 28, background: 'var(--bg-canvas)', padding: '5px 8px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-card)', maxWidth: '100%' }}>
            <button
              onClick={() => setIsAnnual(false)}
              style={{
                padding: '8px 22px', borderRadius: 'var(--radius-pill)', border: 'none',
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
                padding: '8px 22px', borderRadius: 'var(--radius-pill)', border: 'none',
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
        <div className="pricing-grid" style={{ gap: 24 }}>
          {/* FREE Plan */}
          <div className="glass-card pricing-card flex flex-col justify-between" style={{ padding: '28px 24px', borderRadius: 16, border: '1px solid var(--border-subtle)', background: '#ffffff' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#006241', letterSpacing: '-0.01em' }}>FREE</h3>
                <Badge variant="gray">Free Tier</Badge>
              </div>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)', marginBottom: 20, minHeight: 36, lineHeight: 1.5 }}>
                For solo engineers and small side projects.
              </p>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--text-black)' }}>$0</span>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)' }}> / month</span>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Up to 3 team members',
                  'Basic task board',
                  'Manual assignments',
                  '7-day activity log',
                  'Community support'
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--font-xs)', color: 'var(--text-black)' }}>
                    <CheckCircle2 size={16} color="#00754A" style={{ flexShrink: 0 }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/dashboard" className="btn-secondary" style={{ width: '100%', marginTop: 28, textDecoration: 'none', textAlign: 'center', height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Get started
            </Link>
          </div>

          {/* PRO Plan (HIGHLIGHTED RECOMMENDED PLAN) */}
          <div className="glass-card pricing-card flex flex-col justify-between" style={{
            padding: '28px 24px',
            borderRadius: 16,
            border: '2px solid #00754A',
            boxShadow: '0 8px 30px rgba(0, 117, 74, 0.12)',
            position: 'relative',
            background: 'var(--green-light)'
          }}>
            {/* Recommended Badge */}
            <div style={{
              position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
              background: '#ffffff', color: '#006241', fontSize: '11px', fontWeight: 800, padding: '4px 16px', borderRadius: 'var(--radius-pill)',
              border: '1px solid #00754A', boxShadow: '0 2px 8px rgba(0,98,65,0.15)', whiteSpace: 'nowrap', zIndex: 2
            }}>
              RECOMMENDED
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 8 }}>
                <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#006241', letterSpacing: '-0.01em' }}>PRO</h3>
                <Badge variant="green">Automation</Badge>
              </div>
              <p style={{ fontSize: 'var(--font-xs)', color: '#006241', marginBottom: 20, minHeight: 36, fontWeight: 500, lineHeight: 1.5 }}>
                For growing engineering teams that need automation.
              </p>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: '#006241' }}>
                  {isAnnual ? '$39' : '$49'}
                </span>
                <span style={{ fontSize: 'var(--font-xs)', color: '#006241' }}> / month</span>
                {isAnnual && <p style={{ fontSize: '11px', color: '#00754A', marginTop: 4, fontWeight: 700 }}>Billed annually ($468/yr)</p>}
              </div>

              <div style={{ borderTop: '1px solid rgba(0,98,65,0.2)', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Up to 25 team members',
                  'AI task delegation',
                  'Burnout Radar (14d)',
                  'Sprint analytics',
                  'Unlimited integrations',
                  'Priority email support'
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--font-xs)', color: '#006241', fontWeight: 600 }}>
                    <CheckCircle2 size={16} color="#00754A" style={{ flexShrink: 0 }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/dashboard" className="btn-primary" style={{ width: '100%', marginTop: 28, textDecoration: 'none', height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-xs)', background: '#00754A' }}>
              Start free trial <ArrowRight size={16} />
            </Link>
          </div>

          {/* ENTERPRISE Plan */}
          <div className="glass-card pricing-card flex flex-col justify-between" style={{ padding: '28px 24px', borderRadius: 16, border: '1px solid var(--border-subtle)', background: '#ffffff' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#006241', letterSpacing: '-0.01em' }}>ENTERPRISE</h3>
                <Badge variant="gold">Custom AI</Badge>
              </div>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)', marginBottom: 20, minHeight: 36, lineHeight: 1.5 }}>
                For orgs that need compliance, SSO, and SLAs.
              </p>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--text-black)' }}>Custom</span>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)' }}> / contact sales</span>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Unlimited members',
                  'Everything in Pro',
                  'SSO & SCIM provisioning',
                  'Audit-ready logs',
                  'Dedicated CSM',
                  'Custom SLA'
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--font-xs)', color: 'var(--text-black)' }}>
                    <CheckCircle2 size={16} color="var(--gold)" style={{ flexShrink: 0 }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <a href="mailto:enterprise@orka.ai" className="btn-primary" style={{ width: '100%', marginTop: 28, textDecoration: 'none', textAlign: 'center', height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--house-green)', color: '#ffffff', border: 'none' }}>
              Contact sales
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
