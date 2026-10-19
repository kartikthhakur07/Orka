'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface SidebarContextType {
  isHovered: boolean
  setIsHovered: (val: boolean) => void
  isPinned: boolean
  togglePinned: () => void
  setIsPinned: (val: boolean) => void
  isExpanded: boolean // True when hovered or pinned
  collapsed: boolean  // Opposite of isExpanded: !isExpanded
  toggleSidebar: () => void // alias for togglePinned
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPinned, setIsPinnedState] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('orka_sidebar_pinned')
      if (stored !== null) {
        setIsPinnedState(stored === 'true')
      }
    } catch (e) {}

    const handleSync = () => {
      try {
        const stored = localStorage.getItem('orka_sidebar_pinned')
        if (stored !== null) {
          setIsPinnedState(stored === 'true')
        }
      } catch (e) {}
    }

    window.addEventListener('orka_sidebar_sync', handleSync)
    return () => window.removeEventListener('orka_sidebar_sync', handleSync)
  }, [])

  const setIsPinned = (val: boolean) => {
    setIsPinnedState(val)
    try {
      localStorage.setItem('orka_sidebar_pinned', String(val))
    } catch (e) {}
    window.dispatchEvent(new Event('orka_sidebar_sync'))
  }

  const togglePinned = () => {
    setIsPinnedState(prev => {
      const next = !prev
      try {
        localStorage.setItem('orka_sidebar_pinned', String(next))
      } catch (e) {}
      window.dispatchEvent(new Event('orka_sidebar_sync'))
      return next
    })
  }

  const isExpanded = isPinned || isHovered
  const collapsed = !isExpanded
  const toggleSidebar = togglePinned

  return (
    <SidebarContext.Provider
      value={{
        isHovered,
        setIsHovered,
        isPinned,
        togglePinned,
        setIsPinned,
        isExpanded,
        collapsed,
        toggleSidebar
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    return {
      isHovered: false,
      setIsHovered: () => {},
      isPinned: false,
      togglePinned: () => {},
      setIsPinned: () => {},
      isExpanded: false,
      collapsed: true,
      toggleSidebar: () => {}
    }
  }
  return context
}
