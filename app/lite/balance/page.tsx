"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Wallet, TrendingUp, PieChart, Download, Copy, Check, Send, QrCode } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface PFIMetrics {
  score: number
  index: number
  share: number
}

interface WalletInfo {
  address: string
  balances: {
    USDT: number
  }
  createdAt: Date
}

const API_BASE_URL = process.env.NEXT_PUBLIC_FAIRCOIN_API_URL || 'https://faircoin-api.bixio.xyz'

export default function LiteBalance() {
  const { user, checkAuth } = useAuth()
  const [wallet, setWallet] = useState<WalletInfo | null>(null)
  const [pfiMetrics, setPfiMetrics] = useState<PFIMetrics>({
    score: 0,
    index: 0,
    share: 0
  })
  const [loading, setLoading] = useState(true)
  const [isCreatingWallet, setIsCreatingWallet] = useState(false)
  const [copied, setCopied] = useState(false)

  // Fetch PFI metrics from FairCoin API
  const fetchPFIMetrics = async () => {
    if (!user?.username) return
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/fairness/indexes?user=${encodeURIComponent(user.username)}`)
      
      if (response.ok) {
        const text = await response.text()
        if (!text || text.trim() === '') {
          console.log('[PFI] Empty response from API, using default metrics')
          setPfiMetrics({ score: 0, index: 0, share: 0 })
          return
        }
        
        try {
          const data = JSON.parse(text)
          if (data.success && data.index) {
            setPfiMetrics({
              score: data.index.pfi_total || 0,
              index: data.index.total_fairness_score || 0,
              share: data.index.approved_submissions || 0
            })
          } else {
            setPfiMetrics({ score: 0, index: 0, share: 0 })
          }
        } catch (parseError) {
          console.error('[PFI] Failed to parse JSON:', parseError)
          setPfiMetrics({ score: 0, index: 0, share: 0 })
        }
      } else {
        console.log(`[PFI] API returned status ${response.status}, using default metrics`)
        setPfiMetrics({ score: 0, index: 0, share: 0 })
      }
    } catch (error) {
      console.error('[PFI] Error fetching metrics:', error)
      setPfiMetrics({ score: 0, index: 0, share: 0 })
    }
  }

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    const loadData = async () => {
      if (user?.username) {
        console.log('[Balance] Loading wallet for user:', user.username, 'wallet_address:', user.wallet_address)
        console.log('[Balance] Full user object:', user)
        
        // Load wallet from localStorage
        const savedWallet = localStorage.getItem('wallet')
        if (savedWallet) {
          try {
            const parsedWallet = JSON.parse(savedWallet)
            setWallet(parsedWallet)
            console.log('[Balance] Loaded saved wallet from localStorage:', parsedWallet)
          } catch (e) {
            console.error('Failed to parse saved wallet:', e)
          }
        } else if (user.wallet_address) {
          // If user has wallet_address from auth but no wallet object, create it
          const walletFromAuth: WalletInfo = {
            address: user.wallet_address,
            balances: { USDT: 0 },
            createdAt: new Date()
          }
          setWallet(walletFromAuth)
          localStorage.setItem('wallet', JSON.stringify(walletFromAuth))
          console.log('[Balance] Created wallet from auth wallet_address:', user.wallet_address)
        } else {
          // Check if user object in localStorage has wallet_address
          const storedUser = localStorage.getItem('user')
          console.log('[Balance] No wallet_address in user object, checking localStorage user:', storedUser)
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser)
              console.log('[Balance] Parsed user from localStorage:', userData)
              if (userData.wallet_address) {
                const walletFromStorage: WalletInfo = {
                  address: userData.wallet_address,
                  balances: { USDT: 0 },
                  createdAt: new Date()
                }
                setWallet(walletFromStorage)
                localStorage.setItem('wallet', JSON.stringify(walletFromStorage))
                console.log('[Balance] Created wallet from localStorage user wallet_address:', userData.wallet_address)
              }
            } catch (e) {
              console.error('[Balance] Failed to parse user from localStorage:', e)
            }
          }
          console.log('[Balance] No wallet found and no wallet_address available')
        }
        
        // Fetch PFI metrics
        await fetchPFIMetrics()
      }
      setLoading(false)
    }
    
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const createWallet = async () => {
    if (!user?.username) return
    
    setIsCreatingWallet(true)
    
    try {
      const xchatAPI = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8088'
      const response = await fetch(`${xchatAPI}/api/wallet/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username })
      })
      
      const data = await response.json()
      
      if (data.success && data.data) {
        const newWallet: WalletInfo = {
          address: data.data.address,
          balances: { USDT: data.data.balances?.USDT || 0 },
          createdAt: new Date()
        }
        
        setWallet(newWallet)
        localStorage.setItem('wallet', JSON.stringify(newWallet))
        
        // Update user object with wallet_address
        if (user) {
          const updatedUser = { ...user, wallet_address: data.data.address }
          localStorage.setItem('user', JSON.stringify(updatedUser))
          // Trigger auth state refresh
          window.dispatchEvent(new Event('authStateChanged'))
        }
        
        if (data.data.secretPhrase) {
          localStorage.setItem(`wallet_phrase_${data.data.address}`, data.data.secretPhrase)
          alert(
            `Treasury Created!\n\n` +
            `IMPORTANT: Save your secret phrase!\n\n` +
            `${data.data.secretPhrase}\n\n` +
            `Write it down and keep it safe!`
          )
        }
      } else {
        alert(data.error || 'Failed to create treasury')
      }
    } catch (error) {
      console.error('Failed to create wallet:', error)
      alert('Failed to create treasury. Please try again.')
    } finally {
      setIsCreatingWallet(false)
    }
  }

  const copyToClipboard = async () => {
    if (!wallet) return
    
    try {
      await navigator.clipboard.writeText(wallet.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy address:', error)
    }
  }

  const downloadWalletDetails = () => {
    if (!wallet || !user?.username) return

    const secretPhrase = localStorage.getItem(`wallet_phrase_${wallet.address}`) || 
                        'Secret phrase not available'

    const walletDetails = `FAIRCOIN - PFI TREASURY
========================

Username: ${user.username}
Address: ${wallet.address}

Secret Phrase:
${secretPhrase}

PFI METRICS:
- Score: ${pfiMetrics.score}
- Index: ${pfiMetrics.index.toFixed(1)}%
- Share: ${pfiMetrics.share}

Created: ${new Date().toISOString()}
`

    const blob = new Blob([walletDetails], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `faircoin-pfi-${wallet.address.substring(0, 8)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            PFI Treasury ✨
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400">
            {user?.username}&apos;s Personal Fairness Index
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !wallet ? (
          <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-8 sm:p-12 shadow-xl text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Wallet className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create Your PFI Treasury
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Your treasury stores your Personal Fairness Index metrics and community tokens.
              We're not a cryptocurrency platform - we measure fairness!
            </p>
            <button
              onClick={createWallet}
              disabled={isCreatingWallet}
              className="w-full py-6 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-2xl font-bold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-xl disabled:opacity-50"
            >
              {isCreatingWallet ? 'Creating...' : 'Create PFI Treasury'}
            </button>
          </div>
        ) : (
          <>
            {/* Treasury Address */}
            <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 shadow-xl">
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">Treasury Address</p>
              <div className="flex items-center gap-3">
                <p className="text-base text-gray-800 dark:text-white font-mono break-all flex-1">
                  {wallet.address}
                </p>
                <button
                  onClick={copyToClipboard}
                  className="flex-shrink-0 py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors flex items-center gap-2 font-semibold"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Token Balance Card */}
            <div className="rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 p-8 sm:p-12 mb-8 text-center shadow-2xl text-white">
              <p className="text-2xl mb-4 opacity-90">Tokens Entrusted ✨</p>
              <p className="text-6xl sm:text-7xl font-extrabold mb-2">
                {wallet.balances.USDT.toFixed(4)}
              </p>
              <p className="text-3xl opacity-90">USDT</p>
              <p className="text-lg mt-4 opacity-80">
                Faith, Love & Justice in Heaven's Network
              </p>
            </div>

            {/* Send & Receive Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Link
                href="/lite/send"
                className="py-6 px-8 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <Send className="w-6 h-6" />
                Send
              </Link>
              <Link
                href="/lite/receive"
                className="py-6 px-8 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <QrCode className="w-6 h-6" />
                Receive
              </Link>
            </div>

            {/* PFI Metrics */}
            <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Personal Fairness Index (PFI★)
              </h2>

              <div className="space-y-6">
                {/* PFI Score */}
                <div className="border-4 border-emerald-200 dark:border-emerald-700 rounded-2xl p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-700 dark:to-gray-600">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xl text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
                      PFI Score
                      <span className="text-amber-500">✨</span>
                    </p>
                    <PieChart className="w-10 h-10 text-emerald-500" />
                  </div>
                  <p className="text-5xl sm:text-6xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-3">
                    {pfiMetrics.score}
                  </p>
                  <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                    <div
                      className="bg-emerald-500 h-4 rounded-full transition-all"
                      style={{ width: `${(pfiMetrics.score / 1000) * 100}%` }}
                    />
                  </div>
                </div>

                {/* PFI Index */}
                <div className="border-4 border-blue-200 dark:border-blue-700 rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xl text-gray-700 dark:text-gray-300 font-semibold">
                      PFI Index
                    </p>
                    <TrendingUp className="w-10 h-10 text-blue-500" />
                  </div>
                  <p className="text-5xl sm:text-6xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">
                    {pfiMetrics.index.toFixed(1)}%
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Performance Indicator
                  </p>
                </div>

                {/* PFI Share */}
                <div className="border-4 border-purple-200 dark:border-purple-700 rounded-2xl p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xl text-gray-700 dark:text-gray-300 font-semibold">
                      PFI Share
                    </p>
                    <Wallet className="w-10 h-10 text-purple-500" />
                  </div>
                  <p className="text-5xl sm:text-6xl font-extrabold text-purple-600 dark:text-purple-400 mb-2">
                    {pfiMetrics.share.toFixed(2)}
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Approved Submissions
                  </p>
                </div>
              </div>

              <button
                onClick={fetchPFIMetrics}
                className="w-full mt-6 py-5 px-6 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-2xl hover:from-primary-600 hover:to-accent-600 text-xl font-bold shadow-xl"
              >
                <TrendingUp className="w-6 h-6 inline mr-2" />
                Refresh PFI Metrics
              </button>
            </div>

            {/* Spiritual Note */}
            <div className="rounded-3xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-4 border-amber-200 dark:border-amber-700 p-6 sm:p-8 mb-8 shadow-xl">
              <p className="text-xl text-amber-900 dark:text-amber-100 text-center leading-relaxed">
                ✨ <span className="font-bold">Remember:</span> Tokens stored through{' '}
                <span className="font-bold text-amber-700 dark:text-amber-300">Faith</span>,{' '}
                <span className="font-bold text-amber-700 dark:text-amber-300">Love</span>, and{' '}
                <span className="font-bold text-amber-700 dark:text-amber-300">Justice</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={downloadWalletDetails}
                className="py-6 px-8 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-xl flex items-center justify-center gap-3"
              >
                <Download className="w-6 h-6" />
                Download Details
              </button>
              <Link
                href="/lite"
                className="py-6 px-8 rounded-2xl bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all shadow-xl text-center"
              >
                Back to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
