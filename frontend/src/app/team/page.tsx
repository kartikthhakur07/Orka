'use client'

import { useEffect, useState } from 'react'
import { getTeam, buildTeam, getSkillGap } from '@/lib/api'
import { Users, Plus, X, Zap, Loader2, AlertTriangle, UserPlus, Target } from 'lucide-react'

/* ── helpers ──────────────────────────────────────────────────────────── */
function OfflineBanner() {
  return (
    <div className="offline-banner flex items-center gap-3 mb-4">
      <AlertTriangle size={16} />
      <p style={{ fontSize: '0.85rem' }}>Backend offline — run: <code style={{ background: 'rgba(239,68,68,0.15)', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace' }}>uvicorn main:app --reload</code></p>
    </div>
  )
}

const AVATAR_COLORS = ['#f97316', '#a855f7', '#14b8a6', '#22c55e', '#eab308', '#ef4444', '#3b82f6', '#ec4899']
const SKILL_CHIP_CLASSES = ['chip-orange', 'chip-purple', 'chip-teal', 'chip-green', 'chip-red']

function getInitials(name: string) {
  return (name || 'UN').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
}

/* ── Skill Chip Input ─────────────────────────────────────────────────── */
function SkillChipInput({ skills, onChange }: { skills: string[]; onChange: (s: string[]) => void }) {
  const [input, setInput] = useState('')
  const add = () => {
    const s = input.trim()
    if (s && !skills.includes(s)) onChange([...skills, s])
    setInput('')
  }
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
        {skills.map(s => (
          <span key={s} className="chip chip-orange" style={{ cursor: 'pointer' }} onClick={() => onChange(skills.filter(x => x !== s))}>
            {s} <X size={10} />
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input className="orka-input" style={{ flex: 1 }} placeholder="Add skill… press Enter"
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())} />
        <button className="btn-secondary" onClick={add} style={{ padding: '10px 14px', display: 'flex', alignItems: 'center' }}>
          <Plus size={16} />
        </button>
      </div>
    </div>
  )
}

/* ── Team Member Card ─────────────────────────────────────────────────── */
function MemberCard({ member, idx }: { member: any; idx: number }) {
  const avatarBg = AVATAR_COLORS[idx % AVATAR_COLORS.length]
  const skills: string[] = member.skills || member.skill_set || []
  const workload = member.workload ?? member.current_workload ?? 0
  const dna = member.work_dna || member.dna_badge || member.work_style || ''

  return (
    <div
      className="glass-card p-5 animate-fade-in-up"
      style={{ opacity: 0, animationFillMode: 'forwards', animationDelay: `${idx * 60}ms` }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div className="avatar avatar-lg" style={{ background: `${avatarBg}25`, color: avatarBg }}>
          {getInitials(member.name)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{member.name}</p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{member.role || 'Team Member'}</p>
          {dna && (
            <span className="chip chip-purple" style={{ fontSize: '0.65rem', marginTop: 4 }}>🧬 {dna}</span>
          )}
        </div>
      </div>

      {/* Skills */}
      <div style={{ marginBottom: 12 }}>
        <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
          Skills
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {skills.slice(0, 6).map((s, i) => (
            <span key={i} className={`chip ${SKILL_CHIP_CLASSES[i % SKILL_CHIP_CLASSES.length]}`} style={{ fontSize: '0.7rem' }}>
              {s}
            </span>
          ))}
          {skills.length > 6 && (
            <span className="chip" style={{ fontSize: '0.7rem' }}>+{skills.length - 6}</span>
          )}
        </div>
      </div>

      {/* Workload bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Current Workload</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: workload > 80 ? '#ef4444' : workload > 60 ? '#eab308' : '#22c55e' }}>
            {workload}%
          </span>
        </div>
        <div className="score-bar" style={{ height: 7 }}>
          <div className="score-bar-fill" style={{
            '--target-width': `${workload}%`,
            background: workload > 80
              ? 'linear-gradient(90deg, #ef444470, #ef4444)'
              : workload > 60
              ? 'linear-gradient(90deg, #eab30870, #eab308)'
              : 'linear-gradient(90deg, #22c55e70, #22c55e)'
          } as any} />
        </div>
      </div>
    </div>
  )
}

/* ── Team Members Tab ─────────────────────────────────────────────────── */
function TeamMembersTab() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(false)

  useEffect(() => {
    getTeam()
      .then(res => setMembers(res.members || res.team || (Array.isArray(res) ? res : [])))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card p-5">
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 10, width: '40%' }} />
            </div>
          </div>
          <div className="skeleton" style={{ height: 60, borderRadius: 8, marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 8 }} />
        </div>
      ))}
    </div>
  )

  return (
    <div>
      {error && <OfflineBanner />}
      {members.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <Users size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No team members found</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {members.map((m: any, i: number) => <MemberCard key={i} member={m} idx={i} />)}
        </div>
      )}
    </div>
  )
}

/* ── Build Team Tab ───────────────────────────────────────────────────── */
function BuildTeamTab() {
  const [projectType, setProjectType] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState<any>(null)
  const [error, setError]     = useState(false)

  const submit = async () => {
    setLoading(true); setError(false)
    try {
      const res = await buildTeam({ project_type: projectType, required_skills: skills })
      setResult(res)
    } catch { setError(true) }
    finally { setLoading(false) }
  }

  return (
    <div>
      <div className="glass-card p-6 mb-5">
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserPlus size={16} color="var(--accent-purple)" /> Build AI-Suggested Team
        </h3>
        {error && <OfflineBanner />}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Project Type</label>
            <input className="orka-input" placeholder="e.g. E-commerce, ML Pipeline, SaaS Dashboard…"
              value={projectType} onChange={e => setProjectType(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Required Skills</label>
            <SkillChipInput skills={skills} onChange={setSkills} />
          </div>
          <button className="btn-primary" onClick={submit} disabled={loading || !projectType}>
            {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Building…</> : <><Zap size={14} /> Build AI Team</>}
          </button>
        </div>
      </div>

      {result && (
        <div className="animate-fade-in-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          {/* Suggested Team */}
          {(result.suggested_team || result.team || []).length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>
                ✅ Suggested Team
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
                {(result.suggested_team || result.team || []).map((m: any, i: number) => (
                  <MemberCard key={i} member={m} idx={i} />
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {(result.missing_skills || []).length > 0 && (
            <div className="glass-card p-5 mb-4">
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ef4444', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={14} /> Missing Skills
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {result.missing_skills.map((s: string, i: number) => (
                  <span key={i} className="chip chip-red">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Hire Recommendations */}
          {(result.hire_recommendations || result.recommendations || []).length > 0 && (
            <div className="glass-card p-5">
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-orange)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <UserPlus size={14} /> Hire Recommendations
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(result.hire_recommendations || result.recommendations || []).map((r: string, i: number) => (
                  <div key={i} style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {r}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Skill Gap Tab ────────────────────────────────────────────────────── */
function SkillGapTab() {
  const [skillsInput, setSkillsInput] = useState('')
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState<any>(null)
  const [error, setError]       = useState(false)

  const submit = async () => {
    setLoading(true); setError(false)
    try {
      const res = await getSkillGap(skillsInput)
      setResult(res)
    } catch { setError(true) }
    finally { setLoading(false) }
  }

  return (
    <div>
      <div className="glass-card p-6 mb-5">
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Target size={16} color="var(--accent-teal)" /> Skill Gap Analysis
        </h3>
        {error && <OfflineBanner />}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Project Skills Required <span style={{ color: 'var(--text-faint)' }}>(comma separated)</span>
            </label>
            <input className="orka-input" placeholder="e.g. React, Python, AWS, Docker, ML…"
              value={skillsInput} onChange={e => setSkillsInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
          <button className="btn-primary" onClick={submit} disabled={loading}>
            {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing…</> : <><Zap size={14} /> Analyze Gaps</>}
          </button>
        </div>
      </div>

      {result && (
        <div className="animate-fade-in-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            {/* Available skills */}
            <div className="glass-card p-5">
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#22c55e', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                ✅ Available Skills
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(result.available_skills || result.team_skills || []).map((s: string, i: number) => (
                  <span key={i} className="chip chip-green">{s}</span>
                ))}
                {(result.available_skills || result.team_skills || []).length === 0 && (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>None found</span>
                )}
              </div>
            </div>

            {/* Missing skills */}
            <div className="glass-card p-5">
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ef4444', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                ❌ Missing Skills
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(result.missing_skills || result.gaps || []).map((s: string, i: number) => (
                  <span key={i} className="chip chip-red">{s}</span>
                ))}
                {(result.missing_skills || result.gaps || []).length === 0 && (
                  <span style={{ color: '#22c55e', fontSize: '0.82rem' }}>✅ All skills covered!</span>
                )}
              </div>
            </div>
          </div>

          {/* Gap score */}
          {result.gap_score !== undefined && (
            <div className="glass-card p-5 mb-4">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Coverage Score</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: result.gap_score >= 70 ? '#22c55e' : result.gap_score >= 40 ? '#eab308' : '#ef4444' }}>
                  {result.gap_score}%
                </span>
              </div>
              <div className="score-bar" style={{ height: 10 }}>
                <div className="score-bar-fill" style={{
                  '--target-width': `${result.gap_score}%`,
                  background: result.gap_score >= 70 ? 'linear-gradient(90deg, #22c55e70, #22c55e)' :
                              result.gap_score >= 40 ? 'linear-gradient(90deg, #eab30870, #eab308)' :
                              'linear-gradient(90deg, #ef444470, #ef4444)'
                } as any} />
              </div>
            </div>
          )}

          {/* Hire recommendations */}
          {(result.hire_recommendations || result.recommendations || []).length > 0 && (
            <div className="glass-card p-5">
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-orange)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <UserPlus size={14} /> Hire Recommendations
              </h3>
              {(result.hire_recommendations || result.recommendations || []).map((r: string, i: number) => (
                <div key={i} style={{ padding: '8px 12px', borderRadius: 8, marginBottom: 6, background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {r}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Main ─────────────────────────────────────────────────────────────── */
export default function TeamPage() {
  const [tab, setTab] = useState(0)
  const tabs = ['Team Members', 'Build Team', 'Skill Gap']

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 className="section-title">👥 Team Builder</h1>
        <p className="section-subtitle">Manage your team, build AI-curated squads, and analyze skill coverage</p>
      </div>

      <div className="tab-bar mb-6" style={{ maxWidth: 400 }}>
        {tabs.map((t, i) => (
          <button key={t} className={`tab-btn ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && <TeamMembersTab />}
      {tab === 1 && <BuildTeamTab />}
      {tab === 2 && <SkillGapTab />}
    </div>
  )
}
