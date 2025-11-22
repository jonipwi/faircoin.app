"use client"

import { useState, useEffect } from 'react'
import { Store, Search, X } from 'lucide-react'
import { useLocalePath } from '@/lib/i18n/useLocalePath'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { api, type MerchantCategory } from '@/lib/api'

export const dynamic = 'force-dynamic'

interface Toast {
  message: string
  show: boolean
}

export default function LiteMerchants() {
  const localePath = useLocalePath()
  const { t } = useLanguage()
  const [categories, setCategories] = useState<MerchantCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState<Toast>({ message: '', show: false })

  const showToast = (message: string) => {
    setToast({ message, show: true })
    setTimeout(() => {
      setToast({ message: '', show: false })
    }, 2000)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await api.merchant.categories()
      setCategories(response.categories)
    } catch (error) {
      const isDev = process.env.NODE_ENV === 'development'
      if (isDev) console.error('Failed to fetch merchant categories:', error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter(category =>
    category.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.folder.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
            <Store className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {t('lite.merchants.title') || 'Merchant Groups'} 🏪
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-3">
            {t('lite.merchants.subtitle') || 'Explore merchant categories in your community'}
          </p>
          <p className="text-base sm:text-lg text-gray-500 dark:text-gray-500 italic">
            💡 {t('lite.merchants.groupHint') || 'Each group represents a category of local merchants'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder={t('lite.merchants.searchPlaceholder') || "Search merchants..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-2xl border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-8 sm:p-12 text-center shadow-xl">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('lite.merchants.noMerchants') || 'No Merchant Categories Found'}
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('lite.merchants.tryDifferent') || 'Try a different search or check back soon'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCategories.map((category) => (
              <div
                key={category.folder}
                className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                {/* Category Header */}
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-5xl sm:text-6xl">{category.icon}</span>
                  <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {category.display_name}
                    </h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                      📁 {category.folder}
                    </p>
                  </div>
                </div>

                {/* Examples */}
                <div className="mb-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <span className="text-xl">📋</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        {t('lite.merchants.examplesInGroup') || 'Examples in this group:'}
                      </p>
                      <p className="text-base text-gray-700 dark:text-gray-300">
                        {category.examples}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-5">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      {t('lite.merchants.avgCBI') || 'Avg CBI★'}
                    </div>
                    <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                      {category.avg_cbi}
                    </div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {category.rating}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-5">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      {t('lite.merchants.merchants') || 'Merchants'}
                    </div>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {category.merchant_count}
                    </div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {t('lite.merchants.inThisGroup') || 'in this group'}
                    </div>
                  </div>
                </div>

                {/* CBI Range */}
                <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {t('lite.merchants.typicalCBI') || 'Typical CBI★'}: <span className="text-base font-bold text-green-600 dark:text-green-400">{category.cbi_range}</span>
                  </p>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => window.location.href = `${localePath('lite/merchants/stores')}?folder=${encodeURIComponent(category.folder)}` as string}
                  className="w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all shadow-xl"
                >
                  👁️ {t('lite.merchants.viewMerchantsIn') || 'View Merchants in'} {category.folder}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Join as Merchant CTA */}
        <div className="mt-12 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 p-8 sm:p-12 text-center shadow-2xl">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
            <Store className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            {t('lite.merchants.joinCommunity') || 'Want to Join Our Merchant Community?'} 🏪
          </h2>
          <p className="text-xl sm:text-2xl text-white/90 mb-8">
            {t('lite.merchants.buildTrust') || 'Build trust with your customers through fair business practices'}
          </p>
          <button
            onClick={() => window.location.href = localePath('lite/merchants/apply') as string}
            className="inline-block py-6 px-12 rounded-2xl bg-white text-green-700 text-2xl font-bold hover:bg-gray-100 transition-all shadow-xl hover:scale-105"
          >
            ✨ {t('lite.merchants.applyMerchant') || 'Become a Merchant'}
          </button>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => window.location.href = localePath('lite') as string}
            className="block w-full py-6 px-8 rounded-2xl bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all shadow-xl text-center"
          >
            {t('common.backToHome') || 'Back to Home'}
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px]">
            <span className="text-lg font-semibold flex-1">{toast.message}</span>
            <button
              onClick={() => setToast({ message: '', show: false })}
              className="text-white dark:text-gray-900 hover:opacity-70 transition-opacity"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
