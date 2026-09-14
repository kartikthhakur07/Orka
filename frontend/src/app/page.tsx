'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import Badge from '@/components/Badge'
import {
  Zap, Brain, Flame, Home, Shield, CalendarDays,
  CheckCircle2, ArrowRight, Sparkles, Cpu, Layers,
  TrendingUp, Users, Activity, ChevronRight, Play, RefreshCw, BarChart3, HelpCircle
} from 'lucide-react'

/* ── Interactive Scenario Presets for Sandbox ───────────────────────── */
const PRESETS = [
  { name: 'Optimal Balance', skill: 92, avail: 7.5, load: 30, perf: 95, urg: 40 },
  { name: 'High Burnout Risk', skill: 85, avail: 3.0, load: 88, perf: 78, urg: 90 },
  { name: 'Senior Expert Match', skill: 98, avail: 8.0, load: 45, perf: 98, urg: 60 },
  { name: 'Under-utilized Junior', skill: 60, avail: 8.0, load: 15, perf: 70, urg: 20 },
]

export default function LandingPage() {
  /* Interactive Algorithm State */
  const [skillMatch, setSkillMatch] = useState(92)
  const [availability, setAvailability] = useState(7.5)
  const [workload, setWorkload] = useState(30)
  const [performance, setPerformance] = useState(95)
  const [urgency, setUrgency] = useState(40)

  /* Computed Score Formula */
  const calculatedScore = Math.round(
    (skillMatch * 0.35) +
    ((availability / 8.0) * 100 * 0.25) +
    ((100 - workload) * 0.20) +
    (performance * 0.15) +
    (urgency * 0.05)
  )

  const applyPreset = (p: typeof PRESETS[0]) => {
    setSkillMatch(p.skill)
    setAvailability(p.avail)
    setWorkload(p.load)
    setPerformance(p.perf)
    setUrgency(p.urg)
  }

  /* FAQ Accordion State */
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  /* Pricing State */
  const [isAnnual, setIsAnnual] = useState(true)

  /* ROI Calculator State */
  const [teamSize, setTeamSize] = useState(15)
  const [avgSalary, setAvgSalary] = useState(120000)

  /* ROI Calculations */
  const hoursSavedPerMonth = teamSize * 18
  const hourlyRate = avgSalary / 2080
  const annualSavings = Math.round(hoursSavedPerMonth * hourlyRate * 12)
  const attritionSavings = Math.round(teamSize * 0.12 * (avgSalary * 0.45))
  const totalImpact = annualSavings + attritionSavings

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', overflowX: 'hidden' }}>
      {/* Navbar */}
      <Navbar />

      {/* ── 1. Dribbble-Style Hero Section (AgroControl Style Stage) ───────────── */}
      <section style={{ position: 'relative', padding: 'var(--space-5) var(--space-3) var(--space-6)', maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
        {/* Glow ambient background sphere */}
        <div style={{
          position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(59,130,246,0.06) 50%, transparent 80%)',
          filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Top Pill Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 99, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', marginBottom: 24 }}>
            <Sparkles size={14} color="var(--accent-primary)" />
            <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--accent-primary)', letterSpacing: '0.04em' }}>
              ORKA CONTROL CENTER · PREDICTIVE AI ENGINE v2.0
            </span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'var(--font-3xl)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            maxWidth: 960,
            margin: '0 auto 21px',
          }}>
            Command Engineering Teams with <br />
            <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 50%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Algorithmic Precision & Telemetry
            </span>
          </h1>

          <p style={{
            fontSize: 'var(--font-base)',
            color: 'var(--text-secondary)',
            maxWidth: 720,
            margin: '0 auto 34px',
            lineHeight: 1.6,
          }}>
            Automate task delegation with 5-factor precision, intercept burnout risk 14 days early, enforce policy-compliant WFH scheduling, and shield deadlines from slippage.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 55, flexWrap: 'wrap' }}>
            <Link href="/dashboard" className="btn-primary" style={{ padding: '14px 34px', fontSize: 'var(--font-xs)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              Launch Control Dashboard <ArrowRight size={18} />
            </Link>
            <Link href="/delegator" className="btn-secondary" style={{ padding: '14px 28px', fontSize: 'var(--font-xs)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Play size={15} color="var(--accent-primary)" /> Try Task Delegator
            </Link>
          </div>

          {/* ── Central Dashboard Control Stage Preview (Dribbble AgroControl style) ── */}
          <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto' }}>
            {/* Floating Telemetry Pill Widget 1 (Top Left) */}
            <div className="animate-fade-in-up" style={{
              position: 'absolute', top: -24, left: -20, zIndex: 10,
              padding: '12px 18px', borderRadius: 16,
              background: 'rgba(9, 9, 11, 0.85)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={18} color="#10b981" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>Burnout Risk</p>
                <p style={{ fontSize: 'var(--font-xs)', color: '#10b981', fontWeight: 800 }}>12% · Healthy</p>
              </div>
            </div>

            {/* Floating Telemetry Pill Widget 2 (Top Right) */}
            <div className="animate-fade-in-up" style={{
              position: 'absolute', top: -20, right: -20, zIndex: 10,
              padding: '12px 18px', borderRadius: 16,
              background: 'rgba(9, 9, 11, 0.85)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={18} color="var(--accent-primary)" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>Match Precision</p>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--accent-primary)', fontWeight: 800 }}>98.6% Accuracy</p>
              </div>
            </div>

            {/* Floating Telemetry Pill Widget 3 (Bottom Right) */}
            <div className="animate-fade-in-up" style={{
              position: 'absolute', bottom: -20, right: 30, zIndex: 10,
              padding: '12px 18px', borderRadius: 16,
              background: 'rgba(9, 9, 11, 0.85)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={18} color="#3b82f6" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>Sprint Velocity</p>
                <p style={{ fontSize: 'var(--font-xs)', color: '#3b82f6', fontWeight: 800 }}>+28% Efficiency</p>
              </div>
            </div>

            {/* Main Stage Glass Mockup Frame */}
            <div className="glass-card p-6" style={{
              borderRadius: 24,
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 34px 89px rgba(0, 0, 0, 0.7)',
              background: 'rgba(12, 12, 16, 0.95)'
            }}>
              {/* Window Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, marginBottom: 21, borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                </div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em' }}>
                  ORKA CONTROL CENTER · LIVE AGRO-STYLE MONITOR
                </div>
                <Badge variant="green">LIVE AGENT ACTIVE</Badge>
              </div>

              {/* Stage Content Layout */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, textAlign: 'left' }}>
                <div style={{ padding: '16px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE ENGINEERS</p>
                  <p style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0' }}>14 / 14</p>
                  <Badge variant="blue">100% Online</Badge>
                </div>
                <div style={{ padding: '16px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>DELEGATED TASKS</p>
                  <p style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0' }}>248 Tasks</p>
                  <Badge variant="green">0 Slippage</Badge>
                </div>
                <div style={{ padding: '16px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>COGNITIVE CAPACITY</p>
                  <p style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0' }}>68% Avg</p>
                  <Badge variant="cyan">Optimal Zone</Badge>
                </div>
                <div style={{ padding: '16px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>HYBRID COMPLIANCE</p>
                  <p style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0' }}>100%</p>
                  <Badge variant="purple">Policy Active</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Stat Counter Highlights Ribbon ─────────────────────────────────── */}
      <section style={{ padding: '34px var(--space-4)', background: 'rgba(9, 9, 11, 0.8)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 21, textAlign: 'center' }}>
          <div>
            <p style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: 'var(--accent-primary)', lineHeight: 1 }}>99.2%</p>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: 8, fontWeight: 600 }}>5-Factor Assignment Accuracy</p>
          </div>
          <div>
            <p style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: '#3b82f6', lineHeight: 1 }}>14 Days</p>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: 8, fontWeight: 600 }}>Burnout Early Warning Signal</p>
          </div>
          <div>
            <p style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: '#10b981', lineHeight: 1 }}>&lt; 30ms</p>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: 8, fontWeight: 600 }}>Real-Time Inference Latency</p>
          </div>
          <div>
            <p style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: '#8b5cf6', lineHeight: 1 }}>30 Sec</p>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: 8, fontWeight: 600 }}>Full 2-Week Sprint Generation</p>
          </div>
        </div>
      </section>

      {/* ── 3. Bento Box Feature Matrix (Dribbble Layout) ────────────────────── */}
      <section id="features" style={{ padding: 'var(--space-6) var(--space-4)', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 55 }}>
          <Badge variant="purple" style={{ marginBottom: 12 }}>Architecture</Badge>
          <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
            6 Core Autonomous Modules
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: 'var(--font-base)', maxWidth: 640, margin: '8px auto 0' }}>
            Built as decoupled micro-engines to streamline engineering operations and maximize flow state.
          </p>
        </div>

        {/* Bento Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 21 }}>
          <div className="glass-card p-6 flex flex-col justify-between">
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Brain size={22} />
              </div>
              <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>1. Smart Task Delegator</h3>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Matches incoming features with optimal engineers using a 5-factor weighted algorithm evaluating skills, availability, workload, rating, and urgency.
              </p>
            </div>
            <Link href="/delegator" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: 'var(--accent-primary)', fontWeight: 600, marginTop: 21, textDecoration: 'none' }}>
              Explore Delegator <ChevronRight size={14} />
            </Link>
          </div>

          <div className="glass-card p-6 flex flex-col justify-between">
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Flame size={22} />
              </div>
              <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>2. Burnout Radar</h3>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Monitors stress scores, focus hours, meeting load, and context switches to issue proactive intervention recommendations 2 weeks early.
              </p>
            </div>
            <Link href="/burnout" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#ef4444', fontWeight: 600, marginTop: 21, textDecoration: 'none' }}>
              Open Radar <ChevronRight size={14} />
            </Link>
          </div>

          <div className="glass-card p-6 flex flex-col justify-between">
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Home size={22} />
              </div>
              <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>3. WFH Decider</h3>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Automates hybrid remote work approvals by assessing commute, deep focus requirements, and policy constraints for optimal productivity.
              </p>
            </div>
            <Link href="/wfh" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#10b981', fontWeight: 600, marginTop: 21, textDecoration: 'none' }}>
              Check WFH Engine <ChevronRight size={14} />
            </Link>
          </div>

          <div className="glass-card p-6 flex flex-col justify-between">
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Shield size={22} />
              </div>
              <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>4. Deadline Shield</h3>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Calculates real-time project slippage risk percentages and forecasts velocity gaps before milestones are breached.
              </p>
            </div>
            <Link href="/deadline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#3b82f6', fontWeight: 600, marginTop: 21, textDecoration: 'none' }}>
              View Shield Telemetry <ChevronRight size={14} />
            </Link>
          </div>

          <div className="glass-card p-6 flex flex-col justify-between">
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Cpu size={22} />
              </div>
              <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>5. AI Copilot Chat</h3>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Natural language query assistant providing instant answers regarding team capacity, project risks, and optimal task assignments.
              </p>
            </div>
            <Link href="/copilot" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#8b5cf6', fontWeight: 600, marginTop: 21, textDecoration: 'none' }}>
              Talk to Copilot <ChevronRight size={14} />
            </Link>
          </div>

          <div className="glass-card p-6 flex flex-col justify-between">
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <CalendarDays size={22} />
              </div>
              <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>6. Auto Sprint Planner</h3>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Generates balanced 2-week sprint schedules in 30 seconds respecting daily developer capacity and specialization.
              </p>
            </div>
            <Link href="/sprint" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#06b6d4', fontWeight: 600, marginTop: 21, textDecoration: 'none' }}>
              Schedule Sprint <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. Interactive Live Sandbox & 5-Factor Score Visualizer ───────────── */}
      <section id="algorithm" style={{ padding: 'var(--space-6) var(--space-4)', background: 'rgba(9, 9, 11, 0.6)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 34 }}>
            <Badge variant="blue" style={{ marginBottom: 12 }}>Interactive Sandbox</Badge>
            <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
              Live 5-Factor Scoring Simulator
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: 'var(--font-base)' }}>
              Test presets or adjust parameters to see how ORKA computes optimal assignment scores in real-time.
            </p>

            {/* Presets Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 21, flexWrap: 'wrap' }}>
              {PRESETS.map(p => (
                <button
                  key={p.name}
                  className="btn-secondary"
                  onClick={() => applyPreset(p)}
                  style={{ padding: '8px 16px', fontSize: 'var(--font-xs)', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <RefreshCw size={12} /> {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Golden Grid Sandbox Card */}
          <div className="glass-card p-8 golden-grid" style={{ alignItems: 'center' }}>
            {/* Sliders Column (61.8%) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 21 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', fontWeight: 600, marginBottom: 8 }}>
                  <span>1. Skill Match Weight (35%)</span>
                  <span style={{ color: 'var(--accent-primary)' }}>{skillMatch}%</span>
                </div>
                <input type="range" min="0" max="100" value={skillMatch} onChange={e => setSkillMatch(Number(e.target.value))} style={{ accentColor: 'var(--accent-primary)' }} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', fontWeight: 600, marginBottom: 8 }}>
                  <span>2. Available Hours (25%)</span>
                  <span style={{ color: '#3b82f6' }}>{availability}h / 8.0h</span>
                </div>
                <input type="range" min="0" max="8" step="0.5" value={availability} onChange={e => setAvailability(Number(e.target.value))} style={{ accentColor: '#3b82f6' }} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', fontWeight: 600, marginBottom: 8 }}>
                  <span>3. Workload Inverse (20%)</span>
                  <span style={{ color: '#06b6d4' }}>{workload}% load ({100 - workload}% free capacity)</span>
                </div>
                <input type="range" min="0" max="100" value={workload} onChange={e => setWorkload(Number(e.target.value))} style={{ accentColor: '#06b6d4' }} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', fontWeight: 600, marginBottom: 8 }}>
                  <span>4. Performance Telemetry (15%)</span>
                  <span style={{ color: '#10b981' }}>{performance} / 100</span>
                </div>
                <input type="range" min="0" max="100" value={performance} onChange={e => setPerformance(Number(e.target.value))} style={{ accentColor: '#10b981' }} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', fontWeight: 600, marginBottom: 8 }}>
                  <span>5. Deadline Urgency (5%)</span>
                  <span style={{ color: '#f59e0b' }}>{urgency}%</span>
                </div>
                <input type="range" min="0" max="100" value={urgency} onChange={e => setUrgency(Number(e.target.value))} style={{ accentColor: '#f59e0b' }} />
              </div>
            </div>

            {/* Score Output Column (38.2%) */}
            <div style={{
              textAlign: 'center', background: 'rgba(9, 9, 11, 0.9)', padding: 34,
              borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)'
            }}>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Computed Match Score
              </p>
              <div style={{
                fontSize: 'var(--font-3xl)', fontWeight: 900,
                color: calculatedScore >= 75 ? '#10b981' : calculatedScore >= 50 ? '#f59e0b' : '#ef4444',
                margin: '12px 0'
              }}>
                {calculatedScore}
              </div>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginBottom: 21, lineHeight: 1.5 }}>
                {calculatedScore >= 75
                  ? '⚡ Ideal Match — Safe for auto-delegation'
                  : calculatedScore >= 50
                  ? '⚠️ Moderate Fit — Requires capacity monitor'
                  : '🛑 Overload Risk — Reassign to avoid burnout'}
              </p>
              <Link href="/delegator" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', fontSize: 'var(--font-xs)' }}>
                Test Live Delegator Engine
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Interactive ROI & Cost Savings Calculator Section (#roi) ───────── */}
      <section id="roi" style={{ padding: 'var(--space-6) var(--space-4)', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 42 }}>
          <Badge variant="indigo" style={{ marginBottom: 12 }}>ROI Calculator</Badge>
          <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
            Calculate Your Team's Productivity Gains
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: 'var(--font-base)', maxWidth: 620, margin: '8px auto 0' }}>
            Quantify reclaimed developer focus hours and burnout attrition savings with ORKA v2.0 AI.
          </p>
        </div>

        <div className="glass-card p-8 golden-grid" style={{ alignItems: 'center' }}>
          {/* Controls Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-sm)', fontWeight: 600, marginBottom: 10 }}>
                <span>Engineering Team Size</span>
                <span style={{ color: 'var(--accent-indigo)', fontWeight: 800 }}>{teamSize} Engineers</span>
              </div>
              <input
                type="range" min="5" max="150" step="5"
                value={teamSize}
                onChange={e => setTeamSize(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-indigo)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-sm)', fontWeight: 600, marginBottom: 10 }}>
                <span>Average Engineer Salary</span>
                <span style={{ color: '#3b82f6', fontWeight: 800 }}>${avgSalary.toLocaleString()} / year</span>
              </div>
              <input
                type="range" min="60000" max="220000" step="5000"
                value={avgSalary}
                onChange={e => setAvgSalary(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#3b82f6' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, paddingTop: 10 }}>
              <div style={{ padding: 16, borderRadius: 12, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>Reclaimed Focus Hours</p>
                <p style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: 'var(--accent-indigo)', marginTop: 4 }}>
                  {hoursSavedPerMonth.toLocaleString()} hrs / mo
                </p>
              </div>
              <div style={{ padding: 16, borderRadius: 12, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>Burnout Reduction</p>
                <p style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: '#10b981', marginTop: 4 }}>
                  -64% Attrition
                </p>
              </div>
            </div>
          </div>

          {/* ROI Metric Highlight Column */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(99,102,241,0.15) 0%, rgba(9,9,11,0.95) 100%)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 20,
            padding: 34,
            textAlign: 'center'
          }}>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Estimated Annual Economic Impact
            </p>
            <div style={{
              fontSize: 'var(--font-3xl)', fontWeight: 900, color: '#10b981', margin: '14px 0 6px',
              letterSpacing: '-0.02em'
            }}>
              ${totalImpact.toLocaleString()}
            </div>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginBottom: 24 }}>
              Includes ${annualSavings.toLocaleString()} in reclaimed dev hours + ${attritionSavings.toLocaleString()} in prevented turnover costs.
            </p>
            <Link href="/dashboard" className="btn-primary" style={{ width: '100%', textDecoration: 'none', padding: '14px' }}>
              Unlock Productivity Gains Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. Figma-Make Styled Pricing Section (#pricing) ─────────────────── */}
      <section id="pricing" style={{ padding: 'var(--space-6) var(--space-4)', background: 'rgba(9, 9, 11, 0.7)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Pricing Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Badge variant="cobalt" style={{ marginBottom: 12 }}>Transparent Pricing</Badge>
            <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
              Plans Built to Scale with Your Engineering
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: 'var(--font-base)', maxWidth: 640, margin: '8px auto 0' }}>
              Start for free with basic delegation, or unlock advanced burnout telemetry & automated WFH deciders.
            </p>

            {/* Monthly / Annual Toggle Switch */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginTop: 28, background: 'rgba(255,255,255,0.04)', padding: '6px 10px', borderRadius: 99, border: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => setIsAnnual(false)}
                style={{
                  padding: '8px 20px', borderRadius: 99, border: 'none',
                  background: !isAnnual ? 'var(--accent-indigo)' : 'transparent',
                  color: !isAnnual ? '#fff' : 'var(--text-muted)',
                  fontSize: 'var(--font-xs)', fontWeight: 700, cursor: 'pointer', transition: 'all 200ms'
                }}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                style={{
                  padding: '8px 20px', borderRadius: 99, border: 'none',
                  background: isAnnual ? 'var(--accent-indigo)' : 'transparent',
                  color: isAnnual ? '#fff' : 'var(--text-muted)',
                  fontSize: 'var(--font-xs)', fontWeight: 700, cursor: 'pointer', transition: 'all 200ms',
                  display: 'flex', alignItems: 'center', gap: 8
                }}
              >
                Annual Billing
                <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: 99, background: '#10b981', color: '#000', fontWeight: 800 }}>
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>

              {/* 3 Pricing Tier Cards (Figma Make Layout) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'stretch' }}>
            {/* Starter Tier */}
            <div className="glass-card p-8 flex flex-col justify-between" style={{ borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: 'var(--text-primary)' }}>Starter</h3>
                  <Badge variant="gray">Free Tier</Badge>
                </div>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginBottom: 24, minHeight: 36 }}>
                  Perfect for small teams & side projects looking for smart delegation.
                </p>
                <div style={{ marginBottom: 28 }}>
                  <span style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: 'var(--text-primary)' }}>$0</span>
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}> / free forever</span>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    'Up to 5 Team Members',
                    'Basic Task Delegation',
                    'Standard Analytics & Metrics',
                    'Auto Sprint Schedule Generator',
                    'IBM HR Dataset Integration',
                    'Community Discord Support'
                  ].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={16} color="#10b981" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/dashboard" className="btn-secondary" style={{ width: '100%', marginTop: 32, textDecoration: 'none', textAlign: 'center' }}>
                Get Started Free
              </Link>
            </div>

            {/* Pro Scale Tier (HIGHEST MATCH FIGMA MAKE CARD) */}
            <div className="glass-card p-8 flex flex-col justify-between" style={{
              borderRadius: 24,
              border: '2px solid #16a34a',
              boxShadow: '0 0 34px rgba(22, 163, 74, 0.25)',
              position: 'relative',
              background: 'linear-gradient(180deg, rgba(22, 163, 74, 0.08) 0%, rgba(12, 12, 16, 0.95) 100%)'
            }}>
              {/* Floating Most Popular Badge */}
              <div style={{
                position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                color: '#fff', fontSize: 'var(--font-xs)', fontWeight: 800, padding: '4px 16px', borderRadius: 99,
                letterSpacing: '0.06em', boxShadow: '0 4px 14px rgba(22,163,74,0.5)'
              }}>
                MOST POPULAR
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 4 }}>
                  <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: 'var(--text-primary)' }}>Pro</h3>
                  <Badge variant="green">Growth</Badge>
                </div>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginBottom: 24, minHeight: 36 }}>
                  For growing engineering teams that need workload automation & early burnout signals.
                </p>
                <div style={{ marginBottom: 28 }}>
                  <span style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: 'var(--text-primary)' }}>
                    {isAnnual ? '$24' : '$29'}
                  </span>
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}> / month</span>
                  {isAnnual && <p style={{ fontSize: '11px', color: '#10b981', marginTop: 4, fontWeight: 600 }}>Billed annually ($288/yr)</p>}
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    'Up to 25 Team Members',
                    'AI Workload & Burnout Radar (14-Day Warning)',
                    'Advanced 5-Factor Delegator with Live Weights',
                    'Automated WFH Policy Decider',
                    'Deadline Shield & Velocity Forecast',
                    'Unlimited Integrations & Webhooks',
                    'Priority Email & Slack Support'
                  ].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--font-xs)', color: 'var(--text-primary)', fontWeight: 500 }}>
                      <CheckCircle2 size={16} color="#16a34a" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/dashboard" className="btn-primary" style={{ width: '100%', marginTop: 32, textDecoration: 'none', padding: '14px', fontSize: 'var(--font-xs)', background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)' }}>
                Start 14-Day Free Trial <ArrowRight size={16} />
              </Link>
            </div>

            {/* Enterprise Tier */}
            <div className="glass-card p-8 flex flex-col justify-between" style={{ borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: 'var(--text-primary)' }}>Enterprise</h3>
                  <Badge variant="purple">Custom AI</Badge>
                </div>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginBottom: 24, minHeight: 36 }}>
                  For large orgs needing compliance, SSO, SAML 2.0, audit logs, and dedicated SLAs.
                </p>
                <div style={{ marginBottom: 28 }}>
                  <span style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: 'var(--text-primary)' }}>Custom</span>
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}> / contact sales</span>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 4 }}>Custom volume licensing available</p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    'Unlimited Team Members',
                    'Guaranteed Compliance, SSO & SAML 2.0',
                    'Audit-Ready Event & Security Logs',
                    'Dedicated Customer Success Manager (CSM)',
                    'Custom Uptime SLA & Private Deployment',
                    'On-Premise / Private Cloud Hosting'
                  ].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={16} color="#8b5cf6" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a href="mailto:enterprise@orka.ai" className="btn-secondary" style={{ width: '100%', marginTop: 32, textDecoration: 'none', textAlign: 'center' }}>
                Contact Sales
              </a>
            </div>
          </div>

          {/* Detailed Feature Comparison Table */}
          <div style={{ marginTop: 64 }}>
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: 'var(--text-primary)', textAlign: 'center', marginBottom: 24 }}>
              Feature Breakdown Comparison
            </h3>

            <div className="glass-card" style={{ overflowX: 'auto', borderRadius: 16 }}>
              <table className="orka-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ width: '40%' }}>Core Capabilities</th>
                    <th style={{ width: '20%', textAlign: 'center' }}>Starter ($0)</th>
                    <th style={{ width: '20%', textAlign: 'center', color: 'var(--accent-indigo)' }}>Pro Scale ($39)</th>
                    <th style={{ width: '20%', textAlign: 'center' }}>Enterprise ($159)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { f: '5-Factor Task Delegator', s: 'Basic', p: 'Advanced Live Weights', e: 'Custom ML Models' },
                    { f: 'Team Size Limit', s: '5 Members', p: 'Unlimited', e: 'Unlimited' },
                    { f: 'Burnout Radar Interception', s: '—', p: '14-Day Warning', e: 'Real-time Telemetry' },
                    { f: 'WFH Decider Engine', s: 'Manual Rule', p: 'Automated AI', e: 'Custom Policy Rules' },
                    { f: 'Deadline Risk Shield', s: 'Basic Alerts', p: 'Full Velocity Forecast', e: 'Predictive Slippage SLA' },
                    { f: 'AI Copilot Assistant', s: '10 Queries / mo', p: 'Unlimited Queries', e: 'Unlimited + Custom KB' },
                    { f: 'IBM HR Dataset Sync', s: 'Included', p: 'Included', p2: 'Custom HRIS API' },
                    { f: 'Support SLA', s: 'Community', p: '24/7 Priority', e: 'Dedicated Success Mgr' },
                  ].map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.f}</td>
                      <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{row.s}</td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--accent-indigo)' }}>{row.p}</td>
                      <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{row.e || row.p2 || row.p}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FAQ Section ─────────────────────────────────────────────────── */}
      <section style={{ padding: 'var(--space-6) var(--space-4)', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 34 }}>
          <Badge variant="cyan" style={{ marginBottom: 12 }}>Knowledge</Badge>
          <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
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
              style={{ cursor: 'pointer', transition: 'all 200ms' }}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <HelpCircle size={16} color="var(--accent-primary)" /> {item.q}
                </h3>
                <ChevronRight size={18} color="var(--text-muted)" style={{ transform: openFaq === i ? 'rotate(90deg)' : 'none', transition: 'transform 200ms' }} />
              </div>
              {openFaq === i && (
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: 14, lineHeight: 1.6, paddingLeft: 26 }}>
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. Footer ───────────────────────────────────────────────────────── */}
      <footer style={{ padding: 'var(--space-5) var(--space-4)', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-sidebar)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--font-xs)', color: 'var(--text-muted)', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Zap size={18} color="var(--accent-primary)" />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>ORKA AI Engine v2.0</span>
            <span>· Next-Gen Engineering Telemetry</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 21 }}>
            <a href="https://orka-ten.vercel.app" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Live App</a>
            <a href="https://orkapi.onrender.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>API Telemetry</a>
            <a href="https://github.com/kartikthhakur07/Orka" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>GitHub Repo</a>
          </div>
        </div>
      </footer>
    </div>
  )
}