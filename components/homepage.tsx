'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Trash2, Edit2, Plus, Check, X, BookOpen } from 'lucide-react'

interface Course {
  id: number
  course_code: string
  course_name: string
  description: string | null
}

interface FormData {
  course_code: string
  course_name: string
  description: string
}

export function Homepage() {
  const { toast } = useToast()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<FormData>({
    course_code: '',
    course_name: '',
    description: '',
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch courses
  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/courses')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setCourses(data)
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast({
        title: 'Error',
        description: 'Failed to load courses',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.course_code.trim()) {
      toast({ title: 'Validation Error', description: 'Course code is required', variant: 'destructive' })
      return false
    }
    if (!formData.course_name.trim()) {
      toast({ title: 'Validation Error', description: 'Course name is required', variant: 'destructive' })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setSubmitting(true)
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId ? { id: editingId, ...formData } : formData

      const response = await fetch('/api/courses', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) throw new Error('Failed to save')

      toast({
        title: 'Success',
        description: editingId ? 'Course updated successfully' : 'Course added successfully',
      })

      setFormData({ course_code: '', course_name: '', description: '' })
      setEditingId(null)
      await fetchCourses()
    } catch (error) {
      console.error('Error saving course:', error)
      toast({
        title: 'Error',
        description: 'Failed to save course',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (course: Course) => {
    setFormData({
      course_code: course.course_code,
      course_name: course.course_name,
      description: course.description || '',
    })
    setEditingId(course.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return

    try {
      const response = await fetch('/api/courses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) throw new Error('Failed to delete')

      toast({ title: 'Success', description: 'Course deleted successfully' })
      await fetchCourses()
    } catch (error) {
      console.error('Error deleting course:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete course',
        variant: 'destructive',
      })
    }
  }

  const handleCancel = () => {
    setFormData({ course_code: '', course_name: '', description: '' })
    setEditingId(null)
  }

  const filteredCourses = courses.filter(
    course =>
      course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/90 text-white sticky top-0 z-50 material-shadow-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center font-bold text-primary shadow-lg">
                DM
              </div>
              <div>
                <h1 className="text-3xl font-bold">Dream More</h1>
                <p className="text-accent text-sm">Right work at right time</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6">
            <BookOpen className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Manage Your Courses</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Add, edit, and manage your training courses. Changes are instantly reflected across the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 interactive-shadow border-border/50">
              <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5 rounded-t-lg">
                <CardTitle className="text-primary">
                  {editingId ? 'Edit Course' : 'Add New Course'}
                </CardTitle>
                <CardDescription>
                  {editingId ? 'Update course details' : 'Create a new training course'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Course Code</label>
                    <Input
                      name="course_code"
                      value={formData.course_code}
                      onChange={handleInputChange}
                      placeholder="e.g., WEB101"
                      className="neomorph-light-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Course Name</label>
                    <Input
                      name="course_name"
                      value={formData.course_name}
                      onChange={handleInputChange}
                      placeholder="e.g., Web Development"
                      className="neomorph-light-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Course description (optional)"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg neomorph-light-sm focus:ring-accent focus:ring-2 focus:outline-none text-foreground resize-none"
                      rows={4}
                    />
                    <p className="text-xs text-foreground/50">
                      {formData.description.length}/500 characters
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-accent hover:bg-accent/90 text-primary font-semibold interactive-shadow"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2"></div>
                          {editingId ? 'Updating...' : 'Adding...'}
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          {editingId ? 'Update' : 'Add'} Course
                        </>
                      )}
                    </Button>
                    {editingId && (
                      <Button
                        type="button"
                        onClick={handleCancel}
                        variant="outline"
                        className="flex-1 border-border hover:bg-muted"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Courses List Section */}
          <div className="lg:col-span-2">
            <Card className="interactive-shadow border-border/50">
              <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <CardTitle className="text-primary">Available Courses</CardTitle>
                    <CardDescription>
                      {courses.length} {courses.length === 1 ? 'course' : 'courses'} available
                    </CardDescription>
                  </div>
                </div>
                <Input
                  placeholder="Search courses by name or code..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="neomorph-light-sm"
                />
              </CardHeader>

              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-muted border-t-accent rounded-full animate-spin"></div>
                  </div>
                ) : filteredCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-muted mx-auto mb-4 opacity-50" />
                    <p className="text-foreground/70">
                      {courses.length === 0 ? 'No courses yet. Add your first course!' : 'No courses match your search.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredCourses.map(course => (
                      <div
                        key={course.id}
                        className="p-4 bg-gradient-to-r from-muted/50 to-muted/20 rounded-lg border border-border/50 hover:border-accent/50 transition-all hover:shadow-md group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full">
                                {course.course_code}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-primary mb-2 line-clamp-2">
                              {course.course_name}
                            </h3>
                            {course.description && (
                              <p className="text-sm text-foreground/70 line-clamp-2">
                                {course.description}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              onClick={() => handleEdit(course)}
                              size="sm"
                              variant="outline"
                              className="border-border hover:bg-accent/10 hover:text-accent"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDelete(course.id)}
                              size="sm"
                              variant="outline"
                              className="border-border hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <Card className="interactive-shadow border-border/50 text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-accent mb-2">{courses.length}</div>
              <p className="text-foreground/70">Total Courses</p>
            </CardContent>
          </Card>

          <Card className="interactive-shadow border-border/50 text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-primary mb-2">
                {courses.filter(c => c.description).length}
              </div>
              <p className="text-foreground/70">Documented</p>
            </CardContent>
          </Card>

          <Card className="interactive-shadow border-border/50 text-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-accent mb-2">100%</div>
              <p className="text-foreground/70">Up to Date</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white mt-20 material-shadow-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-2">Dream More</h3>
              <p className="text-accent text-sm">Right work at right time</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="/" className="hover:text-accent transition">Home</a></li>
                <li><a href="/" className="hover:text-accent transition">Register</a></li>
                <li><a href="/admin" className="hover:text-accent transition">Admin</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Contact</h4>
              <p className="text-sm text-white/80">+251 99 933 132 122</p>
              <p className="text-sm text-white/80">+251 90 899 3322</p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-white/60 text-sm">
            <p>&copy; 2024 Dream More Training Center. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
