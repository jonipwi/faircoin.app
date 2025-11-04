"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Github, Shield, CheckCircle, ExternalLink, ArrowLeft, Sparkles, AlertTriangle } from 'lucide-react'
import { api, type AuthSession, type TermsResponse } from '@/lib/api'

function AuthPageContent() {
  const devMode = process.env.NEXT_PUBLIC_DEV_MODE || process.env.DEV_MODE
  const devModeMessage = process.env.NEXT_PUBLIC_DEV_MODE_MESSAGE || process.env.DEV_MODE_MESSAGE
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'login' | 'terms' | 'success'>('login')
  const [session, setSession] = useState<AuthSession | null>(null)
  const [terms, setTerms] = useState<TermsResponse['terms'] | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)

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

  // Load terms when needed
  useEffect(() => {
    if (step === 'terms' && !terms) {
      loadTerms()
    }
  }, [step, terms])



  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.auth.init()
      
      if (response.success) {
        // Redirect to GitHub OAuth
        window.location.href = response.auth_url
      } else {
        setError('Failed to initialize authentication')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start authentication')
      setLoading(false)
    }
  }

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
        
        // Store session token for dashboard access
        if (session.id) {
          localStorage.setItem('auth_token', session.id)
          // Also set as cookie for server-side access
          document.cookie = `session=${session.id}; path=/; max-age=${24*60*60}; secure=${location.protocol === 'https:'}; samesite=strict`
        }
        
        // Redirect to dashboard after delay
        setTimeout(() => {
          router.push('/dashboard')
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

  const renderLoginStep = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800">
          <Shield className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
            Secure Authentication
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
            FairCoin
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Join our community-driven fair transaction system. Sign in with GitHub to get started.
        </p>
      </div>

      <div className="card p-8 max-w-md mx-auto">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Sign In / Register
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Use your GitHub account to access FairCoin
            </p>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full btn btn-primary btn-lg group"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                <span>Connecting to GitHub...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Github className="w-5 h-5" />
                <span>Continue with GitHub</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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

  const renderTermsStep = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <button
          onClick={() => setStep('login')}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </button>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
          Terms & Conditions
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Please read and accept our terms to complete your registration
        </p>
        
        {session && (
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={session.avatar_url}
              alt={session.username}
              className="w-6 h-6 rounded-full"
            />
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
                onClick={() => setStep('login')}
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

        {step === 'login' && renderLoginStep()}
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