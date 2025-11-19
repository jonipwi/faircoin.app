import { useParams } from 'next/navigation'

export function useLocalePath() {
  const params = useParams()
  const locale = params?.locale || 'en'
  
  return (path: string) => {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return `/${locale}/${cleanPath}`
  }
}
