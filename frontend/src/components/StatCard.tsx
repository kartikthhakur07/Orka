'use client'

import React, { useEffect, useState } from 'react'

function useCountUp(target: number, duration = 1000) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!target) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setVal(Math.floor(p * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return val
}

interface StatCardProps {
  label?: string
  title?: string
  value: number | string
  unit?: string
  icon?: any
  color?: string
  delay?: number
  invertRisk?: boolean
  badge?: { text: string; variant: 'blue' | 'purple' | 'green' | 'red' | 'yellow' | 'cyan' | 'neutral' }
}

export function StatCard({
  label,
  title,
  value,
  unit = '',
  icon: Icon,
  color = '#4f46e5',
  badge,
}: StatCardProps) {
  const isNumber = typeof value === 'number'
  const displayed = isNumber ? useCountUp(value as number, 1000) : value
  const numVal = isNumber ? (value as number) : 50
  const cardTitle = title || label || ''

  return (
    <div className="bright-card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--colors-mute)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {cardTitle}
        </span>
        {Icon && (
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 'var(--rounded-md)',
            background: 'var(--colors-surface-soft)',
            color: 'var(--colors-ink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--colors-hairline-soft)'
          }}>
            <Icon size={17} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '14px 0 10px' }}>
        <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--colors-ink)', lineHeight: 1, letterSpacing: '-0.6px' }}>
          {displayed}
        </span>
        {unit && (
          <span style={{ fontSize: '14px', color: 'var(--colors-mute)', fontWeight: 600 }}>
            {unit}
          </span>
        )}
      </div>

      {badge ? (
        <div>
          <span className="badge-posthog badge-yellow" style={{ fontSize: '11px' }}>
            {badge.text}
          </span>
        </div>
      ) : (
        <div style={{ height: 5, width: '100%', background: 'var(--colors-surface-soft)', borderRadius: 999, overflow: 'hidden', marginTop: 4 }}>
          <div style={{
            height: '100%',
            width: `${Math.min(numVal, 100)}%`,
            background: 'var(--colors-primary)',
            borderRadius: 999,
            transition: 'width 1s ease-out'
          }} />
        </div>
      )}
    </div>
  )
}

export default StatCard
