import Image from 'next/image'
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Dream More Logo"
              width={50}
              height={50}
              className="h-12 w-auto"
              priority
            />
            <div>
              <h1 className="text-lg font-bold text-primary">Dream More</h1>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/logo.png"
                  alt="Dream More Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
                <div>
                  <p className="font-bold text-lg">Dream More</p>
                  <p className="text-accent text-xs">Right work at right time</p>
                </div>
              </div>
              <p className="text-white/80 text-sm">
                Empowering professionals with skills and knowledge for career advancement.
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-white mb-4">Contact Us</h3>
              <div className="space-y-2 text-white/80 text-sm">
                <p>
                  <a href="tel:+251993132122" className="hover:text-accent transition-colors">
                    +251 99 313 2122
                  </a>
                </p>
                <p>
                  <a href="tel:+251908993322" className="hover:text-accent transition-colors">
                    +251 90 899 3322
                  </a>
                </p>
                <p>
                  <a href="mailto:info@dreammore.com" className="hover:text-accent transition-colors">
                    info@dreammore.com
                  </a>
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-semibold text-white mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {/* Telegram */}
                <a
                  href="https://t.me/Dreammore21"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-accent hover:text-white flex items-center justify-center transition-all transform hover:scale-110"
                  title="Join us on Telegram"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295-.042 0-.084 0-.127-.01l-.21-3.093 5.852-5.285c.25-.223-.055-.346-.364-.123L8.88 10.117l-3.002-.938c-.653-.204-.666-.666.136-.994l11.698-4.514c.545-.217 1.047.099.876.951z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/dreammorecompany"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-accent hover:text-white flex items-center justify-center transition-all transform hover:scale-110"
                  title="Follow us on Instagram"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.205 0-3.584-.012-4.849-.069-3.259-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-white/20 pt-8 text-center text-white/60 text-sm">
            <p>&copy; 2026 Dream More Training Center. All rights reserved.</p>
            <p className="mt-2">Empowering professionals for the future of work</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
