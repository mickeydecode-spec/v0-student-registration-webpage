'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, Loader2, RefreshCw } from 'lucide-react'

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
  phone_country_code: string
  date_of_birth: string
  gender: string
  address: string
  city: string
  course_id: string
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
    phone_country_code: '+251',
    date_of_birth: '',
    gender: '',
    address: '',
    city: '',
    course_id: '',
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

  const handleRefreshCourses = async () => {
    await fetchCourses()
    toast({
      title: 'Success',
      description: 'Courses refreshed successfully',
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePhoneCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setFormData(prev => ({
      ...prev,
      phone_country_code: value,
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
    const fullPhone = `${formData.phone_country_code} ${formData.phone}`.trim()
    if (!fullPhone || fullPhone === formData.phone_country_code) {
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
    if (!formData.course_id) {
      toast({ title: 'Error', description: 'Please select a course', variant: 'destructive' })
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
          phone: `${formData.phone_country_code} ${formData.phone}`,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          address: formData.address,
          city: formData.city,
          courses: [formData.course_id],
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
        phone_country_code: '+251',
        date_of_birth: '',
        gender: '',
        address: '',
        city: '',
        course_id: '',
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
              <div className="flex gap-2">
                <select
                  value={formData.phone_country_code}
                  onChange={handlePhoneCountryChange}
                  className="w-24 px-3 py-2 bg-white border-0 rounded-lg neomorph-light-sm focus:ring-2 focus:ring-accent text-foreground font-mono"
                  disabled={formLoading}
                >
                  <option value="+251">Ethiopia (+251)</option>
                  <option value="+1">USA/Canada (+1)</option>
                  <option value="+44">UK (+44)</option>
                  <option value="+91">India (+91)</option>
                  <option value="+86">China (+86)</option>
                  <option value="+81">Japan (+81)</option>
                  <option value="+234">Nigeria (+234)</option>
                  <option value="+27">South Africa (+27)</option>
                  <option value="+255">Tanzania (+255)</option>
                  <option value="+256">Uganda (+256)</option>
                </select>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="912345678"
                  className="neomorph-light-sm focus:ring-2 focus:ring-accent border-0 flex-1"
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-primary">Select Your Course *</label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRefreshCourses}
                disabled={coursesLoading || formLoading}
                className="h-6 w-6 p-0"
                title="Refresh courses"
              >
                <RefreshCw className={`w-4 h-4 text-accent ${coursesLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            {coursesLoading ? (
              <div className="flex items-center justify-center py-6 bg-muted/30 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin text-accent mr-2" />
                <p className="text-sm text-muted-foreground">Loading courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="flex items-center justify-center py-6 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">No courses available</p>
              </div>
            ) : (
              <select
                name="course_id"
                value={formData.course_id}
                onChange={handleInputChange}
                className="w-full px-3 py-3 bg-white border-0 rounded-lg neomorph-light-sm focus:ring-2 focus:ring-accent text-foreground text-base"
                disabled={formLoading}
              >
                <option value="">Choose a course...</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.course_name}
                  </option>
                ))}
              </select>
            )}
            {formData.course_id && courses.find(c => c.id.toString() === formData.course_id)?.description && (
              <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted/40 rounded">
                {courses.find(c => c.id.toString() === formData.course_id)?.description}
              </p>
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
