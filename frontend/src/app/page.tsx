'use client'

import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Badge } from '@/components/Badge'
import { AlgorithmSection } from '@/components/AlgorithmSection'
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { PricingSection } from '@/components/PricingSection'
import {
  Brain, Flame, Home, Shield, CalendarDays, Layers,
  ArrowRight, Play, ChevronRight, HelpCircle
} from 'lucide-react'
import { useState } from 'react'

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', overflowX: 'hidden' }}>
      {/* Sticky Header Navbar */}
      <Navbar />

      {/* ── 1. Hero Section ─────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', padding: 'var(--space-5) var(--space-4) var(--space-6)', maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Top Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 99, background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: 24 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 8px #16a34a' }} />
            <span style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: '#15803d', letterSpacing: '0.02em' }}>
              Now with real-time burnout prediction
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'var(--font-3xl)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: '#0f172a',
            maxWidth: 960,
            margin: '0 auto 21px',
          }}>
            The AI Decision Engine for <br />
            <span style={{ color: '#16a34a' }}>
              Modern Engineering
            </span> Teams
          </h1>

          {/* Supporting Text */}
          <p style={{
            fontSize: 'var(--font-base)',
            color: '#475569',
            maxWidth: 760,
            margin: '0 auto 34px',
            lineHeight: 1.6,
          }}>
            Automate task delegation, predict burnout 14 days early, and run sprint planning in 30 seconds. Built for engineering managers who are tired of managing spreadsheets.
          </p>

          {/* Hero CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 52, flexWrap: 'wrap' }}>
            <Link href="/dashboard" className="btn-primary" style={{ padding: '14px 34px', fontSize: 'var(--font-xs)', borderRadius: 12, background: '#16a34a' }}>
              Try the dashboard <ArrowRight size={16} />
            </Link>
            <Link href="/delegator" className="btn-secondary" style={{ padding: '14px 28px', fontSize: 'var(--font-xs)', borderRadius: 12 }}>
              <Play size={15} color="#16a34a" /> Watch 2-min demo
            </Link>
          </div>

          {/* Central Dashboard Control Stage Preview Mockup */}
          <div style={{ position: 'relative', maxWidth: 1040, margin: '0 auto' }}>
            <div className="glass-card p-6" style={{
              borderRadius: 24,
              border: '1px solid #cbd5e1',
              boxShadow: '0 24px 64px rgba(15, 23, 42, 0.12)',
              background: '#ffffff',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, marginBottom: 20, borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#16a34a' }} />
                </div>
                <div style={{ fontSize: 'var(--font-xs)', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>
                  ORKA CONTROL CENTER · SPRINT 47 OVERVIEW
                </div>
                <Badge variant="green">Sprint On Track</Badge>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <div style={{ padding: 16, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: 'var(--font-xs)', color: '#64748b', fontWeight: 600 }}>ACTIVE TASKS</p>
                  <p style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>47 Tasks</p>
                  <Badge variant="blue">+8 this sprint</Badge>
                </div>
                <div style={{ padding: 16, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: 'var(--font-xs)', color: '#64748b', fontWeight: 600 }}>TEAM VELOCITY</p>
                  <p style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>94%</p>
                  <Badge variant="green">Optimal Speed</Badge>
                </div>
                <div style={{ padding: 16, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: 'var(--font-xs)', color: '#64748b', fontWeight: 600 }}>BURNOUT RISK</p>
                  <p style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: '#16a34a', margin: '4px 0' }}>Low</p>
                  <Badge variant="teal">1 Watch Listed</Badge>
                </div>
                <div style={{ padding: 16, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: 'var(--font-xs)', color: '#64748b', fontWeight: 600 }}>HYBRID COMPLIANCE</p>
                  <p style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>100%</p>
                  <Badge variant="indigo">Policy Active</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Stats Section ────────────────────────────────────────────────── */}
      <section style={{ padding: '36px var(--space-4)', background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, textAlign: 'center' }}>
          <div>
            <p style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: '#16a34a', lineHeight: 1 }}>94%</p>
            <p style={{ fontSize: 'var(--font-xs)', color: '#0f172a', marginTop: 8, fontWeight: 700 }}>Task accuracy rate</p>
            <p style={{ fontSize: '11px', color: '#64748b' }}>vs manual assignment</p>
          </div>
          <div>
            <p style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: '#2563eb', lineHeight: 1 }}>30s</p>
            <p style={{ fontSize: 'var(--font-xs)', color: '#0f172a', marginTop: 8, fontWeight: 700 }}>Average delegation time</p>
            <p style={{ fontSize: '11px', color: '#64748b' }}>from sprint planning</p>
          </div>
          <div>
            <p style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: '#7c3aed', lineHeight: 1 }}>14d</p>
            <p style={{ fontSize: 'var(--font-xs)', color: '#0f172a', marginTop: 8, fontWeight: 700 }}>Burnout early alert</p>
            <p style={{ fontSize: '11px', color: '#64748b' }}>lead time</p>
          </div>
          <div>
            <p style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: '#b45309', lineHeight: 1 }}>3.2×</p>
            <p style={{ fontSize: 'var(--font-xs)', color: '#0f172a', marginTop: 8, fontWeight: 700 }}>ROI in 90 days</p>
            <p style={{ fontSize: '11px', color: '#64748b' }}>avg across Pro teams</p>
          </div>
        </div>
      </section>

      {/* ── 3. Features Section (6 Prompt Cards) ────────────────────────────── */}
      <section id="features" style={{ padding: 'var(--space-6) var(--space-4)', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Badge variant="green" style={{ marginBottom: 12 }}>Features</Badge>
          <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: '#0f172a' }}>
            Built for Modern Engineering Management
          </h2>
          <p style={{ color: '#64748b', marginTop: 8, fontSize: 'var(--font-base)', maxWidth: 640, margin: '8px auto 0' }}>
            Six core modules designed to optimize team flow and prevent burnout.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {/* Card 1 */}
          <div className="glass-card p-6 flex flex-col justify-between" style={{ borderRadius: 20 }}>
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Brain size={22} />
              </div>
              <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>1. AI Task Delegation</h3>
              <p style={{ fontSize: 'var(--font-xs)', color: '#475569', lineHeight: 1.6 }}>
                Automatically assigns tasks to the right team member based on skills, workload, and availability scores in real-time.
              </p>
            </div>
            <Link href="/delegator" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#16a34a', fontWeight: 700, marginTop: 20, textDecoration: 'none' }}>
              Explore Delegator <ChevronRight size={14} />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-6 flex flex-col justify-between" style={{ borderRadius: 20 }}>
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Shield size={22} />
              </div>
              <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>2. Sprint Analytics</h3>
              <p style={{ fontSize: 'var(--font-xs)', color: '#475569', lineHeight: 1.6 }}>
                Visualise sprint velocity, burndown, and cycle time with intelligent forecasting powered by historical data.
              </p>
            </div>
            <Link href="/sprint" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#2563eb', fontWeight: 700, marginTop: 20, textDecoration: 'none' }}>
              Explore Analytics <ChevronRight size={14} />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-6 flex flex-col justify-between" style={{ borderRadius: 20 }}>
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f0fdfa', color: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Home size={22} />
              </div>
              <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>3. Team Capacity Planner</h3>
              <p style={{ fontSize: 'var(--font-xs)', color: '#475569', lineHeight: 1.6 }}>
                Balance workloads across your whole org. See who has headroom before you commit to another deadline.
              </p>
            </div>
            <Link href="/wfh" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#0f766e', fontWeight: 700, marginTop: 20, textDecoration: 'none' }}>
              Check Capacity <ChevronRight size={14} />
            </Link>
          </div>

          {/* Card 4 */}
          <div className="glass-card p-6 flex flex-col justify-between" style={{ borderRadius: 20 }}>
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Flame size={22} />
              </div>
              <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>4. Burnout Radar</h3>
              <p style={{ fontSize: 'var(--font-xs)', color: '#475569', lineHeight: 1.6 }}>
                14-day early warning system that surfaces pressure signals before engineers burn out or go quiet.
              </p>
            </div>
            <Link href="/burnout" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#dc2626', fontWeight: 700, marginTop: 20, textDecoration: 'none' }}>
              Open Burnout Radar <ChevronRight size={14} />
            </Link>
          </div>

          {/* Card 5 */}
          <div className="glass-card p-6 flex flex-col justify-between" style={{ borderRadius: 20 }}>
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <CalendarDays size={22} />
              </div>
              <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>5. Compliance Logs</h3>
              <p style={{ fontSize: 'var(--font-xs)', color: '#475569', lineHeight: 1.6 }}>
                Audit-ready trails for every task change, delegation event, and status update across your workspace.
              </p>
            </div>
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#7c3aed', fontWeight: 700, marginTop: 20, textDecoration: 'none' }}>
              View Audit Logs <ChevronRight size={14} />
            </Link>
          </div>

          {/* Card 6 */}
          <div className="glass-card p-6 flex flex-col justify-between" style={{ borderRadius: 20 }}>
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fffbeb', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Layers size={22} />
              </div>
              <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>6. Integrations Hub</h3>
              <p style={{ fontSize: 'var(--font-xs)', color: '#475569', lineHeight: 1.6 }}>
                Connect Jira, Linear, GitHub, Slack, and 40+ tools in minutes. Your data flows where your team already works.
              </p>
            </div>
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#b45309', fontWeight: 700, marginTop: 20, textDecoration: 'none' }}>
              Browse Hub <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. AI Algorithm Section ─────────────────────────────────────────── */}
      <AlgorithmSection />

      {/* ── 5. Testimonials Section ─────────────────────────────────────────── */}
      <TestimonialsSection />

      {/* ── 6. Pricing Section ─────────────────────────────────────────────── */}
      <PricingSection />

      {/* ── 7. FAQ Accordion ───────────────────────────────────────────────── */}
      <section style={{ padding: 'var(--space-6) var(--space-4)', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 34 }}>
          <Badge variant="gray" style={{ marginBottom: 12 }}>Knowledge</Badge>
          <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: '#0f172a' }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            {
              q: 'How does ORKA detect burnout risk 14 days in advance?',
              a: 'ORKA analyzes cognitive load telemetry, meeting density, context switching frequency, and focus hour trends to flag early burnout signals before performance decline occurs.'
            },
            {
              q: 'Is ORKA integrated with live HR datasets?',
              a: 'Yes! ORKA is fully integrated with the IBM HR Analytics dataset, using machine-learned feature weights to prevent attrition and optimize team wellness.'
            },
            {
              q: 'How does the 5-Factor Task Delegator compute match scores?',
              a: 'It uses a weighted multi-factor formula evaluating Skill Match (35%), Available Hours (25%), Workload Inverse (20%), Performance Rating (15%), and Task Urgency (5%).'
            },
            {
              q: 'Can ORKA enforce company WFH policies automatically?',
              a: 'Yes. The WFH Decider factors in commute times, deep focus task requirements, and team meeting schedules to issue policy-compliant remote work approvals.'
            }
          ].map((item, i) => (
            <div
              key={i}
              className="glass-card p-6"
              style={{ cursor: 'pointer', transition: 'all 200ms', borderRadius: 16 }}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <HelpCircle size={16} color="#16a34a" /> {item.q}
                </h3>
                <ChevronRight size={18} color="#94a3b8" style={{ transform: openFaq === i ? 'rotate(90deg)' : 'none', transition: 'transform 200ms' }} />
              </div>
              {openFaq === i && (
                <p style={{ fontSize: 'var(--font-xs)', color: '#475569', marginTop: 14, lineHeight: 1.6, paddingLeft: 26 }}>
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. Footer ───────────────────────────────────────────────────────── */}
      <footer style={{ padding: 'var(--space-5) var(--space-4)', borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--font-xs)', color: '#64748b', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: '#16a34a', color: '#fff', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>O</div>
            <span style={{ fontWeight: 800, color: '#0f172a' }}>ORKA v2</span>
            <span>· Bright Swiss AI Decision Engine</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <a href="https://orka-ten.vercel.app" target="_blank" rel="noreferrer" style={{ color: '#64748b', textDecoration: 'none' }}>Live App</a>
            <a href="https://orkapi.onrender.com" target="_blank" rel="noreferrer" style={{ color: '#64748b', textDecoration: 'none' }}>API Telemetry</a>
            <a href="https://github.com/kartikthhakur07/Orka" target="_blank" rel="noreferrer" style={{ color: '#64748b', textDecoration: 'none' }}>GitHub Repo</a>
          </div>
        </div>
      </footer>
    </div>
  )
}