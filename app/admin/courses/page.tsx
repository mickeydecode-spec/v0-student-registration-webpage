import { AdminProtected } from '@/components/admin-protected'
import { AdminNav } from '@/components/admin-nav'
import { CourseManagement } from '@/components/course-management'

export const metadata = {
  title: 'Course Management | Dream More Admin',
  description: 'Manage courses available for student registration',
}

export default function CoursesPage() {
  return (
    <AdminProtected>
      <div>
        <AdminNav />
        <CourseManagement />
      </div>
    </AdminProtected>
  )
}
