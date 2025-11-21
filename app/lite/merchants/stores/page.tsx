"use client"

import { useState, useEffect } from 'react'
import { Store, Star, MapPin, Search, Award, ArrowLeft, TrendingUp } from 'lucide-react'

interface MerchantStore {
  id: number
  name: string
  category: string
  tfiScore: number
  rating: number
  reviews: number
  location: string
  address: string
  description: string
  owner: string
  isOwner?: boolean
}

const API_BASE_URL = process.env.NEXT_PUBLIC_FAIRCOIN_API_URL || 'https://faircoin-api.bixio.xyz'

export default function MerchantStoresList() {
  const [stores, setStores] = useState<MerchantStore[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    try {
      // Mock data - replace with actual API call
      setStores([
        {
          id: 1,
          name: "Green Valley Market",
          category: "🏪 Groceries / Essentials",
          tfiScore: 95,
          rating: 4.9,
          reviews: 234,
          location: "Downtown",
          address: "123 Main Street",
          description: "Fresh organic produce and local products",
          owner: "Maria Santos",
          isOwner: false
        },
        {
          id: 2,
          name: "Sunrise Bakery",
          category: "🍲 Food & Beverages",
          tfiScore: 92,
          rating: 4.8,
          reviews: 189,
          location: "East Side",
          address: "456 Baker Ave",
          description: "Fresh bread and pastries daily",
          owner: "John Baker",
          isOwner: false
        },
        {
          id: 3,
          name: "Fair Trade Coffee House",
          category: "🍲 Food & Beverages",
          tfiScore: 94,
          rating: 4.9,
          reviews: 312,
          location: "City Center",
          address: "789 Coffee Lane",
          description: "Ethically sourced coffee and tea",
          owner: "Lisa Chen",
          isOwner: false
        },
        {
          id: 4,
          name: "Quick Laundry Service",
          category: "👕 Household Services",
          tfiScore: 88,
          rating: 4.7,
          reviews: 156,
          location: "West End",
          address: "321 Clean Street",
          description: "Professional laundry and tailoring services",
          owner: "Robert Johnson",
          isOwner: false
        },
        {
          id: 5,
          name: "Paws & Claws Pet Care",
          category: "🐶 Pet Care",
          tfiScore: 90,
          rating: 4.8,
          reviews: 203,
          location: "North Side",
          address: "555 Pet Avenue",
          description: "Pet grooming and veterinary care",
          owner: "Sarah Mitchell",
          isOwner: false
        },
        {
          id: 6,
          name: "Community Pharmacy Plus",
          category: "💊 Pharmacy",
          tfiScore: 93,
          rating: 4.9,
          reviews: 287,
          location: "Central District",
          address: "888 Health Road",
          description: "Your trusted local pharmacy with consultation",
          owner: "Dr. James Lee",
          isOwner: false
        },
        {
          id: 7,
          name: "Fair Housing Realty",
          category: "🏠 Property & Housing",
          tfiScore: 89,
          rating: 4.7,
          reviews: 145,
          location: "Downtown",
          address: "999 Real Estate Blvd",
          description: "Honest property management and rentals",
          owner: "Patricia Wong",
          isOwner: false
        }
      ])
    } catch (error) {
      console.error('Failed to fetch stores:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getTFIColor = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-500'
    if (score >= 80) return 'from-blue-500 to-cyan-500'
    if (score >= 70) return 'from-yellow-500 to-amber-500'
    return 'from-orange-500 to-red-500'
  }

  const getTFIRating = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Very Good'
    if (score >= 70) return 'Good'
    return 'Fair'
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
            Merchant Stores
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400">
            Browse verified stores with fair trade ratings
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search stores by name, category, or location..."
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
        ) : filteredStores.length === 0 ? (
          <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-8 sm:p-12 text-center shadow-xl">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Stores Found
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Try a different search or check back soon
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
                        {store.name}
                      </h2>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-base font-semibold">
                        {store.category}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-lg">
                        <MapPin className="w-5 h-5" />
                        {store.location}
                      </span>
                    </div>
                    <p className="text-base text-gray-600 dark:text-gray-400 mb-2">
                      📍 {store.address}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-6">
                  {store.description}
                </p>

                {/* TFI Score */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-6 h-6 text-amber-500" />
                      <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Trade Fairness Index (TFI★)
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                        {store.tfiScore}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {getTFIRating(store.tfiScore)}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div
                      className={`bg-gradient-to-r ${getTFIColor(store.tfiScore)} h-4 rounded-full transition-all`}
                      style={{ width: `${store.tfiScore}%` }}
                    />
                  </div>
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-lg text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">{store.rating}</span> / 5.0
                    </span>
                  </div>
                  <span className="text-lg text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">{store.reviews}</span> reviews
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  {store.isOwner && (
                    <button
                      onClick={() => window.location.href = '/lite/merchants/dashboard'}
                      className="w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-xl flex items-center justify-center gap-2"
                    >
                      <TrendingUp className="w-6 h-6" />
                      My Store Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => alert(`View ${store.name} details - Coming soon!`)}
                    className="w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all shadow-xl"
                  >
                    👁️ View Store Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => window.location.href = '/lite/merchants'}
            className="block w-full py-6 px-8 rounded-2xl bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all shadow-xl text-center flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-6 h-6" />
            Back to Categories
          </button>
        </div>
      </div>
    </div>
  )
}
