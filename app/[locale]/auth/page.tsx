"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Wallet as WalletIcon, Shield, CheckCircle, ArrowLeft, Sparkles, AlertTriangle, Copy, Eye, EyeOff, Download } from 'lucide-react'
import { api, type AuthSession, type TermsResponse } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { useLocalePath } from '@/lib/i18n/useLocalePath'

function AuthPageContent() {
  const devMode = process.env.NEXT_PUBLIC_DEV_MODE || process.env.DEV_MODE
  const devModeMessage = process.env.NEXT_PUBLIC_DEV_MODE_MESSAGE || process.env.DEV_MODE_MESSAGE
  const router = useRouter()
  const searchParams = useSearchParams()
  const localePath = useLocalePath()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'choice' | 'register' | 'login' | 'mnemonic' | 'terms' | 'success'>('choice')
  const [session, setSession] = useState<AuthSession | null>(null)
  const [terms, setTerms] = useState<TermsResponse['terms'] | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [mnemonic, setMnemonic] = useState('')
  const [showMnemonic, setShowMnemonic] = useState(false)
  const [mnemonicWords, setMnemonicWords] = useState<string[]>([])
  const [generatedUsername, setGeneratedUsername] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [registeredUserId, setRegisteredUserId] = useState<number | null>(null)
  const [copiedMnemonic, setCopiedMnemonic] = useState(false)

  // Handle OAuth callback and success/error states
  useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')
    const user = searchParams.get('user')
    const email = searchParams.get('email')
    const avatar = searchParams.get('avatar')
    const sessionId = searchParams.get('session_id')
    
    if (error) {
      const message = searchParams.get('message')
      const errorMessages: { [key: string]: string } = {
        oauth_error: message || 'GitHub OAuth authentication was cancelled or failed',
        missing_params: 'OAuth parameters are missing',
        auth_failed: message || 'Authentication failed',
        server_error: message || 'Internal server error',
      }
      setError(errorMessages[error] || message || 'Authentication failed')
    } else if (success === 'true' && user) {
      // Successfully authenticated, create session object
      const userId = searchParams.get('user_id')
      const authSession: AuthSession = {
        id: sessionId || '',
        user_id: userId ? parseInt(userId) : Date.now(), // Use provided user_id or fallback
        username: user,
        email: email || '', // Email can be empty
        avatar_url: avatar || '',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      }
      
      setSession(authSession)
      setStep('terms')
      
      // Clear URL parameters
      window.history.replaceState({}, '', '/auth')
    }
  }, [searchParams])

  const handleRegisterWallet = async () => {
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters)')
      return
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Call backend API directly instead of Next.js API route
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://faircoin-api.bixio.xyz/sandbox'
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/wallet/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName.trim(), email: email.trim() }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedUsername(data.username)
        setWalletAddress(data.wallet_address)
        setMnemonicWords(data.mnemonic.split(' '))
        setRegisteredUserId(data.user_id) // Store the actual user ID
        setStep('mnemonic')
      } else {
        setError(data.error || 'Failed to create wallet')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create wallet')
    } finally {
      setLoading(false)
    }
  }

  const handleLoginWallet = async () => {
    const words = mnemonic.trim().split(/\s+/)
    if (words.length !== 12) {
      setError('Secret phrase must be exactly 12 words')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Call backend API directly instead of Next.js API route
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://faircoin-api.bixio.xyz/sandbox'
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/wallet/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mnemonic: mnemonic.trim() }),
      })

      const data = await response.json()

      if (data.success && data.session) {
        const sessionData = {
          id: data.session.session_token,
          user_id: data.session.user_id,
          username: data.session.username,
          full_name: data.session.full_name,
          email: data.session.email || '',
          avatar_url: data.session.avatar_url || '',
          wallet_address: data.session.wallet_address,
          created_at: data.session.created_at,
          expires_at: data.session.expires_at,
        }
        setSession(sessionData)
        localStorage.setItem('auth_token', data.session.session_token)
        localStorage.setItem('user', JSON.stringify({
          username: data.session.username,
          full_name: data.session.full_name,
          email: data.session.email,
          avatar_url: data.session.avatar_url,
          wallet_address: data.session.wallet_address,
        }))
        window.dispatchEvent(new Event('authStateChanged'))

        if (data.terms_accepted) {
          router.push(localePath('lite') as any)
        } else {
          setStep('terms')
        }
      } else {
        setError(data.error || 'Invalid secret phrase')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  const copyMnemonicToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(mnemonicWords.join(' '))
      setCopiedMnemonic(true)
      setTimeout(() => setCopiedMnemonic(false), 2000)
    } catch (error) {
      console.error('Failed to copy mnemonic:', error)
    }
  }

  const downloadMnemonic = () => {
    const content = `FairCoin Wallet Backup
========================

Username: ${generatedUsername}
Wallet Address: ${walletAddress}

Secret Phrase (12 words):
${mnemonicWords.join(' ')}

IMPORTANT:
- Keep this secret phrase safe and secure
- Never share it with anyone
- Anyone with this phrase can access your wallet
- Store it offline in a secure location

Created: ${new Date().toISOString()}
`

    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `faircoin-wallet-${walletAddress.substring(0, 8)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const proceedToTerms = () => {
    if (!registeredUserId) {
      setError('User ID not found. Please try registering again.')
      return
    }
    const authSession: AuthSession = {
      id: '',
      user_id: registeredUserId, // Use the actual user ID from registration
      username: generatedUsername,
      email: email,
      avatar_url: '',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }
    setSession(authSession)
    setStep('terms')
  }

  // Load terms when needed
  useEffect(() => {
    if (step === 'terms' && !terms) {
      loadTerms()
    }
  }, [step, terms])





  const loadTerms = async () => {
    try {
      const response = await api.auth.terms()
      setTerms(response.terms)
    } catch (err) {
      setError('Failed to load terms and conditions')
    }
  }

  const handleAcceptTerms = async () => {
    if (!session || !terms) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.auth.acceptTerms({
        user_id: session.user_id,
        version: terms.version,
        session_id: session.id,
      })
      
      if (response.success) {
        setStep('success')
        
        // Store session token for dashboard access (from backend response)
        const sessionId = response.session_id || session.id
        if (sessionId) {
          localStorage.setItem('auth_token', sessionId)
          // Also set as cookie for server-side access
          document.cookie = `session=${sessionId}; path=/; max-age=${24*60*60}; secure=${location.protocol === 'https:'}; samesite=strict`
          
          // Store user info for chat widget and other components
          localStorage.setItem('user', JSON.stringify({
            username: session.username,
            full_name: session.full_name,
            email: session.email,
            avatar_url: session.avatar_url,
            wallet_address: session.wallet_address,
          }))
          window.dispatchEvent(new Event('authStateChanged'))
        }
        
        // Redirect to lite page after delay
        setTimeout(() => {
          router.push(localePath('lite') as any)
        }, 2000)
      } else {
        setError(response.message || 'Failed to accept terms')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept terms')
    } finally {
      setLoading(false)
    }
  }

  const renderChoiceStep = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800">
          <Shield className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
            Secure Wallet Authentication
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
            FairCoin
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Create a new wallet or login with your 12-word secret phrase
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <button
          onClick={() => setStep('register')}
          className="card p-8 hover:shadow-xl transition-all group"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <WalletIcon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Wallet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start your FairCoin journey by creating a secure wallet with a 12-word secret phrase
          </p>
        </button>

        <button
          onClick={() => setStep('login')}
          className="card p-8 hover:shadow-xl transition-all group"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Login with Secret Phrase
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Access your existing wallet using your 12-word secret phrase
          </p>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
        <div className="card p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Light & Truth</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Complete transparency in all transactions and governance decisions
          </p>
        </div>

        <div className="card p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Love & Mercy</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Compassionate community support and second chances for all
          </p>
        </div>

        <div className="card p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Just & Peace</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Fair resource distribution and equitable economic opportunities
          </p>
        </div>
      </div>
    </div>
  )

  const renderRegisterStep = () => (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <button
          onClick={() => setStep('choice')}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
          Create Your Wallet
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Enter your details to generate a unique username and wallet
        </p>
      </div>

      <div className="card p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              A unique username will be automatically generated from your name
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Required for account recovery and important notifications
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900 dark:text-amber-100">
                <p className="font-semibold mb-1">Important Security Information</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>You will receive a 12-word secret phrase</li>
                  <li>This phrase is the ONLY way to access your wallet</li>
                  <li>Write it down and store it securely offline</li>
                  <li>Never share it with anyone</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={handleRegisterWallet}
            disabled={loading || !fullName.trim() || !email.trim()}
            className="w-full btn btn-primary btn-lg"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                <span>Creating Wallet...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <WalletIcon className="w-5 h-5" />
                <span>Create Wallet</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  const renderLoginStep = () => (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <button
          onClick={() => setStep('choice')}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
          Login to Your Wallet
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Enter your 12-word secret phrase to access your wallet
        </p>
      </div>

      <div className="card p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Secret Phrase (12 words) *
            </label>
            <div className="relative">
              <textarea
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                placeholder="Enter your 12-word secret phrase (separated by spaces)"
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                disabled={loading}
                style={{ filter: showMnemonic ? 'none' : 'blur(5px)' }}
              />
              <button
                type="button"
                onClick={() => setShowMnemonic(!showMnemonic)}
                className="absolute top-3 right-3 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showMnemonic ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Word count: {mnemonic.trim().split(/\s+/).filter(w => w.length > 0).length}/12
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <p className="font-semibold mb-1">Security Tips</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Make sure you&apos;re on the correct website</li>
                  <li>Never enter your phrase on untrusted sites</li>
                  <li>Use the eye icon to verify your phrase before submitting</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={handleLoginWallet}
            disabled={loading || mnemonic.trim().split(/\s+/).length !== 12}
            className="w-full btn btn-primary btn-lg"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                <span>Logging In...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5" />
                <span>Login with Secret Phrase</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  const renderMnemonicStep = () => (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
          Wallet Created Successfully!
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Save your secret phrase - this is the ONLY way to access your wallet
        </p>
      </div>

      <div className="card p-8 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-gray-800 dark:to-gray-700 border-2 border-amber-300 dark:border-amber-700">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Your Account Details
            </h2>
          </div>

          <div className="space-y-3">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Username (auto-generated)</p>
              <p className="text-lg font-mono font-bold text-gray-900 dark:text-white">{generatedUsername}</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Wallet Address</p>
              <p className="text-sm font-mono text-gray-900 dark:text-white break-all">{walletAddress}</p>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-500 dark:border-red-700 rounded-lg p-6">
            <div className="flex gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
              <div>
                <p className="font-bold text-red-900 dark:text-red-100 mb-2">
                  ⚠️ CRITICAL: Save Your Secret Phrase NOW
                </p>
                <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                  This will be shown ONLY ONCE. If you lose it, you will lose access to your wallet forever!
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Your 12-Word Secret Phrase:</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {mnemonicWords.map((word, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-6">{index + 1}.</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">{word}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={copyMnemonicToClipboard}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  {copiedMnemonic ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedMnemonic ? 'Copied!' : 'Copy to Clipboard'}</span>
                </button>

                <button
                  onClick={downloadMnemonic}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Backup</span>
                </button>
              </div>
            </div>

            <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>Write these words down on paper in order</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>Store the paper in a secure location (safe, vault)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>Never share these words with anyone</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>Anyone with these words can access your wallet and funds</span>
              </li>
            </ul>
          </div>

          <button
            onClick={proceedToTerms}
            className="w-full btn btn-primary btn-lg"
          >
            I have saved my secret phrase - Continue
          </button>
        </div>
      </div>
    </div>
  )

  const renderTermsStep = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <button
          onClick={() => setStep('choice')}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
          Terms & Conditions
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Please read and accept our terms to complete your registration
        </p>
        
        {session && (
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
            <WalletIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Welcome, {session.username}!
            </span>
          </div>
        )}
      </div>

      <div className="card p-8">
        {terms && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-primary-500" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  FairCoin Terms of Service
                </h2>
                <p className="text-sm text-gray-500">
                  Version {terms.version} • Last updated: {new Date(terms.last_updated).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {terms.sections.map((section, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {index + 1}. {section.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <div className="text-sm">
                  <span className="text-gray-900 dark:text-white font-medium">
                    I have read and agree to the Terms of Service
                  </span>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    By accepting, you commit to uphold FairCoin&apos;s principles of Light & Truth, Love & Mercy, and Just & Peace.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep('choice')}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptTerms}
                disabled={!termsAccepted || loading}
                className="btn btn-primary flex-1"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Accepting...</span>
                  </div>
                ) : (
                  'Accept & Continue'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderSuccessStep = () => (
    <div className="text-center space-y-8 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
          Welcome to FairCoin!
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Your account has been created successfully. You&apos;re now part of the FairCoin community.
        </p>
      </div>

      <div className="card p-6 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-950/50 dark:to-accent-950/50 border border-primary-200 dark:border-primary-800">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            What&apos;s Next?
          </h2>
          <ul className="space-y-2 text-left">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-gray-600 dark:text-gray-400">Set up your wallet</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-gray-600 dark:text-gray-400">Complete your profile</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-gray-600 dark:text-gray-400">Start earning PFI through community participation</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        Redirecting to dashboard in a moment...
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Staging/Development Environment Warning Banner */}
      {devMode && devMode !== 'production' && (
        <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 shadow-lg">
          <div className="container py-4">
            <div className="flex items-center justify-center gap-3 text-white">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
              <div className="text-center">
                <p className="font-bold uppercase tracking-wide text-sm">
                  {devMode.toUpperCase()} ENVIRONMENT - NOT A PHISHING SITE
                </p>
                <p className="text-sm font-medium">
                  {devModeMessage?.replace(/"/g, '') || 'This is a development/testing environment'}
                </p>
              </div>
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container py-12 md:py-20">
        {error && (
          <div className="max-w-md mx-auto mb-8">
            <div className="card p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <span className="text-red-600 dark:text-red-400 text-sm">⚠️</span>
                </div>
                <div>
                  <h3 className="font-medium text-red-900 dark:text-red-100">
                    Authentication Error
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'choice' && renderChoiceStep()}
        {step === 'register' && renderRegisterStep()}
        {step === 'login' && renderLoginStep()}
        {step === 'mnemonic' && renderMnemonicStep()}
        {step === 'terms' && renderTermsStep()}
        {step === 'success' && renderSuccessStep()}
      </div>
    </main>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">Loading authentication...</p>
        </div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  )
}