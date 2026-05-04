'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'
import { useAdminAuth } from '@/hooks/use-admin-auth'
import {
  Shuffle,
  RotateCcw,
  CheckCircle2,
  Link2,
  Eye,
  EyeOff,
  KeyRound,
  AlertCircle,
} from 'lucide-react'

export function AdminSettings() {
  const { toast } = useToast()
  const supabase = createClient()

  // ── Email settings ────────────────────────────────────────────────────────
  const [email, setEmail] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // ── Redirect URL ──────────────────────────────────────────────────────────
  const { redirectPath, setRedirectPath, generateRandomRedirect, resetRedirect, changePassword } =
    useAdminAuth()
  const [redirectValue, setRedirectValue] = useState(redirectPath)
  const [redirectSaved, setRedirectSaved] = useState(false)

  // ── Change password ───────────────────────────────────────────────────────
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)

  // Keep redirect input in sync when state changes (e.g. after generate/reset)
  useEffect(() => {
    setRedirectValue(redirectPath)
  }, [redirectPath])

  // Load email setting
  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('admin_email')
          .eq('id', 1)
          .single()
        if (error && error.code !== 'PGRST116') throw error
        if (data) setEmail(data.admin_email)
      } catch {
        toast({ title: 'Error', description: 'Failed to load settings', variant: 'destructive' })
      } finally {
        setInitialLoading(false)
      }
    }
    load()
  }, [])

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailLoading(true)
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({ admin_email: email })
        .eq('id', 1)
      if (error) throw error
      toast({ title: 'Saved', description: 'Admin email updated successfully.' })
    } catch {
      toast({ title: 'Error', description: 'Failed to update admin email.', variant: 'destructive' })
    } finally {
      setEmailLoading(false)
    }
  }

  const handleSaveRedirect = () => {
    if (!redirectValue.trim()) return
    setRedirectPath(redirectValue.trim())
    setRedirectSaved(true)
    setTimeout(() => setRedirectSaved(false), 2500)
    toast({ title: 'Redirect updated', description: `Post-login destination set to ${redirectValue.trim()}.` })
  }

  const handleGenerateRedirect = () => {
    generateRandomRedirect()
    setRedirectSaved(false)
  }

  const handleResetRedirect = () => {
    resetRedirect()
    setRedirectValue('/admin')
    setRedirectSaved(false)
    toast({ title: 'Redirect reset', description: 'Post-login redirect restored to /admin.' })
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess(false)

    if (!current || !next || !confirm) { setPwError('All fields are required.'); return }
    if (next !== confirm) { setPwError('New passwords do not match.'); return }
    if (next.length < 8) { setPwError('Password must be at least 8 characters.'); return }

    setPwLoading(true)
    const err = await changePassword(current, next)
    setPwLoading(false)

    if (err) {
      setPwError(err)
    } else {
      setPwSuccess(true)
      setCurrent('')
      setNext('')
      setConfirm('')
      toast({ title: 'Password changed', description: 'Your new password is active immediately.' })
    }
  }

  // Password strength
  const strength = (() => {
    if (!next) return 0
    let s = 0
    if (next.length >= 8) s++
    if (next.length >= 12) s++
    if (/[A-Z]/.test(next)) s++
    if (/[0-9]/.test(next)) s++
    if (/[^A-Za-z0-9]/.test(next)) s++
    return s
  })()
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength]
  const strengthColor = ['', 'bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-emerald-500'][strength]

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">

      {/* ── Email settings ──────────────────────────────────────────────────── */}
      <Card className="interactive-shadow border-border/50">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle>Admin Settings</CardTitle>
          <CardDescription>Configure application settings</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSaveEmail} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Admin Email Address</label>
              <p className="text-xs text-muted-foreground">
                This email will receive Excel exports of all student registrations.
              </p>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@dreammore.com"
                required
                className="neomorph-light-sm focus:ring-accent"
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
              <p className="text-sm text-foreground font-medium mb-2">Email Notification Features</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Automatic export of all registrations on demand</li>
                <li>Excel file attachment with complete student data</li>
                <li>Includes personal details and enrolled courses</li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={emailLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold interactive-shadow"
            >
              {emailLoading ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ── Change Password ─────────────────────────────────────────────────── */}
      <Card className="interactive-shadow border-border/50">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="w-4 h-4" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update the admin panel password. Choose a strong password with a mix of letters,
            numbers, and symbols.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleChangePassword} className="space-y-5" noValidate>

            {/* Current password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Current Password</label>
              <div className="relative">
                <Input
                  type={showCurrent ? 'text' : 'password'}
                  value={current}
                  onChange={e => { setCurrent(e.target.value); setPwError('') }}
                  placeholder="Enter current password"
                  disabled={pwLoading}
                  className="neomorph-light-sm pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowCurrent(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">New Password</label>
              <div className="relative">
                <Input
                  type={showNext ? 'text' : 'password'}
                  value={next}
                  onChange={e => { setNext(e.target.value); setPwError('') }}
                  placeholder="Minimum 8 characters"
                  disabled={pwLoading}
                  className="neomorph-light-sm pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowNext(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNext ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength meter */}
              {next.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength ? strengthColor : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{strengthLabel}</p>
                </div>
              )}
            </div>

            {/* Confirm new password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Confirm New Password</label>
              <Input
                type="password"
                value={confirm}
                onChange={e => { setConfirm(e.target.value); setPwError('') }}
                placeholder="Repeat new password"
                disabled={pwLoading}
                autoComplete="new-password"
                className={`neomorph-light-sm ${
                  confirm && confirm !== next ? 'border-red-400 focus:ring-red-400' : ''
                } ${confirm && confirm === next && next ? 'border-green-500 focus:ring-green-500' : ''}`}
              />
            </div>

            {pwError && (
              <div className="flex items-start gap-3 p-3.5 rounded-lg border border-red-200 bg-red-50">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{pwError}</p>
              </div>
            )}

            {pwSuccess && (
              <div className="flex items-center gap-3 p-3.5 rounded-lg border border-green-200 bg-green-50">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-700">
                  Password changed successfully. Your next login will use the new password.
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={pwLoading || !current || !next || !confirm}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold interactive-shadow"
            >
              {pwLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
        </CardContent>
      </Card>

      {/* ── Post-Login Redirect URL ─────────────────────────────────────────── */}
      <Card className="interactive-shadow border-border/50">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            Post-Login Redirect URL
          </CardTitle>
          <CardDescription>
            Configure where admins land after signing in. Use a randomised path to make
            the admin panel harder to discover.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Redirect Path</label>
            <div className="flex gap-2">
              <Input
                value={redirectValue}
                onChange={e => { setRedirectValue(e.target.value); setRedirectSaved(false) }}
                placeholder="/admin"
                className="neomorph-light-sm font-mono text-sm"
              />
              <Button
                type="button"
                onClick={handleSaveRedirect}
                disabled={!redirectValue.trim() || redirectValue === redirectPath}
                className="bg-primary hover:bg-primary/90 text-white font-semibold shrink-0"
              >
                Save
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerateRedirect}
              className="flex-1 gap-2 border-border/60"
            >
              <Shuffle className="w-4 h-4" />
              Generate Random
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleResetRedirect}
              className="flex-1 gap-2 border-border/60"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Default
            </Button>
          </div>

          <div className="p-3.5 rounded-lg bg-muted/50 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Active redirect path</p>
            <p className="font-mono text-sm text-primary break-all">{redirectPath}</p>
          </div>

          {redirectSaved && (
            <div className="flex items-center gap-2 p-3 rounded-lg border border-green-200 bg-green-50">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-700">Redirect path saved successfully.</p>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
