"use client"

import { useState, useEffect } from 'react'
import { Store, Star, MapPin, Search, Award, X } from 'lucide-react'
import { useLocalePath } from '@/lib/i18n/useLocalePath'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { api, type Merchant } from '@/lib/api'

export const dynamic = 'force-dynamic'

interface MerchantGroup {
  category: string
  count: number
  avgRating: number
  avgTFI: number
  merchants: Merchant[]
}

interface Toast {
  message: string
  show: boolean
}

export default function LiteMerchants() {
  const localePath = useLocalePath()
  const { t } = useLanguage()
  const [merchantGroups, setMerchantGroups] = useState<MerchantGroup[]>([])
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
    fetchMerchants()
  }, [])

  const fetchMerchants = async () => {
    const isDev = process.env.NODE_ENV === 'development'
    try {
      const response = await api.merchant.list()
      const merchants = response.merchants
      
      // Group merchants by category
      const grouped = merchants.reduce((acc, merchant) => {
        const category = merchant.category || 'Other'
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(merchant)
        return acc
      }, {} as Record<string, Merchant[]>)
      
      // Convert to array with stats
      const groups: MerchantGroup[] = Object.entries(grouped).map(([category, merch]) => ({
        category,
        count: merch.length,
        avgRating: merch.reduce((sum, m) => sum + (m.average_rating || 0), 0) / merch.length,
        avgTFI: merch.reduce((sum, m) => sum + (m.tfi || 0), 0) / merch.length,
        merchants: merch
      }))
      
      setMerchantGroups(groups)
    } catch (error) {
      const isDev = process.env.NODE_ENV === 'development'
      if (isDev) console.error('Failed to fetch merchants:', error)
      setMerchantGroups([])
    } finally {
      setLoading(false)
    }
  }

  const filteredGroups = merchantGroups.filter(group =>
    group.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Groceries': '🏪',
      'Food': '🍲',
      'Services': '🚖',
      'Pet': '🐶',
      'Community': '📚',
      'Pharmacy': '💊',
      'Property': '🏠',
      'Household': '👕'
    }
    for (const [key, icon] of Object.entries(icons)) {
      if (category.includes(key)) return icon
    }
    return '🏪'
  }

  const getTFIColor = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-500'
    if (score >= 80) return 'from-blue-500 to-cyan-500'
    if (score >= 70) return 'from-yellow-500 to-amber-500'
    return 'from-orange-500 to-red-500'
  }

  const getTFIRating = (score: number) => {
    if (score >= 90) return t('lite.merchants.ratings.excellent') || 'Excellent'
    if (score >= 80) return t('lite.merchants.ratings.veryGood') || 'Very Good'
    if (score >= 70) return t('lite.merchants.ratings.good') || 'Good'
    return t('lite.merchants.ratings.fair') || 'Fair'
  }

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
        ) : filteredGroups.length === 0 ? (
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
            {filteredGroups.map((group) => (
              <div
                key={group.category}
                className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                {/* Category Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl sm:text-5xl">{getCategoryIcon(group.category)}</span>
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                          {group.category}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {group.count} {group.count === 1 ? 'merchant' : 'merchants'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Group Statistics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Avg TFI★
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {group.avgTFI.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {getTFIRating(group.avgTFI)}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Avg Rating
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {group.avgRating.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      out of 5.0
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => window.location.href = `${localePath('lite/merchants/stores')}?category=${encodeURIComponent(group.category)}` as string}
                    className="w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all shadow-xl"
                  >
                    👁️ View {group.count} {group.count === 1 ? 'Merchant' : 'Merchants'}
                  </button>
                </div>
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
