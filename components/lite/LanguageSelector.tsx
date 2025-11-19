"use client"

import { useState } from 'react'
import { Globe, Check } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function LanguageSelector() {
  const { locale, setLocale, languages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const languageList = Object.entries(languages)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-base text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/50 hover:text-primary-700 dark:hover:text-primary-300 transition-all"
        aria-label="Select language"
      >
        <Globe className="w-5 h-5" />
        <span className="hidden sm:inline">{languages[locale].flag} {languages[locale].name}</span>
        <span className="sm:hidden">{languages[locale].flag}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
            <div className="p-2">
              <div className="px-4 py-3 border-b-2 border-gray-200 dark:border-gray-700">
                <p className="text-sm font-bold text-gray-900 dark:text-white">Select Language</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">选择语言 • 언어 선택 • 言語選択</p>
              </div>
              <div className="py-2 space-y-1">
                {languageList.map(([code, lang]) => (
                  <button
                    key={code}
                    onClick={() => {
                      setLocale(code as any)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      locale === code
                        ? 'bg-primary-500 text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="font-semibold text-base">{lang.name}</span>
                    </div>
                    {locale === code && <Check className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
