"use client"

import { Store, Star, Award, Search, TrendingUp } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function MerchantsSection() {
  const { t } = useLanguage()
  const merchants = [
    {
      name: t('merchants.merchant1Name'),
      category: t('merchants.merchant1Category'),
      tfi: 95,
      rating: 4.9,
      reviews: 234,
      image: '🌿',
    },
    {
      name: t('merchants.merchant2Name'),
      category: t('merchants.merchant2Category'),
      tfi: 92,
      rating: 4.8,
      reviews: 189,
      image: '☕',
    },
    {
      name: t('merchants.merchant3Name'),
      category: t('merchants.merchant3Category'),
      tfi: 90,
      rating: 4.7,
      reviews: 156,
      image: '🥖',
    },
    {
      name: t('merchants.merchant4Name'),
      category: t('merchants.merchant4Category'),
      tfi: 88,
      rating: 4.6,
      reviews: 98,
      image: '🔨',
    },
  ]

  return (
    <section id="merchants" className="section">
      <div className="container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
            <Store className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-white">{t('merchants.title')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            {t('merchants.subtitle')}
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            {t('merchants.description')}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="card p-4 flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('merchants.searchPlaceholder')}
                className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
              />
              <button className="btn btn-primary btn-sm">{t('merchants.search')}</button>
            </div>
          </div>
        </div>

        {/* Merchants Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {merchants.map((merchant) => (
            <div key={merchant.name} className="card card-hover p-6 group">
              <div className="text-center mb-4">
                <div className="w-20 h-20 mx-auto mb-4 text-6xl">
                  {merchant.image}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {merchant.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {merchant.category}
                </p>
              </div>

              {/* TFI Score */}
              <div className="mb-4 p-3 rounded-lg bg-primary-50 dark:bg-primary-950/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('merchants.tfiScore')}
                  </span>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-primary-500" />
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      {merchant.tfi}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {merchant.rating}
                  </span>
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  {merchant.reviews} {t('merchants.reviews')}
                </span>
              </div>

              {/* Action Button */}
              <button className="btn btn-outline btn-sm w-full mt-4">
                {t('merchants.viewStore')}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="btn btn-primary btn-lg">
            <Store className="w-5 h-5" />
            {t('merchants.becomeButton')}
          </button>
        </div>
      </div>
    </section>
  )
}
