'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useRegistrations } from '@/hooks/use-registrations'
import { createClient } from '@/lib/supabase/client'
import { Checkbox } from '@/components/ui/checkbox'
import { DownloadIcon, EnvelopeOpenIcon } from '@radix-ui/react-icons'

export function ExportManager() {
  const { toast } = useToast()
  const { registrations, isLoading } = useRegistrations()
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [exportLoading, setExportLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')
  const [loadingEmail, setLoadingEmail] = useState(true)

  const supabase = createClient()

  // Load admin email
  React.useEffect(() => {
    const loadAdminEmail = async () => {
      try {
        const { data } = await supabase
          .from('admin_settings')
          .select('admin_email')
          .eq('id', 1)
          .single()

        if (data) {
          setAdminEmail(data.admin_email)
        }
      } catch (error) {
        console.error('Failed to load admin email')
      } finally {
        setLoadingEmail(false)
      }
    }

    loadAdminEmail()
  }, [supabase])

  const isAllSelected = selectedIds.size === registrations.length && registrations.length > 0
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < registrations.length

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(registrations.map(reg => reg.id)))
    }
  }

  const toggleSelectId = (id: number) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const getExportData = () => {
    const dataToExport = selectedIds.size > 0
      ? registrations.filter(reg => selectedIds.has(reg.id))
      : registrations

    return dataToExport.map(reg => ({
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
    }))
  }

  const downloadExcel = async () => {
    try {
      setExportLoading(true)
      const XLSX = await import('xlsx')

      const data = getExportData()
      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Registrations')

      // Set column widths
      ws['!cols'] = [
        { wch: 15 },
        { wch: 15 },
        { wch: 25 },
        { wch: 15 },
        { wch: 15 },
        { wch: 10 },
        { wch: 25 },
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
        { wch: 35 },
        { wch: 15 },
      ]

      XLSX.writeFile(wb, `dream-more-registrations-${new Date().toISOString().split('T')[0]}.xlsx`)

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
    } finally {
      setExportLoading(false)
    }
  }

  const sendViaEmail = async () => {
    if (!adminEmail) {
      toast({
        title: 'Error',
        description: 'Admin email is not configured. Please set it in settings.',
        variant: 'destructive',
      })
      return
    }

    try {
      setEmailLoading(true)
      const XLSX = await import('xlsx')

      const data = getExportData()
      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Registrations')
      ws['!cols'] = [
        { wch: 15 },
        { wch: 15 },
        { wch: 25 },
        { wch: 15 },
        { wch: 15 },
        { wch: 10 },
        { wch: 25 },
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
        { wch: 35 },
        { wch: 15 },
      ]

      // Generate Excel as buffer
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })

      // Send to API route
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: adminEmail,
          fileName: `dream-more-registrations-${new Date().toISOString().split('T')[0]}.xlsx`,
          fileContent: Array.from(wbout),
          recordCount: data.length,
        }),
      })

      if (!response.ok) throw new Error('Failed to send email')

      toast({
        title: 'Success',
        description: `Email sent to ${adminEmail} with ${data.length} registrations`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send email',
        variant: 'destructive',
      })
    } finally {
      setEmailLoading(false)
    }
  }

  if (isLoading || loadingEmail) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Export Options Card */}
      <Card className="interactive-shadow border-border/50">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle>Export Options</CardTitle>
          <CardDescription>Download or email student registration data</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
            <p className="text-sm font-medium text-foreground mb-2">Admin Email: {adminEmail}</p>
            <p className="text-xs text-muted-foreground">
              All exports will be sent to this email address. Configure it in Settings.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={downloadExcel}
              disabled={registrations.length === 0 || exportLoading}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold interactive-shadow"
            >
              <DownloadIcon className="w-4 h-4" />
              {exportLoading ? 'Preparing...' : 'Download Excel'}
            </Button>
            <Button
              onClick={sendViaEmail}
              disabled={registrations.length === 0 || emailLoading}
              className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary font-semibold interactive-shadow"
            >
              <EnvelopeOpenIcon className="w-4 h-4" />
              {emailLoading ? 'Sending...' : 'Email to Admin'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Record Selection Card */}
      <Card className="interactive-shadow border-border/50">
        <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5">
          <CardTitle>Select Records</CardTitle>
          <CardDescription>
            {selectedIds.size > 0
              ? `${selectedIds.size} record${selectedIds.size !== 1 ? 's' : ''} selected`
              : 'Select which records to export (leave empty to export all)'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {registrations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No registrations available</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors border-b border-border">
                <Checkbox
                  id="select-all"
                  checked={isAllSelected}
                  onCheckedChange={toggleSelectAll}
                  className="cursor-pointer"
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-semibold cursor-pointer text-foreground flex-1"
                >
                  {isAllSelected ? 'Deselect All' : 'Select All'} ({registrations.length} registrations)
                </label>
              </div>

              {registrations.map(reg => (
                <div
                  key={reg.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <Checkbox
                    id={`reg-${reg.id}`}
                    checked={selectedIds.has(reg.id)}
                    onCheckedChange={() => toggleSelectId(reg.id)}
                    className="cursor-pointer"
                  />
                  <label
                    htmlFor={`reg-${reg.id}`}
                    className="text-sm cursor-pointer text-foreground flex-1"
                  >
                    {reg.first_name} {reg.last_name} ({reg.email})
                  </label>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
