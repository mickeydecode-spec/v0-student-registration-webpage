'use client'

import { useState, useEffect, useRef } from 'react'
import { useAdminAuth } from '@/hooks/use-admin-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  KeyRound,
  Clock,
  ChevronRight,
} from 'lucide-react'

// ─── Security badge strip ─────────────────────────────────────────────────────
function SecurityBadges() {
  return (
    <div className="flex items-center gap-4 justify-center flex-wrap">
      {[
        { icon: ShieldCheck, label: 'Rate Limited' },
        { icon: KeyRound, label: 'Hashed Passwords' },
        { icon: Lock, label: 'CSRF Protected' },
        { icon: Clock, label: '12h Sessions' },
      ].map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex items-center gap-1.5 text-xs text-white/40 select-none"
        >
          <Icon className="w-3 h-3" />
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Rate-limit countdown ─────────────────────────────────────────────────────
function RateLimitBanner({ remainingMs }: { remainingMs: number }) {
  const [secs, setSecs] = useState(Math.ceil(remainingMs / 1000))

  useEffect(() => {
    const interval = setInterval(() => {
      setSecs(s => {
        if (s <= 1) { clearInterval(interval); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const mins = Math.floor(secs / 60)
  const remaining = secs % 60

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border border-red-500/30 bg-red-500/10">
      <Clock className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-red-300">
        Too many failed attempts. Try again in{' '}
        <span className="font-mono font-semibold text-red-200">
          {mins > 0 ? `${mins}m ` : ''}{remaining}s
        </span>
        .
      </p>
    </div>
  )
}

// ─── Admin Login Panel ────────────────────────────────────────────────────────
export function AdminLoginPanel() {
  const { login, isRateLimited, rateLimitRemainingMs, attemptsLeft } = useAdminAuth()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim() || loading || isRateLimited) return

    setError('')
    setLoading(true)
    const err = await login(password)
    if (err) {
      setError(err)
      setPassword('')
      inputRef.current?.focus()
    }
    // On success, login() calls router.replace internally.
    setLoading(false)
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2847 60%, #0a1628 100%)' }}
    >
      {/* Subtle dot grid */}
      <div
        className="fixed inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative w-full max-w-sm space-y-8">
        {/* Brand header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20">
            <Lock className="w-7 h-7 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Access</h1>
            <p className="text-white/40 text-sm mt-1">Dream More Student Platform</p>
          </div>
        </div>

        {/* Login card */}
        <div
          className="rounded-2xl border border-white/10 p-8 space-y-6"
          style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)' }}
        >
          <div>
            <h2 className="text-base font-semibold text-white">Sign In</h2>
            <p className="text-sm text-white/40 mt-0.5">
              Enter your administrator password to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {isRateLimited && <RateLimitBanner remainingMs={rateLimitRemainingMs} />}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Admin Password
              </label>
              <div className="relative">
                <Input
                  ref={inputRef}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value)
                    if (error) setError('')
                  }}
                  placeholder="Enter your password"
                  disabled={loading || isRateLimited}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-accent/50 focus-visible:border-accent/40 pr-10 h-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-3.5 rounded-lg border border-red-500/30 bg-red-500/10">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {!isRateLimited && attemptsLeft < 5 && attemptsLeft > 0 && !error && (
              <p className="text-xs text-yellow-400/80">
                {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining before lockout.
              </p>
            )}

            <Button
              type="submit"
              disabled={loading || isRateLimited || !password.trim()}
              className="w-full h-12 bg-accent hover:bg-accent/90 text-primary font-semibold text-sm tracking-wide transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Access Admin Panel
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Security badges */}
        <SecurityBadges />

        {/* Back to home */}
        <div className="text-center">
          <a
            href="/"
            className="text-xs text-white/25 hover:text-white/55 transition-colors"
          >
            &larr; Back to Homepage
          </a>
        </div>
      </div>
    </div>
  )
}
