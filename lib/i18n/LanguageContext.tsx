"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import languages from './languages.json'
import { getLocaleFromPath, defaultLocale } from './locales'

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

type LocaleChangeOptions = {
  emitChange?: boolean
}

interface LanguageContextType {
  locale: LanguageCode
  setLocale: (locale: LanguageCode, options?: LocaleChangeOptions) => void
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

  const applyLocaleMeta = useCallback((newLocale: LanguageCode) => {
    setLocaleState(newLocale)
    setDir(languages[newLocale].dir as Direction)
    localStorage.setItem('faircoin-locale', newLocale)
    document.documentElement.setAttribute('dir', languages[newLocale].dir)
    document.documentElement.setAttribute('lang', newLocale)
  }, [])

  const emitLocaleChange = useCallback((newLocale: LanguageCode) => {
    window.dispatchEvent(
      new CustomEvent('faircoin-locale-change', { detail: { locale: newLocale } })
    )
  }, [])

  const setLocale = useCallback(
    (newLocale: LanguageCode, options?: LocaleChangeOptions) => {
      applyLocaleMeta(newLocale)
      const shouldEmit = options?.emitChange ?? true
      if (shouldEmit) {
        emitLocaleChange(newLocale)
      }

      const currentPathLocale = getLocaleFromPath(pathname)
      if (currentPathLocale !== newLocale) {
        const segments = pathname.split('/').filter(Boolean)
        if (currentPathLocale) {
          segments[0] = newLocale
        } else {
          segments.unshift(newLocale)
        }
        router.push(('/' + segments.join('/')) as any)
      }
    },
    [applyLocaleMeta, emitLocaleChange, pathname, router]
  )

  useEffect(() => {
    const pathLocale = getLocaleFromPath(pathname)
    if (pathLocale) {
      applyLocaleMeta(pathLocale)
      return
    }

    const saved = localStorage.getItem('faircoin-locale') as LanguageCode
    if (saved && translations[saved]) {
      applyLocaleMeta(saved)
    } else {
      const browserLang = navigator.language.split('-')[0]
      if (translations[browserLang]) {
        applyLocaleMeta(browserLang as LanguageCode)
      }
    }
  }, [pathname, applyLocaleMeta])

  useEffect(() => {
    const handleLocaleOverride = (event: Event) => {
      const detail = (event as CustomEvent<{ locale?: LanguageCode }>).detail
      const overrideLocale = detail?.locale
      if (overrideLocale && translations[overrideLocale] && overrideLocale !== locale) {
        setLocale(overrideLocale, { emitChange: false })
      }
    }

    window.addEventListener('faircoin-locale-override', handleLocaleOverride)
    return () => {
      window.removeEventListener('faircoin-locale-override', handleLocaleOverride)
    }
  }, [locale, setLocale])

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.')
    let value: any = translations[locale]

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        value = translations.en
        for (const fallbackKey of keys) {
          value = value?.[fallbackKey]
        }
        break
      }
    }

    if (typeof value !== 'string') {
      return key
    }

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
