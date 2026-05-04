import Image from 'next/image'
import { StudentRegistrationForm } from '@/components/student-registration-form'

export const metadata = {
  title: 'Student Registration | Dream More',
  description: 'Register for Dream More courses and training programs',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="bg-primary text-white sticky top-0 z-50 material-shadow-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Dream More Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
