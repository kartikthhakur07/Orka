'use client'

import { Badge } from '@/components/Badge'

export function BurndownChart() {
  const points = [90, 78, 65, 60, 52, 44, 38, 30, 24, 18, 12, 6]

  return (
    <div className="glass-card p-6" style={{ borderRadius: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 800, color: '#0f172a' }}>
            Sprint Burndown
          </h3>
          <p style={{ fontSize: 'var(--font-xs)', color: '#64748b', marginTop: 2 }}>
            Story points remaining per day
          </p>
        </div>
        <Badge variant="green">On Track</Badge>
      </div>

      {/* SVG & HTML Burndown Chart */}
      <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', gap: 10, padding: '16px 8px 0', borderBottom: '1px solid #e2e8f0' }}>
        {points.map((val, idx) => (
          <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
            <div
              style={{
                width: '100%',
                height: `${val}%`,
                background: idx >= 8 ? '#16a34a' : 'rgba(22, 163, 74, 0.25)',
                borderRadius: '6px 6px 0 0',
                transition: 'height 800ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
            <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'DM Mono, monospace' }}>
              D{idx + 1}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 'var(--font-xs)', color: '#64748b' }}>
        <span>Day 1 (90 pts)</span>
        <span style={{ color: '#16a34a', fontWeight: 700 }}>Day 12 (6 pts remaining)</span>
      </div>
    </div>
  )
}
