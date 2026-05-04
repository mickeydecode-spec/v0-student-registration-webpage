'use client'

import { useState, useEffect, useCallback } from 'react'
import { adminAuth } from '@/lib/admin-auth'

interface UseAdminAuthReturn {
  isAuthenticated: boolean
  isLoading: boolean
  login: (password: string) => Promise<boolean>
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

  const login = useCallback(async (password: string): Promise<boolean> => {
    if (adminAuth.verifyPassword(password)) {
      adminAuth.createSession()
      
      // Wait for localStorage to sync and state to update
      await new Promise(resolve => setTimeout(resolve, 50))
      
      setIsAuthenticated(true)
      setSessionExpiry(adminAuth.getSessionExpiry())
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    adminAuth.logout()
    setIsAuthenticated(false)
    setSessionExpiry(null)
  }, [])

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    sessionExpiry,
  }
}

