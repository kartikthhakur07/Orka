'use client'

import { useEffect, useState } from 'react'
import { getTeam, buildTeam, getSkillGap } from '@/lib/api'
import OfflineBanner from '@/components/OfflineBanner'
import Badge from '@/components/Badge'
import StatCard from '@/components/StatCard'
import { Users, Plus, X, Zap, Loader2, UserPlus, Target, AlertCircle } from 'lucide-react'

const AVATAR_COLORS = ['#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#8b5cf6', '#ec4899']

function getInitials(name: string) {
  return (name || 'UN').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
}

function SkillChipInput({ skills, onChange }: { skills: string[]; onChange: (s: string[]) => void }) {
  const [input, setInput] = useState('')
  const add = () => {
    const s = input.trim()
    if (s && !skills.includes(s)) onChange([...skills, s])
    setInput('')
  }
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        {skills.map(s => (
          <Badge key={s} variant="blue" style={{ cursor: 'pointer' }} onClick={() => onChange(skills.filter(x => x !== s))}>
            {s} <X size={10} style={{ marginLeft: 4 }} />
          </Badge>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <input className="orka-input" style={{ flex: 1, fontSize: 'var(--font-xs)' }} placeholder="Add skill… press Enter"
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())} />
        <button className="btn-secondary" onClick={add} style={{ padding: '10px 16px', display: 'flex', alignItems: 'center' }}>
          <Plus size={16} />
        </button>
      </div>
    </div>
  )
}

