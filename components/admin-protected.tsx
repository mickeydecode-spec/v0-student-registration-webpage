'use client'

import { useAdminAuth } from '@/hooks/use-admin-auth'
import { AdminLoginPanel } from '@/components/admin-login-panel'

interface AdminProtectedProps {
  children: React.ReactNode
}

export function AdminProtected({ children }: AdminProtectedProps) {
  const { isAuthenticated, isLoading } = useAdminAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-muted border-t-accent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLoginPanel />
  }

  return <>{children}</>
}
