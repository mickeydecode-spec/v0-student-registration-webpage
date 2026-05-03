import { RegistrationFormSimple } from '@/components/registration-form-simple'

export const metadata = {
  title: 'Dream More | Student Registration',
  description: 'Register for Dream More training courses and start your learning journey',
}

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border/50 material-shadow-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center font-bold text-white">
              DM
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Dream More</h1>
              <p className="text-accent text-xs">Right work at right time</p>
            </div>
          </div>
          {/* Hidden admin link - accessible only to those who know */}
          <a
            href="/admin/login"
            className="hidden sm:inline-block px-4 py-2 text-xs font-medium text-muted-foreground hover:text-accent transition-colors opacity-20 hover:opacity-100"
            title="Admin access"
          >
            ⚙️
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Start Your Learning Journey
          </h2>
          <p className="text-lg text-muted-foreground mb-2">
            Register today and choose from our wide range of professional courses
          </p>
          <p className="text-sm text-accent font-semibold">
            Empower yourself with skills for the future
          </p>
        </div>

        {/* Registration Form */}
        <div className="animate-slide-in-right">
          <RegistrationFormSimple />
        </div>

        {/* Features Highlight */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-accent font-bold">1</span>
            </div>
            <h3 className="font-semibold text-primary mb-2">Easy Registration</h3>
            <p className="text-sm text-muted-foreground">
              Quick and simple enrollment process
            </p>
          </div>

          <div className="text-center p-6 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-accent font-bold">2</span>
            </div>
            <h3 className="font-semibold text-primary mb-2">Choose Your Course</h3>
            <p className="text-sm text-muted-foreground">
              Select from diverse professional training programs
            </p>
          </div>

          <div className="text-center p-6 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-accent font-bold">3</span>
            </div>
            <h3 className="font-semibold text-primary mb-2">Start Learning</h3>
            <p className="text-sm text-muted-foreground">
              Begin your growth and achieve your goals
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-primary text-white border-t border-primary/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <p className="text-accent font-semibold">Dream More Training Center</p>
              <p className="text-white/70 text-sm mt-1">Right work at right time</p>
            </div>
            <div className="mt-4 md:mt-0 text-white/80 text-sm text-center md:text-right">
              <p>+251 99 933 132 122 | +251 90 899 3322</p>
              <p className="text-xs mt-1 text-white/60">© 2024 Dream More. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
