'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, BarChart3, Users, BookOpen, Settings, LogOut, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAdminAuth } from '@/hooks/use-admin-auth'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAdminAuth()

  const navItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/admin' },
    { icon: Users, label: 'Registrations', href: '/admin/registrations' },
    { icon: BookOpen, label: 'Manage Courses', href: '/admin/manage-courses' },
    { icon: Download, label: 'Export Data', href: '/admin/export' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary text-white transform transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-primary/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-bold text-primary text-sm">
              DM
            </div>
            <span className="font-bold text-lg">Dream More</span>
          </div>
          <button
            className="md:hidden text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-accent text-primary font-semibold'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-primary/20 p-4 space-y-2">
          <Link href="/" className="block w-full">
            <Button
              variant="outline"
              className="w-full bg-white/10 hover:bg-white/20 border-white/30 text-white text-sm"
            >
              Back to Home
            </Button>
          </Link>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full bg-red-500/20 hover:bg-red-500/30 border-red-400/30 text-white text-sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-border/50 flex items-center px-4 md:px-8 sticky top-0 z-40">
          <button
            className="md:hidden text-primary mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
