'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

interface AuthGuardProps {
  children: React.ReactNode
  moduleName?: string
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoggedIn, isInitialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      router.replace('/login')
    }
  }, [isInitialized, isLoggedIn, router])

  if (!isInitialized || !isLoggedIn) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        color: '#64748b',
        fontSize: '13px',
        fontWeight: 600
      }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '3px solid #cbd5e1',
          borderTopColor: '#f7a501',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span>Redirecting to ORKA Sign-In Portal...</span>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return <>{children}</>
}

export default AuthGuard
