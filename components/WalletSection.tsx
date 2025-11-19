"use client"

import { useState, useEffect } from 'react'
import { Wallet, TrendingUp, Lock, Award, PieChart, Download, Copy, Check } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { useLocalePath } from '@/lib/i18n/useLocalePath'

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

export function WalletSection() {
  const { isAuthenticated, user, loading, checkAuth } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const localePath = useLocalePath()
  const [wallet, setWallet] = useState<WalletInfo | null>(null)
  const [pfiMetrics, setPfiMetrics] = useState<PFIMetrics>({
    score: 0,
    index: 0,
    share: 0
  })
  const [isCreatingWallet, setIsCreatingWallet] = useState(false)
  const [copied, setCopied] = useState(false)

  // Refresh auth state on component mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Fetch PFI metrics from FairCoin API
  const fetchPFIMetrics = async () => {
    if (!user?.username) return
    
    try {
      console.log(`[PFI] Fetching metrics for user: ${user.username}`)
      const response = await fetch(`${API_BASE_URL}/api/v1/fairness/indexes?user=${encodeURIComponent(user.username)}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('[PFI] API response:', data)
        
        if (data.success && data.index) {
          setPfiMetrics({
            score: data.index.pfi_total || 0,
            index: data.index.total_fairness_score || 0,
            share: data.index.approved_submissions || 0
          })
        } else {
          setPfiMetrics({ score: 0, index: 0, share: 0 })
        }
      } else {
        console.error(`[PFI] API failed with status ${response.status}`)
        setPfiMetrics({ score: 0, index: 0, share: 0 })
      }
    } catch (error) {
      console.error('[PFI] Error fetching metrics:', error)
      setPfiMetrics({ score: 0, index: 0, share: 0 })
    }
  }

  // Load wallet and fetch PFI metrics on mount
  useEffect(() => {
    if (user?.username) {
      // Load wallet from localStorage if exists
      const savedWallet = localStorage.getItem('wallet')
      if (savedWallet) {
        try {
          setWallet(JSON.parse(savedWallet))
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
      }
      
      // Fetch PFI metrics
      fetchPFIMetrics()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const createWallet = async () => {
    if (!user?.username) return
    
    setIsCreatingWallet(true)
    
    try {
      // Create wallet through xchat API
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
        
        // Save secret phrase
        if (data.data.secretPhrase) {
          localStorage.setItem(`wallet_phrase_${data.data.address}`, data.data.secretPhrase)
          alert(
            `Wallet Created Successfully!\n\n` +
            `IMPORTANT: Save your secret phrase securely!\n\n` +
            `Secret Phrase:\n${data.data.secretPhrase}\n\n` +
            `This will NEVER be shown again. Write it down and keep it safe!\n\n` +
            `Use the "Download Wallet Details" button to save this information.`
          )
        }
      } else {
        alert(data.error || 'Failed to create wallet')
      }
    } catch (error) {
      console.error('Failed to create wallet:', error)
      alert('Failed to create wallet. Please try again.')
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
                        'Secret phrase not available (only shown once during creation)'

    const walletDetails = `FAIRCOIN - PFI TREASURY DETAILS
========================

Username: ${user.username}
Treasury Address: ${wallet.address}
Network: FairCoin Network

Secret Phrase (BIP39 Mnemonic):
${secretPhrase}

PFI METRICS:
- PFI Score: ${pfiMetrics.score}
- PFI Index: ${pfiMetrics.index.toFixed(1)}%
- PFI Share: ${pfiMetrics.share}

IMPORTANT SECURITY NOTES:
- Never share your secret phrase with anyone
- Store this file in a secure location
- Delete this file after backing up to a secure location
- Anyone with access to your secret phrase can access your treasury

Created: ${new Date().toISOString()}
`

    const blob = new Blob([walletDetails], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `faircoin-pfi-wallet-${wallet.address.substring(0, 8)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleLogin = () => {
    router.push(localePath('auth') as any)
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

  return (
    <section id="wallet" className="section bg-white/5 dark:bg-gray-900/30 backdrop-blur-sm">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            PFI Treasury ✨
          </h2>
          <p className="text-xl text-white/80">
            {t('wallet.subtitle')}
          </p>
        </div>

        {/* Wallet Creation or Display */}
        {!wallet || !isAuthenticated ? (
          <div className="max-w-2xl mx-auto">
            <div className="card p-12 text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Wallet className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('wallet.createTreasury')}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {t('wallet.treasuryDescription')}
              </p>
              <button
                onClick={handleLogin}
                className="btn btn-primary btn-lg w-full"
              >
                <Wallet className="w-5 h-5" />
                {t('wallet.loginToWallet') || 'Create or Access Your Treasury'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Wallet Address */}
            <div className="card p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                  Treasury Address
                </h3>
                <Wallet className="w-6 h-6 text-primary-500" />
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-800 dark:text-white font-mono break-all flex-1">
                  {wallet.address}
                </p>
                <button
                  onClick={copyToClipboard}
                  className="btn btn-ghost btn-sm flex items-center gap-2"
                  title="Copy address"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Token Balance */}
            <div className="card p-8 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                  Tokens Entrusted ✨
                </h3>
                <TrendingUp className="w-6 h-6 text-amber-500" />
              </div>
              <p className="text-5xl font-extrabold text-amber-600 dark:text-amber-400 mb-2">
                {wallet.balances.USDT.toFixed(4)} USDT
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Faith, Love, and Justice tokens stored in Heaven's Network
              </p>
            </div>

            {/* PFI Metrics Section */}
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

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                {/* PFI Score */}
                <div className="border dark:border-gray-700 rounded-xl p-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-700 dark:to-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                      PFI Score
                      <span className="text-amber-500">✨</span>
                    </p>
                    <PieChart className="w-8 h-8 text-emerald-500" />
                  </div>
                  <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                    {pfiMetrics.score}
                  </p>
                  <div className="mt-3 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${(pfiMetrics.score / 1000) * 100}%` }}
                    />
                  </div>
                </div>

                {/* PFI Index */}
                <div className="border dark:border-gray-700 rounded-xl p-5 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      PFI Index
                    </p>
                    <TrendingUp className="w-8 h-8 text-blue-500" />
                  </div>
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {pfiMetrics.index.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Performance Indicator
                  </p>
                </div>

                {/* PFI Share */}
                <div className="border dark:border-gray-700 rounded-xl p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      PFI Share
                    </p>
                    <Wallet className="w-8 h-8 text-amber-500" />
                  </div>
                  <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                    {pfiMetrics.share.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Approved Submissions
                  </p>
                </div>
              </div>

              <button
                onClick={fetchPFIMetrics}
                className="btn btn-primary w-full"
              >
                <TrendingUp className="w-5 h-5" />
                Refresh PFI Metrics
              </button>
            </div>

            {/* Spiritual Note */}
            <div className="card p-6 mb-8 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-2 border-amber-200 dark:border-amber-700">
              <p className="text-base text-amber-900 dark:text-amber-100 text-center leading-relaxed">
                ✨ <span className="font-semibold">Remember:</span> Your tokens are stored through{' '}
                <span className="font-semibold text-amber-700 dark:text-amber-300">Faith</span>,{' '}
                <span className="font-semibold text-amber-700 dark:text-amber-300">Love</span>, and{' '}
                <span className="font-semibold text-amber-700 dark:text-amber-300">Justice</span> in Heaven's Network
              </p>
            </div>

            {/* Download Wallet Details */}
            <div className="flex justify-center">
              <button
                onClick={downloadWalletDetails}
                className="btn btn-outline flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Treasury Details
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
