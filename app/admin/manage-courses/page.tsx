import { AdminProtected } from '@/components/admin-protected'
import { AdminLayout } from '@/components/admin-layout'
import { CourseManagement } from '@/components/course-management'

export const metadata = {
  title: 'Manage Courses | Dream More Admin',
  description: 'Add, edit, and delete courses',
}

export default function ManageCoursesPage() {
  return (
    <AdminProtected>
      <AdminLayout>
        <CourseManagement />
      </AdminLayout>
    </AdminProtected>
  )
}
