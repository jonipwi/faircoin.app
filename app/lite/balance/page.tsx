"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, ExternalLink } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

type Transaction = {
  id: string
  type: 'sent' | 'received'
  amount: string
  contact: string
  date: string
}

export default function LiteBalance() {
  const { user } = useAuth()
  const [balance, setBalance] = useState<string>('0')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with actual API call from lib/api.ts
    const fetchBalance = async () => {
      await new Promise(resolve => setTimeout(resolve, 500))
      setBalance('1,250.50')
      setTransactions([
        {
          id: '1',
          type: 'received',
          amount: '100.00',
          contact: 'John Elder',
          date: '2 hours ago'
        },
        {
          id: '2',
          type: 'sent',
          amount: '25.50',
          contact: 'Maria Santos',
          date: 'Yesterday'
        },
        {
          id: '3',
          type: 'received',
          amount: '500.00',
          contact: 'David Chen',
          date: '3 days ago'
        }
      ])
      setLoading(false)
    }
    fetchBalance()
  }, [])

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            My Balance
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400">
            {user?.username}&apos;s FairCoin wallet
          </p>
        </div>

        {/* Balance Card */}
        <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-accent-600 p-8 sm:p-12 mb-8 text-center shadow-2xl text-white">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <p className="text-2xl mb-4 opacity-90">Total Balance</p>
              <p className="text-6xl sm:text-7xl font-extrabold mb-2">
                {balance}
              </p>
              <p className="text-3xl opacity-90">FC</p>
              <div className="mt-8 flex items-center justify-center gap-2 text-green-200">
                <TrendingUp className="w-6 h-6" />
                <span className="text-xl font-semibold">+12.5% this month</span>
              </div>
            </>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-primary-600 dark:text-primary-400 text-lg font-semibold hover:underline"
            >
              View All
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-100 dark:bg-gray-700 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center ${
                    tx.type === 'received'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  }`}>
                    {tx.type === 'received' ? (
                      <ArrowDownLeft className="w-7 h-7 sm:w-8 sm:h-8" />
                    ) : (
                      <ArrowUpRight className="w-7 h-7 sm:w-8 sm:h-8" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {tx.type === 'received' ? 'Received from' : 'Sent to'} {tx.contact}
                    </p>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                      {tx.date}
                    </p>
                  </div>
                  <p className={`text-2xl sm:text-3xl font-bold ${
                    tx.type === 'received'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {tx.type === 'received' ? '+' : '-'}{tx.amount} FC
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/lite/send"
            className="py-6 px-8 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl font-bold text-center hover:from-green-600 hover:to-emerald-600 transition-all shadow-xl hover:shadow-2xl"
          >
            Send FairCoin
          </Link>
          <Link
            href="/lite/receive"
            className="py-6 px-8 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold text-center hover:from-purple-600 hover:to-pink-600 transition-all shadow-xl hover:shadow-2xl"
          >
            Receive FairCoin
          </Link>
        </div>
      </div>
    </div>
  )
}
