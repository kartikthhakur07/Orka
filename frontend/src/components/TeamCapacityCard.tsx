'use client'

export interface TeamMemberCapacity {
  name: string
  role: string
  load: number
  tasks: number
}

export function TeamCapacityCard({ members }: { members?: TeamMemberCapacity[] }) {
  const defaultMembers: TeamMemberCapacity[] = [
    { name: 'Priya Sharma', role: 'Senior Lead', load: 78, tasks: 4 },
    { name: 'Marcus Chen', role: 'Full Stack', load: 62, tasks: 3 },
    { name: 'Anya Ivanova', role: 'Backend Eng', load: 91, tasks: 6 },
    { name: 'Leo Wang', role: 'Frontend Dev', load: 45, tasks: 2 },
    { name: 'Sara Kim', role: 'DevOps Eng', load: 55, tasks: 3 },
  ]

  const list = members && members.length > 0 ? members : defaultMembers

  return (
    <div style={{ marginTop: 28 }}>
      <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>
        Team Capacity
      </h3>

      {/* Responsive Grid: Mobile 1col, Tablet 2col, Desktop 5col */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16
      }}>
        {list.map((m, i) => {
          const color = m.load > 85 ? '#dc2626' : m.load > 70 ? '#d97706' : '#16a34a'
          const initials = m.name.split(' ').map(w => w[0]).join('').toUpperCase()

          return (
            <div key={i} className="glass-card p-5" style={{ borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: `${color}15`, color: color,
                  fontWeight: 800, fontSize: 'var(--font-xs)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {initials}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: 'var(--font-xs)', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {m.name}
                  </p>
                  <p style={{ fontSize: '11px', color: '#64748b' }}>{m.role}</p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, marginBottom: 6 }}>
                <span style={{ color: '#64748b' }}>{m.tasks} active tasks</span>
                <span style={{ color: color }}>{m.load}% load</span>
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
