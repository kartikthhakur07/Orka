'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Badge } from '@/components/Badge'
import {
  Zap, Brain, Flame, Home, Shield, CalendarDays,
  CheckCircle2, ArrowRight, Sparkles, Cpu, ExternalLink
} from 'lucide-react'

export default function LandingPage() {
  /* Interactive Algorithm State */
  const [skillMatch, setSkillMatch] = useState(90)
  const [availability, setAvailability] = useState(7.5)
  const [workload, setWorkload] = useState(35)
  const [performance, setPerformance] = useState(92)
  const [urgency, setUrgency] = useState(80)

  /* Computed Score Formula */
  const calculatedScore = Math.round(
    (skillMatch * 0.35) +
    ((availability / 8.0) * 100 * 0.25) +
    ((100 - workload) * 0.20) +
    (performance * 0.15) +
    (urgency * 0.05)
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Navbar Header */}
      <Navbar />

      {/* ── Hero Section (Golden Ratio Proportions) ───────────────────────── */}
      <section style={{ padding: 'var(--space-6) var(--space-4) var(--space-5)', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <Badge variant="indigo" style={{ padding: '6px 16px', fontSize: 'var(--font-xs)', marginBottom: 'var(--space-3)' }}>
          <Sparkles size={14} style={{ marginRight: 6 }} /> 5-Factor Predictive AI Engine v2.0
        </Badge>

        <h1
          style={{
            fontSize: 'var(--font-display)',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            maxWidth: 900,
            margin: '0 auto var(--space-3)',
          }}
        >
          AI Decision Engine for <br />
          <span style={{ color: 'var(--accent-indigo)' }}>Modern Engineering Teams</span>
        </h1>

        <p
          style={{
            fontSize: 'var(--font-md)',
            color: 'var(--text-secondary)',
            maxWidth: 720,
            margin: '0 auto var(--space-4)',
            lineHeight: 1.6,
          }}
        >
          Automate task delegation with 5-factor precision, detect burnout risk 2 weeks before performance drops, enforce WFH policies, and shield your team from deadline delays.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 'var(--space-5)' }}>
          <Link href="/dashboard" className="btn-primary" style={{ padding: '14px 34px', fontSize: 'var(--font-base)', textDecoration: 'none' }}>
            Launch Executive Dashboard <ArrowRight size={18} />
          </Link>
          <Link href="/delegator" className="btn-secondary" style={{ padding: '14px 28px', fontSize: 'var(--font-base)', textDecoration: 'none' }}>
            Try Task Delegator
          </Link>
        </div>

        {/* Live Hero Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', textAlign: 'left' }}>
          <div className="glass-card p-6 flex items-center gap-4">
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--accent-indigo-dim)', color: 'var(--accent-indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={24} />
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Smart Match</p>
              <p style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: 'var(--text-primary)' }}>94.5% Confidence</p>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Auto-assigned by 5-factor fit</p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-center gap-4">
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(59, 130, 246, 0.12)', color: 'var(--accent-cobalt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={24} />
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Burnout Radar</p>
              <p style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: 'var(--text-primary)' }}>14 Days Early Alert</p>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Cognitive load & stress tracking</p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-center gap-4">
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--accent-teal-dim)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarDays size={24} />
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Sprint Generation</p>
              <p style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: 'var(--text-primary)' }}>30 Seconds</p>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Balanced 2-week sprint distribution</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6 Core Features Grid ─────────────────────────────────────────── */}
      <section id="features" style={{ padding: 'var(--space-5) var(--space-4)', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>
          <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
            6 Core Intelligent Modules
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: 'var(--font-base)' }}>
            Designed to eliminate management toil and safeguard developer focus.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
          {[
            {
              icon: Brain, color: '#6366f1', title: '1. Smart Task Delegator',
              desc: 'Matches tasks with members using a 5-factor weighted algorithm evaluating skill fit, capacity, rating, and stress.'
            },
            {
              icon: Flame, color: '#ef4444', title: '2. Burnout Radar',
              desc: 'Tracks cognitive load, meeting density, and context switching to predict burnout risk 2 weeks before performance drops.'
            },
            {
              icon: Home, color: '#10b981', title: '3. WFH Decider',
              desc: 'Calculates WFH eligibility based on commute distance, deep work requirements, and meeting schedules for maximum focus.'
            },
            {
              icon: Shield, color: '#3b82f6', title: '4. Deadline Shield',
              desc: 'Monitors sprint velocity and remaining task complexity to predict deadline delays before delivery is compromised.'
            },
            {
              icon: Cpu, color: '#0d9488', title: '5. NLP Task Parser',
              desc: 'Extracts skills, estimated hours, and complexity from single-sentence task descriptions using natural language parsing.'
            },
            {
              icon: CalendarDays, color: '#f59e0b', title: '6. Auto Sprint Planner',
              desc: 'Generates balanced 2-week sprint schedules in 30 seconds respecting daily capacity limits and technical specialization.'
            },
          ].map((f, i) => (
            <div key={i} className="glass-card p-6 flex flex-col gap-3">
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${f.color}15`, color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <f.icon size={22} />
              </div>
              <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)' }}>{f.title}</h3>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Interactive 5-Factor Score Visualizer ────────────────────────── */}
      <section id="algorithm" style={{ padding: 'var(--space-5) var(--space-4)', background: 'rgba(18, 18, 24, 0.6)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
            <Badge variant="indigo" style={{ marginBottom: 10 }}>Algorithmic Precision</Badge>
            <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
              Interactive 5-Factor Scoring Model
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: 'var(--font-base)' }}>
              Adjust the Golden Ratio weighted parameters to see how ORKA computes optimal assignment scores.
            </p>
          </div>

          <div className="glass-card p-8 golden-grid" style={{ alignItems: 'center' }}>
            {/* Sliders (61.8% Main) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-sm)', fontWeight: 600, marginBottom: 6 }}>
                  <span>1. Skill Match (35%)</span>
                  <span style={{ color: 'var(--accent-indigo)' }}>{skillMatch}%</span>
                </div>
                <input type="range" min="0" max="100" value={skillMatch} onChange={e => setSkillMatch(Number(e.target.value))} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-sm)', fontWeight: 600, marginBottom: 6 }}>
                  <span>2. Availability (25%)</span>
                  <span style={{ color: 'var(--accent-cobalt)' }}>{availability}h / 8h</span>
                </div>
                <input type="range" min="0" max="8" step="0.5" value={availability} onChange={e => setAvailability(Number(e.target.value))} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-sm)', fontWeight: 600, marginBottom: 6 }}>
                  <span>3. Workload Inverse (20%)</span>
                  <span style={{ color: 'var(--accent-teal)' }}>{workload}% load ({100 - workload}% free)</span>
                </div>
                <input type="range" min="0" max="100" value={workload} onChange={e => setWorkload(Number(e.target.value))} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-sm)', fontWeight: 600, marginBottom: 6 }}>
                  <span>4. Performance Rating (15%)</span>
                  <span style={{ color: 'var(--accent-emerald)' }}>{performance} / 100</span>
                </div>
                <input type="range" min="0" max="100" value={performance} onChange={e => setPerformance(Number(e.target.value))} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-sm)', fontWeight: 600, marginBottom: 6 }}>
                  <span>5. Deadline Urgency (5%)</span>
                  <span style={{ color: 'var(--accent-amber)' }}>{urgency}%</span>
                </div>
                <input type="range" min="0" max="100" value={urgency} onChange={e => setUrgency(Number(e.target.value))} />
              </div>
            </div>

            {/* Calculated Score Display (38.2% Side) */}
            <div style={{ textAlign: 'center', background: 'rgba(12, 12, 16, 0.9)', padding: 34, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-card)' }}>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Calculated Assignment Score
              </p>
              <div style={{ fontSize: '4.5rem', fontWeight: 900, color: calculatedScore >= 75 ? '#10b981' : calculatedScore >= 50 ? '#f59e0b' : '#ef4444', margin: '10px 0' }}>
                {calculatedScore}
              </div>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 21 }}>
                {calculatedScore >= 75 ? '⚡ Ideal Match — Auto-assign recommended' : calculatedScore >= 50 ? '⚠️ Moderate Match — Assign with caution' : '🛑 Poor Match — High burnout risk'}
              </p>
              <Link href="/delegator" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                Test Live Delegator Engine
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Business ROI Calculator ──────────────────────────────────────── */}
      <section id="roi" style={{ padding: 'var(--space-5) var(--space-4)', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
            High Business Impact & Financial ROI
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: 'var(--font-base)' }}>
            Preventing developer turnover yields direct quantifiable savings.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', textAlign: 'center' }}>
          <div className="glass-card p-6">
            <p style={{ fontSize: 'var(--font-xl)', fontWeight: 900, color: 'var(--accent-indigo)' }}>₹7–10 Lakhs</p>
            <p style={{ fontSize: 'var(--font-base)', fontWeight: 700, color: 'var(--text-primary)', margin: '8px 0 4px' }}>Developer Retention Savings</p>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Average cost saved per engineer retained by eliminating burnout turnover.</p>
          </div>

          <div className="glass-card p-6">
            <p style={{ fontSize: 'var(--font-xl)', fontWeight: 900, color: 'var(--accent-cobalt)' }}>300x ROI</p>
            <p style={{ fontSize: 'var(--font-base)', fontWeight: 700, color: 'var(--text-primary)', margin: '8px 0 4px' }}>Return on Investment</p>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Calculated against standard ORKA annual subscription costs.</p>
          </div>

          <div className="glass-card p-6">
            <p style={{ fontSize: 'var(--font-xl)', fontWeight: 900, color: 'var(--accent-teal)' }}>24+ Hours</p>
            <p style={{ fontSize: 'var(--font-base)', fontWeight: 700, color: 'var(--text-primary)', margin: '8px 0 4px' }}>Focus Time Reclaimed</p>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Saved per week by converting low-value meetings into async workflows.</p>
          </div>
        </div>
      </section>

      {/* ── Pricing Tiers ───────────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: 'var(--space-5) var(--space-4)', background: 'rgba(18, 18, 24, 0.6)', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>
            <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
              Transparent Pricing Plans
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: 'var(--font-base)' }}>
              Scale your team intelligence seamlessly as your engineering organization grows.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
            {/* Free */}
            <div className="glass-card p-6 flex flex-col justify-between">
              <div>
                <p style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)' }}>Free Starter</p>
                <p style={{ fontSize: 'var(--font-xl)', fontWeight: 900, color: 'var(--text-primary)', margin: '12px 0' }}>₹0 <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 500 }}>/ month</span></p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={16} color="#10b981" /> Up to 3 team members</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={16} color="#10b981" /> Basic Task Delegator</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={16} color="#10b981" /> WFH Decider</li>
                </ul>
              </div>
              <Link href="/dashboard" className="btn-secondary" style={{ textDecoration: 'none', marginTop: 24, textAlign: 'center' }}>
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="glass-card p-6 flex flex-col justify-between" style={{ borderColor: 'rgba(99, 102, 241, 0.4)', boxShadow: '0 12px 34px rgba(99, 102, 241, 0.15)' }}>
              <div>
                <Badge variant="indigo" style={{ marginBottom: 8 }}>Most Popular</Badge>
                <p style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)' }}>Pro Team</p>
                <p style={{ fontSize: 'var(--font-xl)', fontWeight: 900, color: 'var(--accent-indigo)', margin: '12px 0' }}>₹1,999 <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 500 }}>/ month</span></p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={16} color="#6366f1" /> Up to 20 team members</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={16} color="#6366f1" /> IBM HR Analytics Integration</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={16} color="#6366f1" /> Burnout Radar (14-day early warning)</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={16} color="#6366f1" /> Auto Sprint Planner (30-sec sprint)</li>
                </ul>
              </div>
              <Link href="/dashboard" className="btn-primary" style={{ textDecoration: 'none', marginTop: 24, textAlign: 'center' }}>
                Start Pro Trial <ArrowRight size={16} />
              </Link>
            </div>

            {/* Enterprise */}
            <div className="glass-card p-6 flex flex-col justify-between">
              <div>
                <p style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)' }}>Enterprise</p>
                <p style={{ fontSize: 'var(--font-xl)', fontWeight: 900, color: 'var(--text-primary)', margin: '12px 0' }}>Custom</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={16} color="#10b981" /> Unlimited team members</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={16} color="#10b981" /> Custom fine-tuned AI models</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={16} color="#10b981" /> Slack & GitHub Integrations</li>
                </ul>
              </div>
              <a href="https://github.com/kartikthhakur07/Orka" target="_blank" rel="noreferrer" className="btn-secondary" style={{ textDecoration: 'none', marginTop: 24, textAlign: 'center' }}>
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-sidebar)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Zap size={16} color="var(--accent-indigo)" />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>ORKA AI Engine v2.0</span>
            <span>· Supernova Hacks</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <a href="https://orka-ten.vercel.app" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Live Frontend</a>
            <a href="https://orkapi.onrender.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Live API</a>
            <a href="https://github.com/kartikthhakur07/Orka" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}