/**
 * Currency Display Component
 * Light & Truth • Love & Mercy • Just & Peace
 * 
 * Smart component that displays FairCoin amounts with optional fiat equivalents
 */

"use client"

import { useFCToFiat } from '@/hooks/useExchange'
import { useExchange } from '@/contexts/ExchangeContext'
import { formatCurrency, formatCompactCurrency } from '@/lib/exchange-api'
import { TrendingUp, TrendingDown, Loader2, AlertCircle } from 'lucide-react'

interface CurrencyDisplayProps {
  amount: number
  showFC?: boolean
  showFiat?: boolean
  compact?: boolean
  className?: string
  fcClassName?: string
  fiatClassName?: string
  showTrend?: boolean
}

export function CurrencyDisplay({
  amount,
  showFC = true,
  showFiat,
  compact = false,
  className = '',
  fcClassName = '',
  fiatClassName = 'text-sm text-gray-500 dark:text-gray-400',
  showTrend = false,
}: CurrencyDisplayProps) {
  const { preferredCurrency, showFiatEquivalent, isExchangeAvailable } = useExchange()
  const shouldShowFiat = showFiat !== undefined ? showFiat : showFiatEquivalent
  
  const { fiatAmount, rate, error, isLoading } = useFCToFiat(
    amount,
    preferredCurrency
  )

  const formatFC = (amt: number) => {
    return compact ? formatCompactCurrency(amt, 'FC') : formatCurrency(amt, 'FC')
  }

  const formatFiat = (amt: number) => {
    return compact ? formatCompactCurrency(amt, preferredCurrency) : formatCurrency(amt, preferredCurrency)
  }

  return (
    <div className={`inline-flex flex-col ${className}`}>
      {showFC && (
        <div className={`font-bold ${fcClassName}`}>
          {formatFC(amount)}
        </div>
      )}
      
      {shouldShowFiat && isExchangeAvailable && (
        <div className={`flex items-center gap-1 ${fiatClassName}`}>
          {isLoading && (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Converting...</span>
            </>
          )}
          
          {error && !isLoading && (
            <>
              <AlertCircle className="w-3 h-3 text-amber-500" />
              <span className="text-amber-500">Rate unavailable</span>
            </>
          )}
          
          {!error && !isLoading && fiatAmount !== undefined && (
            <>
              <span>≈ {formatFiat(fiatAmount)}</span>
              {showTrend && rate !== undefined && (
                <span className={rate >= 1 ? 'text-emerald-500' : 'text-rose-500'}>
                  {rate >= 1 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                </span>
              )}
            </>
          )}
        </div>
      )}
      
      {shouldShowFiat && !isExchangeAvailable && (
        <div className={`text-xs ${fiatClassName}`}>
          <AlertCircle className="w-3 h-3 inline mr-1" />
          Exchange offline
        </div>
      )}
    </div>
  )
}
