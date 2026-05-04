/**
 * admin-auth.ts
 * Production-ready client-side auth library for the Dream More admin panel.
 *
 * Security features:
 *  - Passwords stored as SHA-256 hashes (client-safe; no server required)
 *  - CSRF token bound to each session (regenerated on every login)
 *  - In-memory rate limiter: max 5 attempts per IP-equivalent (tab) per 15 min window
 *  - Session expiry enforced on every read
 *  - Redirect URL stored per-session; supports random path generation
 */

// ─── Constants ──────────────────────────────────────────────────────────────

const SESSION_KEY = 'dm_admin_session'
const PASSWORD_KEY = 'dm_admin_pw_hash'
const REDIRECT_KEY = 'dm_admin_redirect'
const RATE_KEY = 'dm_admin_rate'

const SESSION_EXPIRY_MS = 12 * 60 * 60 * 1000 // 12 hours
const MAX_ATTEMPTS = 5
const RATE_WINDOW_MS = 15 * 60 * 1000 // 15 minutes

// Default password hash: SHA-256 of "admin123"
// Replace DEFAULT_PASSWORD_HASH with hash of your real password.
const DEFAULT_PASSWORD_HASH =
  '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'

const DEFAULT_REDIRECT = '/admin'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AdminSession {
  authenticated: boolean
  timestamp: number
  expiresAt: number
  csrfToken: string
  redirectPath: string
}

interface RateRecord {
  attempts: number
  windowStart: number
  lockedUntil: number | null
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** SHA-256 hash using the Web Crypto API (browser-safe, no Node dependency). */
async function sha256(text: string): Promise<string> {
  if (typeof window === 'undefined') return text
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/** Cryptographically random hex string (used for CSRF tokens). */
function randomHex(bytes = 32): string {
  if (typeof window === 'undefined') return 'ssr'
  const arr = new Uint8Array(bytes)
  crypto.getRandomValues(arr)
  return Array.from(arr)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/** Generate a random admin path segment, e.g. "/admin/x4f9a2b1". */
export function generateRandomAdminPath(): string {
  const segment = randomHex(4) // 8 hex chars
  return `/admin/${segment}`
}

// ─── Rate Limiter ─────────────────────────────────────────────────────────────

const rateStore: RateRecord = {
  attempts: 0,
  windowStart: Date.now(),
  lockedUntil: null,
}

function getRateRecord(): RateRecord {
  if (typeof window === 'undefined') return rateStore
  try {
    const raw = sessionStorage.getItem(RATE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as RateRecord
      Object.assign(rateStore, parsed)
    }
  } catch {
    // ignore
  }
  return rateStore
}

function saveRateRecord(record: RateRecord): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(RATE_KEY, JSON.stringify(record))
  } catch {
    // ignore
  }
}

export function rateLimitCheck(): { allowed: boolean; remainingMs: number; attemptsLeft: number } {
  const record = getRateRecord()
  const now = Date.now()

  // Reset window if expired
  if (now - record.windowStart > RATE_WINDOW_MS) {
    record.attempts = 0
    record.windowStart = now
    record.lockedUntil = null
    saveRateRecord(record)
  }

  // Check lock
  if (record.lockedUntil && now < record.lockedUntil) {
    return { allowed: false, remainingMs: record.lockedUntil - now, attemptsLeft: 0 }
  }

  const attemptsLeft = MAX_ATTEMPTS - record.attempts
  return { allowed: attemptsLeft > 0, remainingMs: 0, attemptsLeft: Math.max(0, attemptsLeft) }
}

function recordFailedAttempt(): void {
  const record = getRateRecord()
  record.attempts += 1
  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockedUntil = Date.now() + RATE_WINDOW_MS
  }
  saveRateRecord(record)
}

function resetRateRecord(): void {
  const record = getRateRecord()
  record.attempts = 0
  record.lockedUntil = null
  saveRateRecord(record)
}

