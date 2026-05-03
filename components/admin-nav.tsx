'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { SettingsIcon, BookOpenIcon, FileTextIcon, MailIcon, DownloadIcon } from 'lucide-react'

export function AdminNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: FileTextIcon,
    },
    {
      href: '/admin/courses',
      label: 'Manage Courses',
      icon: BookOpenIcon,
    },
    {
      href: '/admin/settings',
      label: 'Settings',
      icon: SettingsIcon,
    },
    {
      href: '/admin/export',
      label: 'Export & Email',
      icon: DownloadIcon,
    },
  ]

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold">D</span>
            </div>
            <span className="hidden md:inline">Dream More Admin</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 md:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-primary-foreground/10'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
