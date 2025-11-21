"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Store, Star, MapPin, Search, Award, X } from 'lucide-react'

interface Merchant {
  id: number
  name: string
  category: string
  tfiScore: number
  reviews: number
  location: string
  description: string
  icon: string
}

interface Toast {
  message: string
  show: boolean
}

const API_BASE_URL = process.env.NEXT_PUBLIC_FAIRCOIN_API_URL || 'https://faircoin-api.bixio.xyz'

export default function LiteMerchants() {
  const [merchants, setMerchants] = useState<Merchant[]>([])
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
    try {
      // Mock data for now - replace with actual API call
      setMerchants([
        {
          id: 1,
          name: "Daily Essentials",
          category: "Groceries / Essentials",
          tfiScore: 94,
          reviews: 234,
          location: "Typical CBI★: 85-98",
          description: "Community Mini Market, Local Grocery, Fresh Vegetables, Water Refill",
          icon: "🏪"
        },
        {
          id: 2,
          name: "Food & Drinks",
          category: "Food & Beverages",
          tfiScore: 90,
          reviews: 189,
          location: "Typical CBI★: 82-95",
          description: "Local Food Stall, Bakery & Pastry, Coffee & Tea, Juice Bar",
          icon: "🍲"
        },
        {
          id: 3,
          name: "Household Services",
          category: "Household Services",
          tfiScore: 87,
          reviews: 156,
          location: "Typical CBI★: 80-92",
          description: "Tailor, Laundry Service, Home Supplies, Small Hardware",
          icon: "👕"
        },
        {
          id: 4,
          name: "Services",
          category: "Services & Help",
          tfiScore: 91,
          reviews: 142,
          location: "Typical CBI★: 85-94",
          description: "Local Driver, Repairman, Barber, Cleaning Service",
          icon: "🚖"
        },
        {
          id: 5,
          name: "Pet & Care",
          category: "Pet Care",
          tfiScore: 88,
          reviews: 98,
          location: "Typical CBI★: 83-93",
          description: "Pet Grooming, Pet Food Shop, Local Vet",
          icon: "🐶"
        },
        {
          id: 6,
          name: "Education & Community",
          category: "Community",
          tfiScore: 92,
          reviews: 167,
          location: "Typical CBI★: 86-96",
          description: "Tutoring Center, Sunday School, Library, Kids Activities",
          icon: "📚"
        },
        {
          id: 7,
          name: "Health & Wellness",
          category: "Pharmacy",
          tfiScore: 93,
          reviews: 215,
          location: "Typical CBI★: 88-97",
          description: "Community Pharmacy, Health Supplies, Over-the-Counter Medicine, Consultation",
          icon: "💊"
        },
        {
          id: 8,
          name: "Property & Housing",
          category: "Property & Housing",
          tfiScore: 89,
          reviews: 178,
          location: "Typical CBI★: 84-94",
          description: "Real Estate Agent, Home Rental, Property Management, Home Insurance",
          icon: "🏠"
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
    merchant.category.toLowerCase().includes(searchQuery.toLowerCase())
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
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
            <Store className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Trusted Merchants 🏪
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400">
            Find fair and honest merchants near you
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search merchants..."
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
              No Merchants Found
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Try a different search or check back soon
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredMerchants.map((merchant) => (
              <div
                key={merchant.id}
                className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                {/* Merchant Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl sm:text-5xl">{merchant.icon}</span>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        {merchant.name}
                      </h2>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-base font-semibold">
                        📁 {merchant.category}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-lg">
                        <MapPin className="w-5 h-5" />
                        {merchant.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-6">
                  {merchant.description}
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
                        {merchant.tfiScore}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {getTFIRating(merchant.tfiScore)}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div
                      className={`bg-gradient-to-r ${getTFIColor(merchant.tfiScore)} h-4 rounded-full transition-all`}
                      style={{ width: `${merchant.tfiScore}%` }}
                    />
                  </div>
                </div>

                {/* Reviews */}
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-lg text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">{merchant.reviews}</span> verified reviews
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => window.location.href = '/lite/merchants/stores'}
                    className="w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all shadow-xl"
                  >
                    👁️ View Stores in {merchant.category}
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
            Want to Join Our Merchant Community? 🏪
          </h2>
          <p className="text-xl sm:text-2xl text-white/90 mb-8">
            Build trust with your customers through fair business practices
          </p>
          <button
            onClick={() => window.location.href = '/lite/merchants/apply'}
            className="inline-block py-6 px-12 rounded-2xl bg-white text-green-700 text-2xl font-bold hover:bg-gray-100 transition-all shadow-xl hover:scale-105"
          >
            ✨ Become a Merchant
          </button>
        </div>

        {/* Back Button */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => window.location.href = '/lite'}
            className="flex-1 py-6 px-8 rounded-2xl bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all shadow-xl text-center"
          >
            ← Back to Home
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
