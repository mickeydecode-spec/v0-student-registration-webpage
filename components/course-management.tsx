'use client'

import { useState } from 'react'
import { useCourses, createCourse, updateCourse, deleteCourse } from '@/hooks/use-courses'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Trash2Icon, EditIcon, PlusIcon, SaveIcon, XIcon, AlertCircle, CheckCircle, Upload } from 'lucide-react'

interface CourseFormData {
  course_code: string
  course_name: string
  description: string
}

interface BulkCourseData {
  name: string
  code?: string
}

export function CourseManagement() {
  const { courses, isLoading, mutate } = useCourses()
  const { toast } = useToast()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isBulkAdding, setIsBulkAdding] = useState(false)
  const [bulkInput, setBulkInput] = useState('')
  const [formData, setFormData] = useState<CourseFormData>({
    course_code: '',
    course_name: '',
    description: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  const validateForm = (data: CourseFormData) => {
    const newErrors: Record<string, string> = {}

    if (!data.course_code.trim()) {
      newErrors.course_code = 'Course code is required'
    } else if (data.course_code.trim().length > 50) {
      newErrors.course_code = 'Course code must be 50 characters or less'
    }

    if (!data.course_name.trim()) {
      newErrors.course_name = 'Course name is required'
    } else if (data.course_name.trim().length > 255) {
      newErrors.course_name = 'Course name must be 255 characters or less'
    }

    if (data.description.trim().length > 1000) {
      newErrors.description = 'Description must be 1000 characters or less'
    }

    return newErrors
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleAddCourse = () => {
    setIsAdding(true)
    setEditingId(null)
    setFormData({
      course_code: '',
      course_name: '',
      description: '',
    })
    setErrors({})
  }

  const handleEditCourse = (course: any) => {
    setEditingId(course.id)
    setIsAdding(false)
    setFormData({
      course_code: course.course_code,
      course_name: course.course_name,
      description: course.description || '',
    })
    setErrors({})
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({
      course_code: '',
      course_name: '',
      description: '',
    })
    setErrors({})
  }

  const handleSave = async () => {
    const newErrors = validateForm(formData)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSaving(true)
    try {
      if (editingId) {
        await updateCourse(editingId, formData)
        toast({
          title: 'Success',
          description: 'Course updated successfully',
        })
      } else {
        await createCourse(formData)
        toast({
          title: 'Success',
          description: 'Course created successfully',
        })
      }
      await mutate()
      handleCancel()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save course',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCourse = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return
    }

    try {
      await deleteCourse(id)
      await mutate()
      toast({
        title: 'Success',
        description: 'Course deleted successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete course',
        variant: 'destructive',
      })
    }
  }

  // Bulk course addition handlers
  const parseBulkInput = (input: string): BulkCourseData[] => {
    const lines = input.split('\n').filter((line) => line.trim())
    return lines.map((line) => {
      const trimmed = line.trim()
      // Simple format: "Course Name" or "CODE: Course Name"
      if (trimmed.includes(':')) {
        const [code, name] = trimmed.split(':').map((s) => s.trim())
        return { name, code }
      }
      return { name: trimmed }
    })
  }

  const handleBulkAdd = async () => {
    const courseList = parseBulkInput(bulkInput)

    if (courseList.length === 0) {
      toast({
        title: 'Error',
        description: 'Please enter at least one course name',
        variant: 'destructive',
      })
      return
    }

    setIsSaving(true)
    let successCount = 0
    let failCount = 0

    try {
      for (const course of courseList) {
        try {
          const courseCode = course.code || `COURSE${Math.floor(Math.random() * 10000)}`
          await createCourse({
            course_code: courseCode,
            course_name: course.name,
            description: '',
          })
          successCount++
        } catch {
          failCount++
        }
      }

      await mutate()

      if (failCount === 0) {
        toast({
          title: 'Success',
          description: `${successCount} course${successCount !== 1 ? 's' : ''} added successfully`,
        })
      } else {
        toast({
          title: 'Partial Success',
          description: `${successCount} added, ${failCount} failed`,
          variant: 'destructive',
        })
      }

      setBulkInput('')
      setIsBulkAdding(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add courses',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Course Management
          </h1>
          <p className="text-foreground/70 text-base md:text-lg">
            Add, edit, and manage courses available for student registration
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-lg material-shadow-2">
              <h2 className="text-xl font-bold text-foreground mb-6">
                {editingId ? 'Edit Course' : isAdding ? 'Add New Course' : 'Course Form'}
              </h2>

              {isAdding || editingId ? (
                <form className="space-y-4">
                  {/* Course Code */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      Course Code <span className="text-accent">*</span>
                    </label>
                    <Input
                      name="course_code"
                      value={formData.course_code}
                      onChange={handleInputChange}
                      placeholder="e.g., CS101"
                      disabled={isSaving}
                      className={`neomorph-light-sm ${errors.course_code ? 'border-red-500' : ''}`}
                    />
                    {errors.course_code && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.course_code}
                      </p>
                    )}
                  </div>

                  {/* Course Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      Course Name <span className="text-accent">*</span>
                    </label>
                    <Input
                      name="course_name"
                      value={formData.course_name}
                      onChange={handleInputChange}
                      placeholder="e.g., Introduction to Computer Science"
                      disabled={isSaving}
                      className={`neomorph-light-sm ${errors.course_name ? 'border-red-500' : ''}`}
                    />
                    {errors.course_name && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.course_name}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      Description <span className="text-foreground/50 text-xs">(Optional)</span>
                    </label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter course description..."
                      disabled={isSaving}
                      rows={4}
                      className={`neomorph-light-sm resize-none ${errors.description ? 'border-red-500' : ''}`}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.description}
                      </p>
                    )}
                    <p className="text-xs text-foreground/50">
                      {formData.description.length}/1000 characters
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                    >
                      <SaveIcon className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Course'}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      disabled={isSaving}
                      variant="outline"
                      className="flex-1"
                    >
                      <XIcon className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {/* Single or Bulk Toggle */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setIsAdding(true)
                        setIsBulkAdding(false)
                        setEditingId(null)
                        setFormData({
                          course_code: '',
                          course_name: '',
                          description: '',
                        })
                        setErrors({})
                      }}
                      disabled={isBulkAdding || editingId !== null}
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 text-base"
                    >
                      <PlusIcon className="w-5 h-5 mr-2" />
                      Add Single Course
                    </Button>
                    <Button
                      onClick={() => {
                        setIsBulkAdding(true)
                        setIsAdding(false)
                        setEditingId(null)
                        setBulkInput('')
                        setErrors({})
                      }}
                      disabled={isAdding || editingId !== null}
                      variant="outline"
                      className="flex-1 font-semibold py-6 text-base"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Bulk Add Courses
                    </Button>
                  </div>

                  {/* Bulk Input Section */}
                  {isBulkAdding && (
                    <div className="space-y-4 p-6 bg-muted/30 rounded-lg border-2 border-accent/30">
                      <div>
                        <label className="text-sm font-semibold text-foreground mb-2 block">
                          Course Names (One per line) *
                        </label>
                        <p className="text-xs text-muted-foreground mb-3">
                          Enter one course name per line. Optionally prefix with code using "CODE: Course Name" format.
                        </p>
                        <Textarea
                          value={bulkInput}
                          onChange={(e) => setBulkInput(e.target.value)}
                          placeholder={`Web Development
Graphics Design
Digital Marketing
CODE101: Advanced Python
CODE102: Mobile App Dev`}
                          disabled={isSaving}
                          rows={8}
                          className="neomorph-light-sm resize-none font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          {bulkInput.split('\n').filter((line) => line.trim()).length} course{bulkInput.split('\n').filter((line) => line.trim()).length !== 1 ? 's' : ''} to add
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={handleBulkAdd}
                          disabled={isSaving || !bulkInput.trim()}
                          className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {isSaving ? 'Adding...' : 'Add All Courses'}
                        </Button>
                        <Button
                          onClick={() => {
                            setIsBulkAdding(false)
                            setBulkInput('')
                          }}
                          disabled={isSaving}
                          variant="outline"
                          className="flex-1"
                        >
                          <XIcon className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Courses List Section */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-lg material-shadow-2">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Available Courses
                <span className="text-accent ml-2">({courses.length})</span>
              </h2>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-muted border-t-accent rounded-full animate-spin"></div>
                  <p className="text-foreground/70 mt-4">Loading courses...</p>
                </div>
              ) : courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <PlusIcon className="w-8 h-8 text-foreground/40" />
                  </div>
                  <p className="text-foreground/70 text-center">
                    No courses yet. Create your first course to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {courses.map((course: any) => (
                    <div
                      key={course.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-muted/30 rounded-lg border border-border hover:border-accent/50 hover:shadow-md transition-all neomorph-light-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-accent/20 text-accent font-mono text-sm font-semibold rounded-full">
                            {course.course_code}
                          </span>
                          <h3 className="text-base md:text-lg font-semibold text-foreground truncate">
                            {course.course_name}
                          </h3>
                        </div>
                        {course.description && (
                          <p className="text-sm text-foreground/70 line-clamp-2">
                            {course.description}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          onClick={() => handleEditCourse(course)}
                          disabled={editingId !== null || isAdding}
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <EditIcon className="w-4 h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          onClick={() => handleDeleteCourse(course.id)}
                          disabled={editingId !== null || isAdding}
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2Icon className="w-4 h-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats Section */}
            {courses.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-card rounded-xl p-4 shadow-md material-shadow-1 border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground/70 text-sm">Total Courses</p>
                      <p className="text-2xl font-bold text-accent">{courses.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-xl p-4 shadow-md material-shadow-1 border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground/70 text-sm">Available for Registration</p>
                      <p className="text-2xl font-bold text-secondary">{courses.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                      <PlusIcon className="w-6 h-6 text-secondary" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
