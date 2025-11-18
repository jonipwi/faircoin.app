"use client"

import { useState, useEffect } from 'react'
import { Wallet, Send, QrCode, History, TrendingUp, Lock, Award, Clock } from 'lucide-react'
import { CurrencyDisplay } from '@/components/CurrencyDisplay'
import { MultiCurrencyBalance } from '@/components/MultiCurrencyBalance'
import { CurrencyConverter } from '@/components/CurrencyConverter'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export function WalletSection() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [fcBalance] = useState(1234.56) // This would come from your wallet state/API

  // Check for authentication token directly (supports both wallet and OAuth)
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('auth_token') || 
                 document.cookie.split('; ').find(row => row.startsWith('session='))?.split('=')[1]
    setHasToken(!!token)
  }, [isAuthenticated])

  const handleLogin = () => {
    router.push('/auth')
  }

  if (loading) {
    return (
      <section id="wallet" className="section">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="card p-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading wallet...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!hasToken && !isAuthenticated) {
    return (
      <section id="wallet" className="section">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="card p-12 text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-primary-500/10 dark:bg-primary-500/20 flex items-center justify-center">
                <Lock className="w-10 h-10 text-primary-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                Authentication Required
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Please log in to access your FairCoin wallet and manage your funds.
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <button className="btn btn-primary btn-lg" onClick={handleLogin}>
                  <Wallet className="w-5 h-5" />
                  Login to Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="wallet" className="section bg-white/5 dark:bg-gray-900/30 backdrop-blur-sm">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            My Wallet
          </h2>
          <p className="text-xl text-white/80">
            Manage your FairCoins and track your Personal Fairness Index
          </p>
        </div>

        {/* Balance Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                Available Balance
              </h3>
              <Wallet className="w-6 h-6 text-primary-500" />
            </div>
            <CurrencyDisplay
              amount={fcBalance}
              fcClassName="text-5xl font-extrabold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent"
              fiatClassName="mt-2 text-sm text-gray-500 dark:text-gray-400"
            />
          </div>

          <div className="card p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                Locked/Vesting
              </h3>
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
            <CurrencyDisplay
              amount={500}
              fcClassName="text-5xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent"
              fiatClassName="mt-2 text-sm text-gray-500 dark:text-gray-400"
              showFiat={false}
            />
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Unlocks over 90 days
            </div>
          </div>
        </div>

        {/* Multi-Currency Balance View */}
        <div className="mb-8">
          <MultiCurrencyBalance fcBalance={fcBalance} />
        </div>

        {/* Currency Converter */}
        <div className="mb-8">
          <CurrencyConverter defaultFrom="FC" defaultTo="USD" defaultAmount={100} />
        </div>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <button className="btn btn-primary justify-start p-6">
            <Send className="w-5 h-5" />
            <span className="font-semibold">Send FC</span>
          </button>
          <button className="btn btn-outline justify-start p-6">
            <QrCode className="w-5 h-5" />
            <span className="font-semibold">Request Payment</span>
          </button>
          <button className="btn btn-outline justify-start p-6">
            <History className="w-5 h-5" />
            <span className="font-semibold">Transaction History</span>
          </button>
        </div>

        {/* PFI Display */}
        <div className="card p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Personal Fairness Index (PFI★)
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your contribution score to the FairCoin community
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* PFI Score Circle */}
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="url(#pfi-gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(75 / 100) * 553} 553`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="pfi-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-extrabold bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                      75
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      / 100
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PFI Breakdown */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Community Service
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    45 hours
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Community Attestations
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    12 attestations
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Account Age
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    180 days
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '50%' }} />
                </div>
              </div>

              <div className="pt-4">
                <button className="btn btn-outline btn-sm w-full">
                  <TrendingUp className="w-4 h-4" />
                  How to Improve Your PFI
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recent Transactions
            </h3>
            <button className="btn btn-ghost btn-sm">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {[
              { type: 'Received', from: 'alice', amount: '+50.00 FC', time: '2 hours ago', icon: '↓', color: 'text-emerald-500' },
              { type: 'Sent', from: 'bob_merchant', amount: '-25.50 FC', time: '1 day ago', icon: '↑', color: 'text-rose-500' },
              { type: 'Reward', from: 'FairCoin System', amount: '+10.00 FC', time: '3 days ago', icon: '★', color: 'text-amber-500' },
            ].map((tx, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl ${tx.color}`}>
                    {tx.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{tx.type}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{tx.from}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${tx.color}`}>{tx.amount}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{tx.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
