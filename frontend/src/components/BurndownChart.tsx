'use client'

import { Badge } from '@/components/Badge'

export function BurndownChart() {
  const points = [90, 78, 65, 60, 52, 44, 38, 30, 24, 18, 12, 6]

  return (
    <div className="glass-card p-6" style={{ borderRadius: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: '#006241' }}>
            Sprint Burndown
          </h3>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)', marginTop: 2 }}>
            Story points remaining per day
          </p>
        </div>
        <Badge variant="green">On Track</Badge>
      </div>

      {/* SVG & HTML Burndown Chart */}
      <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', gap: 10, padding: '16px 8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
        {points.map((val, idx) => (
          <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
            <div
              style={{
                width: '100%',
                height: `${val}%`,
                background: idx >= 8 ? '#00754A' : 'rgba(0, 117, 74, 0.25)',
                borderRadius: '4px 4px 0 0',
                transition: 'height 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            />
            <span style={{ fontSize: '10px', color: 'var(--text-black-soft)', fontFamily: 'DM Mono, monospace' }}>
              D{idx + 1}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 'var(--font-xs)', color: 'var(--text-black-soft)' }}>
        <span>Day 1 (90 pts)</span>
        <span style={{ color: '#006241', fontWeight: 700 }}>Day 12 (6 pts remaining)</span>
      </div>
    </div>
  )
}
