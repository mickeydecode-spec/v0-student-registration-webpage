import { AdminNav } from '@/components/admin-nav'
import { AdminDashboard } from '@/components/admin-dashboard'

export const metadata = {
  title: 'Admin Dashboard | Dream More',
  description: 'Manage student registrations',
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <AdminNav />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AdminDashboard />
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white mt-16 material-shadow-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-accent">Dream More Training Center | Admin Panel</p>
        </div>
      </footer>
    </div>
  )
}
