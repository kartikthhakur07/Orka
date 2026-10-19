'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import { AuthGuard } from '@/components/AuthGuard'
import { assignTask, splitTask, parseTask } from '@/lib/api'
import OfflineBanner from '@/components/OfflineBanner'
import {
  Brain, Plus, X, Zap, Loader2, CheckCircle2, Clock, Layers, Star,
  AlertTriangle, Sparkles, UserCheck, ShieldAlert, ArrowRight, Activity,
  Cpu, Sliders, ChevronRight, ShieldCheck, HelpCircle, Target, Users,
  Scale, Compass, Award, Check
} from 'lucide-react'
import {
  RadialBarChart, RadialBar, ScatterChart, Scatter, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Cell, CartesianGrid, Legend,
  ReferenceLine, BarChart, Bar
} from 'recharts'
import { useSidebar } from '@/context/SidebarContext'

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical']

const PRESETS = [
  {
    name: '⚡ Stripe Webhooks',
    title: 'Implement Stripe Webhook Verification Endpoint',
    skills: ['Python', 'FastAPI', 'Stripe', 'Redis'],
    priority: 'High',
    complexity: 7,
    deadlineDays: 5
  },
  {
    name: '🎨 PostHog CSS Tokens',
    title: 'Refactor Tailwind Tokens to PostHog Vanilla CSS Design System',
    skills: ['React', 'CSS', 'UI/UX', 'Next.js'],
    priority: 'Medium',
    complexity: 4,
    deadlineDays: 7
  },
  {
    name: '🔐 OAuth Security',
    title: 'Audit JWT Expiry and Google OAuth Refresh Loop Protection',
    skills: ['Security', 'OAuth', 'JWT', 'Backend'],
    priority: 'Critical',
    complexity: 8,
    deadlineDays: 3
  },
  {
    name: '🚀 DB Pool Optimizer',
    title: 'Tune PostgreSQL Async Connection Pool Scaling & Failover',
    skills: ['PostgreSQL', 'SQLAlchemy', 'DevOps'],
    priority: 'High',
    complexity: 6,
    deadlineDays: 4
  },
  {
    name: '🤖 Vector Embeddings',
    title: 'Deploy Pinecone Vector Index for Semantic Task Searching',
    skills: ['Python', 'PyTorch', 'VectorDB', 'FastAPI'],
    priority: 'High',
    complexity: 8,
    deadlineDays: 6
  }
]

const QUICK_SKILL_SUGGESTIONS = [
  'Python', 'FastAPI', 'React', 'TypeScript', 'Docker',
  'PostgreSQL', 'Redis', 'Security', 'DevOps', 'Next.js'
]

/* ── Custom Scatter Tooltip ────────────────────────────────────────────── */
function CustomScatterTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div style={{
        background: '#23251d',
        color: '#ffffff',
        padding: '10px 14px',
        borderRadius: 8,
        fontSize: '11px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        border: '1px solid #33342d'
      }}>
        <div style={{ fontWeight: 800, fontSize: '13px', color: '#f7a501', marginBottom: 2 }}>{data.name}</div>
        <div style={{ color: '#cbd5e1', marginBottom: 6 }}>{data.role}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '2px 10px', fontSize: '10px' }}>
          <span style={{ color: '#94a3b8' }}>Skill Match:</span>
          <span style={{ fontWeight: 700, color: '#10b981' }}>{data.skillMatch}%</span>
          <span style={{ color: '#94a3b8' }}>Available Capacity:</span>
          <span style={{ fontWeight: 700, color: '#38bdf8' }}>{data.capacity}%</span>
          <span style={{ color: '#94a3b8' }}>Zone:</span>
          <span style={{ fontWeight: 700, color: data.color }}>{data.zone}</span>
        </div>
      </div>
    )
  }
  return null
}

