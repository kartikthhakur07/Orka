'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Badge } from '@/components/Badge'
import {
  Brain, Flame, Home, Shield, CalendarDays,
  CheckCircle2, ArrowRight, Sparkles, Cpu,
  TrendingUp, Users, Activity, ChevronRight, Play, RefreshCw, HelpCircle
} from 'lucide-react'

/* ── Interactive Scenario Presets for Sandbox ───────────────────────── */
const PRESETS = [
  { name: 'Optimal Balance', skill: 95, avail: 7.5, load: 30, perf: 95, urg: 40 },
  { name: 'High Burnout Risk', skill: 85, avail: 3.0, load: 88, perf: 78, urg: 90 },
  { name: 'Senior Expert Match', skill: 98, avail: 8.0, load: 45, perf: 98, urg: 60 },
  { name: 'Under-utilized Junior', skill: 60, avail: 8.0, load: 15, perf: 70, urg: 20 },
]

export default function LandingPage() {
  /* Interactive Algorithm State */
  const [skillMatch, setSkillMatch] = useState(95)
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

  /* Pricing State */
  const [isAnnual, setIsAnnual] = useState(true)

  /* ROI Calculator State */
  const [teamSize, setTeamSize] = useState(15)
  const [avgSalary, setAvgSalary] = useState(120000)

  /* FAQ Accordion State */
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  /* ROI Calculations */
  const hoursSavedPerMonth = teamSize * 18
  const hourlyRate = avgSalary / 2080
  const annualSavings = Math.round(hoursSavedPerMonth * hourlyRate * 12)
  const attritionSavings = Math.round(teamSize * 0.12 * (avgSalary * 0.45))
  const totalImpact = annualSavings + attritionSavings

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', overflowX: 'hidden' }}>
      {/* Sticky Header Navbar */}
      <Navbar />

      {/* ── 1. Hero Section (Bright Swiss Green Stance) ────────────────────── */}
      <section style={{ position: 'relative', padding: 'var(--space-5) var(--space-4) var(--space-6)', maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Top Live Pill Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 99, background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: 24 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
            <span style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: '#15803d', letterSpacing: '0.02em' }}>
              with real-time burnout prediction
            </span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'var(--font-3xl)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: '#0f172a',
            maxWidth: 960,
            margin: '0 auto 21px',
          }}>
            AI Decision Engine for <br />
            <span style={{ color: '#16a34a' }}>
              Modern Engineering Teams
            </span>
          </h1>

          <p style={{
            fontSize: 'var(--font-base)',
            color: '#475569',
            maxWidth: 720,
            margin: '0 auto 34px',
            lineHeight: 1.6,
          }}>
            Automate task delegation with 5-factor precision, predict burnout 14 days early, and run sprint planning in 30 seconds. Built for engineering teams.
          </p>

          {/* Hero CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 52, flexWrap: 'wrap' }}>
            <Link href="/dashboard" className="btn-primary" style={{ padding: '14px 34px', fontSize: 'var(--font-xs)', borderRadius: 12 }}>
              Try the dashboard <ArrowRight size={16} />
            </Link>
            <Link href="/delegator" className="btn-secondary" style={{ padding: '14px 28px', fontSize: 'var(--font-xs)', borderRadius: 12 }}>
              <Play size={15} color="#16a34a" /> Watch 2-min demo
            </Link>
          </div>

          {/* 4 Metric Boxes Bar (Figma Make Layout) */}
          <div style={{
            maxWidth: 1040, margin: '0 auto 55px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
            background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 20, padding: 20, boxShadow: 'var(--shadow-card)'
          }}>
            <div>
              <p style={{ fontSize: 'var(--font-lg)', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>4.9 / 5.0</p>
              <p style={{ fontSize: 'var(--font-xs)', color: '#64748b', marginTop: 6, fontWeight: 600 }}>Rating across 200+ reviews</p>
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-lg)', fontWeight: 900, color: '#16a34a', lineHeight: 1 }}>14 Days</p>
              <p style={{ fontSize: 'var(--font-xs)', color: '#64748b', marginTop: 6, fontWeight: 600 }}>Early burnout detection</p>
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-lg)', fontWeight: 900, color: '#2563eb', lineHeight: 1 }}>30 Sec</p>
              <p style={{ fontSize: 'var(--font-xs)', color: '#64748b', marginTop: 6, fontWeight: 600 }}>Average sprint planning</p>
            </div>
            <div>
              <p style={{ fontSize: 'var(--font-lg)', fontWeight: 900, color: '#7c3aed', lineHeight: 1 }}>99.9%</p>
              <p style={{ fontSize: 'var(--font-xs)', color: '#64748b', marginTop: 6, fontWeight: 600 }}>Uptime SLA guaranteed</p>
            </div>
          </div>

          {/* ── Central Dashboard Control Stage Preview Mockup ── */}
          <div style={{ position: 'relative', maxWidth: 1040, margin: '0 auto' }}>
            <div className="glass-card p-6" style={{
              borderRadius: 24,
              border: '1px solid #cbd5e1',
              boxShadow: '0 24px 64px rgba(15, 23, 42, 0.12)',
              background: '#ffffff',
              textAlign: 'left'
            }}>
              {/* Mockup Header Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, marginBottom: 20, borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
                </div>
                <div style={{ fontSize: 'var(--font-xs)', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>
                  ORKA CONTROL CENTER · SPRINT 47 OVERVIEW
                </div>
                <Badge variant="green">Sprint On Track</Badge>
              </div>

              {/* Mockup Content Grid */}
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

      {/* ── 2. 6-Feature Bento Grid (#features) ────────────────────────────── */}
      <section id="features" style={{ padding: 'var(--space-6) var(--space-4)', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Badge variant="green" style={{ marginBottom: 12 }}>Architecture</Badge>
          <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: '#0f172a' }}>
            6 Core Autonomous Modules
          </h2>
          <p style={{ color: '#64748b', marginTop: 8, fontSize: 'var(--font-base)', maxWidth: 640, margin: '8px auto 0' }}>
            Built as decoupled micro-engines to streamline engineering operations and maximize flow state.
          </p>
        </div>

        {/* Bento Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          <div className="glass-card p-6 flex flex-col justify-between" style={{ borderRadius: 20 }}>
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Brain size={22} />
              </div>
              <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>1. Intelligent Task Delegation</h3>
              <p style={{ fontSize: 'var(--font-xs)', color: '#475569', lineHeight: 1.6 }}>
                Automatically assigns tasks to team members based on skills, current workload, historical velocity, and availability.
              </p>
            </div>
            <Link href="/delegator" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#16a34a', fontWeight: 700, marginTop: 20, textDecoration: 'none' }}>
              Explore Delegator <ChevronRight size={14} />
            </Link>
          </div>

          <div className="glass-card p-6 flex flex-col justify-between" style={{ borderRadius: 20 }}>
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Flame size={22} />
              </div>
              <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>2. Early Burnout Detection</h3>
              <p style={{ fontSize: 'var(--font-xs)', color: '#475569', lineHeight: 1.6 }}>
                Surfaces pressure signals 14 days early before engineers burn out or experience cognitive overload.
              </p>
            </div>
            <Link href="/burnout" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#dc2626', fontWeight: 700, marginTop: 20, textDecoration: 'none' }}>
              Open Burnout Radar <ChevronRight size={14} />
            </Link>
          </div>

          <div className="glass-card p-6 flex flex-col justify-between" style={{ borderRadius: 20 }}>
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f0fdfa', color: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Home size={22} />
              </div>
              <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>3. WFH Decider Engine</h3>
              <p style={{ fontSize: 'var(--font-xs)', color: '#475569', lineHeight: 1.6 }}>
                Automates hybrid remote work approvals by assessing commute times, deep focus tasks, and team policy constraints.
              </p>
            </div>
            <Link href="/wfh" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#0f766e', fontWeight: 700, marginTop: 20, textDecoration: 'none' }}>
              Check WFH Engine <ChevronRight size={14} />
            </Link>
          </div>

          <div className="glass-card p-6 flex flex-col justify-between" style={{ borderRadius: 20 }}>
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Shield size={22} />
              </div>
              <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>4. Sprint Velocity Forecasting</h3>
              <p style={{ fontSize: 'var(--font-xs)', color: '#475569', lineHeight: 1.6 }}>
                Visualizes sprint velocity, burndown curves, and cycle time with historical AI forecasting to shield deadlines.
              </p>
            </div>
            <Link href="/deadline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#2563eb', fontWeight: 700, marginTop: 20, textDecoration: 'none' }}>
              View Velocity Forecast <ChevronRight size={14} />
            </Link>
          </div>

          <div className="glass-card p-6 flex flex-col justify-between" style={{ borderRadius: 20 }}>
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Cpu size={22} />
              </div>
              <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>5. AI Copilot Chat Assistant</h3>
              <p style={{ fontSize: 'var(--font-xs)', color: '#475569', lineHeight: 1.6 }}>
                Natural language query assistant providing instant answers regarding team capacity, project risks, and optimal assignments.
              </p>
            </div>
            <Link href="/copilot" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#7c3aed', fontWeight: 700, marginTop: 20, textDecoration: 'none' }}>
              Talk to Copilot <ChevronRight size={14} />
            </Link>
          </div>

          <div className="glass-card p-6 flex flex-col justify-between" style={{ borderRadius: 20 }}>
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fffbeb', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <CalendarDays size={22} />
              </div>
              <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>6. Automated Sprint Schedule</h3>
              <p style={{ fontSize: 'var(--font-xs)', color: '#475569', lineHeight: 1.6 }}>
                Generates balanced 2-week sprint schedules in 30 seconds respecting daily developer capacity and specialization.
              </p>
            </div>
            <Link href="/sprint" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--font-xs)', color: '#b45309', fontWeight: 700, marginTop: 20, textDecoration: 'none' }}>
              Schedule Sprint <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. Algorithm 5-Factor Scoring Simulator (#algorithm) ─────────────── */}
      <section id="algorithm" style={{ padding: 'var(--space-6) var(--space-4)', background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 34 }}>
            <Badge variant="green" style={{ marginBottom: 12 }}>Math Engine</Badge>
            <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: '#0f172a' }}>
              Every assignment backed by real math
            </h2>
            <p style={{ color: '#64748b', marginTop: 8, fontSize: 'var(--font-base)' }}>
              Test presets or adjust parameters to see how ORKA computes candidate match scores for Task #ORK-2847.
            </p>

            {/* Presets Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
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

          {/* Candidate Evaluation Grid */}
          <div className="glass-card p-8 golden-grid" style={{ alignItems: 'center', borderRadius: 24 }}>
            {/* Sliders Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', fontWeight: 600, marginBottom: 6 }}>
                  <span>1. Skill Match Weight (35%)</span>
                  <span style={{ color: '#16a34a', fontWeight: 800 }}>{skillMatch}%</span>
                </div>
                <input type="range" min="0" max="100" value={skillMatch} onChange={e => setSkillMatch(Number(e.target.value))} style={{ width: '100%', accentColor: '#16a34a' }} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', fontWeight: 600, marginBottom: 6 }}>
                  <span>2. Available Hours (25%)</span>
                  <span style={{ color: '#2563eb', fontWeight: 800 }}>{availability}h / 8.0h</span>
                </div>
                <input type="range" min="0" max="8" step="0.5" value={availability} onChange={e => setAvailability(Number(e.target.value))} style={{ width: '100%', accentColor: '#2563eb' }} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', fontWeight: 600, marginBottom: 6 }}>
                  <span>3. Workload Inverse (20%)</span>
                  <span style={{ color: '#0f766e', fontWeight: 800 }}>{workload}% load ({100 - workload}% capacity)</span>
                </div>
                <input type="range" min="0" max="100" value={workload} onChange={e => setWorkload(Number(e.target.value))} style={{ width: '100%', accentColor: '#0f766e' }} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', fontWeight: 600, marginBottom: 6 }}>
                  <span>4. Performance Telemetry (15%)</span>
                  <span style={{ color: '#7c3aed', fontWeight: 800 }}>{performance} / 100</span>
                </div>
                <input type="range" min="0" max="100" value={performance} onChange={e => setPerformance(Number(e.target.value))} style={{ width: '100%', accentColor: '#7c3aed' }} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', fontWeight: 600, marginBottom: 6 }}>
                  <span>5. Deadline Urgency (5%)</span>
                  <span style={{ color: '#b45309', fontWeight: 800 }}>{urgency}%</span>
                </div>
                <input type="range" min="0" max="100" value={urgency} onChange={e => setUrgency(Number(e.target.value))} style={{ width: '100%', accentColor: '#b45309' }} />
              </div>
            </div>

            {/* Candidate Match Box (Figma Make Spec) */}
            <div style={{
              textAlign: 'center', background: '#0f172a', color: '#ffffff', padding: 28,
              borderRadius: 20, boxShadow: '0 12px 30px rgba(15,23,42,0.2)'
            }}>
              <p style={{ fontSize: 'var(--font-xs)', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Task #ORK-2847 Match Result
              </p>
              <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: '#4ade80', margin: '8px 0 2px' }}>
                Priya Sharma
              </div>
              <p style={{ fontSize: 'var(--font-xs)', color: '#94a3b8', marginBottom: 16 }}>
                Score: <span style={{ color: '#4ade80', fontWeight: 800 }}>{calculatedScore}</span> / 100 (Recommended Fit)
              </p>
              <Link href="/delegator" className="btn-primary" style={{ width: '100%', textDecoration: 'none', background: '#16a34a', padding: '12px', fontSize: 'var(--font-xs)' }}>
                Delegate to Priya
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. ROI & Impact Calculator Section (#roi) ───────────────────────── */}
      <section id="roi" style={{ padding: 'var(--space-6) var(--space-4)', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 42 }}>
          <Badge variant="indigo" style={{ marginBottom: 12 }}>ROI Calculator</Badge>
          <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: '#0f172a' }}>
            Calculate Your Team's Productivity Gains
          </h2>
          <p style={{ color: '#64748b', marginTop: 8, fontSize: 'var(--font-base)', maxWidth: 620, margin: '8px auto 0' }}>
            Quantify reclaimed developer focus hours and burnout attrition savings with ORKA v2.0 AI.
          </p>
        </div>

        <div className="glass-card p-8 golden-grid" style={{ alignItems: 'center', borderRadius: 24 }}>
          {/* Controls Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-sm)', fontWeight: 600, marginBottom: 8 }}>
                <span>Engineering Team Size</span>
                <span style={{ color: '#16a34a', fontWeight: 800 }}>{teamSize} Engineers</span>
              </div>
              <input
                type="range" min="5" max="150" step="5"
                value={teamSize}
                onChange={e => setTeamSize(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#16a34a' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-sm)', fontWeight: 600, marginBottom: 8 }}>
                <span>Average Engineer Salary</span>
                <span style={{ color: '#2563eb', fontWeight: 800 }}>${avgSalary.toLocaleString()} / year</span>
              </div>
              <input
                type="range" min="60000" max="220000" step="5000"
                value={avgSalary}
                onChange={e => setAvgSalary(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#2563eb' }}
              />
            </div>
          </div>

          {/* ROI Metric Highlight Column */}
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
            border: '2px solid #bbf7d0',
            borderRadius: 20,
            padding: 28,
            textAlign: 'center'
          }}>
            <p style={{ fontSize: 'var(--font-xs)', color: '#64748b', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Estimated Annual Economic Impact
            </p>
            <div style={{ fontSize: 'var(--font-3xl)', fontWeight: 900, color: '#16a34a', margin: '10px 0 4px', letterSpacing: '-0.02em' }}>
              ${totalImpact.toLocaleString()}
            </div>
            <p style={{ fontSize: 'var(--font-xs)', color: '#475569', marginBottom: 20 }}>
              Includes ${annualSavings.toLocaleString()} in reclaimed dev hours + ${attritionSavings.toLocaleString()} in prevented turnover costs.
            </p>
            <Link href="/dashboard" className="btn-primary" style={{ width: '100%', textDecoration: 'none', padding: '12px' }}>
              Unlock Productivity Gains Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Pricing Section (#pricing) (Figma Make Exact Layout) ─────────── */}
      <section id="pricing" style={{ padding: 'var(--space-6) var(--space-4)', background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Pricing Header */}
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <Badge variant="blue" style={{ marginBottom: 12 }}>Transparent Pricing</Badge>
            <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: '#0f172a' }}>
              Plans Built to Scale with Your Engineering
            </h2>
            <p style={{ color: '#64748b', marginTop: 8, fontSize: 'var(--font-base)', maxWidth: 640, margin: '8px auto 0' }}>
              Start for free with basic delegation, or unlock advanced burnout telemetry & automated WFH deciders.
            </p>

            {/* Monthly / Annual Toggle Switch */}
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
                  -20%
                </span>
              </button>
            </div>
          </div>

          {/* 3 Pricing Tier Cards (Figma Make Layout) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'stretch' }}>
            {/* Starter Tier */}
            <div className="glass-card p-8 flex flex-col justify-between" style={{ borderRadius: 24, border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#0f172a' }}>Starter</h3>
                  <Badge variant="gray">Free Tier</Badge>
                </div>
                <p style={{ fontSize: 'var(--font-xs)', color: '#64748b', marginBottom: 24, minHeight: 36 }}>
                  Perfect for small teams & side projects looking for smart delegation.
                </p>
                <div style={{ marginBottom: 28 }}>
                  <span style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: '#0f172a' }}>$0</span>
                  <span style={{ fontSize: 'var(--font-xs)', color: '#64748b' }}> / month</span>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    'Up to 5 team members',
                    'Basic task delegation',
                    'Standard analytics & metrics',
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

            {/* Pro Tier (HIGHEST MATCH FIGMA MAKE CARD) */}
            <div className="glass-card p-8 flex flex-col justify-between" style={{
              borderRadius: 24,
              border: '2px solid #16a34a',
              boxShadow: 'var(--shadow-green-glow)',
              position: 'relative',
              background: '#f0fdf4'
            }}>
              {/* Floating Most Popular Badge */}
              <div style={{
                position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                background: '#ffffff', color: '#15803d', fontSize: 'var(--font-xs)', fontWeight: 800, padding: '4px 16px', borderRadius: 99,
                border: '1px solid #bbf7d0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}>
                Most popular
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 4 }}>
                  <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#0f172a' }}>Pro</h3>
                  <Badge variant="green">Growth</Badge>
                </div>
                <p style={{ fontSize: 'var(--font-xs)', color: '#15803d', marginBottom: 24, minHeight: 36 }}>
                  For growing engineering teams that need workload automation & early burnout signals.
                </p>
                <div style={{ marginBottom: 28 }}>
                  <span style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: '#0f172a' }}>
                    {isAnnual ? '$24' : '$29'}
                  </span>
                  <span style={{ fontSize: 'var(--font-xs)', color: '#64748b' }}> / month</span>
                  {isAnnual && <p style={{ fontSize: '11px', color: '#16a34a', marginTop: 4, fontWeight: 700 }}>Billed annually ($288/yr)</p>}
                </div>

                <div style={{ borderTop: '1px solid #bbf7d0', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    'Up to 25 team members',
                    'AI workload & burnout radar (14-day warning)',
                    'Advanced 5-factor delegator with live weights',
                    'Unlimited integrations & webhooks',
                    'Priority email & Slack support'
                  ].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--font-xs)', color: '#0f172a', fontWeight: 600 }}>
                      <CheckCircle2 size={16} color="#16a34a" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/dashboard" className="btn-primary" style={{ width: '100%', marginTop: 32, textDecoration: 'none', padding: '14px', fontSize: 'var(--font-xs)', background: '#16a34a' }}>
                Get started
              </Link>
            </div>

            {/* Enterprise Tier */}
            <div className="glass-card p-8 flex flex-col justify-between" style={{ borderRadius: 24, border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#0f172a' }}>Enterprise</h3>
                  <Badge variant="purple">Custom AI</Badge>
                </div>
                <p style={{ fontSize: 'var(--font-xs)', color: '#64748b', marginBottom: 24, minHeight: 36 }}>
                  For large orgs needing compliance, SSO, SAML 2.0, audit logs, and dedicated SLAs.
                </p>
                <div style={{ marginBottom: 28 }}>
                  <span style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: '#0f172a' }}>Custom</span>
                  <span style={{ fontSize: 'var(--font-xs)', color: '#64748b' }}> / contact sales</span>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    'Unlimited team members',
                    'Guaranteed compliance, SSO & SAML 2.0',
                    'Audit-ready event & security logs',
                    'Dedicated Customer Success Manager (CSM)',
                    'Custom SLA & Private Cloud Hosting'
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

      {/* ── 6. FAQ Accordion Section ────────────────────────────────────────── */}
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

      {/* ── 7. Footer ───────────────────────────────────────────────────────── */}
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