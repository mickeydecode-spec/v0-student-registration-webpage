import { AdminLayout } from '@/components/admin-layout'
import { AdminDashboard } from '@/components/admin-dashboard'

export const metadata = {
  title: 'Student Registrations | Dream More Admin',
  description: 'View and manage student registrations',
}

export default function RegistrationsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-primary">Student Registrations</h2>
          <p className="text-muted-foreground mt-2">
            View, edit, and manage all student registrations
          </p>
        </div>
        <AdminDashboard />
      </div>
    </AdminLayout>
  )
}
