'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, CheckCircle, TrendingUp } from 'lucide-react'

interface Stats {
  totalRegistrations: number
  totalCourses: number
  completedRegistrations: number
  registrationTrend: number
}

export function AdminDashboardOverview() {
  const [stats, setStats] = useState<Stats>({
    totalRegistrations: 0,
    totalCourses: 0,
    completedRegistrations: 0,
    registrationTrend: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [registrations, courses] = await Promise.all([
          fetch('/api/registrations').then(r => r.json()),
          fetch('/api/courses').then(r => r.json()),
        ])

        setStats({
          totalRegistrations: registrations.length || 0,
          totalCourses: courses.length || 0,
          completedRegistrations: registrations.length || 0,
          registrationTrend: 12,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      icon: Users,
      label: 'Total Registrations',
      value: stats.totalRegistrations,
      color: 'from-blue-500/10 to-blue-500/5',
      textColor: 'text-blue-600',
    },
    {
      icon: BookOpen,
      label: 'Available Courses',
      value: stats.totalCourses,
      color: 'from-purple-500/10 to-purple-500/5',
      textColor: 'text-purple-600',
    },
    {
      icon: CheckCircle,
      label: 'Processed',
      value: stats.completedRegistrations,
      color: 'from-green-500/10 to-green-500/5',
      textColor: 'text-green-600',
    },
    {
      icon: TrendingUp,
      label: 'This Month',
      value: `+${stats.registrationTrend}`,
      color: 'from-orange-500/10 to-orange-500/5',
      textColor: 'text-orange-600',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Welcome to Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage courses, view registrations, and configure system settings
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={index}
              className="bg-gradient-to-br border-0 interactive-shadow overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)`,
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      {loading ? '-' : stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.textColor} bg-white/50`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 interactive-shadow">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/manage-courses"
              className="p-4 rounded-lg border-2 border-accent/30 hover:border-accent hover:bg-accent/5 transition-all text-center cursor-pointer"
            >
              <BookOpen className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="font-semibold text-primary">Manage Courses</p>
              <p className="text-xs text-muted-foreground mt-1">Add, edit, delete courses</p>
            </a>

            <a
              href="/admin/registrations"
              className="p-4 rounded-lg border-2 border-accent/30 hover:border-accent hover:bg-accent/5 transition-all text-center cursor-pointer"
            >
              <Users className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="font-semibold text-primary">View Registrations</p>
              <p className="text-xs text-muted-foreground mt-1">Manage student records</p>
            </a>

            <a
              href="/admin/settings"
              className="p-4 rounded-lg border-2 border-accent/30 hover:border-accent hover:bg-accent/5 transition-all text-center cursor-pointer"
            >
              <CheckCircle className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="font-semibold text-primary">Settings</p>
              <p className="text-xs text-muted-foreground mt-1">Configure system settings</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
