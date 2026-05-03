'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'

const AVAILABLE_COURSES = [
  'Graphics Designing',
  'Video Editing',
  'Digital Marketing',
  'Cinematography',
  'Web and Mobile App Development',
  'Basic Computer Skill',
  'Computer Maintenance',
  'Mobile Maintenance',
  'AI for Business',
  'Cybersecurity & Data Safety',
  'Robotics & Drone Technology',
  'AI-Powered Freelancing',
  '3D Modeling & Product',
  'Prototyping',
]

interface FormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: string
  gender: string
  address: string
  city: string
  state: string
  postal_code: string
  courses: string[]
}

export function StudentRegistrationForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    courses: [],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCourseToggle = (course: string) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.includes(course)
        ? prev.courses.filter(c => c !== course)
        : [...prev.courses, course],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from('students').insert([
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          courses: formData.courses,
        },
      ])

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Registration submitted successfully!',
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
        state: '',
        postal_code: '',
        courses: [],
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit registration. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      {/* Personal Details Section */}
      <Card className="mb-6 interactive-shadow border-border/50">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="text-primary">Personal Details</CardTitle>
          <CardDescription>Enter your personal information</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">First Name *</label>
              <Input
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="John"
                required
                className="neomorph-light-sm focus:ring-accent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Last Name *</label>
              <Input
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Doe"
                required
                className="neomorph-light-sm focus:ring-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email *</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                required
                className="neomorph-light-sm focus:ring-accent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone</label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+251 9XX XXX XXXX"
                className="neomorph-light-sm focus:ring-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Date of Birth</label>
              <Input
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                className="neomorph-light-sm focus:ring-accent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg neomorph-light-sm focus:ring-accent focus:ring-2 focus:outline-none text-foreground"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Address</label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Street address"
              className="neomorph-light-sm focus:ring-accent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">City</label>
              <Input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                className="neomorph-light-sm focus:ring-accent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">State/Region</label>
              <Input
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="State"
                className="neomorph-light-sm focus:ring-accent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Postal Code</label>
              <Input
                name="postal_code"
                value={formData.postal_code}
                onChange={handleInputChange}
                placeholder="Postal Code"
                className="neomorph-light-sm focus:ring-accent"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Selection Section */}
      <Card className="mb-6 interactive-shadow border-border/50">
        <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5">
          <CardTitle className="text-primary">Select Courses</CardTitle>
          <CardDescription>Choose the courses you want to enroll in</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AVAILABLE_COURSES.map(course => (
              <div key={course} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <Checkbox
                  id={course}
                  checked={formData.courses.includes(course)}
                  onCheckedChange={() => handleCourseToggle(course)}
                  className="cursor-pointer"
                />
                <label
                  htmlFor={course}
                  className="text-sm font-medium cursor-pointer text-foreground hover:text-accent transition-colors"
                >
                  {course}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center mb-8">
        <Button
          type="submit"
          disabled={loading}
          className="px-8 py-6 bg-primary hover:bg-primary/90 text-white font-semibold text-lg rounded-lg interactive-shadow"
        >
          {loading ? 'Submitting...' : 'Submit Registration'}
        </Button>
      </div>
    </form>
  )
}
