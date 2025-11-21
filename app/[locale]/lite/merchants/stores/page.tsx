"use client"

import { useState, useEffect, Suspense } from 'react'
import { Store, Star, MapPin, Search, Award, ArrowLeft, TrendingUp } from 'lucide-react'
import { useLocalePath } from '@/lib/i18n/useLocalePath'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { api, type Merchant } from '@/lib/api'
import { useSearchParams } from 'next/navigation'

export const dynamic = 'force-dynamic'

function MerchantStoresListContent() {
  const localePath = useLocalePath()
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get('category')
  
  const [stores, setStores] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFilter || 'all')

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    const isDev = process.env.NODE_ENV === 'development'
    try {
      const response = await api.merchant.list()
      setStores(response.merchants)
    } catch (error) {
      if (isDev) console.error('Failed to fetch stores:', error)
      setStores([])
    } finally {
      setLoading(false)
    }
  }

  const filteredStores = stores.filter(store =>
    (selectedCategory === 'all' || store.category === selectedCategory) &&
    ((store.business_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (store.category?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (store.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()))
  )

  // Get unique categories from stores
  const categories = ['all', ...Array.from(new Set(stores.map(s => s.category).filter(Boolean)))]

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
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-6">
            <Store className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {t('lite.merchants.stores.title')}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400">
            {t('lite.merchants.stores.subtitle') || 'Browse verified stores with fair trade ratings'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder={t('lite.merchants.stores.searchPlaceholder') || "Search stores by name, category, or location..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-2xl border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('lite.merchants.stores.filterByCategory') || 'Filter by Category'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat || 'all')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-8 sm:p-12 text-center shadow-xl">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('lite.merchants.stores.noStores') || 'No Stores Found'}
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('lite.merchants.stores.tryDifferent') || 'Try a different search or check back soon'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                {/* Store Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Store className="w-7 h-7 text-blue-500" />
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        {store.business_name || store.username}
                      </h2>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-base font-semibold">
                        {store.category || 'General'}
                      </span>
                      {store.verification_status === 'verified' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-semibold">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    {store.business_address && (
                      <p className="text-base text-gray-600 dark:text-gray-400 mb-2">
                        📍 {store.business_address}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-6">
                  {store.description || 'No description available'}
                </p>

                {/* TFI Score */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-6 h-6 text-amber-500" />
                      <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        {t('lite.merchants.stores.tfiLabel') || 'Trade Fairness Index (TFI★)'}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                        {(store.tfi || 0).toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {getTFIRating(store.tfi || 0)}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div
                      className={`bg-gradient-to-r ${getTFIColor(store.tfi || 0)} h-4 rounded-full transition-all`}
                      style={{ width: `${Math.min((store.tfi || 0) * 10, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-lg text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">{(store.average_rating || 0).toFixed(1)}</span> / 5.0
                    </span>
                  </div>
                  <span className="text-lg text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">{store.total_ratings || 0}</span> {t('lite.merchants.reviews') || 'reviews'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => alert(`View ${store.business_name || store.username} details - Coming soon!`)}
                    className="w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all shadow-xl"
                  >
                    👁️ {t('lite.merchants.viewStore') || 'View Store Details'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => window.location.href = localePath('lite/merchants') as string}
            className="w-full py-6 px-8 rounded-2xl bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-6 h-6" />
            {t('lite.merchants.stores.backToCategories') || 'Back to Categories'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MerchantStoresList() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>}>
      <MerchantStoresListContent />
    </Suspense>
  )
}
