import { AdminProtected } from '@/components/admin-protected'
import { AdminLayout } from '@/components/admin-layout'
import { AdminDashboardOverview } from '@/components/admin-dashboard-overview'

export const metadata = {
  title: 'Admin Dashboard | Dream More',
  description: 'Manage courses, registrations, and system settings',
}

export default function AdminPage() {
  return (
    <AdminProtected>
      <AdminLayout>
        <AdminDashboardOverview />
      </AdminLayout>
    </AdminProtected>
  )
}
