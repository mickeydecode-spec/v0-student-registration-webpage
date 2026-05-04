'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'
import { useAdminAuth } from '@/hooks/use-admin-auth'
import { Shuffle, RotateCcw, CheckCircle2, Link2 } from 'lucide-react'

export function AdminSettings() {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // Redirect URL state
  const { redirectPath, setRedirectPath, generateRandomRedirect, resetRedirect } =
    useAdminAuth()
  const [redirectValue, setRedirectValue] = useState(redirectPath)
  const [redirectSaved, setRedirectSaved] = useState(false)

  useEffect(() => {
    setRedirectValue(redirectPath)
  }, [redirectPath])

  const handleSaveRedirect = () => {
    if (!redirectValue.trim()) return
    setRedirectPath(redirectValue.trim())
    setRedirectSaved(true)
    setTimeout(() => setRedirectSaved(false), 2500)
    toast({ title: 'Redirect URL updated', description: `Admins will be sent to ${redirectValue.trim()} after login.` })
  }

  const handleGenerateRedirect = () => {
    generateRandomRedirect()
    setRedirectSaved(false)
  }

  const handleResetRedirect = () => {
    resetRedirect()
    setRedirectValue('/admin')
    setRedirectSaved(false)
    toast({ title: 'Redirect reset', description: 'Post-login redirect set back to /admin.' })
  }

  const supabase = createClient()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('admin_email')
        .eq('id', 1)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setEmail(data.admin_email)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load settings',
        variant: 'destructive',
      })
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({ admin_email: email })
        .eq('id', 1)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Admin email updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update admin email',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
    <Card className="interactive-shadow border-border/50">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardTitle>Admin Settings</CardTitle>
        <CardDescription>Configure application settings</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Admin Email Address</label>
            <p className="text-xs text-muted-foreground mb-3">
              This email will receive Excel exports of all student registrations
            </p>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold interactive-shadow"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </form>
      </CardContent>
    </Card>

    {/* Redirect URL Card */}
    <Card className="interactive-shadow border-border/50">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardTitle className="flex items-center gap-2">
          <Link2 className="w-4 h-4" />
          Post-Login Redirect URL
        </CardTitle>
        <CardDescription>
          Configure where admins are redirected after a successful login. Use a random path
          to obscure the admin panel location.
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
