"use client"

import { useState, useEffect } from 'react'
import { Award, Star, Store, Search, X } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { useLocalePath } from '@/lib/i18n/useLocalePath'

interface Merchant {
  name: string
  category: string
  tfi: number
  rating: number
  reviews: number
  image: string
  description?: string
  location?: string
}

interface MerchantsSectionProps {
  mode?: 'full' | 'lite'
  prefix?: string
  merchants?: Merchant[]
  showSearch?: boolean
  showActions?: boolean
  showTFI?: boolean
}

interface Toast {
  message: string
  show: boolean
}

export function MerchantsSection({
  mode = 'full',
  prefix = 'merchants',
  merchants: externalMerchants,
  showSearch,
  showActions,
  showTFI,
}: MerchantsSectionProps) {
  const { t } = useLanguage()
  const localePath = useLocalePath()
  const [toast, setToast] = useState<Toast>({ message: '', show: false })
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(true)

  // Mode-based defaults
  const effectiveShowSearch = showSearch !== undefined ? showSearch : mode === 'full'
  const effectiveShowActions = showActions !== undefined ? showActions : mode === 'full'
  const effectiveShowTFI = showTFI !== undefined ? showTFI : true

  useEffect(() => {
    if (externalMerchants) {
      setMerchants(externalMerchants)
      setLoading(false)
    } else {
      fetchMerchantCategories()
    }
  }, [externalMerchants])

  const fetchMerchantCategories = async () => {
    try {
      // Fetch merchant categories from API
      const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://faircoin-api.bixio.xyz/sandbox'}/api/v1/public/merchant-categories`, {
        headers: {
          'X-API-Key': 'faircoin-secret-key-2025'
        }
      })
      
      if (!categoriesResponse.ok) {
        throw new Error('Failed to fetch categories')
      }
      
      const categoriesData = await categoriesResponse.json()
      const categories = categoriesData.categories || []
      
      // Fetch all merchants to calculate statistics
      const merchantsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://faircoin-api.bixio.xyz/sandbox'}/api/v1/public/merchants`, {
        headers: {
          'X-API-Key': 'faircoin-secret-key-2025'
        }
      })
      
      const merchantsData = await merchantsResponse.json()
      const allMerchants = merchantsData.merchants || []
      
      // Calculate statistics per category
      const categoryStats = categories.map((cat: any) => {
        const categoryName = cat.display_name || cat.name
        const categoryMerchants = allMerchants.filter((m: any) => 
          m.category === categoryName || m.category === cat.folder
        )
        
        // Use database values if available, otherwise calculate
        const avgRating = cat.avg_cbi ? parseFloat(cat.avg_cbi) / 20 : // Convert CBI back to rating
          (categoryMerchants.length > 0
            ? categoryMerchants.reduce((sum: number, m: any) => sum + (parseFloat(m.average_rating) || 0), 0) / categoryMerchants.length
            : 0)
        
        const totalReviews = cat.merchant_count ? parseInt(cat.merchant_count.replace('+', '')) :
          categoryMerchants.length
        
        const avgTFI = cat.avg_cbi ? parseFloat(cat.avg_cbi) : Math.round(avgRating * 20)
        
        return {
          name: categoryName,
          category: cat.folder || categoryName,
          tfi: Math.round(avgTFI),
          rating: avgRating,
          reviews: totalReviews,
          image: cat.icon || getCategoryIcon(categoryName),
          description: cat.examples || cat.description || t(`${prefix}.${categoryName.toLowerCase().replace(/\\s+/g, '')}.description`),
          location: cat.cbi_range ? `Typical CBI★: ${cat.cbi_range}` : `Typical CBI★: ${Math.round(avgTFI - 10)}-${Math.round(avgTFI + 5)}`
        }
      })
      
      setMerchants(categoryStats)
    } catch (error) {
      console.error('Failed to fetch merchant categories:', error)
      // Fallback to translation-based data
      setMerchants(getDefaultMerchants())
    } finally {
      setLoading(false)
    }
  }
  
  const getCategoryIcon = (categoryName: string): string => {
    const name = categoryName.toLowerCase()
    if (name.includes('groceries') || name.includes('essentials') || name.includes('daily')) return '🏪'
    if (name.includes('food') || name.includes('beverages') || name.includes('drinks')) return '🍲'
    if (name.includes('household') || name.includes('services')) return '👕'
    if (name.includes('pet')) return '🐶'
    if (name.includes('pharmacy') || name.includes('health')) return '💊'
    if (name.includes('property') || name.includes('housing')) return '🏠'
    if (name.includes('community') || name.includes('education')) return '📚'
    return '🚖'
  }
  
  const getDefaultMerchants = (): Merchant[] => [
    {
      name: t(`${prefix}.merchant1Name`),
      category: t(`${prefix}.merchant1Category`),
      tfi: 94,
      rating: 4.9,
      reviews: 234,
      image: '🏪',
      description: t(`${prefix}.merchant1.description`),
      location: 'Typical CBI★: 85-98',
    },
    {
      name: t(`${prefix}.merchant2Name`),
      category: t(`${prefix}.merchant2Category`),
      tfi: 90,
      rating: 4.8,
      reviews: 189,
      image: '🍲',
      description: t(`${prefix}.merchant2.description`),
      location: 'Typical CBI★: 82-95',
    },
    {
      name: t(`${prefix}.merchant3Name`),
      category: t(`${prefix}.merchant3Category`),
      tfi: 87,
      rating: 4.7,
      reviews: 156,
      image: '👕',
      description: t(`${prefix}.merchant3.description`),
      location: 'Typical CBI★: 80-92',
    },
    {
      name: t(`${prefix}.merchant4Name`),
      category: t(`${prefix}.merchant4Category`),
      tfi: 91,
      rating: 4.6,
      reviews: 142,
      image: '🚖',
      description: t(`${prefix}.merchant4.description`),
      location: 'Typical CBI★: 85-94',
    },
    {
      name: t(`${prefix}.merchant5Name`),
      category: t(`${prefix}.merchant5Category`),
      tfi: 88,
      rating: 4.5,
      reviews: 98,
      image: '🐶',
      description: t(`${prefix}.merchant5.description`),
      location: 'Typical CBI★: 83-93',
    },
    {
      name: t(`${prefix}.merchant6Name`),
      category: t(`${prefix}.merchant6Category`),
      tfi: 92,
      rating: 4.8,
      reviews: 167,
      image: '📚',
      description: t(`${prefix}.merchant6.description`),
      location: 'Typical CBI★: 86-96',
    },
    {
      name: t(`${prefix}.merchant7Name`),
      category: t(`${prefix}.merchant7Category`),
      tfi: 93,
      rating: 4.9,
      reviews: 215,
      image: '💊',
      description: t(`${prefix}.merchant7.description`),
      location: 'Typical CBI★: 88-97',
    },
    {
      name: t(`${prefix}.merchant8Name`),
      category: t(`${prefix}.merchant8Category`),
      tfi: 89,
      rating: 4.7,
      reviews: 178,
      image: '🏠',
      description: t(`${prefix}.merchant8.description`),
      location: 'Typical CBI★: 84-94',
    },
  ]

  const showToast = (message: string) => {
    setToast({ message, show: true })
    setTimeout(() => {
      setToast({ message: '', show: false })
    }, 2000)
  }

  if (loading) {
    return (
      <section id="merchants" className="section">
        <div className="container">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded mx-auto mb-4"></div>
              <div className="h-12 w-96 bg-gray-300 dark:bg-gray-700 rounded mx-auto mb-8"></div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-24 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="merchants" className="section">
      <div className="container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
            <Store className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-white">{t(`${prefix}.title`)}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            {t(`${prefix}.subtitle`)}
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-4">
            {t(`${prefix}.description`)}
          </p>
          <p className="text-base text-white/60 max-w-2xl mx-auto mb-8">
            {t(`${prefix}.groupHint`)}
          </p>

          {/* Search Bar */}
          {effectiveShowSearch && (
            <div className="max-w-2xl mx-auto">
              <div className="card p-4 flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t(`${prefix}.searchPlaceholder`)}
                  className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
                />
                <button className="btn btn-primary btn-sm">{t(`${prefix}.search`)}</button>
              </div>
            </div>
          )}
        </div>

        {/* Merchants Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {merchants.map((merchant) => (
            <div key={merchant.name} className="card card-hover p-6 group flex flex-col">
              {/* Merchant Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{merchant.image}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {merchant.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    📁 {merchant.category}
                  </p>
                </div>
              </div>

              {/* Examples */}
              {merchant.description && (
                <div className="mb-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
                  <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">
                    📋 Examples in this group:
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {merchant.description}
                  </p>
                </div>
              )}

              {/* Group Statistics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Avg CBI★
                    </span>
                  </div>
                  <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
                    {merchant.tfi}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {merchant.rating >= 4.8 ? 'Excellent' : merchant.rating >= 4.5 ? 'Very Good' : 'Good'}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Store className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Merchants
                    </span>
                  </div>
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {merchant.reviews}+
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    in this group
                  </div>
                </div>
              </div>

              {/* Typical CBI Range */}
              {merchant.location && (
                <div className="mb-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {merchant.location}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Award key={i} className={`w-3 h-3 ${i < Math.floor(merchant.tfi / 20) ? 'text-amber-500 fill-amber-500' : 'text-gray-300 dark:text-gray-600'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 mt-auto">
                {effectiveShowActions && (
                  <>
                    <button
                      onClick={() => {
                        const slug = merchant.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                        window.location.href = localePath(`merchants/category/${slug}`) as string
                      }}
                      className="btn btn-primary btn-sm w-full"
                    >
                      👁️ {t(`${prefix}.viewMerchantsIn`)} {merchant.category}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="card p-8 max-w-2xl mx-auto bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-2 border-primary-200 dark:border-primary-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t(`${prefix}.joinCommunity`)} 🏪
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t(`${prefix}.buildTrust`)}
            </p>
            <button
              onClick={() => {
                window.location.href = localePath('merchants/apply') as string
              }}
              className="btn btn-primary"
            >
              ✨ {t(`${prefix}.applyMerchant`)}
            </button>
          </div>
        </div>

      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-white dark:bg-gray-800 border-2 border-primary-500 rounded-lg shadow-xl p-4 flex items-center gap-3 min-w-[300px]">
            <div className="flex-1 text-gray-900 dark:text-white font-medium">
              {toast.message}
            </div>
            <button
              onClick={() => setToast({ message: '', show: false })}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
