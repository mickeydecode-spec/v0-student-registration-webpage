import Link from 'next/link'
import { ExcelPreview } from '@/components/excel-preview'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Preview Excel | Dream More Admin',
  description: 'Preview student registrations in Excel format',
}

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="bg-primary text-white sticky top-0 z-50 material-shadow-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center font-bold text-primary">
              DM
            </div>
            <div>
              <h1 className="text-2xl font-bold">Dream More</h1>
              <p className="text-accent text-sm">Excel Preview</p>
            </div>
          </div>
          <nav className="flex gap-4">
            <Link href="/admin">
              <Button variant="outline" className="bg-white/10 hover:bg-white/20 border-white/30 text-white">
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/export">
              <Button variant="outline" className="bg-white/10 hover:bg-white/20 border-white/30 text-white">
                Export
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">Excel Data Preview</h2>
          <p className="text-muted-foreground">View all registration data in spreadsheet format before exporting</p>
        </div>

        <ExcelPreview />
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
