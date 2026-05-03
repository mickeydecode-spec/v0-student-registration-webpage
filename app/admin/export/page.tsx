import { AdminNav } from '@/components/admin-nav'
import { ExportManager } from '@/components/export-manager'

export const metadata = {
  title: 'Export Data | Dream More Admin',
  description: 'Export student registrations to Excel',
}

export default function ExportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <AdminNav />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">Export Student Data</h2>
          <p className="text-muted-foreground">Download or email registration data in Excel format</p>
        </div>

        <ExportManager />
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
