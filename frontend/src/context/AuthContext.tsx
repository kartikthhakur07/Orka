'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface UserPersona {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Manager' | 'Lead' | 'Developer'
  avatarColor: string
}

export const DEMO_PERSONAS: UserPersona[] = [
  { id: 'usr-1', name: 'Alex Rivera', email: 'alex.rivera@orka.ai', role: 'Admin', avatarColor: '#4f46e5' },
  { id: 'usr-2', name: 'Priya Sharma', email: 'priya.sharma@orka.ai', role: 'Lead', avatarColor: '#059669' },
  { id: 'usr-3', name: 'Marcus Chen', email: 'marcus.chen@orka.ai', role: 'Developer', avatarColor: '#0284c7' },
  { id: 'usr-4', name: 'Anya Ivanova', email: 'anya.ivanova@orka.ai', role: 'Manager', avatarColor: '#d97706' },
]

interface AuthContextType {
  user: UserPersona | null
  isLoggedIn: boolean
  isInitialized: boolean
  login: (persona: UserPersona) => void
  logout: () => void
  isAuthModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserPersona | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const syncUser = () => {
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('orka_user') : null
        if (stored) {
          const parsed = JSON.parse(stored)
          setUser({
            id: parsed.id || 'usr-role',
            name: parsed.name || 'User',
            email: parsed.email || '',
            role: (parsed.role === 'manager' || parsed.role === 'Manager' ? 'Manager' : 'Lead'),
            avatarColor: parsed.avatarColor || (parsed.role === 'manager' ? '#1d4ed8' : '#059669'),
          })
        } else {
          setUser(null)
        }
      } catch (e) {
        console.error('Failed to load user from localStorage:', e)
      } finally {
        setIsInitialized(true)
      }
    }

    syncUser()
    window.addEventListener('orka_auth_change', syncUser)
    window.addEventListener('storage', syncUser)

    return () => {
      window.removeEventListener('orka_auth_change', syncUser)
      window.removeEventListener('storage', syncUser)
    }
  }, [])

  const login = (selectedUser: UserPersona) => {
    setUser(selectedUser)
    try {
      localStorage.setItem('orka_user', JSON.stringify(selectedUser))
      window.dispatchEvent(new Event('orka_auth_change'))
    } catch (e) {
      console.error('Failed to save user to localStorage:', e)
    }
    setIsAuthModalOpen(false)
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem('orka_user')
      window.dispatchEvent(new Event('orka_auth_change'))
    } catch (e) {
      console.error('Failed to remove user from localStorage:', e)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isInitialized,
        login,
        logout,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false)
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
