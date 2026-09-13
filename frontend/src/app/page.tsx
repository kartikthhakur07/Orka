'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Zap, Brain, Flame, Home, Shield, Bot, CalendarDays,
  Users, CheckCircle2, ArrowRight, Sparkles, TrendingUp,
  Cpu, Layers, Code2, Lock, Star, ExternalLink, HelpCircle
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
      {/* ── Top Header Navigation ────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '16px 36px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(234, 88, 12, 0.40)'
          }}>
            <Zap size={20} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#0f172a' }}>
            ORK<span style={{ color: 'var(--accent-orange)' }}>A</span>
          </span>
          <span className="badge badge-orange" style={{ marginLeft: 8 }}>v2.0 AI Engine</span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: '0.875rem', fontWeight: 500 }}>
          <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Features</a>
          <a href="#algorithm" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>AI Algorithm</a>
          <a href="#roi" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>ROI Calculator</a>
          <a href="#pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Pricing</a>
          <a href="https://orkapi.onrender.com/docs" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            API Docs <ExternalLink size={12} />
          </a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="https://github.com/kartikthhakur07/Orka" target="_blank" rel="noreferrer" className="btn-secondary" style={{ textDecoration: 'none', fontSize: '0.85rem' }}>
            GitHub Repo
          </a>
          <Link href="/dashboard" className="btn-primary" style={{ textDecoration: 'none', fontSize: '0.85rem' }}>
            Launch App <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 36px 60px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <div className="badge badge-orange animate-fade-in-up" style={{ padding: '6px 16px', fontSize: '0.78rem', marginBottom: 20 }}>
          <Sparkles size={14} style={{ marginRight: 6 }} /> Powered by 5-Factor Predictive Machine Intelligence
        </div>

        <h1 style={{
          fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.15,
          letterSpacing: '-0.03em', color: 'var(--text-primary)',
          maxWidth: 900, margin: '0 auto 20px'
        }}>
          AI Decision Engine for <br />
          <span className="text-gradient-orange">Modern Engineering Teams</span>
        </h1>

        <p style={{
          fontSize: '1.2rem', color: 'var(--text-secondary)',
          maxWidth: 720, margin: '0 auto 36px', lineHeight: 1.6
        }}>
          Stop guessing task assignments. ORKA uses 5-factor AI modeling to assign work, prevent burnout 2 weeks early, enforce WFH policies, and shield your team from deadline risks.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 60 }}>
          <Link href="/dashboard" className="btn-primary" style={{ padding: '14px 32px', fontSize: '1rem', textDecoration: 'none' }}>
            Launch Executive Dashboard <ArrowRight size={18} />
          </Link>
          <Link href="/delegator" className="btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem', textDecoration: 'none' }}>
            Try Task Delegator
          </Link>
        </div>

        {/* Live Hero Preview Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, textAlign: 'left' }}>
          <div className="glass-card p-6 flex items-center gap-4">
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(234, 88, 12, 0.12)', color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Smart Match</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>94.5% Confidence</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto-assigned by 5-factor fit</p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-center gap-4">
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(124, 58, 237, 0.12)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Burnout Early Warning</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>14 Days Advance</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cognitive load & stress alert</p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-center gap-4">
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(13, 148, 136, 0.12)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarDays size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Sprint Generation</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>30 Seconds</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2-week balanced distribution</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6 Core Features Grid ─────────────────────────────────────────── */}
      <section id="features" style={{ padding: '80px 36px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            6 Core Intelligent Modules
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
            Engineered to automate project management overhead and protect engineering focus.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            {
              icon: Brain, color: '#ea580c', title: '1. Smart Task Delegator',
              desc: 'Matches incoming tasks with team members using a 5-factor weighted algorithm considering skill match, capacity, and stress.'
            },
            {
              icon: Flame, color: '#dc2626', title: '2. Burnout Radar',
              desc: 'Tracks cognitive load, meeting density, and context switching to predict burnout risk 2 weeks before performance drops.'
            },
            {
              icon: Home, color: '#16a34a', title: '3. WFH Decider',
              desc: 'Calculates WFH eligibility based on commute distance, deep work requirements, and meeting schedules for maximum productivity.'
            },
            {
              icon: Shield, color: '#7c3aed', title: '4. Deadline Shield',
              desc: 'Monitors sprint velocity and remaining task complexity to predict deadline delays before they impact delivery.'
            },
            {
              icon: Cpu, color: '#0d9488', title: '5. NLP Task Parser',
              desc: 'Extracts skills, estimated hours, and complexity from single-sentence task descriptions using natural language intelligence.'
            },
            {
              icon: CalendarDays, color: '#d97706', title: '6. Auto Sprint Planner',
              desc: 'Generates balanced 2-week sprint schedules in 30 seconds respecting daily capacity limits and skill specialization.'
            },
          ].map((f, i) => (
            <div key={i} className="glass-card p-6 flex flex-col gap-3">
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${f.color}15`, color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <f.icon size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{f.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Interactive 5-Factor Score Visualizer ────────────────────────── */}
      <section id="algorithm" style={{ padding: '80px 36px', background: 'rgba(241, 245, 249, 0.6)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span className="badge badge-purple" style={{ marginBottom: 10 }}>Algorithmic Precision</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              How the 5-Factor Scoring Formula Works
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
              Try adjusting the sliders below to see how ORKA calculates the optimal assignment score in real time.
            </p>
          </div>

          <div className="glass-card p-8" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
            {/* Sliders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                  <span>1. Skill Match (35%)</span>
                  <span style={{ color: 'var(--accent-orange)' }}>{skillMatch}%</span>
                </div>
                <input type="range" min="0" max="100" value={skillMatch} onChange={e => setSkillMatch(Number(e.target.value))} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                  <span>2. Availability (25%)</span>
                  <span style={{ color: 'var(--accent-purple)' }}>{availability}h / 8h</span>
                </div>
                <input type="range" min="0" max="8" step="0.5" value={availability} onChange={e => setAvailability(Number(e.target.value))} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                  <span>3. Workload Inverse (20%)</span>
                  <span style={{ color: 'var(--accent-teal)' }}>{workload}% load ({100 - workload}% free)</span>
                </div>
                <input type="range" min="0" max="100" value={workload} onChange={e => setWorkload(Number(e.target.value))} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                  <span>4. Performance Rating (15%)</span>
                  <span style={{ color: 'var(--accent-green)' }}>{performance} / 100</span>
                </div>
                <input type="range" min="0" max="100" value={performance} onChange={e => setPerformance(Number(e.target.value))} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                  <span>5. Deadline Urgency (5%)</span>
                  <span style={{ color: 'var(--accent-yellow)' }}>{urgency}%</span>
                </div>
                <input type="range" min="0" max="100" value={urgency} onChange={e => setUrgency(Number(e.target.value))} />
              </div>
            </div>

            {/* Calculated Output Card */}
            <div style={{ textAlign: 'center', background: 'rgba(255, 255, 255, 0.9)', padding: 36, borderRadius: 20, border: '1px solid var(--border-card)' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Calculated Assignment Score
              </p>
              <div style={{ fontSize: '4.5rem', fontWeight: 900, color: calculatedScore >= 75 ? '#16a34a' : calculatedScore >= 50 ? '#d97706' : '#dc2626', margin: '10px 0' }}>
                {calculatedScore}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
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
      <section id="roi" style={{ padding: '80px 36px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            High Business Impact & ROI
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
            Preventing developer attrition saves millions in replacement and onboarding costs.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, textAlign: 'center' }}>
          <div className="glass-card p-6">
            <p style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-orange)' }}>₹7–10 Lakhs</p>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: '8px 0 4px' }}>Developer Retention Savings</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average cost saved per engineer retained by avoiding burnout turnover.</p>
          </div>

          <div className="glass-card p-6">
            <p style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-purple)' }}>300x ROI</p>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: '8px 0 4px' }}>Return on Investment</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Calculated against standard ORKA annual subscription costs.</p>
          </div>

          <div className="glass-card p-6">
            <p style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-teal)' }}>24+ Hours</p>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: '8px 0 4px' }}>Focus Time Reclaimed</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Saved per week by converting unnecessary meetings into async workflows.</p>
          </div>
        </div>
      </section>

      {/* ── Pricing Tiers ───────────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: '80px 36px', background: 'rgba(241, 245, 249, 0.6)', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Transparent Pricing Plans
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
              Scale your team intelligence seamlessly as your engineering organization grows.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {/* Free */}
            <div className="glass-card p-6 flex flex-col justify-between">
              <div>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Free Starter</p>
                <p style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', margin: '12px 0' }}>₹0 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ month</span></p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={16} color="#16a34a" /> Up to 3 team members</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={16} color="#16a34a" /> Basic Task Delegator</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={16} color="#16a34a" /> WFH Decider</li>
                </ul>
              </div>
              <Link href="/dashboard" className="btn-secondary" style={{ textDecoration: 'none', marginTop: 24, textTransform: 'center' }}>
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="glass-card p-6 flex flex-col justify-between" style={{ borderColor: 'rgba(234, 88, 12, 0.4)', boxShadow: '0 12px 32px rgba(234, 88, 12, 0.15)' }}>
              <div>
                <div className="badge badge-orange" style={{ marginBottom: 8 }}>Most Popular</div>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Pro Team</p>
                <p style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-orange)', margin: '12px 0' }}>₹1,999 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ month</span></p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={16} color="#ea580c" /> Up to 20 team members</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={16} color="#ea580c" /> Burnout Radar (14-day early warning)</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={16} color="#ea580c" /> Auto Sprint Planner (30-sec sprint)</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={16} color="#ea580c" /> Deadline Shield analytics</li>
                </ul>
              </div>
              <Link href="/dashboard" className="btn-primary" style={{ textDecoration: 'none', marginTop: 24, textAlign: 'center' }}>
                Start Pro Trial <ArrowRight size={16} />
              </Link>
            </div>

            {/* Enterprise */}
            <div className="glass-card p-6 flex flex-col justify-between">
              <div>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Enterprise</p>
                <p style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', margin: '12px 0' }}>Custom</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={16} color="#16a34a" /> Unlimited team members</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={16} color="#16a34a" /> Dedicated GPT-4o fine-tuning</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={16} color="#16a34a" /> Slack & GitHub Integrations</li>
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
      <footer style={{ padding: '40px 36px', borderTop: '1px solid var(--border-subtle)', background: '#ffffff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Zap size={16} color="var(--accent-orange)" />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>ORKA AI Engine v2.0</span>
            <span>· Built for Supernova Hacks</span>
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