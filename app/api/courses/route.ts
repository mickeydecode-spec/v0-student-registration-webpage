import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error
    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const { course_code, course_name, description } = await request.json()

    if (!course_code || !course_name) {
      return NextResponse.json(
        { error: 'Course code and name are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('courses')
      .insert([
        {
          course_code: course_code.trim(),
          course_name: course_name.trim(),
          description: description?.trim() || null,
        },
      ])
      .select()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { id, course_code, course_name, description } = await request.json()

    if (!id || !course_code || !course_name) {
      return NextResponse.json(
        { error: 'ID, course code, and name are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('courses')
      .update({
        course_code: course_code.trim(),
        course_name: course_name.trim(),
        description: description?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    )
  }
}
