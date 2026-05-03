// Admin password authentication
// Note: In production, use proper authentication (Supabase Auth, Auth.js, etc.)
// This is a simple password-based authentication for demonstration

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
const ADMIN_SESSION_KEY = 'admin_session'
const SESSION_EXPIRY_HOURS = 24

export interface AdminSession {
  authenticated: boolean
  timestamp: number
  expiresAt: number
}

export const adminAuth = {
  // Verify admin password
  verifyPassword: (password: string): boolean => {
    return password === ADMIN_PASSWORD
  },

  // Create admin session (stores in localStorage)
  createSession: (): AdminSession => {
    const now = Date.now()
    const expiresAt = now + SESSION_EXPIRY_HOURS * 60 * 60 * 1000
    const session: AdminSession = {
      authenticated: true,
      timestamp: now,
      expiresAt,
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session))
    }
    return session
  },

  // Get current session
  getSession: (): AdminSession | null => {
    if (typeof window === 'undefined') return null
    try {
      const session = localStorage.getItem(ADMIN_SESSION_KEY)
      if (!session) return null
      const parsed = JSON.parse(session) as AdminSession
      // Check if session has expired
      if (parsed.expiresAt < Date.now()) {
        localStorage.removeItem(ADMIN_SESSION_KEY)
        return null
      }
      return parsed
    } catch {
      return null
    }
  },

  // Check if admin is authenticated
  isAuthenticated: (): boolean => {
    return adminAuth.getSession()?.authenticated ?? false
  },

  // Logout (clear session)
  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ADMIN_SESSION_KEY)
    }
  },

  // Get session expiry time
  getSessionExpiry: (): number | null => {
    const session = adminAuth.getSession()
    return session?.expiresAt ?? null
  },
}
