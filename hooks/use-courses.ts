import useSWR from 'swr'

interface Course {
  id: number
  course_code: string
  course_name: string
  description: string | null
  created_at: string
  updated_at: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch courses')
  }
  return res.json()
}

export function useCourses() {
  const { data, error, isLoading, mutate } = useSWR('/api/courses', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  })

  return {
    courses: data || [],
    isLoading,
    error,
    mutate,
  }
}

export async function createCourse(courseData: {
  course_code: string
  course_name: string
  description?: string
}) {
  const res = await fetch('/api/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseData),
  })
  if (!res.ok) throw new Error('Failed to create course')
  return res.json()
}

export async function updateCourse(
  id: number,
  courseData: {
    course_code: string
    course_name: string
    description?: string
  }
) {
  const res = await fetch('/api/courses', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...courseData }),
  })
  if (!res.ok) throw new Error('Failed to update course')
  return res.json()
}

export async function deleteCourse(id: number) {
  const res = await fetch('/api/courses', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
  if (!res.ok) throw new Error('Failed to delete course')
  return res.json()
}
