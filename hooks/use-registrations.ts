import useSWR from 'swr'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch registrations')
  }
  return res.json()
}

export function useRegistrations() {
  const { data, error, isLoading, mutate } = useSWR('/api/registrations', fetcher, {
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
