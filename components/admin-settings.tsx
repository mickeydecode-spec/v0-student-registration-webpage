'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'

export function AdminSettings() {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

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
    <Card className="max-w-2xl interactive-shadow border-border/50">
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
  )
}
