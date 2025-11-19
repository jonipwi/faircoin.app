"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Download, Smartphone, Check, ArrowRight } from 'lucide-react'

export default function InstallPage() {
  const router = useRouter()
  const params = useParams()
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [installStatus, setInstallStatus] = useState<'detecting' | 'ready' | 'installing' | 'installed' | 'not-available'>('detecting')
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if already running as PWA
    const checkStandalone = () => {
      const isStandalonePWA = window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes('android-app://')
      
      setIsStandalone(isStandalonePWA)
      
      if (isStandalonePWA) {
        setInstallStatus('installed')
        // Redirect to home after 3 seconds
        setTimeout(() => {
          router.push(`/${params.locale}/lite` as any)
        }, 3000)
      }
    }

    checkStandalone()

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setInstallStatus('ready')
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Check if install prompt didn't fire after 2 seconds
    const timeout = setTimeout(() => {
      if (!deferredPrompt && !isStandalone) {
        setInstallStatus('not-available')
      }
    }, 2000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      clearTimeout(timeout)
    }
  }, [deferredPrompt, isStandalone, router])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    setInstallStatus('installing')
    
    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setInstallStatus('installed')
        setDeferredPrompt(null)
        // Redirect to home after successful install
        setTimeout(() => {
          router.push(`/${params.locale}/lite` as any)
        }, 2000)
      } else {
        setInstallStatus('ready')
      }
    } catch (error) {
      console.error('Install error:', error)
      setInstallStatus('ready')
    }
  }

  // Auto-trigger install when ready
  useEffect(() => {
    if (installStatus === 'ready' && deferredPrompt) {
      // Auto-trigger after a brief delay
      const autoInstall = setTimeout(() => {
        handleInstall()
      }, 500)
      
      return () => clearTimeout(autoInstall)
    }
  }, [installStatus, deferredPrompt])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-accent-500 to-purple-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 text-center">
          {/* Logo */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-xl">
            <span className="text-5xl font-bold text-white">FC</span>
          </div>

          {/* Status-based content */}
          {installStatus === 'detecting' && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Preparing Installation...
              </h1>
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Please wait while we prepare FairCoin Lite for installation
              </p>
            </>
          )}

          {installStatus === 'ready' && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Install FairCoin Lite
              </h1>
              <Download className="w-16 h-16 mx-auto mb-6 text-primary-600 animate-bounce" />
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                Click the button below to install FairCoin Lite on your device
              </p>
              <button
                onClick={handleInstall}
                className="w-full py-5 px-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <Download className="w-6 h-6" />
                Install Now
              </button>
            </>
          )}

          {installStatus === 'installing' && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Installing...
              </h1>
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Please follow the prompts to complete installation
              </p>
            </>
          )}

          {installStatus === 'installed' && (
            <>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Successfully Installed!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                FairCoin Lite is now installed on your device
              </p>
              <div className="flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400">
                <span className="font-semibold">Redirecting to app...</span>
                <ArrowRight className="w-5 h-5 animate-pulse" />
              </div>
            </>
          )}

          {installStatus === 'not-available' && (
            <>
              <Smartphone className="w-16 h-16 mx-auto mb-6 text-gray-400" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Installation Not Available
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                Your browser doesn't support app installation, or FairCoin Lite is already installed.
              </p>
              <button
                onClick={() => router.push('/lite')}
                className="w-full py-5 px-6 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <ArrowRight className="w-6 h-6" />
                Continue to App
              </button>
              
              {/* Manual Install Instructions */}
              <div className="mt-8 text-left bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-center">
                  Manual Installation
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span><strong>Chrome/Edge:</strong> Click menu (⋮) → "Install app"</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span><strong>Safari iOS:</strong> Tap Share → "Add to Home Screen"</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span><strong>Safari Mac:</strong> File → "Add to Dock"</span>
                  </li>
                </ul>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              FairCoin Lite — Simple & Friendly
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Light & Truth • Love & Mercy • Just & Peace
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
