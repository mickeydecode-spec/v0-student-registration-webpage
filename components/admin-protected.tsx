'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/hooks/use-admin-auth'
import { ShieldCheck } from 'lucide-react'

interface AdminProtectedProps {
  children: React.ReactNode
}

export function AdminProtected({ children }: AdminProtectedProps) {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const router = useRouter()

  // If not authenticated after hydration, redirect to login.
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/admin/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-muted border-t-accent animate-spin" />
          <p className="text-sm text-muted-foreground">Checking session&hellip;</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Render a blank shield while the router.replace navigates
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f2847]">
        <ShieldCheck className="w-10 h-10 text-accent/40 animate-pulse" />
      </div>
    )
  }

  return <>{children}</>
}
