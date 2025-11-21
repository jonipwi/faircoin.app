"use client"

import { useState } from 'react'
import { Store, TrendingUp, Users, Star, MessageCircle, Settings, ArrowLeft, Award } from 'lucide-react'
import { useLocalePath } from '@/lib/i18n/useLocalePath'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface MerchantStats {
  sales: number
  customers: number
  rating: number
  reviews: number
  tfiScore: number
}

export default function LiteMerchantDashboard() {
  const localePath = useLocalePath()
  const { t } = useLanguage()
  const [stats] = useState<MerchantStats>({
    sales: 1250,
    customers: 234,
    rating: 4.8,
    reviews: 189,
    tfiScore: 92
  })

  const quickActions = [
    {
      title: t('lite.merchants.dashboard.viewSales') || 'View Sales',
      description: t('lite.merchants.dashboard.viewSalesDesc') || 'See your recent transactions',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      action: () => alert((t('lite.merchants.dashboard.viewSales') || 'Sales history') + ' - ' + (t('common.comingSoon') || 'Coming soon') + '!')
    },
    {
      title: t('lite.merchants.dashboard.reviews') || 'Customer Reviews',
      description: t('lite.merchants.dashboard.reviewsDesc') || 'Read what customers say',
      icon: Star,
      color: 'from-amber-500 to-orange-500',
      action: () => alert((t('lite.merchants.dashboard.reviews') || 'Customer reviews') + ' - ' + (t('common.comingSoon') || 'Coming soon') + '!')
    },
    {
      title: t('lite.merchants.dashboard.messages') || 'Messages',
      description: t('lite.merchants.dashboard.messagesDesc') || 'Chat with customers',
      icon: MessageCircle,
      color: 'from-blue-500 to-cyan-500',
      action: () => alert((t('lite.merchants.dashboard.messages') || 'Messages') + ' - ' + (t('common.comingSoon') || 'Coming soon') + '!')
    },
    {
      title: t('lite.merchants.dashboard.settings') || 'Store Settings',
      description: t('lite.merchants.dashboard.settingsDesc') || 'Update your store info',
      icon: Settings,
      color: 'from-purple-500 to-pink-500',
      action: () => alert((t('lite.merchants.dashboard.settings') || 'Store settings') + ' - ' + (t('common.comingSoon') || 'Coming soon') + '!')
    }
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
            <Store className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {t('lite.merchants.dashboard.title') || 'My Store Dashboard'} 🏪
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400">
            {t('lite.merchants.dashboard.subtitle') || 'Manage your merchant account'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Total Sales */}
          <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-10 h-10 text-green-500" />
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {t('lite.merchants.dashboard.thisMonth') || 'THIS MONTH'}
              </span>
            </div>
            <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1">
              {stats.sales} FC
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-400">
              {t('lite.merchants.dashboard.totalSales') || 'Total Sales'}
            </div>
          </div>

          {/* Customers */}
          <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-10 h-10 text-blue-500" />
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {t('lite.merchants.dashboard.total') || 'TOTAL'}
              </span>
            </div>
            <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1">
              {stats.customers}
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-400">
              {t('lite.merchants.dashboard.customers') || 'Customers'}
            </div>
          </div>

          {/* Rating */}
          <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <Star className="w-10 h-10 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {t('lite.merchants.dashboard.average') || 'AVERAGE'}
              </span>
            </div>
            <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1">
              {stats.rating} ★
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-400">
              {stats.reviews} {t('lite.merchants.dashboard.reviews') || 'Reviews'}
            </div>
          </div>

          {/* TFI Score */}
          <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <Award className="w-10 h-10 text-purple-500" />
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">TFI★</span>
            </div>
            <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
              {stats.tfiScore}
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-400">
              {t('lite.merchants.dashboard.tradeFairness') || 'Trade Fairness'}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            {t('lite.merchants.dashboard.quickActions') || 'Quick Actions'}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.title}
                  onClick={action.action}
                  className="group rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-left"
                >
                  <div className="p-8">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                      {action.title}
                    </h3>
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Help Section */}
        <div className="mb-8 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 p-8 sm:p-12 text-center shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            {t('lite.merchants.dashboard.needHelp') || 'Need Help?'} 💡
          </h2>
          <p className="text-xl sm:text-2xl text-white/90 mb-8">
            {t('lite.merchants.dashboard.supportAvailable') || 'Our support team is here to assist you 24/7'}
          </p>
          <button
            onClick={() => window.location.href = localePath('lite/help') as string}
            className="inline-block py-6 px-12 rounded-2xl bg-white text-blue-700 text-2xl font-bold hover:bg-gray-100 transition-all shadow-xl hover:scale-105"
          >
            {t('lite.merchants.dashboard.getHelp') || 'Get Help Now'}
          </button>
        </div>

        {/* Back Button */}
        <div className="flex gap-4">
          <button
            onClick={() => window.location.href = localePath('lite/merchants') as string}
            className="flex-1 py-6 px-8 rounded-2xl bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-6 h-6" />
            {t('lite.merchants.dashboard.backToMerchants') || 'Back to Merchants'}
          </button>
          <button
            onClick={() => window.location.href = localePath('lite') as string}
            className="flex-1 py-6 px-8 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xl font-bold hover:from-primary-600 hover:to-accent-600 transition-all shadow-xl"
          >
            {t('common.home') || 'Home'}
          </button>
        </div>
      </div>
    </div>
  )
}
