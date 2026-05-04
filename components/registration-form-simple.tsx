'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, Loader2 } from 'lucide-react'

interface Course {
  id: number
  course_code: string
  course_name: string
  description: string | null
}

interface FormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: string
  gender: string
  address: string
  city: string
  courses: string[]
}

export function RegistrationFormSimple() {
  const { toast } = useToast()
  const [courses, setCourses] = useState<Course[]>([])
  const [coursesLoading, setCoursesLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    city: '',
    courses: [],
  })

  // Fetch courses
  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true)
      const response = await fetch('/api/courses')
      if (!response.ok) throw new Error('Failed to fetch courses')
      const data = await response.json()
      setCourses(data)
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast({
        title: 'Error',
        description: 'Failed to load courses. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setCoursesLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCourseToggle = (courseId: number) => {
    const courseIdStr = courseId.toString()
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.includes(courseIdStr)
        ? prev.courses.filter(id => id !== courseIdStr)
        : [...prev.courses, courseIdStr]
    }))
  }

  const validateForm = () => {
    if (!formData.first_name.trim()) {
      toast({ title: 'Error', description: 'First name is required', variant: 'destructive' })
      return false
    }
    if (!formData.last_name.trim()) {
      toast({ title: 'Error', description: 'Last name is required', variant: 'destructive' })
      return false
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast({ title: 'Error', description: 'Valid email is required', variant: 'destructive' })
      return false
    }
    if (!formData.phone.trim()) {
      toast({ title: 'Error', description: 'Phone number is required', variant: 'destructive' })
      return false
    }
    if (!formData.date_of_birth) {
      toast({ title: 'Error', description: 'Date of birth is required', variant: 'destructive' })
      return false
    }
    if (!formData.gender) {
      toast({ title: 'Error', description: 'Gender is required', variant: 'destructive' })
      return false
    }
    if (!formData.address.trim()) {
      toast({ title: 'Error', description: 'Address is required', variant: 'destructive' })
      return false
    }
    if (!formData.city.trim()) {
      toast({ title: 'Error', description: 'City is required', variant: 'destructive' })
      return false
    }
    if (formData.courses.length === 0) {
      toast({ title: 'Error', description: 'Please select at least one course', variant: 'destructive' })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setFormLoading(true)
      const supabase = createClient()

      const { error } = await supabase.from('students').insert([
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: `+251 ${formData.phone}`,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          address: formData.address,
          city: formData.city,
          courses: formData.courses.map(id => parseInt(id)),
        },
      ])

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Registration completed successfully! Welcome to Dream More.',
        variant: 'default',
      })

      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        address: '',
        city: '',
        courses: [],
      })
    } catch (error) {
      console.error('Registration error:', error)
      toast({
        title: 'Error',
        description: 'Registration failed. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <Card className="w-full bg-white/95 border-0 interactive-shadow">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
        <CardTitle className="text-2xl text-primary">Register for a Course</CardTitle>
        <CardDescription className="text-base">
          Join Dream More and start your learning journey today
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary">First Name *</label>
              <Input
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="John"
                className="neomorph-light-sm focus:ring-2 focus:ring-accent border-0"
                disabled={formLoading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary">Last Name *</label>
              <Input
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Doe"
                className="neomorph-light-sm focus:ring-2 focus:ring-accent border-0"
                disabled={formLoading}
              />
            </div>
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary">Email *</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className="neomorph-light-sm focus:ring-2 focus:ring-accent border-0"
                disabled={formLoading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary">Phone *</label>
              <div className="flex items-center">
                <span className="px-3 py-2 bg-muted text-muted-foreground font-mono text-sm rounded-l-lg border border-r-0 border-border">
                  +251
                </span>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="912345678"
                  className="neomorph-light-sm focus:ring-2 focus:ring-accent border-0 flex-1 rounded-l-none"
                  disabled={formLoading}
                />
              </div>
            </div>
          </div>

          {/* Date of Birth and Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary">Date of Birth *</label>
              <Input
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                className="neomorph-light-sm focus:ring-2 focus:ring-accent border-0"
                disabled={formLoading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border-0 rounded-lg neomorph-light-sm focus:ring-2 focus:ring-accent text-foreground"
                disabled={formLoading}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary">Address *</label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="123 Main Street"
              className="neomorph-light-sm focus:ring-2 focus:ring-accent border-0"
              disabled={formLoading}
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary">City *</label>
            <Input
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Addis Ababa"
              className="neomorph-light-sm focus:ring-2 focus:ring-accent border-0"
              disabled={formLoading}
            />
          </div>

          {/* Course Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-primary">Select Your Courses * (Choose at least one)</label>
            {coursesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-4 h-4 animate-spin text-accent mr-2" />
                <p className="text-sm text-muted-foreground">Loading courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="flex items-center justify-center py-8 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">No courses available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {courses.map(course => {
                  const isSelected = formData.courses.includes(course.id.toString())
                  return (
                    <div
                      key={course.id}
                      onClick={() => handleCourseToggle(course.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all transform hover:scale-105 ${
                        isSelected
                          ? 'border-accent bg-accent/10 shadow-md'
                          : 'border-muted hover:border-accent/50 bg-muted/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={`course-${course.id}`}
                          checked={isSelected}
                          onClick={(e) => e.stopPropagation()}
                          className="cursor-pointer mt-1 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <label
                            htmlFor={`course-${course.id}`}
                            className="text-sm font-semibold cursor-pointer text-foreground"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {course.course_name}
                          </label>
                          {course.description && (
                            <p className="text-xs text-foreground/60 mt-1 line-clamp-2">
                              {course.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            {formData.courses.length > 0 && (
              <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg">
                <p className="text-sm font-medium text-foreground">
                  Selected: <span className="text-accent font-semibold">{formData.courses.length} course{formData.courses.length !== 1 ? 's' : ''}</span>
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={formLoading}
            className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white py-6 text-base font-semibold rounded-lg interactive-shadow border-0 transition-all"
          >
            {formLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Registering...
              </>
            ) : (
              <>
                Complete Registration
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            All fields marked with * are required
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
