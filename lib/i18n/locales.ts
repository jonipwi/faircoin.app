import languages from './languages.json'

export const locales = Object.keys(languages) as Array<keyof typeof languages>
export const defaultLocale = 'en'

export type Locale = keyof typeof languages

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export function getLocaleFromPath(pathname: string): Locale | null {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && isValidLocale(segments[0])) {
    return segments[0] as Locale
  }
  return null
}
