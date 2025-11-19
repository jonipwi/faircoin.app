"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import languages from './languages.json'
import { getLocaleFromPath, isValidLocale, defaultLocale } from './locales'

// Import all translations
import en from './translations/en.json'
import zh from './translations/zh.json'
import zhTW from './translations/zh-TW.json'
import es from './translations/es.json'
import fr from './translations/fr.json'
import de from './translations/de.json'
import hi from './translations/hi.json'
import ru from './translations/ru.json'
import id from './translations/id.json'
import ko from './translations/ko.json'
import ja from './translations/ja.json'
import he from './translations/he.json'
import ar from './translations/ar.json'
import nl from './translations/nl.json'
import pt from './translations/pt.json'

const translations: Record<string, any> = {
  en, zh, 'zh-TW': zhTW, es, fr, de, hi, ru, id, ko, ja, he, ar, nl, pt
}

type LanguageCode = keyof typeof languages
type Direction = 'ltr' | 'rtl'

interface LanguageContextType {
  locale: LanguageCode
  setLocale: (locale: LanguageCode) => void
  t: (key: string, params?: Record<string, string>) => string
  dir: Direction
  languages: typeof languages
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [locale, setLocaleState] = useState<LanguageCode>(defaultLocale)
  const [dir, setDir] = useState<Direction>('ltr')

  useEffect(() => {
    // First priority: locale from URL path
    const pathLocale = getLocaleFromPath(pathname)
    if (pathLocale) {
      setLocaleState(pathLocale)
      setDir(languages[pathLocale].dir as Direction)
      localStorage.setItem('faircoin-locale', pathLocale)
      document.documentElement.setAttribute('dir', languages[pathLocale].dir)
      document.documentElement.setAttribute('lang', pathLocale)
      return
    }

    // Second priority: saved language from localStorage
    const saved = localStorage.getItem('faircoin-locale') as LanguageCode
    if (saved && translations[saved]) {
      setLocaleState(saved)
      setDir(languages[saved].dir as Direction)
    } else {
      // Third priority: browser language
      const browserLang = navigator.language.split('-')[0]
      if (translations[browserLang]) {
        setLocaleState(browserLang as LanguageCode)
        setDir(languages[browserLang as LanguageCode].dir as Direction)
      }
    }
  }, [pathname])

  const setLocale = (newLocale: LanguageCode) => {
    setLocaleState(newLocale)
    setDir(languages[newLocale].dir as Direction)
    localStorage.setItem('faircoin-locale', newLocale)
    document.documentElement.setAttribute('dir', languages[newLocale].dir)
    document.documentElement.setAttribute('lang', newLocale)
    
    // Update URL to match locale if not already there
    const currentPathLocale = getLocaleFromPath(pathname)
    if (currentPathLocale !== newLocale) {
      const segments = pathname.split('/').filter(Boolean)
      if (currentPathLocale) {
        // Replace existing locale in path
        segments[0] = newLocale
      } else {
        // Add locale to beginning of path
        segments.unshift(newLocale)
      }
      router.push(('/' + segments.join('/')) as any)
    }
  }

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.')
    let value: any = translations[locale]

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        // Fallback to English if key not found
        value = translations.en
        for (const fallbackKey of keys) {
          value = value?.[fallbackKey]
        }
        break
      }
    }

    if (typeof value !== 'string') {
      return key // Return key if translation not found
    }

    // Replace parameters
    if (params) {
      Object.keys(params).forEach((param) => {
        value = value.replace(`{{${param}}}`, params[param])
      })
    }

    return value
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir, languages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
