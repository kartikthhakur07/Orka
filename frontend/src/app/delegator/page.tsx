'use client'

import { useState } from 'react'
import { assignTask, splitTask, parseTask } from '@/lib/api'
import {
  Brain, Plus, X, Zap, Loader2, AlertTriangle,
  CheckCircle, ChevronRight, Clock, Layers, Star
} from 'lucide-react'

/* ── helpers ──────────────────────────────────────────────────────────── */
function OfflineBanner() {
  return (
    <div className="offline-banner flex items-center gap-3 mb-4">
      <AlertTriangle size={16} />
      <p style={{ fontSize: '0.85rem' }}>
        Backend offline — run: <code style={{ background: 'rgba(239,68,68,0.15)', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace' }}>uvicorn main:app --reload</code>
      </p>
    </div>
  )
}

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical']
const PRIORITY_COLORS: Record<string, string> = {
  Low: 'teal', Medium: 'yellow', High: 'orange', Critical: 'red'
}

/* ── Confidence Ring ──────────────────────────────────────────────────── */
function ConfidenceRing({ value }: { value: number }) {
  const pct = Math.round(value * 100)
  const r = 38; const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  const color = pct >= 75 ? '#22c55e' : pct >= 50 ? '#eab308' : '#ef4444'

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={96} height={96} className="confidence-ring">
        <circle cx={48} cy={48} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
        <circle
          cx={48} cy={48} r={r} fill="none"
          stroke={color} strokeWidth={6} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 48 48)"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)', filter: `drop-shadow(0 0 6px ${color}60)` }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: '1.3rem', fontWeight: 800, color }}>{pct}%</div>
        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>conf</div>
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
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
        {skills.map(s => (
          <span key={s} className="chip chip-orange" style={{ cursor: 'pointer' }} onClick={() => remove(s)}>
            {s} <X size={10} />
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="orka-input"
          style={{ flex: 1 }}
          placeholder="e.g. Python, React, ML…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
        />
        <button className="btn-secondary" onClick={add} style={{ padding: '10px 14px', display: 'flex', alignItems: 'center' }}>
          <Plus size={16} />
        </button>
      </div>
    </div>
  )
}

/* ── Assign Tab ───────────────────────────────────────────────────────── */
function AssignTab() {
  const [form, setForm] = useState({
    title: '', skills: [] as string[], priority: 'Medium',
    complexity: 5, deadline_days: 7
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState(false)

  const submit = async () => {
    setLoading(true); setError(false)
    try {
      const res = await assignTask({
        task: form.title, required_skills: form.skills,
        priority: form.priority, complexity: form.complexity,
        deadline_days: form.deadline_days,
      })
      setResult(res)
    } catch { setError(true) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: 20 }}>
      {/* Form */}
      <div className="glass-card p-6">
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Brain size={16} color="var(--accent-orange)" /> Task Details
        </h3>

        {error && <OfflineBanner />}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Task Title
            </label>
            <input className="orka-input" placeholder="e.g. Build payment gateway…"
              value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Required Skills
            </label>
            <SkillChipInput skills={form.skills} onChange={s => setForm(p => ({ ...p, skills: s }))} />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Priority
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              {PRIORITY_OPTIONS.map(p => (
                <button key={p} onClick={() => setForm(x => ({ ...x, priority: p }))}
                  style={{
                    flex: 1, padding: '8px 4px', borderRadius: 8,
                    border: `1px solid ${form.priority === p ? `rgba(249,115,22,0.40)` : 'var(--border-card)'}`,
                    background: form.priority === p ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.03)',
                    color: form.priority === p ? 'var(--accent-orange)' : 'var(--text-secondary)',
                    fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 150ms'
                  }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'flex', justifyContent: 'space-between', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span>Complexity</span>
              <span style={{ color: 'var(--accent-orange)', fontWeight: 700 }}>{form.complexity}/10</span>
            </label>
            <input type="range" min={1} max={10} value={form.complexity}
              onChange={e => setForm(p => ({ ...p, complexity: +e.target.value }))} />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'flex', justifyContent: 'space-between', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span>Deadline</span>
              <span style={{ color: 'var(--accent-orange)', fontWeight: 700 }}>{form.deadline_days} days</span>
            </label>
            <input type="range" min={1} max={90} value={form.deadline_days}
              onChange={e => setForm(p => ({ ...p, deadline_days: +e.target.value }))} />
          </div>

          <button className="btn-primary" onClick={submit} disabled={loading || !form.title} style={{ marginTop: 4 }}>
            {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing…</> : <><Zap size={14} /> ⚡ AI Assign</>}
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="glass-card p-6 animate-fade-in-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>
            ✅ Assignment Result
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <ConfidenceRing value={result.confidence ?? 0.85} />
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>Assigned To</p>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-orange)', letterSpacing: '-0.02em' }}>
                {result.assigned_to || result.assignee || result.name || '—'}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                {result.role || ''}
              </p>
            </div>
          </div>

          {/* Reasons */}
          {(result.reasons || result.reason_chips) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {(result.reasons || result.reason_chips || []).map((r: string, i: number) => (
                <span key={i} className="chip chip-green">
                  <CheckCircle size={10} /> {r}
                </span>
              ))}
            </div>
          )}

          {/* Backup */}
          {result.backup && (
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: 10, marginBottom: 16 }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>Backup Option</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {result.backup}
              </p>
            </div>
          )}

          {/* All candidates */}
          {(result.all_candidates || result.candidates) && (
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                All Candidates
              </p>
              {(result.all_candidates || result.candidates || []).slice(0, 5).map((c: any, i: number) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{c.name || c}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-orange)', fontWeight: 600 }}>{Math.round((c.score || c.fit || 0.5) * 100)}%</span>
                  </div>
                  <div className="score-bar">
                    <div className="score-bar-fill" style={{
                      '--target-width': `${Math.round((c.score || c.fit || 0.5) * 100)}%`,
                      background: 'linear-gradient(90deg, var(--accent-orange)80, var(--accent-orange))'
                    } as any} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Split Tab ────────────────────────────────────────────────────────── */
function SplitTab() {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState(false)

  const submit = async () => {
    setLoading(true); setError(false)
    try {
      const res = await splitTask({ project: title, task: title })
      setResult(res)
    } catch { setError(true) }
    finally { setLoading(false) }
  }

  const BADGE_COLORS = ['chip-orange', 'chip-purple', 'chip-teal', 'chip-green']

  return (
    <div>
      <div className="glass-card p-6 mb-5">
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Layers size={16} color="var(--accent-purple)" /> Split Task with AI
        </h3>
        {error && <OfflineBanner />}
        <div style={{ display: 'flex', gap: 10 }}>
          <input className="orka-input" style={{ flex: 1 }} placeholder="e.g. Build user authentication system…"
            value={title} onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()} />
          <button className="btn-primary" onClick={submit} disabled={loading || !title}>
            {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <><Zap size={14} /> Split</>}
          </button>
        </div>
      </div>

      {result && (
        <div className="glass-card p-6 animate-fade-in-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>
            📦 Subtasks Generated
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(result.subtasks || result.tasks || []).map((t: any, i: number) => (
              <div
                key={i}
                className="animate-fade-in-left"
                style={{
                  padding: '14px 16px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex', alignItems: 'center', gap: 12,
                  opacity: 0, animationFillMode: 'forwards',
                  animationDelay: `${i * 80}ms`
                }}
              >
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-orange)' }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {t.title || t.name || t}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {t.skills && t.skills.map((s: string, j: number) => (
                      <span key={j} className={`chip ${BADGE_COLORS[j % BADGE_COLORS.length]}`} style={{ fontSize: '0.68rem' }}>{s}</span>
                    ))}
                    {t.hours && (
                      <span className="chip" style={{ fontSize: '0.68rem' }}>
                        <Clock size={9} /> {t.hours}h
                      </span>
                    )}
                    {t.priority && (
                      <span className={`badge badge-${PRIORITY_COLORS[t.priority] || 'gray'}`}>
                        {t.priority}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight size={14} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Parse Tab ────────────────────────────────────────────────────────── */
function ParseTab() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState(false)

  const submit = async () => {
    setLoading(true); setError(false)
    try {
      const res = await parseTask({ description: text })
      setResult(res)
    } catch { setError(true) }
    finally { setLoading(false) }
  }

  return (
    <div>
      <div className="glass-card p-6 mb-5">
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Star size={16} color="var(--accent-teal)" /> Parse Natural Language Task
        </h3>
        {error && <OfflineBanner />}
        <textarea className="orka-textarea" rows={4}
          placeholder="e.g. Build a React dashboard with real-time charts, needs TypeScript and Tailwind, due in 2 weeks, depends on backend API being ready…"
          value={text} onChange={e => setText(e.target.value)} />
        <button className="btn-primary mt-3" onClick={submit} disabled={loading || !text}>
          {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <><Zap size={14} /> Parse Task</>}
        </button>
      </div>

      {result && (
        <div className="glass-card p-6 animate-fade-in-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>
            🔍 Extracted Task Intelligence
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Skills Detected</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(result.skills || result.required_skills || []).map((s: string, i: number) => (
                  <span key={i} className="chip chip-orange">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Estimates</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {result.estimated_hours && (
                  <span className="chip chip-purple"><Clock size={10} /> {result.estimated_hours}h estimated</span>
                )}
                {result.priority && (
                  <span className={`badge badge-${PRIORITY_COLORS[result.priority] || 'gray'}`}>{result.priority}</span>
                )}
              </div>
            </div>
            {(result.dependencies || []).length > 0 && (
              <div style={{ gridColumn: '1/-1' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Dependencies</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {result.dependencies.map((d: string, i: number) => (
                    <span key={i} className="chip chip-teal">{d}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Main ─────────────────────────────────────────────────────────────── */
export default function DelegatorPage() {
  const [tab, setTab] = useState(0)
  const tabs = ['Assign Task', 'Split Task', 'Parse Task']

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 className="section-title">🧠 Smart Task Delegator</h1>
        <p className="section-subtitle">AI-powered task assignment, splitting, and parsing</p>
      </div>

      <div className="tab-bar mb-6" style={{ maxWidth: 440 }}>
        {tabs.map((t, i) => (
          <button key={t} className={`tab-btn ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && <AssignTab />}
      {tab === 1 && <SplitTab />}
      {tab === 2 && <ParseTab />}
    </div>
  )
}
