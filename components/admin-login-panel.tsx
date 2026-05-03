'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/hooks/use-admin-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, Lock, Eye, EyeOff } from 'lucide-react'

export function AdminLoginPanel() {
  const router = useRouter()
  const { isAuthenticated, login } = useAdminAuth()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!password.trim()) {
      setError('Password is required')
      return
    }

    setIsLoading(true)
    try {
      // Simulate a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 300))

      if (login(password)) {
        // Clear password and redirect
        setPassword('')
        router.push('/admin')
      } else {
        setError('Invalid password. Please try again.')
        setPassword('')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-border/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center font-bold text-white mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
              Admin Access
            </h1>
            <p className="text-muted-foreground">
              Enter your password to access the admin panel
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary">
                Admin Password *
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (error) setError('')
                  }}
                  placeholder="Enter admin password"
                  disabled={isLoading}
                  className="neomorph-light-sm pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50/80 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white py-6 text-base font-semibold rounded-lg transition-all"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Verifying...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Access Admin Panel
                </>
              )}
            </Button>
          </form>

          {/* Info Message */}
          <div className="mt-8 p-4 bg-blue-50/80 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <span className="font-semibold">Note:</span> Only authorized administrators can access this panel. Your session will expire after 24 hours of inactivity.
            </p>
          </div>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-primary hover:text-accent transition-colors font-medium"
            >
              ← Back to Home
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            Dream More Training Center | Secure Admin Panel
          </p>
        </div>
      </div>
    </div>
  )
}
