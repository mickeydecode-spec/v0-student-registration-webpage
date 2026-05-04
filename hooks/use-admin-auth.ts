'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  adminAuth,
  updatePasswordHash,
  getStoredRedirectPath,
  setStoredRedirectPath,
  resetRedirectPath,
  generateRandomAdminPath,
  rateLimitCheck,
} from '@/lib/admin-auth'

export interface UseAdminAuthReturn {
  isAuthenticated: boolean
  isLoading: boolean
  /** Login and immediately navigate to the configured redirect path. Returns error string or null. */
  login: (password: string) => Promise<string | null>
  logout: () => void
  sessionExpiry: number | null
  csrfToken: string | null
  /** Change the admin password. Verifies current password first. Returns error string or null. */
  changePassword: (currentPassword: string, newPassword: string) => Promise<string | null>
  /** Redirect URL management */
  redirectPath: string
  setRedirectPath: (path: string) => void
  generateRandomRedirect: () => void
  resetRedirect: () => void
  /** Rate limit status */
  attemptsLeft: number
  isRateLimited: boolean
  rateLimitRemainingMs: number
}

export function useAdminAuth(): UseAdminAuthReturn {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionExpiry, setSessionExpiry] = useState<number | null>(null)
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [redirectPath, setRedirectPathState] = useState<string>('/admin')
  const [attemptsLeft, setAttemptsLeft] = useState(5)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [rateLimitRemainingMs, setRateLimitRemainingMs] = useState(0)

  // Sync rate limit state
  const syncRateLimit = useCallback(() => {
    const { allowed, remainingMs, attemptsLeft: left } = rateLimitCheck()
    setIsRateLimited(!allowed)
    setRateLimitRemainingMs(remainingMs)
    setAttemptsLeft(left)
  }, [])

  useEffect(() => {
    const session = adminAuth.getSession()
    const authenticated = session?.authenticated ?? false
    setIsAuthenticated(authenticated)
    setSessionExpiry(session?.expiresAt ?? null)
    setCsrfToken(session?.csrfToken ?? null)
    setRedirectPathState(getStoredRedirectPath())
    syncRateLimit()
    setIsLoading(false)

    // Periodically check session validity and rate limit status
    const interval = setInterval(() => {
      const current = adminAuth.getSession()
      if (!current?.authenticated) {
        setIsAuthenticated(false)
        setSessionExpiry(null)
        setCsrfToken(null)
      }
      syncRateLimit()
    }, 30_000)

    return () => clearInterval(interval)
  }, [syncRateLimit])

  /**
   * Login: verify password, create session, then immediately call router.replace
   * so the navigation happens synchronously — no relying on useEffect.
   * Returns null on success, or an error message string on failure.
   */
  const login = useCallback(
    async (password: string): Promise<string | null> => {
      syncRateLimit()
      const result = await adminAuth.verifyPassword(password)

      if (!result.ok) {
        syncRateLimit()
        return result.error ?? 'Invalid password.'
      }

      const session = adminAuth.createSession()
      setIsAuthenticated(true)
      setSessionExpiry(session.expiresAt)
      setCsrfToken(session.csrfToken)

      // Navigate immediately — this is the fix for "stays on login page"
      router.replace(session.redirectPath)
      return null
    },
    [router, syncRateLimit]
  )

  const logout = useCallback(() => {
    adminAuth.logout()
    setIsAuthenticated(false)
    setSessionExpiry(null)
    setCsrfToken(null)
    router.replace('/admin/login')
  }, [router])

  /**
   * Change password: verify current password, then persist new hash.
   * Returns null on success, or an error string on failure.
   */
  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<string | null> => {
      const result = await adminAuth.verifyPassword(currentPassword)
      if (!result.ok) {
        syncRateLimit()
        return result.error ?? 'Current password is incorrect.'
      }
      if (newPassword.length < 8) {
        return 'New password must be at least 8 characters.'
      }
      await updatePasswordHash(newPassword)
      return null
    },
    [syncRateLimit]
  )

  const setRedirectPath = useCallback((path: string) => {
    setStoredRedirectPath(path)
    setRedirectPathState(path.startsWith('/') ? path : `/${path}`)
  }, [])

  const generateRandomRedirect = useCallback(() => {
    const path = generateRandomAdminPath()
    setStoredRedirectPath(path)
    setRedirectPathState(path)
  }, [])

  const resetRedirect = useCallback(() => {
    resetRedirectPath()
    setRedirectPathState('/admin')
  }, [])

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    sessionExpiry,
    csrfToken,
    changePassword,
    redirectPath,
    setRedirectPath,
    generateRandomRedirect,
    resetRedirect,
    attemptsLeft,
    isRateLimited,
    rateLimitRemainingMs,
  }
}
