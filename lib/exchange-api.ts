/**
 * FairCoin Exchange API Client
 * Light & Truth • Love & Mercy • Just & Peace
 * 
 * Provides currency conversion services via the Exchange API
 */

const EXCHANGE_API_BASE = process.env.NEXT_PUBLIC_EXCHANGE_API_URL || 'http://localhost:8088'

export type ExchangeRate = {
  from: string
  to: string
  amount: number
  rate: number
  converted: number
}

export type ExchangeHealth = {
  status: 'healthy' | 'unhealthy'
  version: string
  api: 'connected' | 'disconnected'
  neon_url: string
  table: string
  rate_count: number
  timestamp: number
}

export type CurrencyPair = {
  code1: string
  code2: string
  rate: number
  lastUpdate: string
}

class ExchangeAPIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = 'ExchangeAPIError'
  }
}

async function exchangeRequest<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const url = `${EXCHANGE_API_BASE}${path}`
    console.log('[Exchange API] Request URL:', url)
    console.log('[Exchange API] Base URL:', EXCHANGE_API_BASE)
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
      cache: 'no-store',
      ...init,
    })

    if (!res.ok) {
      let msg = 'Exchange API request failed'
      try {
        const json = await res.json()
        msg = json.error || json.message || msg
      } catch {
        msg = `${msg}: ${res.status} ${res.statusText}`
      }
      throw new ExchangeAPIError(msg, res.status)
    }

    return res.json()
  } catch (error) {
    if (error instanceof ExchangeAPIError) {
      throw error
    }
    throw new ExchangeAPIError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      0
    )
  }
}

export const exchangeApi = {
  /**
   * Check exchange service health
   */
  health: async (): Promise<ExchangeHealth> => {
    return exchangeRequest<ExchangeHealth>('/api/health')
  },

  /**
   * Convert currency amount
   * @param from - Source currency code (e.g., 'USD', 'SGD')
   * @param to - Target currency code (e.g., 'IDR', 'FC')
   * @param amount - Amount to convert
   */
  convert: async (from: string, to: string, amount: number): Promise<ExchangeRate> => {
    if (amount <= 0) {
      throw new ExchangeAPIError('Amount must be greater than 0')
    }
    return exchangeRequest<ExchangeRate>(
      `/api/convert?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=${amount}`
    )
  },

  /**
   * Convert FairCoin to fiat currency
   */
  fcToFiat: async (amount: number, fiatCurrency: string = 'USD'): Promise<number> => {
    const result = await exchangeApi.convert('FC', fiatCurrency, amount)
    return result.converted
  },

  /**
   * Convert fiat currency to FairCoin
   */
  fiatToFC: async (amount: number, fiatCurrency: string = 'USD'): Promise<number> => {
    const result = await exchangeApi.convert(fiatCurrency, 'FC', amount)
    return result.converted
  },

  /**
   * Get exchange rate between two currencies
   */
  getRate: async (from: string, to: string): Promise<number> => {
    const result = await exchangeApi.convert(from, to, 1)
    return result.rate
  },
}

/**
 * Format currency with proper locale and symbol
 */
export function formatCurrency(amount: number, currency: string, locale: string = 'en-US'): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency === 'FC' ? 'USD' : currency, // Use USD format for FC
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount).replace(/US?\$/, currency === 'FC' ? 'FC' : '$')
  } catch {
    // Fallback for unsupported currencies
    return `${amount.toFixed(2)} ${currency}`
  }
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatCompactCurrency(amount: number, currency: string): string {
  const suffixes = ['', 'K', 'M', 'B', 'T']
  let suffixIndex = 0
  let value = amount

  while (value >= 1000 && suffixIndex < suffixes.length - 1) {
    value /= 1000
    suffixIndex++
  }

  const formatted = value.toFixed(suffixIndex > 0 ? 1 : 2)
  return `${formatted}${suffixes[suffixIndex]} ${currency}`
}

/**
 * Supported currency codes
 */
export const SUPPORTED_CURRENCIES = {
  FC: 'FairCoin',
  USD: 'US Dollar',
  IDR: 'Indonesian Rupiah',
  SGD: 'Singapore Dollar',
} as const

export type SupportedCurrency = keyof typeof SUPPORTED_CURRENCIES
