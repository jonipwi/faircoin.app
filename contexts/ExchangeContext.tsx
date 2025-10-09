/**
 * FairCoin Exchange Context
 * Light & Truth • Love & Mercy • Just & Peace
 * 
 * Global state management for currency exchange and conversions
 */

"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { type SupportedCurrency } from '@/lib/exchange-api'
import { useExchangeHealth } from '@/hooks/useExchange'

interface ExchangeContextValue {
  // User preferences
  preferredCurrency: SupportedCurrency
  setPreferredCurrency: (currency: SupportedCurrency) => void
  
  // Service status
  isExchangeAvailable: boolean
  exchangeError: Error | null
  
  // Display settings
  showFiatEquivalent: boolean
  setShowFiatEquivalent: (show: boolean) => void
  
  // Multiple currency support
  displayCurrencies: SupportedCurrency[]
  addDisplayCurrency: (currency: SupportedCurrency) => void
  removeDisplayCurrency: (currency: SupportedCurrency) => void
}

const ExchangeContext = createContext<ExchangeContextValue | undefined>(undefined)

interface ExchangeProviderProps {
  children: ReactNode
  defaultCurrency?: SupportedCurrency
  defaultDisplayCurrencies?: SupportedCurrency[]
}

export function ExchangeProvider({
  children,
  defaultCurrency = 'USD',
  defaultDisplayCurrencies = ['USD', 'IDR', 'SGD'],
}: ExchangeProviderProps) {
  // Load preferences from localStorage
  const [preferredCurrency, setPreferredCurrencyState] = useState<SupportedCurrency>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('faircoin-preferred-currency')
      return (saved as SupportedCurrency) || defaultCurrency
    }
    return defaultCurrency
  })

  const [displayCurrencies, setDisplayCurrencies] = useState<SupportedCurrency[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('faircoin-display-currencies')
      return saved ? JSON.parse(saved) : defaultDisplayCurrencies
    }
    return defaultDisplayCurrencies
  })

  const [showFiatEquivalent, setShowFiatEquivalentState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('faircoin-show-fiat')
      return saved ? JSON.parse(saved) : true
    }
    return true
  })

  // Exchange service health
  const { isHealthy, error: healthError } = useExchangeHealth()

  // Save preferences to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('faircoin-preferred-currency', preferredCurrency)
    }
  }, [preferredCurrency])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('faircoin-display-currencies', JSON.stringify(displayCurrencies))
    }
  }, [displayCurrencies])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('faircoin-show-fiat', JSON.stringify(showFiatEquivalent))
    }
  }, [showFiatEquivalent])

  const setPreferredCurrency = (currency: SupportedCurrency) => {
    setPreferredCurrencyState(currency)
    // Also add to display currencies if not already there
    if (!displayCurrencies.includes(currency)) {
      setDisplayCurrencies([...displayCurrencies, currency])
    }
  }

  const setShowFiatEquivalent = (show: boolean) => {
    setShowFiatEquivalentState(show)
  }

  const addDisplayCurrency = (currency: SupportedCurrency) => {
    if (!displayCurrencies.includes(currency)) {
      setDisplayCurrencies([...displayCurrencies, currency])
    }
  }

  const removeDisplayCurrency = (currency: SupportedCurrency) => {
    // Don't allow removing the preferred currency
    if (currency === preferredCurrency) {
      return
    }
    setDisplayCurrencies(displayCurrencies.filter(c => c !== currency))
  }

  const value: ExchangeContextValue = {
    preferredCurrency,
    setPreferredCurrency,
    isExchangeAvailable: isHealthy,
    exchangeError: healthError || null,
    showFiatEquivalent,
    setShowFiatEquivalent,
    displayCurrencies,
    addDisplayCurrency,
    removeDisplayCurrency,
  }

  return (
    <ExchangeContext.Provider value={value}>
      {children}
    </ExchangeContext.Provider>
  )
}

export function useExchange() {
  const context = useContext(ExchangeContext)
  if (context === undefined) {
    throw new Error('useExchange must be used within an ExchangeProvider')
  }
  return context
}
