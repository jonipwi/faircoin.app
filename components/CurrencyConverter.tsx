/**
 * Currency Converter Component
 * Light & Truth • Love & Mercy • Just & Peace
 * 
 * Interactive currency converter widget
 */

"use client"

import { useState } from 'react'
import { useLiveConvert } from '@/hooks/useExchange'
import { SUPPORTED_CURRENCIES, type SupportedCurrency } from '@/lib/exchange-api'
import { ArrowLeftRight, Loader2, AlertCircle, TrendingUp } from 'lucide-react'

interface CurrencyConverterProps {
  defaultFrom?: SupportedCurrency
  defaultTo?: SupportedCurrency
  defaultAmount?: number
  className?: string
}

export function CurrencyConverter({
  defaultFrom = 'FC',
  defaultTo = 'USD',
  defaultAmount = 100,
  className = '',
}: CurrencyConverterProps) {
  const [fromCurrency, setFromCurrency] = useState<SupportedCurrency>(defaultFrom)
  const [toCurrency, setToCurrency] = useState<SupportedCurrency>(defaultTo)

  const {
    amount,
    setAmount,
    converted,
    rate,
    error,
    isLoading,
    isDebouncing,
  } = useLiveConvert(fromCurrency, toCurrency, defaultAmount)

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const currencyOptions = Object.entries(SUPPORTED_CURRENCIES).map(([code, name]) => ({
    code,
    name,
  }))

  return (
    <div className={`card p-6 space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Currency Converter
        </h3>
        {rate && (
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span>1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}</span>
          </div>
        )}
      </div>

      {/* From Currency */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          From
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter amount"
            min="0"
            step="0.01"
          />
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value as SupportedCurrency)}
            className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {currencyOptions.map(({ code, name }) => (
              <option key={code} value={code}>
                {code} - {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSwapCurrencies}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Swap currencies"
        >
          <ArrowLeftRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* To Currency */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          To
        </label>
        <div className="flex gap-2">
          <div className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white flex items-center">
            {isLoading || isDebouncing ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Converting...</span>
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 text-rose-500">
                <AlertCircle className="w-4 h-4" />
                <span>Error</span>
              </div>
            ) : (
              <span className="font-semibold">
                {converted !== undefined ? converted.toFixed(2) : '0.00'}
              </span>
            )}
          </div>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value as SupportedCurrency)}
            className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {currencyOptions.map(({ code, name }) => (
              <option key={code} value={code}>
                {code} - {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error.message || 'Conversion failed'}</span>
          </div>
        </div>
      )}

      {/* Exchange Rate Info */}
      {rate && !error && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Exchange rate updates every 12 hours
        </div>
      )}
    </div>
  )
}
