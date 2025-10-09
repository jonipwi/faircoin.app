import useSWR from 'swr'
import { api } from '@/lib/api'

export function useStats() {
  const { data, error, isLoading } = useSWR('stats', api.stats)
  return { stats: data, error, isLoading }
}
