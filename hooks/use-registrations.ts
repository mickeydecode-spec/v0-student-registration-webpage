import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

const fetcher = async () => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export function useRegistrations() {
  const { data, error, isLoading, mutate } = useSWR('registrations', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  })

  return {
    registrations: data || [],
    isLoading,
    error,
    mutate,
  }
}