/* ── Skill Chip Input Component ────────────────────────────────────────── */
function SkillChipInput({ skills, onChange }: { skills: string[]; onChange: (s: string[]) => void }) {
  const [input, setInput] = useState('')

  const add = (s?: string) => {
    const target = (s || input).trim()
    if (target && !skills.includes(target)) onChange([...skills, target])
    if (!s) setInput('')
  }

  const remove = (s: string) => onChange(skills.filter(x => x !== s))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {skills.map(s => (
          <span
            key={s}
            className="badge-bright badge-indigo"
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              display: 'inline-flex',
              alignItems: 'center',
              borderRadius: 6,
              fontWeight: 700
            }}
          >
            {s}
            <button
              type="button"
              onClick={() => remove(s)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'inherit',
                padding: 0,
                marginLeft: 6,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          placeholder="Add required skill (e.g. Python, Docker, Redis)..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: '13px',
            borderRadius: 8,
            border: '1.5px solid #cbd5e1',
            background: '#ffffff',
            outline: 'none',
            color: '#23251d'
          }}
        />
        <button
          type="button"
          onClick={() => add()}
          style={{
            padding: '8px 14px',
            fontSize: '12px',
            fontWeight: 700,
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: 8,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {/* Quick Suggestions Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4, marginTop: 2 }}>
        <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>Suggestions:</span>
        {QUICK_SKILL_SUGGESTIONS.filter(s => !skills.includes(s)).slice(0, 5).map(s => (
          <button
            key={s}
            type="button"
            onClick={() => add(s)}
            style={{
              padding: '2px 7px',
              borderRadius: 4,
              border: '1px dashed #cbd5e1',
              background: '#f8fafc',
              fontSize: '10px',
              color: '#475569',
              cursor: 'pointer'
            }}
          >
            + {s}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function DelegatorPage() {
  const { isExpanded, collapsed, toggleSidebar } = useSidebar()
  const [activeTab, setActiveTab] = useState<'assign' | 'split' | 'parse'>('assign')

  // Assign Form State
  const [title, setTitle] = useState('Implement Stripe Webhook Verification Endpoint')
  const [skills, setSkills] = useState<string[]>(['Python', 'FastAPI', 'Stripe', 'Redis'])
  const [priority, setPriority] = useState('High')
  const [complexity, setComplexity] = useState(7)
  const [deadlineDays, setDeadlineDays] = useState(5)
  const [assignLoading, setAssignLoading] = useState(false)
  const [assignResult, setAssignResult] = useState<any>(null)
  const [assignError, setAssignError] = useState(false)

  // Split Form State
  const [splitTitle, setSplitTitle] = useState('Build Google OAuth Authentication Flow & Session Management')
  const [splitLoading, setSplitLoading] = useState(false)
  const [splitResult, setSplitResult] = useState<any>(null)
  const [splitError, setSplitError] = useState(false)

  // Parse Form State
  const [nlpText, setNlpText] = useState('Assign critical bug fix for database connection pool exhaustion to Sanjay Gupta by Friday')
  const [parseLoading, setParseLoading] = useState(false)
  const [parseResult, setParseResult] = useState<any>(null)
  const [parseError, setParseError] = useState(false)

  const handleApplyPreset = (p: typeof PRESETS[0]) => {
    setTitle(p.title)
    setSkills(p.skills)
    setPriority(p.priority)
    setComplexity(p.complexity)
    setDeadlineDays(p.deadlineDays)
  }

  const handleAssign = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!title.trim()) return
    setAssignLoading(true)
    setAssignError(false)
    try {
      const res = await assignTask({
        title,
        required_skills: skills,
        priority: priority.toLowerCase(),
        complexity,
        deadline_days: deadlineDays,
        estimated_hours: Math.max(2, complexity * 4)
      })
      setAssignResult(res)
    } catch {
      setAssignError(true)
    } finally {
      setAssignLoading(false)
    }
  }

  const handleSplit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!splitTitle.trim()) return
    setSplitLoading(true)
    setSplitError(false)
    try {
      const res = await splitTask({ task_title: splitTitle, title: splitTitle })
      setSplitResult(res)
    } catch {
      setSplitError(true)
    } finally {
      setSplitLoading(false)
    }
  }

  const handleParse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nlpText.trim()) return
    setParseLoading(true)
    setParseError(false)
    try {
      const res = await parseTask({ description: nlpText })
      setParseResult(res)
    } catch {
      setParseError(true)
    } finally {
      setParseLoading(false)
    }
  }

  // 5-Ring Radial Bar Gauge Data (Selected Candidate Fit Factors)
  const radialGaugeData = [
    { name: 'Burnout Shield', value: assignResult?.factors?.burnout_safety ?? 88, fill: '#e11d48' },
    { name: 'Domain Focus', value: assignResult?.factors?.domain_focus ?? 91, fill: '#7c3aed' },
    { name: 'Sprint Velocity', value: assignResult?.factors?.velocity ?? 89, fill: '#f7a501' },
    { name: 'Headroom Bandwidth', value: assignResult?.factors?.workload_headroom ?? 82, fill: '#0284c7' },
    { name: 'Skill Overlap', value: assignResult?.factors?.skill_match ?? 94, fill: '#059669' },
  ]

  // Team Talent Allocation 2D Scatter Matrix
  // X: Available Capacity % (100 - workload), Y: Skill Match Synergy %
  const scatterCandidates = [
    {
      name: assignResult?.assigned_to || 'Alex Rivera',
      role: 'Staff Backend Engineer',
      capacity: 65,
      skillMatch: assignResult?.confidence ? Math.round(assignResult.confidence) : 94,
      zone: 'Optimal Match',
      color: '#059669',
      isSelected: true
    },
    {
      name: assignResult?.backup || 'Priya Sharma',
      role: 'Senior Systems Engineer',
      capacity: 72,
      skillMatch: 86,
      zone: 'Runner-Up Match',
      color: '#0284c7',
      isSelected: false
    },
    {
      name: 'Sanjay Gupta',
      role: 'Database Performance Architect',
      capacity: 55,
      skillMatch: 78,
      zone: 'Backup #2',
      color: '#f7a501',
      isSelected: false
    },
    {
      name: 'Anya Ivanova',
      role: 'Core Platform Dev',
      capacity: 18,
      skillMatch: 92,
      zone: 'Burnout Watch (Shielded)',
      color: '#dc2626',
      isSelected: false
    },
    {
      name: 'Marcus Chen',
      role: 'DevOps & Cloud Architect',
      capacity: 80,
      skillMatch: 64,
      zone: 'Mentorship / Growth',
      color: '#8b5cf6',
      isSelected: false
    }
  ]

  // Contenders Spectrum
  const contenders = [
    {
      name: assignResult?.assigned_to || 'Alex Rivera',
      role: 'Staff Backend Engineer',
      score: assignResult?.confidence ? Math.round(assignResult.confidence) : 94,
      status: 'Selected',
      color: '#059669',
      reason: 'Optimal Python/FastAPI synergy + 44% capacity headroom without context switching penalty'
    },
    {
      name: assignResult?.backup || 'Priya Sharma',
      role: 'Senior Systems Engineer',
      score: 86,
      status: 'Runner-Up',
      color: '#0284c7',
      reason: 'High velocity and good backend skills, active on 3 secondary infrastructure epics'
    },
    {
      name: 'Sanjay Gupta',
      role: 'Database Performance Architect',
      score: 78,
      status: 'Backup #2',
      color: '#f7a501',
      reason: 'Strong domain familiarity but context switch penalty from sprint 14 auth epics'
    },
    {
      name: 'Anya Ivanova',
      role: 'Core Platform Dev',
      score: 42,
      status: 'Excluded',
      color: '#dc2626',
      reason: 'Safety Shield: Active in 85% burnout watch zone. Hard constraint enforced.'
    },
  ]

  // Subtask Decomposition Data for Split Mode
  const defaultSplitSubtasks = [
    { title: 'Google OAuth Client ID & Secret Setup', skill: 'Security', estimated_hours: 3, priority: 'critical', complexity: 7 },
    { title: 'Callback Endpoint & State Nonce Verification', skill: 'Backend', estimated_hours: 5, priority: 'high', complexity: 8 },
    { title: 'JWT Session Token Issuance & Refresh Strategy', skill: 'Security', estimated_hours: 4, priority: 'high', complexity: 7 },
    { title: 'Frontend Login Button & Auth Context Provider', skill: 'React', estimated_hours: 4, priority: 'medium', complexity: 5 },
    { title: 'PostgreSQL User Accounts Schema Migration', skill: 'Database', estimated_hours: 3, priority: 'high', complexity: 6 },
    { title: 'End-to-End Integration & Security Token Tests', skill: 'Python', estimated_hours: 3, priority: 'medium', complexity: 5 }
  ]

  const activeSubtasks = splitResult?.subtasks || defaultSplitSubtasks

  const subtaskChartData = activeSubtasks.map((st: any) => ({
    name: st.title.length > 24 ? st.title.slice(0, 22) + '...' : st.title,
    hours: st.estimated_hours || 4,
    complexity: st.complexity || 5,
    skill: st.skill || 'Backend'
  }))

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />

      <div className={`main-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <TopBar onToggleSidebar={toggleSidebar} />

        <AuthGuard moduleName="Task Delegator Engine">
          <div className="page-container">
            {/* Header & Mode Switcher */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
              marginBottom: 16,
              paddingBottom: 16,
              borderBottom: '1.5px solid #e2e8f0'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                  <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#23251d', letterSpacing: '-0.02em', margin: 0 }}>
                    5-Factor AI Task Delegator
                  </h1>
                  <span className="badge-bright badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669' }} /> Live 5-Factor Allocator
                  </span>
                  <span className="badge-bright badge-yellow" style={{ fontSize: '11px', fontWeight: 800 }}>
                    Non-Surveillance Engine
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Algorithmic developer matching, multi-story epic decomposition, and plain-text directive synthesis
                </p>
              </div>

              {/* Segmented Mode Switcher */}
              <div style={{
                display: 'inline-flex',
                background: '#ffffff',
                padding: 4,
                borderRadius: 9999,
                border: '1.5px solid #cbd5e1',
                boxShadow: '1px 1px 0px #cbd5e1'
              }}>
                {(['assign', 'split', 'parse'] as const).map(tab => {
                  const isActive = activeTab === tab
                  const labels = {
                    assign: 'AI 5-Factor Dispatch',
                    split: 'Epic Story Decomposer',
                    parse: 'NLP Directive Terminal'
                  }
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: '7px 18px',
                        borderRadius: 9999,
                        fontSize: '12px',
                        fontWeight: 800,
                        border: 'none',
                        cursor: 'pointer',
                        background: isActive ? '#23251d' : 'transparent',
                        color: isActive ? '#ffffff' : '#64748b',
                        transition: 'all 120ms ease'
                      }}
                    >
                      {labels[tab]}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Top Executive Telemetry Ribbon (4 Cards) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
              marginBottom: 20
            }}>
              <div className="bright-card" style={{ padding: '16px 18px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Active Queue Dispatch
                  </span>
                  <Activity size={16} color="#059669" />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#23251d', lineHeight: 1 }}>14 Tasks</div>
                <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: 4 }}>
                  92% automated match rate
                </div>
              </div>

              <div className="bright-card" style={{ padding: '16px 18px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Median Match Fit
                  </span>
                  <Target size={16} color="#f7a501" />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#23251d', lineHeight: 1 }}>94.2%</div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, marginTop: 4 }}>
                  +3.8% algorithmic boost
                </div>
              </div>

              <div className="bright-card" style={{ padding: '16px 18px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Sprint Load Variance
                  </span>
                  <Scale size={16} color="#0284c7" />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#23251d', lineHeight: 1 }}>±7%</div>
                <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700, marginTop: 4 }}>
                  Balanced team headroom
                </div>
              </div>

              <div className="bright-card" style={{ padding: '16px 18px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Burnout Shields
                  </span>
                  <ShieldCheck size={16} color="#e11d48" />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#23251d', lineHeight: 1 }}>6 Protected</div>
                <div style={{ fontSize: '11px', color: '#e11d48', fontWeight: 700, marginTop: 4 }}>
                  Overload cap auto-enforced
                </div>
              </div>
            </div>

            {/* Quick Task Presets Strip */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 20,
              overflowX: 'auto',
              paddingBottom: 4
            }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0 }}>
                ⚡ Quick Presets:
              </span>
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(p)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 8,
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#23251d',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: '1px 1px 0px #cbd5e1',
                    transition: 'all 120ms ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#23251d'; e.currentTarget.style.background = '#fef9ee' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#ffffff' }}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Mode 1: 5-Factor AI Allocation Studio (Golden Ratio 1 : 1.618) */}
            {activeTab === 'assign' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(330px, 1fr) minmax(520px, 1.618fr)',
                gap: 22,
                alignItems: 'start'
              }}>
                {/* Left Column: Task Formulation Studio (~38%) */}
                <div className="bright-card" style={{ padding: 22, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                      <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                        Task Parameters Studio
                      </h2>
                      <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>Tune requirements for algorithmic developer dispatch</p>
                    </div>
                    <span className="badge-bright badge-yellow">Param Studio</span>
                  </div>

                  {assignError && <OfflineBanner />}

                  <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Task Title *
                      </label>
                      <input
                        placeholder="e.g. Build Stripe Webhook Verification Endpoint"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          fontSize: '13px',
                          borderRadius: 8,
                          border: '1.5px solid #cbd5e1',
                          background: '#ffffff',
                          outline: 'none',
                          color: '#23251d'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Required Engineering Skills
                      </label>
                      <SkillChipInput skills={skills} onChange={setSkills} />
                    </div>

                    {/* Urgency Level Selector */}
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Urgency Priority Level
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                        {PRIORITY_OPTIONS.map(p => {
                          const isSel = priority === p
                          const colors: Record<string, string> = { Low: '#059669', Medium: '#f7a501', High: '#ea580c', Critical: '#dc2626' }
                          return (
                            <button
                              type="button"
                              key={p}
                              onClick={() => setPriority(p)}
                              style={{
                                padding: '7px 4px',
                                borderRadius: 8,
                                border: isSel ? `2px solid ${colors[p]}` : '1.5px solid #cbd5e1',
                                background: isSel ? `${colors[p]}15` : '#ffffff',
                                color: isSel ? colors[p] : '#64748b',
                                fontSize: '11px',
                                fontWeight: 800,
                                cursor: 'pointer',
                                transition: 'all 120ms ease'
                              }}
                            >
                              {p}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Dual Sliders: Deadline & Complexity */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div style={{ padding: 12, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Target Deadline</span>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#23251d' }}>{deadlineDays}d</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="30"
                          value={deadlineDays}
                          onChange={e => setDeadlineDays(Number(e.target.value))}
                          style={{ width: '100%', accentColor: '#f7a501', marginTop: 4 }}
                        />
                        <div style={{ fontSize: '9px', color: '#64748b', marginTop: 3 }}>
                          {deadlineDays <= 3 ? '⚡ Fast-track Priority' : deadlineDays <= 10 ? 'Standard Sprint Flow' : 'Paced Milestone'}
                        </div>
                      </div>

                      <div style={{ padding: 12, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Complexity</span>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: complexity >= 8 ? '#dc2626' : complexity >= 5 ? '#f7a501' : '#059669' }}>
                            {complexity}/10
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={complexity}
                          onChange={e => setComplexity(Number(e.target.value))}
                          style={{ width: '100%', accentColor: '#f7a501', marginTop: 4 }}
                        />
                        <div style={{ fontSize: '9px', color: '#64748b', marginTop: 3 }}>
                          Est. Effort: {Math.max(2, complexity * 4)}h
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={assignLoading}
                      style={{
                        marginTop: 4,
                        padding: '12px',
                        background: '#f7a501',
                        color: '#23251d',
                        border: '1.5px solid #23251d',
                        fontWeight: 800,
                        fontSize: '13px',
                        boxShadow: '2px 2px 0px #23251d',
                        borderRadius: 8,
                        cursor: 'pointer',
                        justifyContent: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        transition: 'transform 80ms ease'
                      }}
                    >
                      {assignLoading ? (
                        <><Loader2 size={16} className="animate-spin" /> Matching Developer Talent...</>
                      ) : (
                        <><Brain size={16} /> Run 5-Factor AI Allocation</>
                      )}
                    </button>
                  </form>

                  <div style={{ marginTop: 16, padding: 12, background: '#f1f5f9', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '11px', color: '#475569' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#23251d', marginBottom: 3 }}>
                      <ShieldCheck size={14} color="#059669" /> Privacy-First Mathematical Allocation
                    </div>
                    No invasive keystroke surveillance. Assignments are computed via git domain affinity, headroom bandwidth, and safety guardrails.
                  </div>
                </div>

                {/* Right Column: Multi-Angle Intelligence Canvas (~62%) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Card 1: Selected Candidate Spotlight + 5-Ring Radial Bar Gauge */}
                  <div className="bright-card" style={{ padding: 22, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div>
                        <span className="badge-bright badge-emerald">Optimal 1st Choice Developer</span>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#23251d', margin: '4px 0 0' }}>
                          5-Factor AI Allocation Result
                        </h3>
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
                        Autonomous Match Confidence
                      </span>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(200px, 1fr) minmax(260px, 1.2fr)',
                      gap: 20,
                      alignItems: 'center',
                      background: '#f8fafc',
                      padding: 16,
                      borderRadius: 12,
                      border: '1.5px solid #e2e8f0'
                    }}>
                      {/* Candidate Bio & Details */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                          <div style={{
                            width: 52,
                            height: 52,
                            borderRadius: '50%',
                            background: '#059669',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            fontWeight: 800,
                            boxShadow: '0 0 0 4px #dcfce7'
                          }}>
                            {assignResult?.assigned_to ? assignResult.assigned_to.slice(0, 2).toUpperCase() : 'AR'}
                          </div>
                          <div>
                            <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                              {assignResult?.assigned_to || 'Alex Rivera'}
                            </h4>
                            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
                              {assignResult?.assigned_role || 'Staff Backend Engineer'}
                            </p>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '11px', color: '#334155' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #e2e8f0' }}>
                            <span style={{ color: '#64748b' }}>Current Sprint Load:</span>
                            <strong style={{ color: '#059669' }}>56% Load (Healthy)</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #e2e8f0' }}>
                            <span style={{ color: '#64748b' }}>Primary Domain:</span>
                            <strong>Python • FastAPI • Redis</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #e2e8f0' }}>
                            <span style={{ color: '#64748b' }}>Assigned Backup:</span>
                            <strong>{assignResult?.backup || 'Priya Sharma'}</strong>
                          </div>
                        </div>

                        <div style={{ marginTop: 12, padding: '8px 10px', background: '#ecfdf5', borderRadius: 6, border: '1px solid #a7f3d0', fontSize: '10px', color: '#065f46' }}>
                          ★ <strong>AI Rationale:</strong> Highest skill overlap (94%) with 44% workload headroom and 0 context switching penalty.
                        </div>
                      </div>

                      {/* 5-Ring Radial Bar Gauge */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '100%', height: 200, position: 'relative' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                              cx="50%"
                              cy="50%"
                              innerRadius="25%"
                              outerRadius="95%"
                              barSize={7}
                              data={radialGaugeData}
                              startAngle={90}
                              endAngle={-270}
                            >
                              <RadialBar
                                background={{ fill: '#e2e8f0' }}
                                dataKey="value"
                                cornerRadius={6}
                              />
                              <Tooltip
                                contentStyle={{ background: '#23251d', border: 'none', borderRadius: 8, color: '#ffffff', fontSize: '11px' }}
                                formatter={(val: any) => [`${val}% Fit`, 'Factor Score']}
                              />
                            </RadialBarChart>
                          </ResponsiveContainer>
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center'
                          }}>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: '#23251d', lineHeight: 1 }}>
                              {assignResult?.confidence ? Math.round(assignResult.confidence) : 94}%
                            </div>
                            <div style={{ fontSize: '8px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              Fit Score
                            </div>
                          </div>
                        </div>

                        {/* Radial Rings Legend */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 10px', marginTop: 4 }}>
                          {radialGaugeData.map(item => (
                            <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '10px', color: '#475569' }}>
                              <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.fill }} />
                              <span>{item.name}: <strong>{item.value}%</strong></span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Developer Talent Allocation Decision Matrix (2D Scatter Chart) */}
                  <div className="bright-card" style={{ padding: 22, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                          Talent Decision Matrix (2D Quadrant)
                        </h4>
                        <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
                          Mapping Team Bandwidth vs. Task Skill Match to identify optimal placement
                        </p>
                      </div>
                      <span className="badge-bright badge-indigo">2D Decision Grid</span>
                    </div>

                    <div style={{ width: '100%', height: 240 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 10, right: 20, bottom: 25, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis
                            type="number"
                            dataKey="capacity"
                            name="Available Capacity"
                            unit="%"
                            domain={[0, 100]}
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            label={{ value: 'Available Capacity (%)', position: 'insideBottom', offset: -15, fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                          />
                          <YAxis
                            type="number"
                            dataKey="skillMatch"
                            name="Skill Match"
                            unit="%"
                            domain={[0, 100]}
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            label={{ value: 'Skill Match (%)', angle: -90, position: 'insideLeft', offset: 12, fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                          />
                          <Tooltip content={<CustomScatterTooltip />} />
                          <ReferenceLine x={50} stroke="#cbd5e1" strokeDasharray="3 3" />
                          <ReferenceLine y={50} stroke="#cbd5e1" strokeDasharray="3 3" />
                          <Scatter name="Engineers" data={scatterCandidates}>
                            {scatterCandidates.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                stroke={entry.isSelected ? '#23251d' : '#ffffff'}
                                strokeWidth={entry.isSelected ? 2.5 : 1}
                              />
                            ))}
                          </Scatter>
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Quadrant Legend Bar */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: 8,
                      marginTop: 10,
                      paddingTop: 12,
                      borderTop: '1px solid #f1f5f9',
                      fontSize: '10px'
                    }}>
                      <div style={{ padding: '6px 8px', borderRadius: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534' }}>
                        <strong>★ Optimal Target</strong>: High Capacity & High Skill Match
                      </div>
                      <div style={{ padding: '6px 8px', borderRadius: 6, background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b' }}>
                        <strong>⚠ Burnout Risk</strong>: High Skill but Overloaded (Shielded)
                      </div>
                      <div style={{ padding: '6px 8px', borderRadius: 6, background: '#f5f3ff', border: '1px solid #ddd6fe', color: '#5b21b6' }}>
                        <strong>🌱 Growth Zone</strong>: High Capacity, Good for Upskilling
                      </div>
                      <div style={{ padding: '6px 8px', borderRadius: 6, background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569' }}>
                        <strong>⛔ Off-Domain</strong>: Low Skill Match for this task
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Evaluated Candidate Spectrum */}
                  <div className="bright-card" style={{ padding: 18, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                        Candidate Evaluation Spectrum
                      </h4>
                      <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>4 Candidates Audited</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                      {contenders.map((c, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '10px 14px',
                            borderRadius: 8,
                            background: idx === 0 ? '#f0fdf4' : '#f8fafc',
                            border: `1.5px solid ${idx === 0 ? '#bbf7d0' : '#e2e8f0'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 12
                          }}
                        >
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                              <strong style={{ fontSize: '13px', color: '#23251d' }}>{c.name}</strong>
                              <span style={{ fontSize: '10px', color: '#64748b' }}>• {c.role}</span>
                              <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: 4, background: `${c.color}20`, color: c.color, fontWeight: 800, marginLeft: 'auto' }}>
                                {c.status}
                              </span>
                            </div>
                            <p style={{ fontSize: '11px', color: '#64748b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {c.reason}
                            </p>
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: 800, color: c.color, minWidth: 42, textAlign: 'right' }}>
                            {c.score}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mode 2: Epic Story Decomposer */}
            {activeTab === 'split' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(330px, 35%) minmax(500px, 65%)',
                gap: 22,
                alignItems: 'start'
              }}>
                {/* Left Column: Epic Formulation Form */}
                <div className="bright-card" style={{ padding: 24, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: '0 0 4px' }}>
                    Epic Decomposition Studio
                  </h2>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px' }}>
                    Deconstruct high-level product epics into sprint-sized modular user stories with automatic skill categorization
                  </p>
                  {splitError && <OfflineBanner />}

                  <form onSubmit={handleSplit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
                        Epic Initiative Title *
                      </label>
                      <input
                        placeholder="e.g. Build Google OAuth Authentication Flow & Session Management"
                        value={splitTitle}
                        onChange={e => setSplitTitle(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px 12px', fontSize: '13px', borderRadius: 8, border: '1.5px solid #cbd5e1', background: '#ffffff', outline: 'none', color: '#23251d' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Quick Epic Templates:</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {[
                          'Stripe Payment Gateway Integration',
                          'Real-Time WebSocket Notification Engine',
                          'Microservices Docker Containerization'
                        ].map(tmpl => (
                          <button
                            key={tmpl}
                            type="button"
                            onClick={() => setSplitTitle(tmpl)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: 6,
                              background: '#f8fafc',
                              border: '1px solid #cbd5e1',
                              fontSize: '11px',
                              color: '#334155',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            + {tmpl}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={splitLoading}
                      style={{
                        padding: '12px',
                        background: '#f7a501',
                        color: '#23251d',
                        border: '1.5px solid #23251d',
                        fontWeight: 800,
                        fontSize: '13px',
                        boxShadow: '2px 2px 0px #23251d',
                        borderRadius: 8,
                        cursor: 'pointer',
                        justifyContent: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginTop: 6
                      }}
                    >
                      {splitLoading ? <><Loader2 size={16} className="animate-spin" /> Deconstructing Epic...</> : <><Layers size={16} /> Split Epic with AI</>}
                    </button>
                  </form>
                </div>

                {/* Right Column: Decomposed Stories + Hours Chart */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Effort Allocation Bar Chart */}
                  <div className="bright-card" style={{ padding: 22, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                          Subtask Effort Allocation
                        </h4>
                        <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>Estimated engineering hours per modular user story</p>
                      </div>
                      <span className="badge-bright badge-yellow">
                        Total: {activeSubtasks.reduce((acc: number, cur: any) => acc + (cur.estimated_hours || 4), 0)}h
                      </span>
                    </div>

                    <div style={{ width: '100%', height: 180 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={subtaskChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#475569' }} angle={-15} textAnchor="end" />
                          <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} unit="h" />
                          <Tooltip
                            contentStyle={{ background: '#23251d', border: 'none', borderRadius: 8, color: '#ffffff', fontSize: '11px' }}
                            formatter={(val: any) => [`${val} Hours`, 'Estimated Effort']}
                          />
                          <Bar dataKey="hours" fill="#f7a501" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Stories Pipeline Tree */}
                  <div className="bright-card" style={{ padding: 22, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                        Generated User Story Pipeline ({activeSubtasks.length} Subtasks)
                      </h3>
                      <span className="badge-bright badge-emerald">Sprint-Ready</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {activeSubtasks.map((st: any, idx: number) => {
                        const domainColors: Record<string, string> = {
                          Security: '#e11d48',
                          Backend: '#059669',
                          React: '#0284c7',
                          Database: '#d97706',
                          DevOps: '#7c3aed',
                          Python: '#0d9488'
                        }
                        const pillColor = domainColors[st.skill] || '#475569'

                        return (
                          <div
                            key={idx}
                            style={{
                              padding: '12px 14px',
                              borderRadius: 8,
                              border: '1.5px solid #e2e8f0',
                              background: '#f8fafc',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 12
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{
                                width: 28,
                                height: 28,
                                borderRadius: 6,
                                background: '#23251d',
                                color: '#fff',
                                fontSize: '12px',
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                {idx + 1}
                              </div>
                              <div>
                                <p style={{ fontSize: '13px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                                  {st.title}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                                  <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: 4, background: `${pillColor}15`, color: pillColor, fontWeight: 700 }}>
                                    {st.skill || 'Full-Stack'}
                                  </span>
                                  <span style={{ fontSize: '10px', color: '#64748b' }}>
                                    Complexity: {st.complexity || 5}/10
                                  </span>
                                </div>
                              </div>
                            </div>
                            <span className="badge-bright badge-yellow" style={{ flexShrink: 0 }}>
                              {st.estimated_hours || 4}h effort
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mode 3: NLP Directive Terminal */}
            {activeTab === 'parse' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(330px, 35%) minmax(500px, 65%)',
                gap: 22,
                alignItems: 'start'
              }}>
                <div className="bright-card" style={{ padding: 24, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: '0 0 4px' }}>
                    NLP Directive Terminal
                  </h2>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px' }}>
                    Paste raw Slack instructions or chat notes to automatically extract structured tickets with priority & assignee
                  </p>
                  {parseError && <OfflineBanner />}

                  <form onSubmit={handleParse} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <textarea
                      rows={6}
                      value={nlpText}
                      onChange={e => setNlpText(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '13px',
                        borderRadius: 8,
                        border: '1.5px solid #cbd5e1',
                        background: '#ffffff',
                        outline: 'none',
                        color: '#23251d',
                        lineHeight: 1.5
                      }}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Sample Directives:</span>
                      {[
                        'Deploy critical Redis failover script before Friday release to prevent pool exhaustion',
                        'Assign urgent Stripe webhook idempotency check to Alex Rivera for sprint 15',
                        'Priya needs to build the JWT token rotation handler and refresh cookie storage'
                      ].map(sample => (
                        <button
                          key={sample}
                          type="button"
                          onClick={() => setNlpText(sample)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 6,
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            fontSize: '10px',
                            color: '#334155',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          "{sample}"
                        </button>
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={parseLoading}
                      style={{
                        padding: '12px',
                        background: '#f7a501',
                        color: '#23251d',
                        border: '1.5px solid #23251d',
                        fontWeight: 800,
                        fontSize: '13px',
                        boxShadow: '2px 2px 0px #23251d',
                        borderRadius: 8,
                        cursor: 'pointer',
                        justifyContent: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginTop: 4
                      }}
                    >
                      {parseLoading ? <><Loader2 size={16} className="animate-spin" /> Parsing Directive...</> : <><Zap size={16} /> Parse NLP Directive</>}
                    </button>
                  </form>
                </div>

                {/* Right Column: Parsed Ticket Specification */}
                <div className="bright-card" style={{ padding: 24, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                        Structured Sprint Ticket Specification
                      </h3>
                      <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
                        Algorithmic extraction of intent, priority, skills, and dependencies
                      </p>
                    </div>
                    <span className="badge-bright badge-emerald">Semantic Parsed</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ padding: 14, background: '#f8fafc', borderRadius: 8, border: '1.5px solid #e2e8f0' }}>
                      <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>EXTRACTED DIRECTIVE TITLE</span>
                      <p style={{ fontSize: '15px', fontWeight: 800, color: '#23251d', margin: '3px 0 0' }}>
                        {parseResult?.description ? parseResult.description : 'Database Connection Pool Exhaustion Fix & Redis Scaling'}
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                      <div style={{ padding: 12, background: '#eeefe9', borderRadius: 8, border: '1px solid #cbd5e1' }}>
                        <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>EXTRACTED PRIORITY</span>
                        <p style={{ fontSize: '14px', fontWeight: 800, color: '#dc2626', margin: '3px 0 0', textTransform: 'capitalize' }}>
                          {parseResult?.priority || 'Critical'}
                        </p>
                      </div>
                      <div style={{ padding: 12, background: '#eeefe9', borderRadius: 8, border: '1px solid #cbd5e1' }}>
                        <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>ESTIMATED EFFORT</span>
                        <p style={{ fontSize: '14px', fontWeight: 800, color: '#23251d', margin: '3px 0 0' }}>
                          {parseResult?.estimated_hours || 8} Hours
                        </p>
                      </div>
                      <div style={{ padding: 12, background: '#eeefe9', borderRadius: 8, border: '1px solid #cbd5e1' }}>
                        <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>MATCHED DEVELOPER</span>
                        <p style={{ fontSize: '14px', fontWeight: 800, color: '#059669', margin: '3px 0 0' }}>
                          {parseResult?.assigned_to || 'Sanjay Gupta'}
                        </p>
                      </div>
                    </div>

                    {/* Extracted Skills & Dependencies */}
                    <div style={{ padding: 14, background: '#ffffff', borderRadius: 8, border: '1.5px solid #e2e8f0' }}>
                      <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                        IDENTIFIED REQUISITE SKILLS
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {(parseResult?.extracted_skills || ['Python', 'PostgreSQL', 'Redis', 'Backend']).map((sk: string) => (
                          <span key={sk} className="badge-bright badge-indigo" style={{ padding: '3px 8px', fontSize: '11px', borderRadius: 4 }}>
                            {sk}
                          </span>
                        ))}
                      </div>

                      <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', display: 'block', margin: '12px 0 6px' }}>
                        PREREQUISITE DEPENDENCIES
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {(parseResult?.dependencies || ['Database Schema', 'CI/CD Pipeline']).map((dep: string) => (
                          <span key={dep} style={{ padding: '3px 8px', background: '#f1f5f9', borderRadius: 4, fontSize: '11px', color: '#334155', border: '1px solid #cbd5e1', fontWeight: 600 }}>
                            🔗 {dep}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </AuthGuard>
      </div>
    </div>
  )
}
