'use client'

import { useState } from 'react'
import { assignTask, splitTask, parseTask } from '@/lib/api'
import { OfflineBanner } from '@/components/OfflineBanner'
import { Badge } from '@/components/Badge'
import {
  Brain, Plus, X, Zap, Loader2,
  CheckCircle, Clock, Layers, Star
} from 'lucide-react'

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical']
const PRIORITY_VARIANTS: Record<string, any> = {
  Low: 'teal', Medium: 'amber', High: 'indigo', Critical: 'crimson'
}

/* ── Confidence Ring ──────────────────────────────────────────────────── */
function ConfidenceRing({ value }: { value: number }) {
  const pct = Math.round(value * 100)
  const r = 38; const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  const color = pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={96} height={96} className="confidence-ring">
        <circle cx={48} cy={48} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} />
        <circle
          cx={48} cy={48} r={r} fill="none"
          stroke={color} strokeWidth={6} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 48 48)"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)', filter: `drop-shadow(0 0 6px ${color}60)` }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: 'var(--font-md)', fontWeight: 800, color }}>{pct}%</div>
        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>conf</div>
      </div>
    </div>
  )
}

/* ── Skill Chip Input ─────────────────────────────────────────────────── */
function SkillChipInput({ skills, onChange }: { skills: string[]; onChange: (s: string[]) => void }) {
  const [input, setInput] = useState('')

  const add = () => {
    const s = input.trim()
    if (s && !skills.includes(s)) onChange([...skills, s])
    setInput('')
  }

  const remove = (s: string) => onChange(skills.filter(x => x !== s))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {skills.map(s => (
          <span key={s} className="chip chip-purple" style={{ background: 'var(--accent-indigo-dim)', color: 'var(--accent-indigo)' }}>
            {s}
            <button
              onClick={() => remove(s)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, marginLeft: 2 }}
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          className="orka-input"
          placeholder="Add skill (e.g. Python, React)..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
          style={{ fontSize: 'var(--font-sm)' }}
        />
        <button type="button" className="btn-secondary" onClick={add} style={{ padding: '8px 12px' }}>
          <Plus size={14} />
        </button>
      </div>
    </div>
  )
}

export default function DelegatorPage() {
  const [activeTab, setActiveTab] = useState<'assign' | 'split' | 'parse'>('assign')

  // Assign Form
  const [title, setTitle] = useState('')
  const [skills, setSkills] = useState<string[]>(['Backend', 'Python'])
  const [priority, setPriority] = useState('Medium')
  const [complexity, setComplexity] = useState(5)
  const [deadlineDays, setDeadlineDays] = useState(7)
  const [assignLoading, setAssignLoading] = useState(false)
  const [assignResult, setAssignResult] = useState<any>(null)
  const [assignError, setAssignError] = useState(false)

  // Split Form
  const [splitTitle, setSplitTitle] = useState('')
  const [splitLoading, setSplitLoading] = useState(false)
  const [splitResult, setSplitResult] = useState<any>(null)
  const [splitError, setSplitError] = useState(false)

  // Parse Form
  const [nlpText, setNlpText] = useState('')
  const [parseLoading, setParseLoading] = useState(false)
  const [parseResult, setParseResult] = useState<any>(null)
  const [parseError, setParseError] = useState(false)

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault()
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
      const res = await splitTask({ task_title: splitTitle })
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

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <h1 className="section-title">🧠 Smart Task Delegator</h1>
        <p className="section-subtitle">5-factor AI matching, automatic task splitting, and natural language sentence parsing</p>
      </div>

      {/* Tab Switcher */}
      <div className="tab-bar" style={{ maxWidth: 500, marginBottom: 'var(--space-4)' }}>
        <button className={`tab-btn ${activeTab === 'assign' ? 'active' : ''}`} onClick={() => setActiveTab('assign')}>
          AI Task Assign
        </button>
        <button className={`tab-btn ${activeTab === 'split' ? 'active' : ''}`} onClick={() => setActiveTab('split')}>
          Auto Task Splitter
        </button>
        <button className={`tab-btn ${activeTab === 'parse' ? 'active' : ''}`} onClick={() => setActiveTab('parse')}>
          NLP Sentence Parser
        </button>
      </div>

      {/* Golden Ratio Split Grid: Form (61.8%) vs Results (38.2%) */}
      {activeTab === 'assign' && (
        <div className="golden-grid">
          <div className="glass-card p-6">
            <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: 16 }}>Task Assignment Parameters</h2>
            {assignError && <OfflineBanner />}
            <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  Task Title
                </label>
                <input
                  className="orka-input"
                  placeholder="e.g. Build Payment Gateway Integration"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  Required Skills
                </label>
                <SkillChipInput skills={skills} onChange={setSkills} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                    Priority
                  </label>
                  <select className="orka-select" value={priority} onChange={e => setPriority(e.target.value)}>
                    {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                    Deadline (Days): {deadlineDays}d
                  </label>
                  <input type="range" min="1" max="30" value={deadlineDays} onChange={e => setDeadlineDays(Number(e.target.value))} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  Task Complexity (1–10): {complexity}
                </label>
                <input type="range" min="1" max="10" value={complexity} onChange={e => setComplexity(Number(e.target.value))} />
              </div>

              <button type="submit" className="btn-primary" disabled={assignLoading} style={{ marginTop: 8 }}>
                {assignLoading ? <><Loader2 size={16} className="animate-spin" /> Calculating Fit...</> : <><Brain size={16} /> Run 5-Factor AI Assignment</>}
              </button>
            </form>
          </div>

          {/* Results Panel */}
          <div>
            {assignResult ? (
              <div className="glass-card p-6 animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Badge variant="indigo">Optimal Match Found</Badge>
                  <ConfidenceRing value={(assignResult.confidence || 90) / 100} />
                </div>

                <div>
                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Assigned To</p>
                  <p style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: 'var(--accent-indigo)' }}>{assignResult.assigned_to}</p>
                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{assignResult.assigned_role}</p>
                </div>

                {assignResult.reason && (
                  <div>
                    <p style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>5-Factor Match Rationale:</p>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
                      {assignResult.reason.map((r: string, idx: number) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <CheckCircle size={14} color="#10b981" /> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-card p-8 text-center flex flex-col items-center justify-center" style={{ minHeight: 300 }}>
                <Brain size={42} color="var(--text-faint)" style={{ marginBottom: 12 }} />
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-sm)' }}>Fill out task parameters and run AI assignment to view recommended match.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Task Splitter View */}
      {activeTab === 'split' && (
        <div className="golden-grid">
          <div className="glass-card p-6">
            <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: 16 }}>Auto Task Splitter</h2>
            {splitError && <OfflineBanner />}
            <form onSubmit={handleSplit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  High-Level Task Title
                </label>
                <input
                  className="orka-input"
                  placeholder="e.g. Build User Authentication Module"
                  value={splitTitle}
                  onChange={e => setSplitTitle(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary" disabled={splitLoading}>
                {splitLoading ? <><Loader2 size={16} className="animate-spin" /> Splitting...</> : <><Layers size={16} /> Auto-Split into Subtasks</>}
              </button>
            </form>
          </div>

          <div>
            {splitResult ? (
              <div className="glass-card p-6 flex flex-col gap-4">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700 }}>Subtask Breakdown</h3>
                  <Badge variant="cobalt">{splitResult.subtask_count} subtasks</Badge>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {splitResult.subtasks?.map((st: any, idx: number) => (
                    <div key={idx} style={{ padding: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                      <p style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{st.title}</p>
                      <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Estimated: {st.estimated_hours}h</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass-card p-8 text-center flex flex-col items-center justify-center" style={{ minHeight: 250 }}>
                <Layers size={42} color="var(--text-faint)" style={{ marginBottom: 12 }} />
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-sm)' }}>Enter a high-level task to break it down automatically.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sentence Parser View */}
      {activeTab === 'parse' && (
        <div className="golden-grid">
          <div className="glass-card p-6">
            <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: 16 }}>NLP Sentence Task Parser</h2>
            {parseError && <OfflineBanner />}
            <form onSubmit={handleParse} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  Task Description Sentence
                </label>
                <textarea
                  className="orka-textarea"
                  placeholder="e.g. Build a high performance ML pipeline and API backend using Python and Docker within 5 days."
                  value={nlpText}
                  onChange={e => setNlpText(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary" disabled={parseLoading}>
                {parseLoading ? <><Loader2 size={16} className="animate-spin" /> Parsing...</> : <><Zap size={16} /> Parse NLP Sentence</>}
              </button>
            </form>
          </div>

          <div>
            {parseResult ? (
              <div className="glass-card p-6 flex flex-col gap-4">
                <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700 }}>Parsed Task Intelligence</h3>
                <div>
                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Extracted Skills</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                    {parseResult.extracted_skills?.map((sk: string) => (
                      <Badge key={sk} variant="indigo">{sk}</Badge>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Estimated Hours</p>
                    <p style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: 'var(--accent-cobalt)' }}>{parseResult.estimated_hours}h</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Complexity</p>
                    <p style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: 'var(--accent-indigo)' }}>{parseResult.complexity} / 10</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card p-8 text-center flex flex-col items-center justify-center" style={{ minHeight: 250 }}>
                <Zap size={42} color="var(--text-faint)" style={{ marginBottom: 12 }} />
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-sm)' }}>Paste a raw task sentence to auto-extract skills, complexity, and hours.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
