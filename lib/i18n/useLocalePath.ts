import { useLanguage } from './LanguageContext'

export function useLocalePath() {
  const { locale } = useLanguage()
  
  return (path: string) => {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return `/${locale}/${cleanPath}`
  }
}