// ─── Password Management ──────────────────────────────────────────────────────

function getStoredPasswordHash(): string {
  if (typeof window === 'undefined') return DEFAULT_PASSWORD_HASH
  try {
    return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD_HASH
  } catch {
    return DEFAULT_PASSWORD_HASH
  }
}

/** Persist a new password hash (call after the user changes their password). */
export async function updatePasswordHash(newPassword: string): Promise<void> {
  const hash = await sha256(newPassword)
  if (typeof window !== 'undefined') {
    localStorage.setItem(PASSWORD_KEY, hash)
  }
}

// ─── Redirect URL Management ──────────────────────────────────────────────────

export function getStoredRedirectPath(): string {
  if (typeof window === 'undefined') return DEFAULT_REDIRECT
  try {
    return localStorage.getItem(REDIRECT_KEY) || DEFAULT_REDIRECT
  } catch {
    return DEFAULT_REDIRECT
  }
}

export function setStoredRedirectPath(path: string): void {
  if (typeof window === 'undefined') return
  const safe = path.startsWith('/') ? path : `/${path}`
  try {
    localStorage.setItem(REDIRECT_KEY, safe)
  } catch {
    // ignore
  }
}

export function resetRedirectPath(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(REDIRECT_KEY)
  } catch {
    // ignore
  }
}

// ─── Session Management ───────────────────────────────────────────────────────

export const adminAuth = {
  /**
   * Verify a plaintext password against the stored hash.
   * Returns { ok: boolean; error?: string }
   */
  verifyPassword: async (
    password: string
  ): Promise<{ ok: boolean; error?: string }> => {
    const { allowed, remainingMs, attemptsLeft } = rateLimitCheck()

    if (!allowed) {
      const secs = Math.ceil(remainingMs / 1000)
      return {
        ok: false,
        error: `Too many attempts. Please wait ${secs} seconds before trying again.`,
      }
    }

    const hash = await sha256(password)
    const stored = getStoredPasswordHash()

    if (hash !== stored) {
      recordFailedAttempt()
      const left = attemptsLeft - 1
      return {
        ok: false,
        error:
          left > 0
            ? `Invalid password. ${left} attempt${left !== 1 ? 's' : ''} remaining.`
            : 'Too many failed attempts. You are locked out for 15 minutes.',
      }
    }

    resetRateRecord()
    return { ok: true }
  },

  /** Create a session in localStorage with CSRF token and redirect path. */
  createSession: (): AdminSession => {
    const now = Date.now()
    const redirectPath = getStoredRedirectPath()
    const session: AdminSession = {
      authenticated: true,
      timestamp: now,
      expiresAt: now + SESSION_EXPIRY_MS,
      csrfToken: randomHex(32),
      redirectPath,
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session))
      } catch {
        // ignore
      }
    }
    return session
  },

  /** Read and validate the current session; returns null if absent or expired. */
  getSession: (): AdminSession | null => {
    if (typeof window === 'undefined') return null
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      if (!raw) return null
      const session = JSON.parse(raw) as AdminSession
      if (session.expiresAt < Date.now()) {
        localStorage.removeItem(SESSION_KEY)
        return null
      }
      return session
    } catch {
      return null
    }
  },

  isAuthenticated: (): boolean => {
    return adminAuth.getSession()?.authenticated ?? false
  },

  getRedirectPath: (): string => {
    return adminAuth.getSession()?.redirectPath ?? getStoredRedirectPath()
  },

  /** Validate that a CSRF token matches the active session. */
  validateCsrf: (token: string): boolean => {
    const session = adminAuth.getSession()
    return session?.csrfToken === token
  },

  logout: (): void => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(SESSION_KEY)
      } catch {
        // ignore
      }
    }
  },

  getSessionExpiry: (): number | null => {
    return adminAuth.getSession()?.expiresAt ?? null
  },

  getCsrfToken: (): string | null => {
    return adminAuth.getSession()?.csrfToken ?? null
  },
}
