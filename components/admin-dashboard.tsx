'use client'

import { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useRegistrations } from '@/hooks/use-registrations'
import { createClient } from '@/lib/supabase/client'
import { Pencil2Icon, TrashIcon, ChevronDownIcon } from '@radix-ui/react-icons'

interface EditingCell {
  id: number | null
  field: string | null
}

export function AdminDashboard() {
  const { toast } = useToast()
  const { registrations, isLoading, mutate } = useRegistrations()
  const [editingCell, setEditingCell] = useState<EditingCell>({ id: null, field: null })
  const [editValues, setEditValues] = useState<Record<string, any>>({})
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCourse, setFilterCourse] = useState('')

  const supabase = createClient()

  const filteredRegistrations = useMemo(() => {
    return registrations.filter(reg => {
      const matchesSearch = 
        `${reg.first_name} ${reg.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCourse = !filterCourse || reg.courses?.includes(filterCourse)
      return matchesSearch && matchesCourse
    })
  }, [registrations, searchTerm, filterCourse])

  const allCourses = useMemo(() => {
    const courses = new Set<string>()
    registrations.forEach(reg => {
      reg.courses?.forEach((course: string) => courses.add(course))
    })
    return Array.from(courses).sort()
  }, [registrations])

  const startEditing = (id: number, field: string, value: any) => {
    setEditingCell({ id, field })
    setEditValues({ [field]: value })
  }

  const handleCellChange = (value: any) => {
    if (editingCell.field) {
      setEditValues(prev => ({
        ...prev,
        [editingCell.field]: value,
      }))
    }
  }

  const saveEdit = async (id: number) => {
    if (!editingCell.field) return

    try {
      const { error } = await supabase
        .from('students')
        .update(editValues)
        .eq('id', id)

      if (error) throw error

      mutate()
      toast({
        title: 'Success',
        description: 'Registration updated successfully',
      })
      setEditingCell({ id: null, field: null })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update registration',
        variant: 'destructive',
      })
    }
  }

  const deleteRegistration = async (id: number) => {
    if (!confirm('Are you sure you want to delete this registration?')) return

    try {
      const { error } = await supabase.from('students').delete().eq('id', id)

      if (error) throw error

      mutate()
      toast({
        title: 'Success',
        description: 'Registration deleted successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete registration',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading registrations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card className="interactive-shadow border-border/50">
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Search by Name or Email</label>
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="neomorph-light-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Filter by Course</label>
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg neomorph-light-sm focus:ring-accent focus:ring-2 focus:outline-none text-foreground"
              >
                <option value="">All Courses</option>
                {allCourses.map(course => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Showing {filteredRegistrations.length} of {registrations.length} registrations
          </p>
        </CardContent>
      </Card>

      {/* Registrations Table */}
      <Card className="interactive-shadow border-border/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle>Student Registrations</CardTitle>
          <CardDescription>View and manage all student registrations</CardDescription>
        </CardHeader>
        <CardContent className="pt-0 overflow-x-auto">
          {filteredRegistrations.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No registrations found
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Courses</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg) => (
                    <tr className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">
                        {editingCell.id === reg.id && editingCell.field === 'full_name' ? (
                          <Input
                            value={editValues.full_name || `${reg.first_name} ${reg.last_name}`}
                            onChange={(e) => handleCellChange(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(reg.id)
                              if (e.key === 'Escape') setEditingCell({ id: null, field: null })
                            }}
                            onBlur={() => saveEdit(reg.id)}
                            autoFocus
                            className="h-8 neomorph-light-sm"
                          />
                        ) : (
                          <span
                            onClick={() => startEditing(reg.id, 'full_name', `${reg.first_name} ${reg.last_name}`)}
                            className="cursor-pointer hover:text-accent transition-colors"
                          >
                            {reg.first_name} {reg.last_name}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {editingCell.id === reg.id && editingCell.field === 'email' ? (
                          <Input
                            value={editValues.email || reg.email}
                            onChange={(e) => handleCellChange(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(reg.id)
                              if (e.key === 'Escape') setEditingCell({ id: null, field: null })
                            }}
                            onBlur={() => saveEdit(reg.id)}
                            autoFocus
                            className="h-8 neomorph-light-sm"
                          />
                        ) : (
                          <span
                            onClick={() => startEditing(reg.id, 'email', reg.email)}
                            className="cursor-pointer hover:text-accent transition-colors"
                          >
                            {reg.email}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        <div className="flex items-center gap-2">
                          <span className="truncate">
                            {reg.courses?.length || 0} course{reg.courses?.length !== 1 ? 's' : ''}
                          </span>
                          <button
                            onClick={() => setExpandedRow(expandedRow === reg.id ? null : reg.id)}
                            className="p-1 hover:bg-muted rounded transition-colors"
                          >
                            <ChevronDownIcon
                              className={`w-4 h-4 transition-transform ${
                                expandedRow === reg.id ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditing(reg.id, 'edit', reg)}
                            className="h-8"
                          >
                            <Pencil2Icon className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteRegistration(reg.id)}
                            className="h-8 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {expandedRow === reg.id && (
                      <tr className="bg-muted/30 border-b border-border">
                        <td colSpan={4} className="px-4 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-semibold text-foreground">Phone: </span>
                              <span className="text-foreground/80">{reg.phone || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-foreground">Date of Birth: </span>
                              <span className="text-foreground/80">{reg.date_of_birth || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-foreground">Gender: </span>
                              <span className="text-foreground/80">{reg.gender || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-foreground">City: </span>
                              <span className="text-foreground/80">{reg.city || 'N/A'}</span>
                            </div>
                            <div className="md:col-span-2">
                              <span className="font-semibold text-foreground">Address: </span>
                              <span className="text-foreground/80">{reg.address || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-foreground">Enrolled Courses: </span>
                              <div className="mt-2">
                                {reg.courses?.map((course: string) => (
                                  <span
                                    key={course}
                                    className="inline-block bg-accent/20 text-accent px-2 py-1 rounded text-xs mr-2 mb-2"
                                  >
                                    {course}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
