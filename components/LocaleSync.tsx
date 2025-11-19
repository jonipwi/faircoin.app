"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { getLocaleFromPath } from '@/lib/i18n/locales'

export function LocaleSync() {
  const pathname = usePathname()
  const { locale, setLocale } = useLanguage()
  
  useEffect(() => {
    const pathLocale = getLocaleFromPath(pathname)
    if (pathLocale && pathLocale !== locale) {
      setLocale(pathLocale as any)
    }
  }, [pathname, locale, setLocale])
  
  return null
}
