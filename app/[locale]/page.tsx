"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface LocalePageProps {
  params: { locale: string }
}

export default function LocalePage({ params }: LocalePageProps) {
  const router = useRouter()
  const { setLocale } = useLanguage()
  
  useEffect(() => {
    // Set the locale in context
    setLocale(params.locale as any)
    
    // Redirect to lite mode with locale
    router.push(`/${params.locale}/lite` as any)
  }, [params.locale, router, setLocale])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-accent-500">
      <div className="text-center text-white">
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
          <span className="text-4xl font-bold">FC</span>
        </div>
        <p className="text-xl font-semibold">Loading FairCoin...</p>
      </div>
    </div>
  )
}
