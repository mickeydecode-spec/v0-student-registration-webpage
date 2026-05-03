import { StudentRegistrationForm } from '@/components/student-registration-form'

export const metadata = {
  title: 'Student Registration | Dream More',
  description: 'Register for Dream More courses and training programs',
}

export default function RegistrationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="bg-primary text-white sticky top-0 z-50 material-shadow-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center font-bold text-primary">
              DM
            </div>
            <div>
              <h1 className="text-2xl font-bold">Dream More</h1>
              <p className="text-accent text-sm">Right work at right time</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">Student Registration</h2>
          <p className="text-muted-foreground text-lg">
            Join Dream More and unlock your potential with our specialized courses
          </p>
        </div>

        {/* Registration Form */}
        <StudentRegistrationForm />
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white mt-16 material-shadow-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <p className="text-accent font-semibold">Dream More Training Center</p>
              <p className="text-white/80 text-sm mt-1">Right work at right time</p>
            </div>
            <div className="mt-4 md:mt-0 text-white/80 text-sm">
              <p>+251 99 933 132 122 | +251 90 899 3322</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
