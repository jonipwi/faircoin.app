import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import languages from '@/lib/i18n/languages.json'

const locales = Object.keys(languages)

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

interface LocaleLayoutProps {
  children: ReactNode
  params: { locale: string }
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = params

  // Validate locale
  if (!locales.includes(locale)) {
    redirect('/en')
  }

  // Set html attributes for locale
  const langConfig = languages[locale as keyof typeof languages]
  
  return (
    <html lang={locale} dir={langConfig?.dir || 'ltr'} suppressHydrationWarning>
      {children}
    </html>
  )
}
