"use client"

import { useState, useEffect } from 'react'
import { Store, Star, Award, MapPin, Phone, Clock, ArrowLeft, Search, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface Merchant {
  id: number
  name: string
  category: string
  tfiScore: number
  rating: number
  reviews: number
  location: string
  address: string
  phone: string
  hours: string
  description: string
  owner: string
  isOwner?: boolean
  image: string
}

export default function CategoryMerchants({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const { t } = useLanguage()
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Convert slug back to readable category name
  const categoryName = params.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  // Get category icon based on name
  const getCategoryIcon = () => {
    const name = categoryName.toLowerCase()
    if (name.includes('groceries') || name.includes('essentials')) return '🏪'
    if (name.includes('food') || name.includes('beverages')) return '🍲'
    if (name.includes('household') || name.includes('services')) return '👕'
    if (name.includes('pet')) return '🐶'
    if (name.includes('pharmacy') || name.includes('health')) return '💊'
    if (name.includes('property') || name.includes('housing')) return '🏠'
    if (name.includes('community') || name.includes('education')) return '📚'
    return '🚖'
  }

  useEffect(() => {
    fetchMerchants()
  }, [params.slug])

  const fetchMerchants = async () => {
    try {
      // Mock data - replace with actual API call
      setMerchants([
        {
          id: 1,
          name: "Green Valley Market",
          category: categoryName,
          tfiScore: 95,
          rating: 4.9,
          reviews: 234,
          location: "Downtown",
          address: "123 Main Street",
          phone: "+1 234 567 8900",
          hours: "Mon-Sat: 8AM-8PM",
          description: "Fresh organic produce and local products. We support local farmers and offer fair prices to our community.",
          owner: "Maria Santos",
          isOwner: false,
          image: getCategoryIcon()
        },
        {
          id: 2,
          name: "Fresh Foods Co-op",
          category: categoryName,
          tfiScore: 91,
          rating: 4.8,
          reviews: 189,
          location: "Midtown",
          address: "456 Oak Avenue",
          phone: "+1 234 567 8901",
          hours: "Daily: 7AM-9PM",
          description: "Community-owned cooperative providing fresh groceries at fair prices with transparent sourcing.",
          owner: "Community Board",
          isOwner: false,
          image: getCategoryIcon()
        },
        {
          id: 3,
          name: "Community Corner Store",
          category: categoryName,
          tfiScore: 88,
          rating: 4.7,
          reviews: 156,
          location: "Eastside",
          address: "789 Elm Street",
          phone: "+1 234 567 8902",
          hours: "Mon-Sun: 9AM-7PM",
          description: "Your neighborhood essential store with friendly service and fair trade practices.",
          owner: "John Smith",
          isOwner: false,
          image: getCategoryIcon()
        }
      ])
    } catch (error) {
      console.error('Failed to fetch merchants:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMerchants = merchants.filter(merchant =>
    merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    merchant.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    merchant.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getTFIColor = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-500'
    if (score >= 80) return 'from-blue-500 to-cyan-500'
    if (score >= 70) return 'from-yellow-500 to-amber-500'
    return 'from-orange-500 to-red-500'
  }

  const getTFIRating = (score: number) => {
    if (score >= 90) return t('merchants.ratings.excellent') || 'Excellent'
    if (score >= 80) return t('merchants.ratings.veryGood') || 'Very Good'
    if (score >= 70) return t('merchants.ratings.good') || 'Good'
    return t('merchants.ratings.fair') || 'Fair'
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-6">
            <Store className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {categoryName} {t('merchants.merchants') || 'Merchants'}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400">
            {t('merchants.categoryDescription') || 'Browse verified merchants with fair trade ratings'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder={t('merchants.searchPlaceholder') || "Search merchants by name, category, or location..."}
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
        ) : filteredMerchants.length === 0 ? (
          <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-8 sm:p-12 text-center shadow-xl">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('merchants.noMerchants') || 'No Merchants Found'}
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('merchants.tryDifferent') || 'Try a different search or check back soon'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredMerchants.map((merchant) => (
              <div
                key={merchant.id}
                className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                {/* Merchant Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Store className="w-6 h-6 text-blue-500" />
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        {merchant.name}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold">
                        {merchant.image} {merchant.category}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm">
                        <MapPin className="w-4 h-4" />
                        {merchant.location}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      📍 {merchant.address}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
                  {merchant.description}
                </p>

                {/* TFI Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-500" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        TFI★ Score
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                        {merchant.tfiScore}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {getTFIRating(merchant.tfiScore)}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className={`bg-gradient-to-r ${getTFIColor(merchant.tfiScore)} h-3 rounded-full transition-all`}
                      style={{ width: `${merchant.tfiScore}%` }}
                    />
                  </div>
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-base text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">{merchant.rating}</span> / 5.0
                    </span>
                  </div>
                  <span className="text-base text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">{merchant.reviews}</span> {t('merchants.reviews') || 'reviews'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  {merchant.isOwner && (
                    <button
                      onClick={() => window.location.href = '/merchants/dashboard'}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <TrendingUp className="w-5 h-5" />
                      {t('merchants.viewDashboard') || 'My Merchant Dashboard'}
                    </button>
                  )}
                  <button
                    onClick={() => alert(`View ${merchant.name} details - Coming soon!`)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-base font-bold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
                  >
                    👁️ {t('merchants.viewDetails') || 'View Details'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        {!loading && filteredMerchants.length > 0 && (
          <div className="mt-12 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 p-8 sm:p-12 text-center shadow-2xl">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
              <Store className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              {t('merchants.joinCommunity') || 'Want to Join Our Merchant Community?'} 🏪
            </h2>
            <p className="text-xl sm:text-2xl text-white/90 mb-8">
              {t('merchants.buildTrust') || 'Build trust with your customers through fair business practices'}
            </p>
            <button
              onClick={() => window.location.href = `/merchants/apply?category=${encodeURIComponent(categoryName)}`}
              className="inline-block py-6 px-12 rounded-2xl bg-white text-green-700 text-2xl font-bold hover:bg-gray-100 transition-all shadow-xl hover:scale-105"
            >
              ✨ {t('merchants.applyMerchant') || 'Become a Merchant'}
            </button>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => router.back()}
            className="w-full py-6 px-8 rounded-2xl bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all shadow-xl text-center flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-6 h-6" />
            {t('merchants.backToCategories') || 'Back to Categories'}
          </button>
        </div>
      </div>
    </div>
  )
}
