"use client"

import Link from 'next/link'
import { MessageCircle, Wallet, HelpCircle, Sparkles, Languages, Vote, Store, ArrowRightLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLocalePath } from '@/lib/i18n/useLocalePath'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { useState, useEffect } from 'react'

export default function LiteHome() {
  const { isAuthenticated, user } = useAuth()
  const localePath = useLocalePath()
  const { locale, setLocale, languages, t } = useLanguage()
  
  // Exchange rates state
  const [fcAmount, setFcAmount] = useState<string>('1')
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'SGD' | 'IDR'>('USD')
  const [exchangeRates, setExchangeRates] = useState({
    USD: 1.0,
    SGD: 1.35,
    IDR: 15500
  })
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  
  // Fetch exchange rates from API
  useEffect(() => {
    const fetchExchangeRates = async () => {
      setLoading(true)
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://faircoin-api.bixio.xyz/sandbox'
        const url = `${API_BASE_URL}/api/v1/exchange/rates`
        
        console.log('Fetching exchange rates from:', url)
        const response = await fetch(url)
        console.log('Exchange API response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Exchange API data:', data)
          
          if (data.success && data.rates) {
            setExchangeRates({
              USD: parseFloat(data.rates.USD) || 0.0,
              SGD: parseFloat(data.rates.SGD) || 0.0,
              IDR: parseFloat(data.rates.IDR) || 0.0
            })
            setLastUpdated(new Date().toLocaleTimeString())
            console.log('Exchange rates updated:', data.rates)
          }
        } else {
          console.error('Exchange API returned error:', response.status)
        }
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error)
        // Keep default rates on error
      } finally {
        setLoading(false)
      }
    }

    fetchExchangeRates()
    // Refresh rates every 5 minutes
    const interval = setInterval(fetchExchangeRates, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])
  
  const convertedAmount = (parseFloat(fcAmount) || 0) * exchangeRates[selectedCurrency]

  // Function to open the floating chat widget
  const openChatWidget = () => {
    if (typeof window !== 'undefined' && (window as any).__openFairCoinChat) {
      (window as any).__openFairCoinChat()
    }
  }

  const quickActions = [
    {
      title: t('lite.chat.title') || 'Community Chat',
      description: t('lite.chat.description') || 'Join the conversation, get help, and meet friends',
      icon: MessageCircle,
      onClick: openChatWidget,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: t('lite.wallet.title') || 'My Wallet',
      description: t('lite.wallet.description') || 'Send, receive, and check your FairCoin balance',
      icon: Wallet,
      href: 'lite/balance',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: t('lite.proposals.title') || 'Proposals',
      description: t('lite.proposals.description') || 'Vote on community decisions and proposals',
      icon: Vote,
      href: 'lite/proposals',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: t('lite.merchants.title') || 'Merchants',
      description: t('lite.merchants.description') || 'Find trusted merchants with fair ratings',
      icon: Store,
      href: 'lite/merchants',
      color: 'from-amber-500 to-orange-500'
    },
    {
      title: t('lite.help.title') || 'Help & Tutorial',
      description: t('lite.help.description') || 'Learn how to use FairCoin step-by-step',
      icon: HelpCircle,
      href: 'lite/help',
      color: 'from-indigo-500 to-violet-500'
    },
    {
      title: t('lite.language.title') || 'Language',
      description: t('lite.language.description') || 'Choose your preferred language',
      icon: Languages,
      href: '#',
      color: 'from-rose-500 to-pink-500',
      isLanguage: true
    }
  ]

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-6">
            <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <span className="text-lg font-semibold text-primary-700 dark:text-primary-300">
              {t('lite.welcome') || 'Welcome to FairCoin Lite'}
            </span>
          </div>
          {isAuthenticated && user && (
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              {t('lite.hello', { username: user.username }) || `Hello, ${user.username}!`}
            </h1>
          )}
          {!isAuthenticated && (
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              {t('lite.title') || 'Simple & Friendly FairCoin'}
            </h1>
          )}
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('lite.subtitle') || 'Everything you need in big, clear buttons'}
          </p>
        </div>

        {/* Big Action Buttons */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {quickActions.map((action) => {
            const Icon = action.icon
            
            // Language selector card
            if (action.isLanguage) {
              return (
                <div
                  key="language"
                  className="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className="p-8 sm:p-10">
                    <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-6`}>
                      <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                      {action.title}
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                      {action.description}
                    </p>
                    <select
                      value={locale}
                      onChange={(e) => setLocale(e.target.value as any)}
                      className="w-full px-4 py-3 text-lg rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500 transition-all"
                    >
                      {Object.entries(languages).map(([code, lang]) => (
                        <option key={code} value={code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-primary-500 to-accent-500" />
                </div>
              )
            }
            
            // If action has onClick, render as button; otherwise as Link
            if (action.onClick) {
              return (
                <button
                  key={action.title}
                  onClick={action.onClick}
                  className="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-left w-full"
                >
                  <div className="p-8 sm:p-10">
                    <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                      {action.title}
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-primary-500 to-accent-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </button>
              )
            }
            
            return (
              <Link
                key={action.href}
                href={localePath(action.href || '') as any}
                className="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="p-8 sm:p-10">
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    {action.title}
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                    {action.description}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-primary-500 to-accent-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </Link>
            )
          })}
        </div>

        {/* Exchange Converter Card */}
        <div className="mb-12">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 p-1 shadow-2xl">
            <div className="rounded-3xl bg-white dark:bg-gray-800 p-8 sm:p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <ArrowRightLeft className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('lite.exchange.title') || 'Exchange Converter'}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {t('lite.exchange.subtitle') || 'Convert FC to other currencies'}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      FairCoin Amount
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={fcAmount}
                        onChange={(e) => setFcAmount(e.target.value)}
                        className="w-full px-6 py-5 text-2xl font-bold rounded-2xl border-3 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-900 transition-all"
                        placeholder="1.0"
                        min="0"
                        step="0.01"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        FC
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Convert To
                    </label>
                    <select
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value as 'USD' | 'SGD' | 'IDR')}
                      className="w-full px-6 py-5 text-2xl font-bold rounded-2xl border-3 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-900 transition-all"
                    >
                      <option value="USD">🇺🇸 USD ($)</option>
                      <option value="SGD">🇸🇬 SGD (S$)</option>
                      <option value="IDR">🇮🇩 IDR (Rp)</option>
                    </select>
                  </div>
                </div>

                {/* Output Section */}
                <div className="flex items-center justify-center">
                  <div className="w-full p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border-2 border-emerald-200 dark:border-emerald-800">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                        Converted Amount
                      </div>
                      <div className="text-5xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-2">
                        {selectedCurrency === 'USD' && '$'}
                        {selectedCurrency === 'SGD' && 'S$'}
                        {selectedCurrency === 'IDR' && 'Rp '}
                        {convertedAmount.toLocaleString(undefined, {
                          minimumFractionDigits: selectedCurrency === 'IDR' ? 0 : 2,
                          maximumFractionDigits: selectedCurrency === 'IDR' ? 0 : 2
                        })}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        1 FC = {selectedCurrency === 'USD' && '$'}
                        {selectedCurrency === 'SGD' && 'S$'}
                        {selectedCurrency === 'IDR' && 'Rp '}
                        {exchangeRates[selectedCurrency].toLocaleString(undefined, {
                          minimumFractionDigits: selectedCurrency === 'IDR' ? 0 : 2,
                          maximumFractionDigits: selectedCurrency === 'IDR' ? 0 : 2
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exchange Rate Info */}
              <div className="mt-8 p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <div className="text-blue-500 mt-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
                      Live Exchange Rates {loading && <span className="text-xs">(Updating...)</span>}
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      1 FC = ${exchangeRates.USD.toFixed(2)} USD | S${exchangeRates.SGD.toFixed(2)} SGD | Rp {exchangeRates.IDR.toLocaleString()} IDR
                    </p>
                    {lastUpdated && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Last updated: {lastUpdated}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info Banner */}
        {!isAuthenticated && (
          <div className="rounded-3xl bg-gradient-to-r from-primary-600 to-accent-600 p-8 sm:p-10 text-center text-white shadow-2xl">
            <h3 className="text-3xl sm:text-4xl font-extrabold mb-4">
              {t('lite.join.title') || 'Ready to join FairCoin?'}
            </h3>
            <p className="text-xl sm:text-2xl mb-8 opacity-95">
              {t('lite.join.subtitle') || 'Create your account in 3 easy steps'}
            </p>
            <Link
              href={localePath('auth') as any}
              className="inline-flex items-center gap-3 px-8 py-5 bg-white text-primary-700 rounded-2xl text-xl font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
            >
              {t('lite.join.button') || 'Get Started Now'}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