function MemberCard({ member, idx }: { member: any; idx: number }) {
  const avatarBg = AVATAR_COLORS[idx % AVATAR_COLORS.length]
  const skills: string[] = member.skills || member.skill_set || []
  const workload = member.workload ?? member.current_workload ?? 0
  const dna = member.work_dna || member.dna_badge || member.work_style || ''

  return (
    <div
      className="glass-card p-6 animate-fade-in-up"
      style={{ opacity: 0, animationFillMode: 'forwards', animationDelay: `${idx * 60}ms` }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div className="avatar avatar-lg" style={{ background: `${avatarBg}20`, color: avatarBg }}>
          {getInitials(member.name)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>{member.name}</p>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{member.role || 'Team Member'}</p>
          {dna && (
            <div style={{ marginTop: 6 }}>
              <Badge variant="purple">🧬 {dna}</Badge>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          Skills Matrix
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {skills.slice(0, 6).map((s, i) => (
            <Badge key={i} variant={i % 2 === 0 ? 'blue' : 'cyan'}>
              {s}
            </Badge>
          ))}
          {skills.length > 6 && (
            <Badge variant="neutral">+{skills.length - 6}</Badge>
          )}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Current Capacity Load</span>
          <span style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: workload > 80 ? '#ef4444' : workload > 60 ? '#f59e0b' : '#10b981' }}>
            {workload}%
          </span>
        </div>
        <div className="score-bar" style={{ height: 7 }}>
          <div className="score-bar-fill" style={{
            '--target-width': `${workload}%`,
            background: workload > 80
              ? 'linear-gradient(90deg, #ef444470, #ef4444)'
              : workload > 60
              ? 'linear-gradient(90deg, #f59e0b70, #f59e0b)'
              : 'linear-gradient(90deg, #10b98170, #10b981)'
          } as any} />
        </div>
      </div>
    </div>
  )
}

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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 21 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card p-6">
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 12, width: '40%' }} />
            </div>
          </div>
          <div className="skeleton" style={{ height: 60, borderRadius: 8, marginBottom: 16 }} />
          <div className="skeleton" style={{ height: 8 }} />
        </div>
      ))}
    </div>
  )

  const avgWorkload = members.length > 0
    ? Math.round(members.reduce((acc, m) => acc + (m.workload ?? m.current_workload ?? 0), 0) / members.length)
    : 0

  return (
    <div>
      {error && <OfflineBanner />}

      {!loading && !error && members.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 13, marginBottom: 34 }}>
          <StatCard title="Total Team Roster" value={members.length} icon={Users} badge={{ text: 'Active', variant: 'blue' }} />
          <StatCard title="Avg Capacity Load" value={`${avgWorkload}%`} icon={Zap} badge={{ text: avgWorkload > 80 ? 'High' : 'Optimal', variant: avgWorkload > 80 ? 'yellow' : 'green' }} />
          <StatCard title="AI Skills Coverage" value="94%" icon={Target} badge={{ text: 'High', variant: 'purple' }} />
        </div>
      )}

      {members.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <Users size={36} color="var(--text-muted)" style={{ margin: '0 auto 13px' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No team members found</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 21 }}>
          {members.map((m: any, i: number) => <MemberCard key={i} member={m} idx={i} />)}
        </div>
      )}
    </div>
  )
}

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
    <div className="golden-grid mb-8">
      <div>
        <div className="glass-card p-6">
          <h3 style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 21, display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserPlus size={16} color="var(--accent-primary)" /> Build AI-Curated Squad
          </h3>
          {error && <OfflineBanner />}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Project Scope / Type</label>
              <input className="orka-input" style={{ fontSize: 'var(--font-xs)' }} placeholder="e.g. E-commerce, ML Pipeline, SaaS Dashboard…"
                value={projectType} onChange={e => setProjectType(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Required Skills</label>
              <SkillChipInput skills={skills} onChange={setSkills} />
            </div>
            <button className="btn-primary" onClick={submit} disabled={loading || !projectType}>
              {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Building Squad…</> : <><Zap size={14} /> Synthesize Team Squad</>}
            </button>
          </div>
        </div>

        {result && (
          <div className="animate-fade-in-up" style={{ marginTop: 21, opacity: 0, animationFillMode: 'forwards' }}>
            {(result.suggested_team || result.team || []).length > 0 && (
              <div style={{ marginBottom: 21 }}>
                <h3 style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 13 }}>
                  Suggested Squad Members
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 13 }}>
                  {(result.suggested_team || result.team || []).map((m: any, i: number) => (
                    <MemberCard key={i} member={m} idx={i} />
                  ))}
                </div>
              </div>
            )}

            {(result.missing_skills || []).length > 0 && (
              <div className="glass-card p-6 mb-4">
                <h3 style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: '#ef4444', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertCircle size={14} /> Missing Skill Gaps
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {result.missing_skills.map((s: string, i: number) => (
                    <Badge key={i} variant="red">{s}</Badge>
                  ))}
                </div>
              </div>
            )}

            {(result.hire_recommendations || result.recommendations || []).length > 0 && (
              <div className="glass-card p-6">
                <h3 style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <UserPlus size={14} /> Strategic Hiring Recommendations
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(result.hire_recommendations || result.recommendations || []).map((r: string, i: number) => (
                    <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(99,102,241,0.06)', border: '1px solid var(--border-subtle)', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <div className="glass-card p-6">
          <h3 style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 13 }}>
            Squad Composition Logic
          </h3>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
            ORKA analyzes individual skill matrix, historical sprint velocity, and current workload to select optimal multi-disciplinary project teams.
          </p>
          <div style={{ padding: 13, background: 'rgba(99,102,241,0.06)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: 4 }}>💡 Capacity Balancing</p>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Engineers above 85% capacity load are automatically excluded from heavy new feature squads.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

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
      <div className="glass-card p-6 mb-8">
        <h3 style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 21, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Target size={16} color="var(--accent-primary)" /> Team Skill Gap Analysis
        </h3>
        {error && <OfflineBanner />}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Project Skills Required <span style={{ color: 'var(--text-muted)' }}>(comma separated)</span>
            </label>
            <input className="orka-input" style={{ fontSize: 'var(--font-xs)' }} placeholder="e.g. React, Python, AWS, Docker, ML…"
              value={skillsInput} onChange={e => setSkillsInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
          <button className="btn-primary" onClick={submit} disabled={loading}>
            {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing Matrix…</> : <><Zap size={14} /> Analyze Skill Coverage</>}
          </button>
        </div>
      </div>

      {result && (
        <div className="animate-fade-in-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 21, marginBottom: 21 }}>
            <div className="glass-card p-6">
              <h3 style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: '#10b981', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                Available Skills Covered
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(result.available_skills || result.team_skills || []).map((s: string, i: number) => (
                  <Badge key={i} variant="green">{s}</Badge>
                ))}
                {(result.available_skills || result.team_skills || []).length === 0 && (
                  <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-xs)' }}>None found</span>
                )}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: '#ef4444', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                Missing Skill Gaps
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(result.missing_skills || result.gaps || []).map((s: string, i: number) => (
                  <Badge key={i} variant="red">{s}</Badge>
                ))}
                {(result.missing_skills || result.gaps || []).length === 0 && (
                  <span style={{ color: '#10b981', fontSize: 'var(--font-xs)' }}>All skills fully covered!</span>
                )}
              </div>
            </div>
          </div>

          {result.gap_score !== undefined && (
            <div className="glass-card p-6 mb-6">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>Skill Matrix Coverage Score</span>
                <span style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: result.gap_score >= 70 ? '#10b981' : result.gap_score >= 40 ? '#f59e0b' : '#ef4444' }}>
                  {result.gap_score}%
                </span>
              </div>
              <div className="score-bar" style={{ height: 10 }}>
                <div className="score-bar-fill" style={{
                  '--target-width': `${result.gap_score}%`,
                  background: result.gap_score >= 70 ? 'linear-gradient(90deg, #10b98170, #10b981)' :
                              result.gap_score >= 40 ? 'linear-gradient(90deg, #f59e0b70, #f59e0b)' :
                              'linear-gradient(90deg, #ef444470, #ef4444)'
                } as any} />
              </div>
            </div>
          )}

          {(result.hire_recommendations || result.recommendations || []).length > 0 && (
            <div className="glass-card p-6">
              <h3 style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <UserPlus size={14} /> Hire Recommendations
              </h3>
              {(result.hire_recommendations || result.recommendations || []).map((r: string, i: number) => (
                <div key={i} style={{ padding: '10px 12px', borderRadius: 8, marginBottom: 8, background: 'rgba(99,102,241,0.06)', border: '1px solid var(--border-subtle)', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
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

export default function TeamPage() {
  const [tab, setTab] = useState(0)
  const tabs = ['Team Members', 'Build Team', 'Skill Gap']

  return (
    <div>
      <div style={{ marginBottom: 34 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <h1 className="section-title">Team Builder</h1>
          <Badge variant="purple">Squad AI</Badge>
        </div>
        <p className="section-subtitle">Manage team roster, build AI-curated project squads, and analyze skill coverage</p>
      </div>

      <div className="tab-bar mb-6" style={{ maxWidth: 420 }}>
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

