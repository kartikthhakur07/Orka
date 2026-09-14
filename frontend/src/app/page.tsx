'use client'

import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Badge } from '@/components/Badge'
import { AlgorithmSection } from '@/components/AlgorithmSection'
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { PricingSection } from '@/components/PricingSection'
import {
  Brain, Flame, Home, Shield, CalendarDays, Layers,
  ArrowRight, Play, ChevronRight, HelpCircle, Plus
} from 'lucide-react'
import { useState } from 'react'

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-canvas)', color: 'var(--text-black)', overflowX: 'hidden' }}>
      {/* Sticky Header Navbar */}
      <Navbar />

      {/* ── 1. Hero Section (Split 50/50 Layout matching exact screenshot) ──────── */}
      <section style={{ position: 'relative', padding: 'clamp(40px, 6vw, 80px) 0', background: 'var(--bg-canvas)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'clamp(32px, 5vw, 64px)', alignItems: 'center' }}>
            {/* Left Hero Column */}
            <div>
              {/* Top Pill Badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 'var(--radius-pill)', background: 'var(--green-light)', border: '1px solid rgba(0, 98, 65, 0.2)', marginBottom: 24, maxWidth: '100%' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00754A', boxShadow: '0 0 8px #00754A', flexShrink: 0 }} />
                <span style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: '#006241', letterSpacing: '-0.01em' }}>
                  Now with real-time burnout prediction
                </span>
              </div>

              {/* Headline */}
              <h1 style={{
                fontSize: 'clamp(32px, 4.8vw, 54px)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                color: 'var(--text-black)',
                marginBottom: 20,
              }}>
                The AI Decision Engine for <br />
                <span style={{ color: '#006241' }}>
                  Modern Engineering Teams
                </span>
              </h1>

              {/* Supporting Text */}
              <p style={{
                fontSize: 'var(--font-base)',
                color: 'var(--text-black-soft)',
                maxWidth: 580,
                marginBottom: 32,
                lineHeight: 1.55,
              }}>
                Automate task delegation, predict burnout 14 days early, and run sprint planning in 30 seconds. Built for engineering managers who are tired of managing spreadsheets.
              </p>

              {/* Hero CTAs (50px full-pill buttons) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
                <Link href="/dashboard" className="btn-primary" style={{ padding: '14px 32px', fontSize: 'var(--font-xs)' }}>
                  Try the dashboard <ArrowRight size={16} />
                </Link>
                <Link href="/delegator" className="btn-secondary" style={{ padding: '14px 24px', fontSize: 'var(--font-xs)' }}>
                  <Play size={15} color="#00754A" /> Watch 2-min demo
                </Link>
              </div>

              {/* Micro-Checkmarks Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#00754A', fontWeight: 800 }}>✓</span> No credit card required
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#00754A', fontWeight: 800 }}>✓</span> Free for small teams
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#00754A', fontWeight: 800 }}>✓</span> Setup in minutes
                </span>
              </div>
            </div>

            {/* Right Hero Column — Interactive Team Office Showcase with Overlays */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0, 98, 65, 0.15)', border: '2px solid rgba(255,255,255,0.8)' }}>
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                  alt="Engineering team collaborating in cafe open office"
                  style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 420, objectFit: 'cover' }}
                />

                {/* Overlay 1: Live Sprint Whiteboard Glass Widget */}
                <div style={{
                  position: 'absolute', top: 20, right: 20, width: 260,
                  background: 'rgba(255, 255, 255, 0.94)', backdropFilter: 'blur(10px)',
                  borderRadius: 14, padding: 16, border: '1px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#006241' }}>Sprint 47</span>
                    <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: 99, background: '#d4e9e2', color: '#006241', fontWeight: 800 }}>● On Track</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 8, background: '#f8fafc', fontSize: '11px' }}>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>Design system updates</span>
                      <span style={{ background: '#fef2f2', color: '#dc2626', padding: '2px 6px', borderRadius: 4, fontWeight: 700, fontSize: '10px' }}>High</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 8, background: '#f8fafc', fontSize: '11px' }}>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>API integration</span>
                      <span style={{ background: '#fffbeb', color: '#b45309', padding: '2px 6px', borderRadius: 4, fontWeight: 700, fontSize: '10px' }}>Medium</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 8, background: '#f8fafc', fontSize: '11px' }}>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>Testing & QA</span>
                      <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '2px 6px', borderRadius: 4, fontWeight: 700, fontSize: '10px' }}>Low</span>
                    </div>
                  </div>
                </div>

                {/* Overlay 2: Sticky Wall Note */}
                <div style={{
                  position: 'absolute', bottom: 20, right: 20,
                  background: '#faf6ee', border: '1px solid #dfc49d',
                  borderRadius: 8, padding: '10px 14px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transform: 'rotate(-2deg)'
                }}>
                  <p style={{ fontSize: '11px', fontWeight: 800, color: '#006241', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Build · Automate · Scale · Together
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Central Dashboard Control Stage Preview Mockup */}
          <div style={{ position: 'relative', width: '100%', marginTop: 'clamp(40px, 6vw, 64px)' }}>
            <div className="glass-card p-6" style={{
              borderRadius: 16,
              border: '1px solid var(--border-card)',
              boxShadow: 'var(--shadow-hover)',
              background: '#ffffff',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, marginBottom: 20, borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#c82014' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#b45309' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#00754A' }} />
                </div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)', fontWeight: 700, letterSpacing: '-0.01em' }}>
                  ORKA CONTROL CENTER · SPRINT 47 OVERVIEW
                </div>
                <Badge variant="green">Sprint On Track</Badge>
              </div>

              <div className="stats-grid">
                <div style={{ padding: 16, borderRadius: 12, background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)', fontWeight: 600 }}>ACTIVE TASKS</p>
                  <p style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: '#006241', margin: '4px 0' }}>47 Tasks</p>
                  <Badge variant="blue">+8 this sprint</Badge>
                </div>
                <div style={{ padding: 16, borderRadius: 12, background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)', fontWeight: 600 }}>TEAM VELOCITY</p>
                  <p style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: '#006241', margin: '4px 0' }}>94%</p>
                  <Badge variant="green">Optimal Speed</Badge>
                </div>
                <div style={{ padding: 16, borderRadius: 12, background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)', fontWeight: 600 }}>BURNOUT RISK</p>
                  <p style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: '#00754A', margin: '4px 0' }}>Low</p>
                  <Badge variant="teal">1 Watch Listed</Badge>
                </div>
                <div style={{ padding: 16, borderRadius: 12, background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)', fontWeight: 600 }}>HYBRID COMPLIANCE</p>
                  <p style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: '#006241', margin: '4px 0' }}>100%</p>
                  <Badge variant="indigo">Policy Active</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. 4-Feature Quick Highlights Ribbon below Control Stage ────────── */}
      <section style={{ padding: '28px 0', background: '#ffffff', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#d4e9e2', color: '#00754A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Brain size={20} />
              </div>
              <div>
                <p style={{ fontSize: 'var(--font-xs)', fontWeight: 800, color: 'var(--text-black)' }}>Smarter Delegation</p>
                <p style={{ fontSize: '11px', color: 'var(--text-black-soft)', marginTop: 2 }}>AI assigns work to the right people.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Flame size={20} />
              </div>
              <div>
                <p style={{ fontSize: 'var(--font-xs)', fontWeight: 800, color: 'var(--text-black)' }}>Predict Burnout</p>
                <p style={{ fontSize: '11px', color: 'var(--text-black-soft)', marginTop: 2 }}>Identify risks 14 days earlier.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#f0fdfa', color: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CalendarDays size={20} />
              </div>
              <div>
                <p style={{ fontSize: 'var(--font-xs)', fontWeight: 800, color: 'var(--text-black)' }}>Plan Faster</p>
                <p style={{ fontSize: '11px', color: 'var(--text-black-soft)', marginTop: 2 }}>Turn hours of planning into seconds.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#f5f3ff', color: '#6d28d9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Shield size={20} />
              </div>
              <div>
                <p style={{ fontSize: 'var(--font-xs)', fontWeight: 800, color: 'var(--text-black)' }}>Built for Teams</p>
                <p style={{ fontSize: '11px', color: 'var(--text-black-soft)', marginTop: 2 }}>Designed for real dev workflows.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Logo Cloud / Social Proof Ribbon ─────────────────────────────── */}
      <section style={{ padding: '36px 0', background: 'var(--bg-canvas)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-black-soft)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>
            TRUSTED BY ENGINEERING TEAMS WORLDWIDE
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(24px, 4vw, 48px)', flexWrap: 'wrap', opacity: 0.7 }}>
            <span style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#334155', letterSpacing: '-0.02em' }}>Google</span>
            <span style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#334155', letterSpacing: '-0.02em' }}>Microsoft</span>
            <span style={{ fontSize: 'var(--font-md)', fontWeight: 900, color: '#6366f1', letterSpacing: '-0.03em' }}>stripe</span>
            <span style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#0f172a' }}>N Notion</span>
            <span style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#16a34a' }}>Spotify</span>
            <span style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#ff5a5f' }}>airbnb</span>
            <span style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#4a154b' }}># slack</span>
            <span style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#0052cc' }}>ATLASSIAN</span>
          </div>
        </div>
      </section>

      {/* ── 3. 6-Features Section (12px Card Radius + Soft Whisper Shadows) ──── */}
      <section id="features" style={{ padding: 'clamp(48px, 7vw, 96px) 0' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: 48 }}>
            <Badge variant="green" style={{ marginBottom: 12 }}>Features</Badge>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 700, color: '#006241' }}>
              Built for Modern Engineering Management
            </h2>
            <p style={{ color: 'var(--text-black-soft)', marginTop: 8, fontSize: 'var(--font-base)', maxWidth: 640, margin: '8px auto 0' }}>
              Six core modules designed to optimize team flow and prevent burnout.
            </p>
          </div>

          <div className="features-grid">
            {/* Card 1 */}
            <div className="glass-card p-6 flex flex-col justify-between" style={{ borderRadius: 12 }}>
              <div>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--green-light)', color: '#00754A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Brain size={22} />
                </div>
                <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: '#006241', marginBottom: 8 }}>1. AI Task Delegation</h3>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)', lineHeight: 1.5 }}>
                  Automatically assigns tasks to the right team member based on skills, workload, and availability scores in real-time.
                </p>
              </div>
              <Link href="/delegator" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#00754A', fontWeight: 700, marginTop: 20, textDecoration: 'none' }}>
                Explore Delegator <ChevronRight size={14} />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="glass-card p-6 flex flex-col justify-between" style={{ borderRadius: 12 }}>
              <div>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Shield size={22} />
                </div>
                <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: '#006241', marginBottom: 8 }}>2. Sprint Analytics</h3>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)', lineHeight: 1.5 }}>
                  Visualise sprint velocity, burndown, and cycle time with intelligent forecasting powered by historical data.
                </p>
              </div>
              <Link href="/sprint" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#1d4ed8', fontWeight: 700, marginTop: 20, textDecoration: 'none' }}>
                Explore Analytics <ChevronRight size={14} />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="glass-card p-6 flex flex-col justify-between" style={{ borderRadius: 12 }}>
              <div>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f0fdfa', color: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Home size={22} />
                </div>
                <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: '#006241', marginBottom: 8 }}>3. Team Capacity Planner</h3>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)', lineHeight: 1.5 }}>
                  Balance workloads across your whole org. See who has headroom before you commit to another deadline.
                </p>
              </div>
              <Link href="/wfh" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#0f766e', fontWeight: 700, marginTop: 20, textDecoration: 'none' }}>
                Check Capacity <ChevronRight size={14} />
              </Link>
            </div>

            {/* Card 4 */}
            <div className="glass-card p-6 flex flex-col justify-between" style={{ borderRadius: 12 }}>
              <div>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fef2f2', color: '#c82014', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Flame size={22} />
                </div>
                <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: '#006241', marginBottom: 8 }}>4. Burnout Radar</h3>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)', lineHeight: 1.5 }}>
                  14-day early warning system that surfaces pressure signals before engineers burn out or go quiet.
                </p>
              </div>
              <Link href="/burnout" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#c82014', fontWeight: 700, marginTop: 20, textDecoration: 'none' }}>
                Open Burnout Radar <ChevronRight size={14} />
              </Link>
            </div>

            {/* Card 5 */}
            <div className="glass-card p-6 flex flex-col justify-between" style={{ borderRadius: 12 }}>
              <div>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f5f3ff', color: '#6d28d9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <CalendarDays size={22} />
                </div>
                <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: '#006241', marginBottom: 8 }}>5. Compliance Logs</h3>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)', lineHeight: 1.5 }}>
                  Audit-ready trails for every task change, delegation event, and status update across your workspace.
                </p>
              </div>
              <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#6d28d9', fontWeight: 700, marginTop: 20, textDecoration: 'none' }}>
                View Audit Logs <ChevronRight size={14} />
              </Link>
            </div>

            {/* Card 6 */}
            <div className="glass-card p-6 flex flex-col justify-between" style={{ borderRadius: 12 }}>
              <div>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fffbeb', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Layers size={22} />
                </div>
                <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: '#006241', marginBottom: 8 }}>6. Integrations Hub</h3>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)', lineHeight: 1.5 }}>
                  Connect Jira, Linear, GitHub, Slack, and 40+ tools in minutes. Your data flows where your team already works.
                </p>
              </div>
              <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#b45309', fontWeight: 700, marginTop: 20, textDecoration: 'none' }}>
                Browse Hub <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. AI Algorithm Section ─────────────────────────────────────────── */}
      <AlgorithmSection />

      {/* ── 5. Testimonials Section ─────────────────────────────────────────── */}
      <TestimonialsSection />

      {/* ── 6. Pricing Section ─────────────────────────────────────────────── */}
      <PricingSection />

      {/* ── 7. House Green Dark Feature Band (#1E3932) ───────────────────────── */}
      <section style={{ margin: 'clamp(36px, 5vw, 64px) 0' }}>
        <div className="container">
          <div className="house-green-band" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, borderRadius: 20, padding: 'clamp(24px, 4vw, 48px)' }}>
            <div style={{ maxWidth: 640 }}>
              <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 700, color: '#ffffff' }}>
                Ready to automate engineering decisions?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--font-sm)', marginTop: 8 }}>
                Join 200+ engineering teams running faster sprints with 0 burnout.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link href="/dashboard" className="btn-primary" style={{ background: '#ffffff', color: '#00754A', border: '1px solid #ffffff', padding: '12px 28px' }}>
                Start free trial
              </Link>
              <a href="mailto:sales@orka.ai" className="btn-secondary" style={{ color: '#ffffff', borderColor: '#ffffff', padding: '12px 24px' }}>
                Talk to sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. FAQ Accordion ───────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(48px, 7vw, 96px) 0' }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <div className="section-header" style={{ marginBottom: 34 }}>
            <Badge variant="gray" style={{ marginBottom: 12 }}>Knowledge</Badge>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 700, color: '#006241' }}>
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
                style={{ cursor: 'pointer', transition: 'all 200ms', borderRadius: 12 }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: '#006241', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <HelpCircle size={16} color="#00754A" /> {item.q}
                  </h3>
                  <ChevronRight size={18} color="rgba(0,0,0,0.58)" style={{ transform: openFaq === i ? 'rotate(90deg)' : 'none', transition: 'transform 200ms' }} />
                </div>
                {openFaq === i && (
                  <p style={{ fontSize: 'var(--font-xs)', color: 'rgba(0,0,0,0.87)', marginTop: 14, lineHeight: 1.5, paddingLeft: 26 }}>
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Floating Circular "Frap" Button (56px #00754A Green Accent) */}
      <Link href="/dashboard" className="frap-btn" title="Open Dashboard" aria-label="Open Dashboard">
        <Plus size={24} />
      </Link>

      {/* ── 9. Dark House Green Footer (#1E3932) ────────────────────────────── */}
      <footer style={{ padding: 'var(--space-6) 0', borderTop: '1px solid var(--border-subtle)', background: 'var(--house-green)', color: '#ffffff' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--font-xs)', color: 'rgba(255,255,255,0.7)', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#ffffff', color: '#006241', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>O</div>
            <span style={{ fontWeight: 800, color: '#ffffff' }}>ORKA v2</span>
            <span>· Starbucks-Inspired Retail Flagship UI</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <a href="https://orka-ten.vercel.app" target="_blank" rel="noreferrer" style={{ color: '#ffffff', textDecoration: 'none' }}>Live App</a>
            <a href="https://orkapi.onrender.com" target="_blank" rel="noreferrer" style={{ color: '#ffffff', textDecoration: 'none' }}>API Telemetry</a>
            <a href="https://github.com/kartikthhakur07/Orka" target="_blank" rel="noreferrer" style={{ color: '#ffffff', textDecoration: 'none' }}>GitHub Repo</a>
          </div>
        </div>
      </footer>
    </div>
  )
}