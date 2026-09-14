import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'indigo' | 'cobalt' | 'teal' | 'emerald' | 'amber' | 'crimson' | 'gray' | 'blue' | 'purple' | 'green' | 'red' | 'yellow' | 'cyan' | 'neutral' | 'gold'
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}

export function Badge({ children, variant = 'indigo', className = '', style = {}, onClick }: BadgeProps) {
  return (
    <span className={`badge badge-${variant} ${className}`} style={style} onClick={onClick}>
      {children}
    </span>
  )
}

export default Badge

