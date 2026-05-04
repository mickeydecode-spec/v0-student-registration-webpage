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
  CheckCircle2,
  ShieldCheck,
  KeyRound,
  Link2,
  Shuffle,
  RotateCcw,
  Clock,
  ChevronRight,
} from 'lucide-react'

type Tab = 'login' | 'password' | 'redirect'

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
        if (s <= 1) {
          clearInterval(interval)
          return 0
        }
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
          {mins > 0 ? `${mins}m ` : ''}
          {remaining}s
        </span>
        .
      </p>
    </div>
  )
}

// ─── Login tab ────────────────────────────────────────────────────────────────
function LoginTab() {
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
    // On success, login() calls router.replace — no further action needed here.
    setLoading(false)
  }

  return (
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
            placeholder="Enter password"
            disabled={loading || isRateLimited}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent/50 focus-visible:border-accent/50 pr-10 h-12"
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
  )
}

// ─── Change password tab ──────────────────────────────────────────────────────
function ChangePasswordTab() {
  const { changePassword } = useAdminAuth()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Strength meter
  const strength = (() => {
    if (next.length === 0) return 0
    let score = 0
    if (next.length >= 8) score++
    if (next.length >= 12) score++
    if (/[A-Z]/.test(next)) score++
    if (/[0-9]/.test(next)) score++
    if (/[^A-Za-z0-9]/.test(next)) score++
    return score
  })()

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength]
  const strengthColor = [
    '',
    'bg-red-500',
    'bg-orange-400',
    'bg-yellow-400',
    'bg-green-400',
    'bg-emerald-400',
  ][strength]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!current || !next || !confirm) {
      setError('All fields are required.')
      return
    }
    if (next !== confirm) {
      setError('New passwords do not match.')
      return
    }
    if (next.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    const err = await changePassword(current, next)
    setLoading(false)

    if (err) {
      setError(err)
    } else {
      setSuccess(true)
      setCurrent('')
      setNext('')
      setConfirm('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Current password */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-widest text-white/50">
          Current Password
        </label>
        <div className="relative">
          <Input
            type={showCurrent ? 'text' : 'password'}
            value={current}
            onChange={e => { setCurrent(e.target.value); setError('') }}
            placeholder="Current password"
            disabled={loading}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent/50 focus-visible:border-accent/50 pr-10 h-11"
            autoComplete="current-password"
          />
          <button type="button" tabIndex={-1} onClick={() => setShowCurrent(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* New password */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-widest text-white/50">
          New Password
        </label>
        <div className="relative">
          <Input
            type={showNext ? 'text' : 'password'}
            value={next}
            onChange={e => { setNext(e.target.value); setError('') }}
            placeholder="New password (min 8 chars)"
            disabled={loading}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent/50 focus-visible:border-accent/50 pr-10 h-11"
            autoComplete="new-password"
          />
          <button type="button" tabIndex={-1} onClick={() => setShowNext(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
            {showNext ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {/* Strength meter */}
        {next.length > 0 && (
          <div className="space-y-1 pt-0.5">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i <= strength ? strengthColor : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-white/40">{strengthLabel}</p>
          </div>
        )}
      </div>

      {/* Confirm */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-widest text-white/50">
          Confirm New Password
        </label>
        <Input
          type="password"
          value={confirm}
          onChange={e => { setConfirm(e.target.value); setError('') }}
          placeholder="Repeat new password"
          disabled={loading}
          className={`bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent/50 focus-visible:border-accent/50 h-11 ${
            confirm && confirm !== next ? 'border-red-500/50' : ''
          } ${confirm && confirm === next && next ? 'border-green-500/40' : ''}`}
          autoComplete="new-password"
        />
      </div>

      {error && (
        <div className="flex items-start gap-3 p-3.5 rounded-lg border border-red-500/30 bg-red-500/10">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 p-3.5 rounded-lg border border-green-500/30 bg-green-500/10">
          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-300">
            Password updated successfully. Your next login will use the new password.
          </p>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading || !current || !next || !confirm}
        className="w-full h-12 bg-accent hover:bg-accent/90 text-primary font-semibold text-sm"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
            Updating...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <KeyRound className="w-4 h-4" />
            Update Password
          </span>
        )}
      </Button>
    </form>
  )
}

// ─── Redirect URL tab ─────────────────────────────────────────────────────────
function RedirectTab() {
  const { redirectPath, setRedirectPath, generateRandomRedirect, resetRedirect } =
    useAdminAuth()
  const [value, setValue] = useState(redirectPath)
  const [saved, setSaved] = useState(false)

  // Keep local input in sync when external state changes
  useEffect(() => {
    setValue(redirectPath)
  }, [redirectPath])

  const handleSave = () => {
    if (!value.trim()) return
    setRedirectPath(value.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleGenerate = () => {
    generateRandomRedirect()
    setSaved(false)
  }

  const handleReset = () => {
    resetRedirect()
    setValue('/admin')
    setSaved(false)
  }

  // Keep local value in sync after generate/reset
  useEffect(() => {
    setValue(redirectPath)
  }, [redirectPath])

  return (
    <div className="space-y-5">
      <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60 leading-relaxed">
        Configure where admins are redirected after a successful login. Using a random
        or non-default path makes the admin panel harder to discover. The path is stored
        locally in your browser.
      </div>

      {/* Current path display */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-widest text-white/50">
          Post-Login Redirect Path
        </label>
        <div className="flex gap-2">
          <Input
            value={value}
            onChange={e => { setValue(e.target.value); setSaved(false) }}
            placeholder="/admin"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent/50 focus-visible:border-accent/50 h-11 font-mono text-sm"
          />
          <Button
            type="button"
            onClick={handleSave}
            disabled={!value.trim() || value === redirectPath}
            className="h-11 px-4 bg-accent hover:bg-accent/90 text-primary font-semibold text-sm shrink-0"
          >
            Save
          </Button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleGenerate}
          className="flex-1 h-10 bg-white/5 border-white/15 text-white/80 hover:bg-white/10 hover:text-white text-sm gap-2"
        >
          <Shuffle className="w-4 h-4" />
          Random Path
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="flex-1 h-10 bg-white/5 border-white/15 text-white/80 hover:bg-white/10 hover:text-white text-sm gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Default
        </Button>
      </div>

      {/* Active path preview */}
      <div className="p-3.5 rounded-lg bg-white/5 border border-white/10">
        <p className="text-xs text-white/40 mb-1">Active redirect path</p>
        <p className="font-mono text-sm text-accent break-all">{redirectPath}</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-green-500/30 bg-green-500/10">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <p className="text-sm text-green-300">Redirect path saved.</p>
        </div>
      )}
    </div>
  )
}

// ─── Main panel ───────────────────────────────────────────────────────────────
export function AdminLoginPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('login')
  const { isAuthenticated } = useAdminAuth()

  // If already authenticated, the hook will navigate via router.replace.
  // Render nothing during that brief moment.
  if (isAuthenticated) return null

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'login', label: 'Sign In', icon: Lock },
    { id: 'password', label: 'Change Password', icon: KeyRound },
    { id: 'redirect', label: 'Redirect URL', icon: Link2 },
  ]

  return (
    <div className="min-h-screen bg-[#0f2847] flex flex-col items-center justify-center px-4 py-12">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="w-full max-w-md relative">
        {/* Logo / brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 mb-5">
            <ShieldCheck className="w-7 h-7 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Dream More Admin
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Secure access to the management panel
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-white/10">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-xs font-semibold tracking-wide transition-all ${
                  activeTab === id
                    ? 'text-accent border-b-2 border-accent bg-accent/5'
                    : 'text-white/40 hover:text-white/70 border-b-2 border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-7">
            {activeTab === 'login' && <LoginTab />}
            {activeTab === 'password' && <ChangePasswordTab />}
            {activeTab === 'redirect' && <RedirectTab />}
          </div>
        </div>

        {/* Security badges */}
        <div className="mt-8">
          <SecurityBadges />
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            &larr; Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
