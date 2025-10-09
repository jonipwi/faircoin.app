/**
 * Multi-Currency Balance Display
 * Light & Truth • Love & Mercy • Just & Peace
 * 
 * Shows FairCoin balance in multiple currencies
 */

"use client"

import { useMultiCurrencyWallet } from '@/hooks/useExchange'
import { useExchange } from '@/contexts/ExchangeContext'
import { formatCurrency, SUPPORTED_CURRENCIES, type SupportedCurrency } from '@/lib/exchange-api'
import { Wallet, Loader2, AlertCircle, Settings, Plus, X } from 'lucide-react'
import { useState } from 'react'

interface MultiCurrencyBalanceProps {
  fcBalance: number
  className?: string
  showAddButton?: boolean
}

export function MultiCurrencyBalance({
  fcBalance,
  className = '',
  showAddButton = true,
}: MultiCurrencyBalanceProps) {
  const { displayCurrencies, addDisplayCurrency, removeDisplayCurrency } = useExchange()
  const { conversions, errors, isConverting } = useMultiCurrencyWallet(fcBalance, displayCurrencies)
  const [showSettings, setShowSettings] = useState(false)

  const availableCurrencies = Object.keys(SUPPORTED_CURRENCIES).filter(
    (code) => code !== 'FC' && !displayCurrencies.includes(code as SupportedCurrency)
  ) as SupportedCurrency[]

  return (
    <div className={`card p-6 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Balance Overview
          </h3>
        </div>
        {showAddButton && (
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Manage currencies"
          >
            <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        )}
      </div>

      {/* Main FC Balance */}
      <div className="py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          FairCoin Balance
        </div>
        <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
          {formatCurrency(fcBalance, 'FC')}
        </div>
      </div>

      {/* Currency Settings Panel */}
      {showSettings && (
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-3">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Display Currencies
          </div>
          
          {availableCurrencies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {availableCurrencies.map((currency) => (
                <button
                  key={currency}
                  onClick={() => {
                    addDisplayCurrency(currency)
                    setShowSettings(false)
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 transition-colors text-sm"
                >
                  <Plus className="w-3 h-3" />
                  <span>{currency}</span>
                </button>
              ))}
            </div>
          )}
          
          {availableCurrencies.length === 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              All available currencies are displayed
            </div>
          )}
        </div>
      )}

      {/* Fiat Equivalents */}
      <div className="space-y-2">
        {isConverting && (
          <div className="flex items-center justify-center gap-2 py-4 text-gray-500 dark:text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Converting to fiat currencies...</span>
          </div>
        )}

        {!isConverting && displayCurrencies.map((currency: SupportedCurrency) => {
          const amount = conversions[currency]
          const error = errors[currency]

          return (
            <div
              key={currency}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                  {currency}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {SUPPORTED_CURRENCIES[currency]}
                  </div>
                  {error ? (
                    <div className="flex items-center gap-1 text-xs text-rose-500">
                      <AlertCircle className="w-3 h-3" />
                      <span>Unable to convert</span>
                    </div>
                  ) : amount !== undefined ? (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formatCurrency(amount, currency)}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 dark:text-gray-500">
                      Loading...
                    </div>
                  )}
                </div>
              </div>

              {displayCurrencies.length > 1 && (
                <button
                  onClick={() => removeDisplayCurrency(currency)}
                  className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-all"
                  title="Remove currency"
                >
                  <X className="w-4 h-4 text-rose-500" />
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer Note */}
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">
        Rates update every 12 hours via Exchange API
      </div>
    </div>
  )
}
