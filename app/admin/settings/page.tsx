import { AdminProtected } from '@/components/admin-protected'
import { AdminLayout } from '@/components/admin-layout'
import { AdminSettings } from '@/components/admin-settings'

export const metadata = {
  title: 'Admin Settings | Dream More',
  description: 'Configure admin settings',
}

export default function SettingsPage() {
  return (
    <AdminProtected>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-primary">Settings</h2>
            <p className="text-muted-foreground mt-2">Manage application configuration and email settings</p>
          </div>
          <AdminSettings />
        </div>
      </AdminLayout>
    </AdminProtected>
  )
}
