import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Fetch students
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })

    if (studentsError) throw studentsError

    // Fetch all courses
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, course_name')

    if (coursesError) throw coursesError

    // Create a map of course ID to course name
    const courseMap = new Map(courses?.map((c: any) => [c.id.toString(), c.course_name]) || [])

    // Map course IDs to course names
    const enrichedStudents = students?.map((student: any) => ({
      ...student,
      course_names: (student.courses || []).map((courseId: number) => courseMap.get(courseId.toString()) || `Course ${courseId}`),
    })) || []

    return NextResponse.json(enrichedStudents)
  } catch (error) {
    console.error('Error fetching registrations:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, first_name, last_name, email, phone, date_of_birth, gender, address, city, courses } = await request.json()
    
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('students')
      .update({
        first_name: first_name || undefined,
        last_name: last_name || undefined,
        email: email || undefined,
        phone: phone || undefined,
        date_of_birth: date_of_birth || undefined,
        gender: gender || undefined,
        address: address || undefined,
        city: city || undefined,
        courses: courses || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating registration:', error)
    return NextResponse.json(
      { error: 'Failed to update registration' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    
    const supabase = await createClient()
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting registration:', error)
    return NextResponse.json(
      { error: 'Failed to delete registration' },
      { status: 500 }
    )
  }
}
