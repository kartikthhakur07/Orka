'use client'

import React, { useEffect, useState } from 'react'

function useCountUp(target: number, duration = 1200) {
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

function getScoreColor(v: number, invertRisk = false): string {
  if (invertRisk) {
    if (v > 60) return '#ef4444'
    if (v > 35) return '#f59e0b'
    return '#10b981'
  }
  if (v >= 75) return '#10b981'
  if (v >= 45) return '#f59e0b'
  return '#ef4444'
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
  color,
  delay = 0,
  invertRisk = false,
  badge,
}: StatCardProps) {
  const isNumber = typeof value === 'number'
  const displayed = isNumber ? useCountUp(value as number, 1000) : value
  const numVal = isNumber ? (value as number) : 50
  const c = color || getScoreColor(numVal, invertRisk)

  const cardTitle = title || label || ''

  return (
    <div
      className="glass-card flex flex-col justify-between animate-fade-in-up p-5"
      style={{
        animationDelay: `${delay}ms`,
        opacity: 0,
        animationFillMode: 'forwards',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontSize: 'var(--font-xs)',
            color: 'var(--text-muted)',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          {cardTitle}
        </span>
        {Icon && (
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={16} color="var(--accent-primary)" />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '14px 0 10px' }}>
        <span
          style={{
            fontSize: 'var(--font-lg)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {displayed}
        </span>
        {unit && (
          <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', fontWeight: 500 }}>
            {unit}
          </span>
        )}
      </div>

      {badge ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className={`badge badge-${badge.variant}`}>
            {badge.text}
          </span>
        </div>
      ) : (
        <div className="score-bar">
          <div
            className="score-bar-fill"
            style={{
              '--target-width': `${Math.min(numVal, 100)}%`,
              '--delay': `${delay}ms`,
              background: `linear-gradient(90deg, var(--accent-primary)70, var(--accent-primary))`,
            } as any}
          />
        </div>
      )}
    </div>
  )
}

export default StatCard

