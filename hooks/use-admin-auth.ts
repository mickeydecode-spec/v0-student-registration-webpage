'use client'

import { useState, useEffect } from 'react'
import { adminAuth } from '@/lib/admin-auth'

interface UseAdminAuthReturn {
  isAuthenticated: boolean
  isLoading: boolean
  login: (password: string) => boolean
  logout: () => void
  sessionExpiry: number | null
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionExpiry, setSessionExpiry] = useState<number | null>(null)

  useEffect(() => {
    // Check authentication status on mount
    const authenticated = adminAuth.isAuthenticated()
    setIsAuthenticated(authenticated)
    setSessionExpiry(adminAuth.getSessionExpiry())
    setIsLoading(false)

    // Optional: Set up a timer to check session expiry
    if (authenticated) {
      const checkInterval = setInterval(() => {
        const still_authenticated = adminAuth.isAuthenticated()
        if (!still_authenticated) {
          setIsAuthenticated(false)
        }
      }, 60000) // Check every minute

      return () => clearInterval(checkInterval)
    }
  }, [])

  const login = (password: string): boolean => {
    if (adminAuth.verifyPassword(password)) {
      adminAuth.createSession()
      setIsAuthenticated(true)
      setSessionExpiry(adminAuth.getSessionExpiry())
      return true
    }
    return false
  }

  const logout = () => {
    adminAuth.logout()
    setIsAuthenticated(false)
    setSessionExpiry(null)
  }

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    sessionExpiry,
  }
}
