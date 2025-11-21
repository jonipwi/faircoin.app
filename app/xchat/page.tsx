'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, MessageCircle, AlertCircle } from 'lucide-react'
import { generateXChatToken, hasValidAuth } from '@/lib/xchat-token'
import { useLocalePath } from '@/lib/i18n/useLocalePath'

export default function XChatPage() {
  const router = useRouter()
  const localePath = useLocalePath()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [iframeUrl, setIframeUrl] = useState<string | null>(null)

  useEffect(() => {
    async function initializeChat() {
      const isDev = process.env.NODE_ENV === 'development'
      try {
        // Check authentication
        const auth = hasValidAuth()
        
        if (!auth.valid || !auth.username) {
          setError('Please log in to access the support chat')
          setLoading(false)
          return
        }

        if (isDev) console.log('[XChat] Generating token for user:', auth.username)

        // Generate encrypted token
        const encryptedToken = await generateXChatToken(auth.username, auth.wallet || '')
        setToken(encryptedToken)

        // Get xchat URL from environment
        const xchatUrl = process.env.NEXT_PUBLIC_XCHAT_URL || 'http://localhost:8088'
        
        // Create iframe URL with token
        const url = `${xchatUrl}/lite?token=${encryptedToken}`
        setIframeUrl(url)

        if (isDev) console.log('[XChat] Token generated, loading iframe')
        setLoading(false)
      } catch (err) {
        console.error('[XChat] Initialization error:', err)
        setError('Failed to initialize chat. Please try again.')
        setLoading(false)
      }
    }

    initializeChat()
  }, [])

  const handleLoginClick = () => {
    router.push(localePath('auth') as any)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary-500/10 dark:bg-primary-500/20 flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-primary-500 animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              Loading Support Chat...
            </h1>
            <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
          </div>
        </div>
      </main>
    )
  }

  if (error || !iframeUrl) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container py-20">
          <div className="max-w-2xl mx-auto">
            <div className="card p-12 text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center">
                {error?.includes('log in') ? (
                  <Lock className="w-10 h-10 text-red-500" />
                ) : (
                  <AlertCircle className="w-10 h-10 text-red-500" />
                )}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {error?.includes('log in') ? 'Authentication Required' : 'Access Denied'}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {error || 'You are not authorized to access this page.'}
              </p>
              <div className="flex gap-4 justify-center pt-4">
                {error?.includes('log in') && (
                  <button onClick={handleLoginClick} className="btn btn-primary btn-lg">
                    <Lock className="w-5 h-5" />
                    Login to Access Chat
                  </button>
                )}
                <button onClick={() => router.push(localePath('') as any)} className="btn btn-outline btn-lg">
                  Return Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="container flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-primary-500" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                FairCoin Support Chat
              </h1>
            </div>
            <button
              onClick={() => router.push(localePath('lite') as any)}
              className="btn btn-ghost btn-sm"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        {/* Chat iframe */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src={iframeUrl}
            className="w-full h-full border-0"
            title="FairCoin Support Chat"
            allow="clipboard-read; clipboard-write"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
        </div>
      </div>
    </main>
  )
}
