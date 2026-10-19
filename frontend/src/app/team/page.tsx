'use client'

import { useState, useEffect, useMemo } from 'react'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import { AuthGuard } from '@/components/AuthGuard'
import { getTeam, createMember, buildTeam, getSkillGap } from '@/lib/api'
import OfflineBanner from '@/components/OfflineBanner'
import {
  Users, UserCheck, Plus, X, Search, CheckCircle2,
  AlertTriangle, Sparkles, Brain, Award, Activity, Zap, TrendingUp,
  Layers, ShieldCheck, Compass, BarChart2, ChevronRight, Sliders
} from 'lucide-react'
import {
  ScatterChart, Scatter, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, CartesianGrid, ReferenceLine, Legend,
  RadialBarChart, RadialBar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadarChart, Radar
} from 'recharts'
import { useSidebar } from '@/context/SidebarContext'

const AVATAR_COLORS = ['#059669', '#0284c7', '#7c3aed', '#d97706', '#db2777', '#0891b2']

function getInitials(name: string) {
  return (name || 'UN').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
}

/* ── Custom Scatter Tooltip for Team Capacity vs Mastery ───────────────── */
function CustomTeamTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div style={{
        background: '#23251d',
        color: '#ffffff',
        padding: '10px 14px',
        borderRadius: 8,
        fontSize: '11px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
        border: '1px solid #33342d',
        maxWidth: 240
      }}>
        <div style={{ fontWeight: 800, fontSize: '12px', color: '#f7a501', marginBottom: 2 }}>
          {data.name}
        </div>
        <div style={{ color: '#cbd5e1', marginBottom: 6, fontSize: '10px' }}>
          {data.role}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '2px 8px', fontSize: '10px' }}>
          <span style={{ color: '#94a3b8' }}>Workload:</span>
          <span style={{ fontWeight: 700, color: data.workload > 80 ? '#dc2626' : '#10b981' }}>{data.workload}%</span>
          <span style={{ color: '#94a3b8' }}>Performance:</span>
          <span style={{ fontWeight: 700, color: '#38bdf8' }}>{data.performance}%</span>
          <span style={{ color: '#94a3b8' }}>Quadrant:</span>
          <span style={{ fontWeight: 700, color: data.color }}>{data.zone}</span>
        </div>
      </div>
    )
  }
  return null
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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
        {skills.map(s => (
          <span key={s} className="badge-bright badge-indigo" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', fontSize: '11px', padding: '3px 8px' }} onClick={() => onChange(skills.filter(x => x !== s))}>
            {s} <X size={11} style={{ marginLeft: 4 }} />
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          style={{ flex: 1, fontSize: '13px', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', background: '#ffffff', color: '#23251d', outline: 'none' }}
          placeholder="Add required skill (e.g. Docker, Redis, Go)..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
        />
        <button className="btn-secondary" onClick={add} style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
          <Plus size={14} /> Add
        </button>
      </div>
    </div>
  )
}

function MemberCard({ member, idx }: { member: any; idx: number }) {
  const avatarBg = AVATAR_COLORS[idx % AVATAR_COLORS.length]
  const skills: string[] = member.skills || member.skill_set || ['Backend', 'Python', 'API']
  const workload = member.workload ?? member.current_workload ?? 55
  const dna = member.work_dna || member.dna_badge || member.work_style || 'System Architect'

  return (
    <div
      className="bright-card"
      style={{
        padding: 20,
        background: '#ffffff',
        border: '1.5px solid #cbd5e1',
        borderRadius: 14,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.15s ease'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: avatarBg, color: '#ffffff', fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px',
            flexShrink: 0
          }}>
            {getInitials(member.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '14px', fontWeight: 800, color: '#23251d', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {member.name}
            </p>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>{member.role || 'Full-Stack Developer'}</p>
          </div>
        </div>

        {dna && (
          <div style={{ marginBottom: 12 }}>
            <span className="badge-bright badge-purple" style={{ fontSize: '10px' }}>🧬 {dna}</span>
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
            Verified Skills
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {skills.slice(0, 5).map((s, i) => (
              <span key={i} className={`badge-bright ${i % 2 === 0 ? 'badge-indigo' : 'badge-sky'}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                {s}
              </span>
            ))}
            {skills.length > 5 && (
              <span className="badge-bright badge-neutral" style={{ fontSize: '10px', padding: '2px 6px' }}>+{skills.length - 5}</span>
            )}
          </div>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Capacity Load</span>
          <span style={{ fontSize: '11px', fontWeight: 800, color: workload > 80 ? '#dc2626' : workload > 60 ? '#d97706' : '#059669' }}>
            {workload}%
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' }}>
          <div style={{
            width: `${workload}%`, height: '100%', borderRadius: 999,
            background: workload > 80 ? '#dc2626' : workload > 60 ? '#f7a501' : '#059669'
          }} />
        </div>
      </div>
    </div>
  )
}

function TeamMembersTab({ members, onRefresh }: { members: any[]; onRefresh: () => void }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [skillsStr, setSkillsStr] = useState('')
  const [workload, setWorkload] = useState(55)
  const [performance, setPerformance] = useState(88)

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !role.trim()) return

    try {
      setSaving(true)
      const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean)
      await createMember({
        name: name.trim(),
        role: role.trim(),
        skills: skills.length ? skills : ['Python', 'Backend', 'API'],
        workload: Number(workload),
        performance_rating: Number(performance),
      })
      setShowAddModal(false)
      setName('')
      setRole('')
      setSkillsStr('')
      onRefresh()
    } catch (err: any) {
      console.error('Failed to add member:', err)
    } finally {
      setSaving(false)
    }
  }

  const filtered = members.filter(m => {
    const q = search.toLowerCase()
    return (m.name || '').toLowerCase().includes(q) || (m.role || '').toLowerCase().includes(q)
  })

  // Distinct Chart 1: Squad Capacity vs Mastery 2D Decision Scatter Matrix
  const scatterData = useMemo(() => {
    return members.map((m, idx) => {
      const w = m.workload ?? 55
      const perf = m.performance_rating ?? (w > 80 ? 94 : w > 50 ? 88 : 78)

      let zone = 'Growth Headroom'
      let color = '#0284c7'
      if (perf >= 85 && w <= 70) {
        zone = 'Available Power'
        color = '#059669'
      } else if (w > 75) {
        zone = 'Surge Load'
        color = '#dc2626'
      }

      return {
        id: m.id || idx,
        name: m.name,
        role: m.role,
        workload: w,
        performance: perf,
        color,
        zone
      }
    })
  }, [members])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ position: 'relative', minWidth: 260 }}>
          <Search size={14} color="#64748b" style={{ position: 'absolute', left: 10, top: 10 }} />
          <input
            placeholder="Search engineer by name or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '7px 12px 7px 32px',
              borderRadius: 8,
              border: '1.5px solid #cbd5e1',
              fontSize: '12px',
              outline: 'none',
              background: '#ffffff',
              width: '100%'
            }}
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            background: '#f7a501',
            color: '#23251d',
            border: '1.5px solid #23251d',
            fontWeight: 800,
            fontSize: '12px',
            borderRadius: 8,
            boxShadow: '2px 2px 0px #23251d',
            cursor: 'pointer'
          }}
        >
          <Plus size={15} /> Add Team Member
        </button>
      </div>

      {/* Golden Ratio Split 1.618 : 1 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(480px, 1.618fr) minmax(340px, 1fr)',
        gap: 22,
        alignItems: 'start'
      }}>
        {/* Left Column (61.8%): Member Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 14,
          alignItems: 'stretch'
        }}>
          {filtered.map((m, idx) => (
            <MemberCard key={m.id || idx} member={m} idx={idx} />
          ))}
        </div>

        {/* Right Column (38.2%): Capacity vs Mastery Scatter Matrix */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="bright-card" style={{ padding: 20, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#23251d', margin: 0 }}>
                  Capacity vs. Mastery Matrix
                </h3>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>Workload % vs. Performance rating</p>
              </div>
              <span className="badge-bright badge-indigo" style={{ fontSize: '10px' }}>2D Matrix</span>
            </div>

            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 15, bottom: 20, left: -15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    type="number"
                    dataKey="workload"
                    name="Workload"
                    unit="%"
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    label={{ value: 'Current Workload (%)', position: 'insideBottom', offset: -12, fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="performance"
                    name="Mastery"
                    domain={[60, 100]}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    label={{ value: 'Performance %', angle: -90, position: 'insideLeft', offset: 15, fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                  />
                  <Tooltip content={<CustomTeamTooltip />} />
                  <ReferenceLine x={70} stroke="#cbd5e1" strokeDasharray="3 3" />
                  <ReferenceLine y={85} stroke="#cbd5e1" strokeDasharray="3 3" />
                  <Scatter name="Engineers" data={scatterData}>
                    {scatterData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#23251d"
                        strokeWidth={1.5}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 6,
              marginTop: 8,
              fontSize: '10px',
              color: '#475569'
            }}>
              <div style={{ padding: '4px 6px', borderRadius: 4, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                ★ <strong>Available Power:</strong> High perf, low load
              </div>
              <div style={{ padding: '4px 6px', borderRadius: 4, background: '#fef2f2', border: '1px solid #fecaca' }}>
                ⚠️ <strong>Surge Load:</strong> Overloaded ({'>'}75%)
              </div>
            </div>
          </div>

          {/* AI DNA Roster Card */}
          <div className="bright-card" style={{ padding: 18, background: '#eeefe9', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
            <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#23251d', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} color="#f7a501" /> Automated Work DNA Synthesis
            </h4>
            <p style={{ fontSize: '11px', color: '#4d4f46', lineHeight: 1.45, margin: 0 }}>
              ORKA derives cognitive styles from git commits, PR review turnaround, and deep focus habits to recommend complementary squad pairings.
            </p>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(35, 37, 29, 0.4)',
          backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16
        }}>
          <div className="bright-card" style={{
            background: '#ffffff', width: '100%', maxWidth: 460, padding: 24, borderRadius: 14,
            border: '2px solid #23251d', boxShadow: '4px 4px 0px #23251d'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1.5px solid #e2e8f0', paddingBottom: 12 }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: 0 }}>Add Engineering Roster Member</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: 4 }}>FULL NAME *</label>
                <input
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  placeholder="e.g. Maya Lin"
                  value={name} onChange={e => setName(e.target.value)} required
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: 4 }}>ROLE *</label>
                <input
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  placeholder="e.g. Senior Frontend Engineer"
                  value={role} onChange={e => setRole(e.target.value)} required
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: 4 }}>SKILLS (comma separated)</label>
                <input
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                  placeholder="e.g. React, Next.js, TypeScript"
                  value={skillsStr} onChange={e => setSkillsStr(e.target.value)}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: 4 }}>WORKLOAD ({workload}%)</label>
                  <input type="range" min="0" max="100" value={workload} onChange={e => setWorkload(Number(e.target.value))} style={{ width: '100%', accentColor: '#f7a501' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: 4 }}>PERFORMANCE ({performance}%)</label>
                  <input type="range" min="0" max="100" value={performance} onChange={e => setPerformance(Number(e.target.value))} style={{ width: '100%', accentColor: '#059669' }} />
                </div>
              </div>
              <button
                type="submit" disabled={saving}
                style={{
                  marginTop: 6, padding: '12px', background: '#f7a501', color: '#23251d',
                  border: '1.5px solid #23251d', fontWeight: 800, fontSize: '13px',
                  boxShadow: '2px 2px 0px #23251d', borderRadius: 8, cursor: 'pointer'
                }}
              >
                {saving ? 'Saving...' : 'Add Member'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function BuildTeamTab() {
  const [projectTitle, setProjectTitle] = useState('')
  const [skills, setSkills] = useState<string[]>(['React', 'Node.js', 'PostgreSQL', 'FastAPI'])
  const [squadSize, setSquadSize] = useState(3)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState(false)

  const handleBuild = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    try {
      const res = await buildTeam({
        project_title: projectTitle || 'Full-Stack Feature Squad',
        required_skills: skills,
        team_size: squadSize
      })
      setResult(res)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  // Radial Bar Chart for Squad Compatibility Dimensions
  const squadRadialData = [
    { name: 'Burnout Shield', value: 88, fill: '#dc2626' },
    { name: 'Context Stability', value: 91, fill: '#7c3aed' },
    { name: 'Velocity Complement', value: 86, fill: '#f7a501' },
    { name: 'Skill Overlap', value: result?.coverage ?? 94, fill: '#059669' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(330px, 1fr) minmax(480px, 1.618fr)', gap: 22, alignItems: 'start' }}>
      <div className="bright-card" style={{ padding: 24, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: '0 0 4px' }}>
          AI Squad Synthesizer
        </h3>
        <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px' }}>Assemble balanced, high-velocity squads with complementary skill coverage</p>

        {error && <OfflineBanner />}

        <form onSubmit={handleBuild} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: 4 }}>PROJECT TITLE *</label>
            <input
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
              placeholder="e.g. Real-Time Analytics Pipeline"
              value={projectTitle} onChange={e => setProjectTitle(e.target.value)} required
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: 4 }}>REQUIRED SKILLS</label>
            <SkillChipInput skills={skills} onChange={setSkills} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b' }}>SQUAD SIZE</span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#23251d' }}>{squadSize} Engineers</span>
            </div>
            <input type="range" min="2" max="6" value={squadSize} onChange={e => setSquadSize(Number(e.target.value))} style={{ width: '100%', accentColor: '#f7a501' }} />
          </div>
          <button
            type="submit" disabled={loading}
            style={{
              padding: '12px', background: '#f7a501', color: '#23251d', border: '1.5px solid #23251d',
              fontWeight: 800, fontSize: '13px', borderRadius: 8, boxShadow: '2px 2px 0px #23251d', cursor: 'pointer'
            }}
          >
            {loading ? 'Synthesizing Optimal Squad...' : 'Synthesize Balanced Squad'}
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Radial Compatibility Gauge */}
        <div className="bright-card" style={{ padding: 22, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#23251d', margin: 0 }}>
              Synthesized Squad Compatibility Gauge
            </h3>
            <span className="badge-bright badge-emerald">Optimal Mix</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(180px, 1fr) minmax(240px, 1.2fr)',
            gap: 16,
            alignItems: 'center'
          }}>
            <div style={{ width: '100%', height: 180, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%" cy="50%"
                  innerRadius="25%" outerRadius="95%"
                  barSize={6}
                  data={squadRadialData}
                  startAngle={90} endAngle={-270}
                >
                  <RadialBar background={{ fill: '#e2e8f0' }} dataKey="value" cornerRadius={6} />
                  <Tooltip contentStyle={{ background: '#23251d', border: 'none', borderRadius: 8, color: '#ffffff', fontSize: '11px' }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#23251d', lineHeight: 1 }}>{result?.coverage ?? 94}%</div>
                <div style={{ fontSize: '8px', fontWeight: 800, color: '#64748b' }}>Coverage</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '11px' }}>
              {squadRadialData.map((d: any) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.fill }} />
                    <span style={{ color: '#475569' }}>{d.name}</span>
                  </div>
                  <strong style={{ color: '#23251d' }}>{d.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Synthesized Squad Roster */}
        <div className="bright-card" style={{ padding: 22, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#23251d', margin: '0 0 12px' }}>
            Curated Squad Members
          </h3>
          {result && result.squad ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {result.squad.map((eng: any, idx: number) => (
                <div key={idx} style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: AVATAR_COLORS[idx % AVATAR_COLORS.length], color: '#fff', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {getInitials(eng.name)}
                    </div>
                    <div>
                      <strong style={{ fontSize: '13px', color: '#23251d' }}>{eng.name || `Engineer ${idx + 1}`}</strong>
                      <p style={{ fontSize: '11px', color: '#64748b', margin: '1px 0 0' }}>{eng.role || 'Full-Stack Developer'}</p>
                    </div>
                  </div>
                  <span className="badge-bright badge-yellow">Optimal Fit</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: 24, textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
              Configure requirements on the left to synthesize an AI-curated squad.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SkillGapTab() {
  const [audit, setAudit] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSkillGap()
      .then(setAudit)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const gaps = audit?.gaps || audit?.skill_gaps || [
    { skill: 'Kubernetes', required: 4, available: 1, deficit: 3, severity: 'Critical' },
    { skill: 'Rust', required: 2, available: 0, deficit: 2, severity: 'Critical' },
    { skill: 'GraphQL', required: 3, available: 2, deficit: 1, severity: 'Moderate' },
    { skill: 'AWS Lambda', required: 5, available: 4, deficit: 1, severity: 'Low' },
    { skill: 'FastAPI', required: 3, available: 4, deficit: -1, severity: 'Surplus' }
  ]

  // Distinct Chart 3: Skill Supply vs Demand Balance Horizon
  const skillSupplyDemandData = [
    { skill: 'Kubernetes', Required: 4, Available: 1 },
    { skill: 'Rust', Required: 2, Available: 0 },
    { skill: 'GraphQL', Required: 3, Available: 2 },
    { skill: 'AWS Lambda', Required: 5, Available: 4 },
    { skill: 'FastAPI', Required: 3, Available: 4 },
    { skill: 'React', Required: 4, Available: 5 },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(480px, 1.618fr) minmax(340px, 1fr)', gap: 22, alignItems: 'start' }}>
      <div className="bright-card" style={{ padding: 24, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#23251d', margin: '0 0 14px' }}>
          Identified Skill Deficits & Bottlenecks
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#eeefe9', borderBottom: '1.5px solid #cbd5e1' }}>
                <th style={{ padding: '10px 14px', fontWeight: 800, color: '#475569' }}>Skill Domain</th>
                <th style={{ padding: '10px 12px', fontWeight: 800, color: '#475569' }}>Required</th>
                <th style={{ padding: '10px 12px', fontWeight: 800, color: '#475569' }}>Available</th>
                <th style={{ padding: '10px 12px', fontWeight: 800, color: '#475569' }}>Deficit</th>
                <th style={{ padding: '10px 14px', fontWeight: 800, color: '#475569', textAlign: 'right' }}>Severity</th>
              </tr>
            </thead>
            <tbody>
              {gaps.map((g: any, i: number) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#23251d' }}>{g.skill}</td>
                  <td style={{ padding: '12px', color: '#64748b' }}>{g.required}</td>
                  <td style={{ padding: '12px', color: '#64748b' }}>{g.available}</td>
                  <td style={{ padding: '12px', fontWeight: 800, color: g.deficit > 0 ? '#dc2626' : '#059669' }}>
                    {g.deficit > 0 ? `-${g.deficit}` : `+${Math.abs(g.deficit)}`}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <span className={`badge-bright ${g.severity === 'Critical' ? 'badge-rose' : g.severity === 'Surplus' ? 'badge-emerald' : 'badge-yellow'}`}>
                      {g.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distinct Chart: Skill Supply vs Demand Balance */}
      <div className="bright-card" style={{ padding: 22, background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#23251d', margin: 0 }}>
              Skill Demand vs. Supply
            </h3>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>Required engineering seats vs verified staff</p>
          </div>
          <span className="badge-bright badge-yellow" style={{ fontSize: '10px' }}>Seats</span>
        </div>

        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillSupplyDemandData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="skill" tick={{ fontSize: 9, fill: '#475569', fontWeight: 700 }} angle={-15} textAnchor="end" />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#23251d', border: 'none', borderRadius: 8, color: '#ffffff', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 700 }} />
              <Bar dataKey="Required" name="Required Demand" fill="#dc2626" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Available" name="Available Supply" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default function TeamPage() {
  const { isExpanded, collapsed, toggleSidebar } = useSidebar()
  const [tab, setTab] = useState(0)
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMembers = () => {
    setLoading(true)
    getTeam()
      .then(res => setMembers(res.members || res.team || (Array.isArray(res) ? res : [])))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const tabs = ['Engineering Roster', 'AI Squad Synthesizer', 'Skill Gap Audit']

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
      <main className={`main-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <TopBar onToggleSidebar={toggleSidebar} />
        <AuthGuard moduleName="Team Roster & Squad Builder">
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
                    Team Roster & Squad Builder
                  </h1>
                  <span className="badge-bright badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669' }} /> Squad AI Online
                  </span>
                  <span className="badge-bright badge-yellow" style={{ fontSize: '11px', fontWeight: 800 }}>
                    Φ Capacity Geometry
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Manage engineering roster, synthesize AI-curated project squads, and audit skill matrix gaps
                </p>
              </div>

              {/* Mode Switcher */}
              <div style={{ display: 'inline-flex', background: '#ffffff', padding: 4, borderRadius: 9999, border: '1.5px solid #cbd5e1' }}>
                {tabs.map((t, i) => (
                  <button
                    key={t}
                    onClick={() => setTab(i)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: 9999,
                      fontSize: '12px',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      background: tab === i ? '#23251d' : 'transparent',
                      color: tab === i ? '#ffffff' : '#64748b',
                      transition: 'all 120ms ease'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Executive Ribbon (4 Cards) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: 14,
              marginBottom: 20
            }}>
              <div className="bright-card" style={{ padding: '14px 18px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Total Roster</span>
                  <Users size={16} color="#4f46e5" />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#23251d', lineHeight: 1 }}>{members.length} Engineers</div>
                <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: 4 }}>
                  Active full-stack squad pool
                </div>
              </div>

              <div className="bright-card" style={{ padding: '14px 18px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Avg Capacity Load</span>
                  <Activity size={16} color="#059669" />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#23251d', lineHeight: 1 }}>74% Avg</div>
                <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: 4 }}>
                  Healthy sprint headroom
                </div>
              </div>

              <div className="bright-card" style={{ padding: '14px 18px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>AI Skill Coverage</span>
                  <Brain size={16} color="#0284c7" />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#23251d', lineHeight: 1 }}>94.5%</div>
                <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700, marginTop: 4 }}>
                  Full-stack architecture ready
                </div>
              </div>

              <div className="bright-card" style={{ padding: '14px 18px', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Curated Squads</span>
                  <UserCheck size={16} color="#f7a501" />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#23251d', lineHeight: 1 }}>4 Active</div>
                <div style={{ fontSize: '11px', color: '#f7a501', fontWeight: 700, marginTop: 4 }}>
                  Zero domain isolation
                </div>
              </div>
            </div>

            {tab === 0 && <TeamMembersTab members={members} onRefresh={fetchMembers} />}
            {tab === 1 && <BuildTeamTab />}
            {tab === 2 && <SkillGapTab />}
          </div>
        </AuthGuard>
      </main>
    </div>
  )
}
