'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useRegistrations } from '@/hooks/use-registrations'
import { DownloadIcon } from '@radix-ui/react-icons'

export function ExcelPreview() {
  const { toast } = useToast()
  const { registrations, isLoading } = useRegistrations()
  const [editingCell, setEditingCell] = useState<{ id: number; field: string } | null>(null)
  const [editValue, setEditValue] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date')

  const sortedData = useMemo(() => {
    const data = registrations.map(reg => ({
      'First Name': reg.first_name,
      'Last Name': reg.last_name,
      'Email': reg.email,
      'Phone': reg.phone || '',
      'Date of Birth': reg.date_of_birth || '',
      'Gender': reg.gender || '',
      'Address': reg.address || '',
      'City': reg.city || '',
      'State': reg.state || '',
      'Postal Code': reg.postal_code || '',
      'Enrolled Courses': (reg.courses || []).join('; '),
      'Registration Date': new Date(reg.created_at).toLocaleDateString(),
      _id: reg.id,
    }))

    if (sortBy === 'name') {
      return data.sort((a, b) => `${a['First Name']} ${a['Last Name']}`.localeCompare(`${b['First Name']} ${b['Last Name']}`))
    }
    return data
  }, [registrations, sortBy])

  const columns = [
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Date of Birth',
    'Gender',
    'Address',
    'City',
    'State',
    'Postal Code',
    'Enrolled Courses',
    'Registration Date',
  ]

  const downloadAsExcel = async () => {
    try {
      const XLSX = await import('xlsx')

      const exportData = sortedData.map(({ _id, ...row }) => row)
      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Registrations')

      ws['!cols'] = columns.map(() => ({ wch: 15 }))

      XLSX.writeFile(wb, `preview-${new Date().toISOString().split('T')[0]}.xlsx`)

      toast({
        title: 'Success',
        description: 'Excel file downloaded successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download Excel file',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading preview...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls Card */}
      <Card className="interactive-shadow border-border/50">
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
                className="px-3 py-2 bg-background border border-border rounded-lg neomorph-light-sm focus:ring-accent focus:ring-2 focus:outline-none text-foreground"
              >
                <option value="date">Registration Date (Newest First)</option>
                <option value="name">Student Name (A-Z)</option>
              </select>
            </div>
            <Button
              onClick={downloadAsExcel}
              disabled={registrations.length === 0}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold interactive-shadow"
            >
              <DownloadIcon className="w-4 h-4" />
              Download as Excel
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Preview of {sortedData.length} registration{sortedData.length !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      {/* Data Preview Table */}
      <Card className="interactive-shadow border-border/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle>Excel Data Preview</CardTitle>
          <CardDescription>View data before exporting</CardDescription>
        </CardHeader>
        <CardContent className="pt-0 overflow-x-auto">
          {sortedData.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No data to preview
            </div>
          ) : (
            <table className="w-full text-xs md:text-sm border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border sticky top-0">
                  {columns.map(col => (
                    <th
                      key={col}
                      className="px-3 py-3 text-left font-semibold text-foreground whitespace-nowrap border-r border-border/30 last:border-r-0"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, idx) => (
                  <tr key={row._id} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                    {columns.map(col => (
                      <td
                        key={`${row._id}-${col}`}
                        className="px-3 py-2 border-r border-border/30 last:border-r-0 text-foreground/80 hover:text-foreground transition-colors truncate max-w-xs"
                        title={(row as any)[col]}
                      >
                        {(row as any)[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card className="interactive-shadow border-border/50">
        <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5">
          <CardTitle>Export Statistics</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Total Records</p>
              <p className="text-2xl font-bold text-primary">{registrations.length}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Columns</p>
              <p className="text-2xl font-bold text-accent">{columns.length}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
              <p className="text-xs font-semibold text-muted-foreground mb-1">File Format</p>
              <p className="text-2xl font-bold text-primary">XLSX</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Est. Size</p>
              <p className="text-2xl font-bold text-accent">~{Math.ceil(registrations.length * 2)} KB</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
