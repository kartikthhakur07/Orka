'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import LightRays from './LightRays'
import TechText from './TechText'
import Carousel from './Carousel'
import PixelCard from './PixelCard'
import Folder from './Folder'
import {
  Brain, Flame, Home, Shield, CalendarDays,
  ArrowRight, Plus, CheckCircle2, Zap, Target,
  ShieldCheck, Lock, Sparkles, HelpCircle, Check,
  MapPin, Activity, Search, Clock, ChevronLeft, ChevronRight, Users
} from 'lucide-react'

export default function LandingPage() {
  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Pricing Billing Cycle Toggle (Monthly vs Annual)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')

  const workflowCards = [
    {
      title: 'Connect Your Stack',
      description: 'Integrates with GitHub, Jira & Linear in seconds. Automatically ingests issue backlogs, velocity, and skill tags without invasive trackers.',
      tag: '01 • INGESTION',
      badge: '⚡ 10s API Setup',
      accentColor: '#0284c7',
      bgColor: '#ffffff',
      features: [
        'GitHub PR & Commit Velocity',
        'Jira & Linear Sprint Backlogs',
        'Zero-Surveillance Privacy'
      ],
      footer: 'Continuous Headroom Sync'
    },
    {
      title: 'Multi-Factor Evaluation',
      description: 'Calculates mathematically optimal assignment fits by balancing engineer skill vectors, active queue headroom, and safety reserves.',
      tag: '02 • ALGORITHM',
      badge: '🎯 5-Factor Fit',
      accentColor: '#ea580c',
      bgColor: '#ffffff',
      features: [
        'Domain & Language Vectors',
        'Burnout Safety Reserves',
        'Bias-Free Delegation'
      ],
      footer: 'Mathematically Fair Fit'
    },
    {
      title: 'Sustain Velocity & Health',
      description: 'Flags upcoming burnout risk 14 days in advance from meeting density and overtime deficits before delivery velocity drops.',
      tag: '03 • PROTECTION',
      badge: '🛡️ 14-Day Radar',
      accentColor: '#059669',
      bgColor: '#ffffff',
      features: [
        'Early Overload Signal Radar',
        'Focus-Block Depletion Alerts',
        'Hybrid Sync Preservation'
      ],
      footer: 'High-Impact Squad Health'
    }
  ];

  const aboutOrkaCards = [
    {
      title: 'Open-Source & Auditable',
      description: 'Transparent formulas licensed under Apache 2.0. Inspect every algorithm weight and self-host on Docker with your own database.',
      tag: '01 • TRANSPARENCY',
      badge: '⚡ Apache 2.0',
      accentColor: '#38bdf8',
      bgColor: '#0c162d',
      features: [
        'Inspectable algorithm formulas',
        'Self-hosted Docker deployment',
        'Direct PostgreSQL data ownership'
      ],
      footer: 'Auditable & Community-Driven'
    },
    {
      title: 'Mathematical Fairness',
      description: 'Eliminates tribal allocation bias and burnout imbalances by evaluating candidate skills, current headroom, and safety reserves objectively.',
      tag: '02 • IMPARTIALITY',
      badge: '🎯 Bias-Free',
      accentColor: '#f7a501',
      bgColor: '#1c1305',
      features: [
        'Multi-vector skill scoring',
        'Active workload safety margin',
        'Objective delegation balance'
      ],
      footer: 'Fair Task Distribution'
    },
    {
      title: 'Zero-Surveillance Integrity',
      description: 'We never record keystrokes, webcam feeds, or screen captures. High engineering velocity comes from psychological safety, not tracking.',
      tag: '03 • PRIVACY',
      badge: '🛡️ Zero Tracking',
      accentColor: '#34d399',
      bgColor: '#051c15',
      features: [
        'No invasive client agents',
        'Zero webcam / screen captures',
        'Privacy-first telemetry only'
      ],
      footer: 'Psychological Safety First'
    },
    {
      title: 'The Sketchbook Ethos',
      description: 'Inspired by PostHog notebooks. Powerful predictive algorithms rendered in warm, approachable, human-crafted design.',
      tag: '04 • HUMAN CRAFT',
      badge: '✨ Warm Design',
      accentColor: '#f472b6',
      bgColor: '#1e1022',
      features: [
        'PostHog-inspired notebooks',
        'Intuitive visual explanations',
        'Built for developer delight'
      ],
      footer: 'Human-Crafted Software'
    }
  ];

  const aboutOrkaItems = [
    {
      title: 'Open-Source & Auditable',
      description: 'Transparent formulas licensed under Apache 2.0. Inspect every algorithm weight and self-host on Docker with your own PostgreSQL database.',
      image: '/orka-card-opensource.jpg',
      bg: '#0f172a'
    },
    {
      title: 'Mathematical Fairness',
      description: 'Eliminates tribal allocation bias and burnout imbalances by evaluating candidate skills, current queue headroom, and safety reserves objectively.',
      image: '/orka-card-fairness.jpg',
      bg: '#1a140b'
    },
    {
      title: 'Zero-Surveillance Integrity',
      description: 'We never record keystrokes, webcam feeds, or screen captures. High engineering velocity comes from psychological safety, not tracking.',
      image: '/orka-card-privacy.jpg',
      bg: '#061d17'
    },
    {
      title: 'The Sketchbook Ethos',
      description: 'Inspired by PostHog notebooks. Powerful predictive algorithms rendered in warm, approachable, human-crafted design.',
      image: '/orka-card-sketchbook.jpg',
      bg: '#1f131a'
    }
  ]

  const faqs = [
    {
      q: 'How does ORKA calculate task delegation recommendations?',
      a: 'ORKA evaluates candidate skill alignment, active workload headroom, burnout margin, critical path deadlines, and calendar availability. The algorithm returns a normalized 0–100 score along with transparent explanation codes and backup options.'
    },
    {
      q: 'Does ORKA replace Jira, Linear, or GitHub Issues?',
      a: 'No. ORKA acts as an intelligence and decision-support layer on top of your existing tools. It synchronizes bidirectionally with Jira, Linear, and GitHub to help engineering managers decide who should do what without altering ticket workflows.'
    },
    {
      q: 'What does "Zero-Surveillance" mean in practice?',
      a: 'ORKA adheres to strict developer privacy. It never tracks keystrokes, webcam feeds, browser history, or idle time. All analytics are derived exclusively from public pull requests, issue sizing, and calendar availability.'
    },
    {
      q: 'Can we self-host ORKA on our own infrastructure?',
      a: 'Yes. ORKA is open-source under Apache 2.0. You can deploy it on your own infrastructure via Docker and connect it to any PostgreSQL database (such as Neon, Supabase, or AWS RDS).'
    },
    {
      q: 'How does the 14-day burnout forecast work?',
      a: 'Burnout Radar evaluates trailing sprint velocity, after-hours commit spikes, meeting density, and time-off deficits to forecast cognitive fatigue 14 days before velocity drops, enabling proactive rebalancing.'
    }
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--colors-canvas)', color: 'var(--colors-body)', overflowX: 'hidden' }}>
      {/* Floating Translucent Frosted Navbar */}
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1: THE IMMERSIVE VOLUMETRIC HERO (100VH FIRST VIEW)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: '#141510',
        overflow: 'hidden',
        borderBottom: '2px solid #23251d',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {/* Fullscreen Interactive LightRays Canvas */}
        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={1}
            lightSpread={0.55}
            rayLength={3}
            glow={0.65}
            haze={0.25}
            followMouse
            mouseInfluence={0.1}
          />
        </div>

        {/* Foreground Hero Stage */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '110px 24px 40px',
          maxWidth: 980,
          width: '100%',
          margin: '0 auto',
          pointerEvents: 'none'
        }}>
          {/* Main Title: Interactive TechText ORKA */}
          <div style={{ width: '100%', height: '480px', position: 'relative', pointerEvents: 'auto' }}>
            <TechText
              text="ORKA"
              fontWeight={600}
              fontSize={150}
              reveal="letter"
              dashLength={4}
              dashGap={2}
              specks={15}
              intro="none"
              introDuration={2}
              clickKick
              guides={false}
              color="#ffffff"
              accentColor="#f7a501"
            />

            {/* Hand-drawn Sketchbook Illustration: Developer at desk at right-bottom of ORKA */}
            <div style={{
              position: 'absolute',
              left: 'clamp(240px, calc(50% + 140px), calc(100% - 170px))',
              top: '220px',
              pointerEvents: 'none',
              zIndex: 15,
              userSelect: 'none'
            }}>
              <img
                src="/orka-burnout-sketch.png"
                alt="Chalk sketch of developer slouched at computer desk"
                style={{
                  display: 'block',
                  width: 'clamp(130px, 16vw, 175px)',
                  height: 'auto',
                  opacity: 0.92,
                  filter: 'drop-shadow(0 0 16px rgba(255, 255, 255, 0.22))',
                  userSelect: 'none'
                }}
              />
            </div>
          </div>

          {/* Tagline */}
          <p style={{
            fontSize: 'clamp(16px, 2.2vw, 20px)',
            color: '#cbd5e1',
            maxWidth: 620,
            margin: '0 auto 28px',
            lineHeight: 1.5,
            fontWeight: 500,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)'
          }}>
            Autonomous engineering decisions. Rendered as a friendly sketchbook.
          </p>

          {/* Primary CTA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', marginBottom: 20 }}>
            <Link
              href="/login"
              className="btn-primary-yellow"
              style={{
                padding: '13px 36px',
                fontSize: '15px',
                fontWeight: 800,
                boxShadow: '0 0 32px rgba(247, 165, 1, 0.4), 3px 3px 0px #23251d',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                textDecoration: 'none'
              }}
            >
              Get started — free <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2: ABOUT ORKA (#about)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="about" style={{ padding: '96px 0', background: 'var(--colors-canvas)', borderBottom: '1px solid var(--colors-hairline)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 28px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '64px',
            alignItems: 'center'
          }}>
            {/* Left Column: About ORKA Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <span className="text-eyebrow">PHILOSOPHY &amp; MISSION</span>
                <h2 className="text-display-lg" style={{ marginTop: 8, marginBottom: 16 }}>
                  About ORKA
                </h2>
              </div>
              <p style={{ fontSize: '16.5px', color: 'var(--colors-body)', lineHeight: 1.7, margin: 0 }}>
                Engineering squads shouldn't be run by guesswork, spreadsheet triage, or dark-pattern surveillance software. ORKA was built as an open-source decision engine that gives leads mathematical clarity while treating developers as creative humans.
              </p>

              {/* Core Pillars Highlights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 800,
                    flexShrink: 0,
                    marginTop: 2
                  }}>
                    ✓
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--colors-ink)', margin: 0 }}>
                      100% Open-Source &amp; Auditable
                    </h4>
                    <p style={{ fontSize: '13.5px', color: 'var(--colors-body)', margin: '2px 0 0', lineHeight: 1.5 }}>
                      Transparent formulas licensed under Apache 2.0. Inspect every algorithm weight or self-host via Docker.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: 'rgba(247, 165, 1, 0.2)',
                    color: '#b45309',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 800,
                    flexShrink: 0,
                    marginTop: 2
                  }}>
                    ✓
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--colors-ink)', margin: 0 }}>
                      Mathematical Fairness
                    </h4>
                    <p style={{ fontSize: '13.5px', color: 'var(--colors-body)', margin: '2px 0 0', lineHeight: 1.5 }}>
                      Evaluates skill vectors, queue headroom, and safety reserves objectively to eliminate tribal bias.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: 'rgba(16, 185, 129, 0.18)',
                    color: '#047857',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 800,
                    flexShrink: 0,
                    marginTop: 2
                  }}>
                    ✓
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--colors-ink)', margin: 0 }}>
                      Zero-Surveillance Guarantee
                    </h4>
                    <p style={{ fontSize: '13.5px', color: 'var(--colors-body)', margin: '2px 0 0', lineHeight: 1.5 }}>
                      Never records keystrokes, webcams, or idle time. High velocity comes from psychological safety.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive 3D Tilt Carousel */}
            <div style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '480px'
            }}>
              <Carousel
                items={aboutOrkaItems}
                baseWidth={420}
                aspectRatio={1.2}
                effect="tilt"
                indicator="dots"
                frame={true}
                arrows={true}
                loop={true}
                autoplay={false}
                autoplayDelay={3500}
                pauseOnHover={true}
                theme="dark"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3: HOW IT WORKS (#how-it-works)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding: '96px 0', background: '#160f03ff', borderBottom: '1px solid rgba(0, 0, 0, 0.14)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 28px' }}>
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 56px' }}>
            <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.12em', color: 'rgba(247, 247, 250, 1)', opacity: 0.85, textTransform: 'uppercase' }}>
              WORKFLOW &amp; EXECUTION
            </span>
            <h2 className="text-display-lg" style={{ marginTop: 8, marginBottom: 14, color: '#f8f8fdff', fontWeight: 900 }}>
              How ORKA Works
            </h2>
            <p style={{ fontSize: '16.5px', color: '#f7f7f7e0', lineHeight: 1.6, fontWeight: 500 }}>
              From backlog ingestion to proactive burnout protection, ORKA operates quietly in the background without disrupting developer focus.
            </p>
          </div>

          {/* Interactive Black Folder Workspace with the 3 Workflow Cards on Golden Amber */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '56px 24px',
            background: 'rgba(237, 235, 235, 0.08)',
            borderRadius: '24px',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            minHeight: '440px',
            position: 'relative',
            boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
              <Folder
                mode="book"
                variant="solid"
                color="#0a0a0c"
                paperColor="#ffffff"
                label="Workflow"
                items={workflowCards}
                theme="dark"
                size={1.3}
              />
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#f3f3f3ff', opacity: 0.85, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Workflow Journal • Click to open &amp; inspect steps
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3: GOLDEN RATIO RESPONSE CHAIN (#features)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="features" style={{ padding: '88px 0', background: 'var(--colors-canvas)', borderBottom: '1px solid var(--colors-hairline)', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 28px' }}>
          
          {/* Header Row: Left-aligned with Eyebrow, Title, Subtitle (No Arrows) */}
          <div style={{ maxWidth: 680, marginBottom: 44 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ color: '#ea580c', fontWeight: 800, fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                — GOLDEN RATIO RESPONSE CHAIN
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 800, color: '#09090b', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 14 }}>
              Seats in the response chain-
            </h2>
            <p style={{ fontSize: '16px', color: '#52525b', lineHeight: 1.6 }}>
              Six intelligent modules designed to streamline squad allocation, prevent overwork, and align delivery targets.
            </p>
          </div>

        </div>

        {/* Continuous Animated Moving Cards Track (Infinite Seamless Marquee) */}
        <div className="orka-marquee-wrapper">
          {[0, 1, 2].map((groupIndex) => (
            <div key={groupIndex} className="orka-marquee-group" aria-hidden={groupIndex > 0}>
              {[
                {
                  tag: 'TASK DELEGATION',
                  icon: <Zap size={18} strokeWidth={2} />,
                  title: 'Autonomous Task Delegation',
                  description: 'Matches incoming issues to the optimal engineer using a 5-factor scoring model that balances skill mastery with available bandwidth.',
                  metricLabel: 'SCORING MODEL',
                  metricValue: '5-Factor Fit',
                },
                {
                  tag: 'BURNOUT RADAR',
                  icon: <Flame size={18} strokeWidth={2} />,
                  title: '14-Day Predictive Burnout Radar',
                  description: 'Identifies cognitive overload patterns from overtime hours, meeting density, and focus block deficits two weeks early.',
                  metricLabel: 'LEAD TIME',
                  metricValue: '14 Days Ahead',
                },
                {
                  tag: 'QUORUM BALANCING',
                  icon: <Users size={18} strokeWidth={2} />,
                  title: 'Hybrid Quorum Balancing',
                  description: 'Coordinates in-office attendance so cross-functional squads overlap on critical collaborative days without forced calendar mandates.',
                  metricLabel: 'SQUAD SYNERGY',
                  metricValue: 'Dynamic Overlap',
                },
                {
                  tag: 'DEADLINE SHIELD',
                  icon: <ShieldCheck size={18} strokeWidth={2} />,
                  title: 'Critical Path Deadline Shield',
                  description: 'Tracks architectural dependencies in real time, calculating Monte Carlo completion probabilities to flag delivery slip risks early.',
                  metricLabel: 'SIMULATION',
                  metricValue: 'Monte Carlo 99.2%',
                },
                {
                  tag: 'CAPACITY WINDOWS',
                  icon: <Clock size={18} strokeWidth={2} />,
                  title: 'Daily Capacity Windows',
                  description: 'Enforces realistic daily effort limits (≤ 8h/day) with automatic PTO and holiday suppression to eliminate crunch before sprint close.',
                  metricLabel: 'EFFORT CAP',
                  metricValue: '≤ 8h Daily Cap',
                },
                {
                  tag: 'SURVEILLANCE FREE',
                  icon: <Lock size={18} strokeWidth={2} />,
                  title: 'Zero-Surveillance Privacy',
                  description: 'Built on engineering respect. No keystroke trackers, webcam monitors, or screenshots. High trust drives sustainable performance.',
                  metricLabel: 'SURVEILLANCE',
                  metricValue: 'Zero Telemetry',
                },
              ].map((card, idx) => (
                <div
                  key={idx}
                  style={{
                    flexShrink: 0,
                    width: 320,
                    minHeight: 380,
                    borderRadius: 22,
                    background: '#242427',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '28px 24px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
                    transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)'
                    e.currentTarget.style.boxShadow = '0 16px 36px rgba(0, 0, 0, 0.32)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.16)'
                  }}
                >
                  {/* Top Row: Pill Tag + Circular Icon */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '5px 12px',
                        borderRadius: 9999,
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        color: '#d4d4d8',
                        textTransform: 'uppercase',
                        fontFamily: 'monospace, var(--font-sans)'
                      }}>
                        {card.tag}
                      </span>
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#f4f4f5'
                      }}>
                        {card.icon}
                      </div>
                    </div>

                    {/* Card Title & Description */}
                    <h3 style={{
                      fontSize: '21px',
                      fontWeight: 700,
                      color: '#ffffff',
                      lineHeight: 1.3,
                      marginBottom: 14,
                      letterSpacing: '-0.01em'
                    }}>
                      {card.title}
                    </h3>
                    <p style={{
                      fontSize: '13.5px',
                      color: '#a1a1aa',
                      lineHeight: 1.65,
                      fontWeight: 400
                    }}>
                      {card.description}
                    </p>
                  </div>

                  {/* Bottom Row: Divider + Metric Stat */}
                  <div style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingTop: 18,
                    marginTop: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      color: '#71717a',
                      textTransform: 'uppercase',
                      fontFamily: 'monospace, var(--font-sans)'
                    }}>
                      {card.metricLabel}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#f4f4f5',
                      letterSpacing: '-0.01em'
                    }}>
                      {card.metricValue}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 4: TRANSPARENT PRICING (#pricing)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="pricing" style={{ padding: '88px 0', background: '#797975ff', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 28px' }}>
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 40px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', color: '#f7a501', textTransform: 'uppercase' }}>
              SIMPLE &amp; TRANSPARENT
            </span>
            <h2 className="text-display-lg" style={{ marginTop: 8, marginBottom: 14, color: '#ffffff', fontWeight: 900 }}>
              Plans for Squads of Any Size
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.6 }}>
              Open-source forever. Scale seamlessly to managed cloud or private deployment.
            </p>

            {/* Billing Cycle Switch */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: 4, borderRadius: 9999, marginTop: 20 }}>
              <button
                onClick={() => setBillingCycle('monthly')}
                style={{
                  background: billingCycle === 'monthly' ? '#ffffff' : 'transparent',
                  color: billingCycle === 'monthly' ? '#09090b' : 'rgba(255, 255, 255, 0.75)',
                  border: 'none',
                  padding: '6px 16px',
                  borderRadius: 9999,
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: billingCycle === 'monthly' ? '0 1px 4px rgba(0,0,0,0.2)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                style={{
                  background: billingCycle === 'annual' ? '#ffffff' : 'transparent',
                  color: billingCycle === 'annual' ? '#09090b' : 'rgba(255, 255, 255, 0.75)',
                  border: 'none',
                  padding: '6px 16px',
                  borderRadius: 9999,
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: billingCycle === 'annual' ? '0 1px 4px rgba(0,0,0,0.2)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                Annual <span style={{ color: '#059669', fontSize: '11px', fontWeight: 800, marginLeft: 2 }}>Save 20%</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid - Powered by PixelCard in Light Theme with Black Text */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'stretch' }}>
            {/* Tier 1: Community */}
            <PixelCard
              variant="default"
              theme="light"
              radius={18}
              style={{ width: '100%', height: '100%', background: '#ffffff', border: '1px solid #e4e4e7', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)' }}
            >
              <div style={{ padding: '36px 32px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                <div>
                  <span style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    padding: '4px 10px',
                    borderRadius: 9999,
                    background: 'rgba(5, 150, 105, 0.1)',
                    color: '#059669',
                    border: '1px solid rgba(5, 150, 105, 0.25)',
                    marginBottom: 14
                  }}>COMMUNITY EDITION</span>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#09090b', margin: '8px 0 6px' }}>Open Source</h3>
                  <p style={{ fontSize: '14px', color: '#3f3f46', marginBottom: 20, lineHeight: 1.5 }}>Self-hosted for growing developer squads.</p>
                  <div style={{ fontSize: '42px', fontWeight: 900, color: '#09090b', marginBottom: 24 }}>
                    $0 <span style={{ fontSize: '15px', fontWeight: 600, color: '#52525b' }}>/ forever</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12, fontSize: '14px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#18181b', fontWeight: 500 }}><Check size={16} color="#059669" /> Up to 15 engineers</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#18181b', fontWeight: 500 }}><Check size={16} color="#059669" /> 5-Factor task delegation engine</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#18181b', fontWeight: 500 }}><Check size={16} color="#059669" /> 14-Day burnout radar</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#18181b', fontWeight: 500 }}><Check size={16} color="#059669" /> Self-hosted PostgreSQL &amp; Docker</li>
                  </ul>
                </div>
                <Link href="/login" style={{
                  width: '100%',
                  textAlign: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  background: '#f4f4f5',
                  color: '#09090b',
                  border: '1px solid #e4e4e7',
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}>
                  Deploy Community →
                </Link>
              </div>
            </PixelCard>

            {/* Tier 2: Pro Squad (Featured - ORKA Yellow PixelCard on White) */}
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <div style={{ position: 'absolute', top: -13, right: 24, zIndex: 10 }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  padding: '4px 12px',
                  borderRadius: 9999,
                  background: '#f7a501',
                  color: '#18181b',
                  boxShadow: '0 4px 12px rgba(247, 165, 1, 0.4)'
                }}>MOST POPULAR</span>
              </div>
              <PixelCard
                variant="yellow"
                theme="light"
                radius={18}
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#ffffff',
                  border: '2px solid #f7a501',
                  boxShadow: '0 12px 36px rgba(247, 165, 1, 0.22), 0 4px 12px rgba(0, 0, 0, 0.06)'
                }}
              >
                <div style={{ padding: '36px 32px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                  <div>
                    <span style={{
                      display: 'inline-block',
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      padding: '4px 10px',
                      borderRadius: 9999,
                      background: 'rgba(247, 165, 1, 0.15)',
                      color: '#d97706',
                      border: '1px solid rgba(247, 165, 1, 0.4)',
                      marginBottom: 14
                    }}>MANAGED CLOUD</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#09090b', margin: '8px 0 6px' }}>Pro Squad</h3>
                    <p style={{ fontSize: '14px', color: '#3f3f46', marginBottom: 20, lineHeight: 1.5 }}>Complete orchestration for high-velocity teams.</p>
                    <div style={{ fontSize: '42px', fontWeight: 900, color: '#09090b', marginBottom: 24 }}>
                      ${billingCycle === 'annual' ? '15' : '19'} <span style={{ fontSize: '15px', fontWeight: 600, color: '#52525b' }}>/ seat / mo</span>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12, fontSize: '14px' }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#18181b', fontWeight: 500 }}><Check size={16} color="#f7a501" /> Unlimited engineers</li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#18181b', fontWeight: 500 }}><Check size={16} color="#f7a501" /> Bidirectional Jira &amp; Linear sync</li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#18181b', fontWeight: 500 }}><Check size={16} color="#f7a501" /> Monte Carlo critical path shield</li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#18181b', fontWeight: 500 }}><Check size={16} color="#f7a501" /> Hybrid quorum optimizer</li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#18181b', fontWeight: 500 }}><Check size={16} color="#f7a501" /> Priority technical support</li>
                    </ul>
                  </div>
                  <Link href="/login" className="btn-primary-yellow" style={{
                    width: '100%',
                    textAlign: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontWeight: 800,
                    fontSize: '14px',
                    background: '#f7a501',
                    color: '#18181b',
                    boxShadow: '0 4px 16px rgba(247, 165, 1, 0.4)'
                  }}>
                    Start 14-Day Free Trial →
                  </Link>
                </div>
              </PixelCard>
            </div>

            {/* Tier 3: Enterprise */}
            <PixelCard
              variant="blue"
              theme="light"
              radius={18}
              style={{ width: '100%', height: '100%', background: '#ffffff', border: '1px solid #e4e4e7', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)' }}
            >
              <div style={{ padding: '36px 32px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                <div>
                  <span style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    padding: '4px 10px',
                    borderRadius: 9999,
                    background: 'rgba(2, 132, 199, 0.1)',
                    color: '#0284c7',
                    border: '1px solid rgba(2, 132, 199, 0.25)',
                    marginBottom: 14
                  }}>CUSTOM DEPLOYMENT</span>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#09090b', margin: '8px 0 6px' }}>Enterprise</h3>
                  <p style={{ fontSize: '14px', color: '#3f3f46', marginBottom: 20, lineHeight: 1.5 }}>Dedicated security, compliance, and custom algorithms.</p>
                  <div style={{ fontSize: '42px', fontWeight: 900, color: '#09090b', marginBottom: 24 }}>
                    Custom <span style={{ fontSize: '15px', fontWeight: 600, color: '#52525b' }}>/ annual</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12, fontSize: '14px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#18181b', fontWeight: 500 }}><Check size={16} color="#0284c7" /> Dedicated Neon DB instance</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#18181b', fontWeight: 500 }}><Check size={16} color="#0284c7" /> Custom dispatch algorithm weights</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#18181b', fontWeight: 500 }}><Check size={16} color="#0284c7" /> SSO, SAML, and audit log exports</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#18181b', fontWeight: 500 }}><Check size={16} color="#0284c7" /> Dedicated engineering advisor</li>
                  </ul>
                </div>
                <Link href="/login" style={{
                  width: '100%',
                  textAlign: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  background: '#f4f4f5',
                  color: '#09090b',
                  border: '1px solid #e4e4e7',
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}>
                  Contact Enterprise →
                </Link>
              </div>
            </PixelCard>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 5: FREQUENTLY ASKED QUESTIONS (#faq)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="faq" style={{ padding: '88px 0', background: 'var(--colors-canvas)', borderBottom: '1px solid var(--colors-hairline)' }}>
        <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="text-eyebrow">COMMON INQUIRIES</span>
            <h2 className="text-display-lg" style={{ marginTop: 8 }}>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {faqs.map((faq, idx) => (
              <div key={idx} className="bright-card" style={{ padding: 22, overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 0 }}
                >
                  <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--colors-ink)' }}>{faq.q}</span>
                  <Plus size={18} color="var(--colors-mute)" style={{ transform: openFaq === idx ? 'rotate(45deg)' : 'none', transition: 'transform 150ms ease' }} />
                </button>
                {openFaq === idx && (
                  <p style={{ fontSize: '14.5px', color: 'var(--colors-body)', lineHeight: 1.6, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--colors-hairline-soft)', margin: '14px 0 0' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 6: POSTHOG-INSPIRED SKETCHBOOK FOOTER
      ═══════════════════════════════════════════════════════════════════════ */}
      <footer style={{ background: '#09090b', borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '56px 0 36px', color: '#f4f4f5' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 36, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <img src="/orka-badge.png" alt="ORKA Logo" style={{ width: 32, height: 32, borderRadius: '50%', boxShadow: '0 2px 8px rgba(247, 165, 1, 0.4)' }} />
                <span style={{ fontSize: '19px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>ORKA</span>
              </div>
              <p style={{ fontSize: '13.5px', color: '#a1a1aa', lineHeight: 1.6, margin: 0 }}>
                Autonomous engineering decisions. Rendered as a friendly sketchbook. Open-source under Apache 2.0.
              </p>
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: '#f7a501', marginBottom: 14, textTransform: 'uppercase' }}>PRODUCT</p>
              <p style={{ fontSize: '13.5px', marginBottom: 10 }}><a href="#about" style={{ color: '#d4d4d8', textDecoration: 'none', transition: 'color 0.15s ease' }}>About ORKA</a></p>
              <p style={{ fontSize: '13.5px', marginBottom: 10 }}><a href="#how-it-works" style={{ color: '#d4d4d8', textDecoration: 'none', transition: 'color 0.15s ease' }}>How It Works</a></p>
              <p style={{ fontSize: '13.5px', marginBottom: 10 }}><a href="#features" style={{ color: '#d4d4d8', textDecoration: 'none', transition: 'color 0.15s ease' }}>Features</a></p>
              <p style={{ fontSize: '13.5px', marginBottom: 10 }}><a href="#pricing" style={{ color: '#d4d4d8', textDecoration: 'none', transition: 'color 0.15s ease' }}>Pricing</a></p>
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: '#f7a501', marginBottom: 14, textTransform: 'uppercase' }}>RESOURCES</p>
              <p style={{ fontSize: '13.5px', marginBottom: 10 }}><a href="#faq" style={{ color: '#d4d4d8', textDecoration: 'none', transition: 'color 0.15s ease' }}>FAQ</a></p>
              <p style={{ fontSize: '13.5px', color: '#a1a1aa', marginBottom: 10 }}>FastAPI Engine (8000)</p>
              <p style={{ fontSize: '13.5px', color: '#a1a1aa', marginBottom: 10 }}>Neon PostgreSQL</p>
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: '#f7a501', marginBottom: 14, textTransform: 'uppercase' }}>SECURITY</p>
              <p style={{ fontSize: '13.5px', color: '#a1a1aa', marginBottom: 10 }}>Zero-Surveillance Policy</p>
              <p style={{ fontSize: '13.5px', color: '#a1a1aa', marginBottom: 10 }}>Apache 2.0 License</p>
              <p style={{ fontSize: '13.5px', color: '#a1a1aa', marginBottom: 10 }}>Privacy &amp; Terms</p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: '12.5px', color: '#71717a' }}>© 2026 ORKA Engine · Open-Source Apache 2.0</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12.5px', color: '#34d399', fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)' }} />
              <span>All Systems Operational · v2.0.4-prod</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}