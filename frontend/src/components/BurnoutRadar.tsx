'use client'

import { Badge } from '@/components/Badge'

export interface BurnoutMember {
  name: string
  role: string
  load: number
  risk: 'Low' | 'Medium' | 'High'
}

export function BurnoutRadar({ members }: { members?: BurnoutMember[] }) {
  const defaultMembers: BurnoutMember[] = [
    { name: 'Priya Sharma', role: 'Senior Lead Engineer', load: 78, risk: 'Low' },
    { name: 'Marcus Chen', role: 'Full Stack Engineer', load: 62, risk: 'Low' },
    { name: 'Anya Ivanova', role: 'Backend Engineer', load: 91, risk: 'Medium' },
    { name: 'Leo Wang', role: 'Frontend Developer', load: 45, risk: 'Low' },
    { name: 'Sara Kim', role: 'DevOps Engineer', load: 55, risk: 'Low' },
  ]

  const list = members && members.length > 0 ? members : defaultMembers

  return (
    <div className="glass-card p-6" style={{ borderRadius: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#0f172a' }}>
            Burnout Radar
          </h3>
          <p style={{ fontSize: 'var(--font-xs)', color: '#64748b', marginTop: 2 }}>
            14-day rolling risk score
          </p>
        </div>
        <Badge variant="green">14d Early Alert</Badge>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {list.map((m, idx) => {
          const color = m.risk === 'High' ? '#dc2626' : m.risk === 'Medium' ? '#d97706' : '#16a34a'
          const badgeVariant = m.risk === 'High' ? 'crimson' : m.risk === 'Medium' ? 'amber' : 'green'
          const initials = m.name.split(' ').map(w => w[0]).join('').toUpperCase()

          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: `${color}15`, color: color,
                    fontSize: '11px', fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {initials}
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }}>
                      {m.name}
                    </p>
                    <p style={{ fontSize: '11px', color: '#64748b' }}>{m.role}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 'var(--font-xs)', fontWeight: 800, color: color }}>{m.load}%</span>
                  <Badge variant={badgeVariant}>{m.risk}</Badge>
                </div>
              </div>
              <div className="score-bar">
                <div
                  className="score-bar-fill"
                  style={{
                    '--target-width': `${m.load}%`,
                    background: color
                  } as any}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
