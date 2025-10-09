/**
 * FairCoin Exchange Hooks
 * Light & Truth • Love & Mercy • Just & Peace
 */

import { useState, useEffect, useCallback } from 'react'
import useSWR from 'swr'
import { exchangeApi, type ExchangeRate, type ExchangeHealth, type SupportedCurrency } from '@/lib/exchange-api'

/**
 * Hook to get exchange service health status
 */
export function useExchangeHealth() {
  const { data, error, isLoading, mutate } = useSWR<ExchangeHealth>(
    'exchange-health',
    exchangeApi.health,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      shouldRetryOnError: true,
      errorRetryCount: 3,
    }
  )

  return {
    health: data,
    isHealthy: data?.status === 'healthy',
    error,
    isLoading,
    refresh: mutate,
  }
}

/**
 * Hook to convert currency amounts
 */
export function useConvert(from: string, to: string, amount: number) {
  const shouldFetch = amount > 0 && from && to
  const { data, error, isLoading, mutate } = useSWR<ExchangeRate>(
    shouldFetch ? `convert-${from}-${to}-${amount}` : null,
    () => exchangeApi.convert(from, to, amount),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      errorRetryCount: 2,
    }
  )

  return {
    result: data,
    converted: data?.converted,
    rate: data?.rate,
    error,
    isLoading,
    refresh: mutate,
  }
}

/**
 * Hook to get exchange rate between currencies
 */
export function useExchangeRate(from: string, to: string) {
  const { data, error, isLoading, mutate } = useSWR<number>(
    from && to ? `rate-${from}-${to}` : null,
    () => exchangeApi.getRate(from, to),
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: true,
      shouldRetryOnError: true,
    }
  )

  return {
    rate: data,
    error,
    isLoading,
    refresh: mutate,
  }
}

/**
 * Hook for FairCoin to fiat conversion with caching
 */
export function useFCToFiat(fcAmount: number, fiatCurrency: SupportedCurrency = 'USD') {
  const { result, converted, rate, error, isLoading, refresh } = useConvert('FC', fiatCurrency, fcAmount)

  return {
    fiatAmount: converted,
    rate,
    result,
    error,
    isLoading,
    refresh,
  }
}

/**
 * Hook for fiat to FairCoin conversion
 */
export function useFiatToFC(fiatAmount: number, fiatCurrency: SupportedCurrency = 'USD') {
  const { result, converted, rate, error, isLoading, refresh } = useConvert(fiatCurrency, 'FC', fiatAmount)

  return {
    fcAmount: converted,
    rate,
    result,
    error,
    isLoading,
    refresh,
  }
}

/**
 * Hook for live currency conversion with debouncing
 */
export function useLiveConvert(
  from: string,
  to: string,
  initialAmount: number = 0,
  debounceMs: number = 500
) {
  const [amount, setAmount] = useState(initialAmount)
  const [debouncedAmount, setDebouncedAmount] = useState(initialAmount)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAmount(amount)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [amount, debounceMs])

  const { result, converted, rate, error, isLoading } = useConvert(from, to, debouncedAmount)

  const updateAmount = useCallback((newAmount: number) => {
    setAmount(newAmount)
  }, [])

  return {
    amount,
    setAmount: updateAmount,
    result,
    converted,
    rate,
    error,
    isLoading,
    isDebouncing: amount !== debouncedAmount,
  }
}

/**
 * Hook to manage multi-currency wallet display
 */
export function useMultiCurrencyWallet(fcBalance: number, preferredCurrencies: SupportedCurrency[] = ['USD', 'IDR', 'SGD']) {
  const [conversions, setConversions] = useState<Record<string, number>>({})
  const [isConverting, setIsConverting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (fcBalance <= 0 || preferredCurrencies.length === 0) {
      return
    }

    const convertAll = async () => {
      setIsConverting(true)
      const newConversions: Record<string, number> = {}
      const newErrors: Record<string, string> = {}

      await Promise.all(
        preferredCurrencies.map(async (currency) => {
          try {
            const amount = await exchangeApi.fcToFiat(fcBalance, currency)
            newConversions[currency] = amount
          } catch (error) {
            newErrors[currency] = error instanceof Error ? error.message : 'Conversion failed'
          }
        })
      )

      setConversions(newConversions)
      setErrors(newErrors)
      setIsConverting(false)
    }

    convertAll()
  }, [fcBalance, preferredCurrencies.join(',')])

  return {
    conversions,
    errors,
    isConverting,
  }
}
