"use client"

import { useState } from 'react'
import { Download, QrCode, Copy, Check } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function LiteReceive() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (user?.username) {
      navigator.clipboard.writeText(user.username)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Generate simple placeholder QR (replace with actual QR library like qrcode.react)
  const qrData = user?.username || 'guest'

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
            <Download className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {t('lite.receive.header') || 'Receive FairCoin'}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400">
            {t('lite.receive.subtitle') || 'Share your username or QR code'}
          </p>
        </div>

        {/* QR Code Display */}
        <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-primary-200 dark:border-primary-700 p-8 sm:p-12 mb-8 text-center shadow-2xl">
          <div className="w-64 h-64 sm:w-80 sm:h-80 mx-auto bg-white rounded-2xl flex items-center justify-center mb-8 border-4 border-gray-200">
            <QrCode className="w-48 h-48 sm:w-64 sm:h-64 text-gray-900" />
            {/* Replace with actual QR code library */}
            <div className="absolute text-xs text-gray-500 mt-72">
              QR: {qrData}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xl text-gray-600 dark:text-gray-400">{t('lite.receive.yourUsername') || 'Your FairCoin Username'}</p>
            <p className="text-4xl sm:text-5xl font-extrabold text-primary-600 dark:text-primary-400 break-all">
              {user?.username || 'guest'}
            </p>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="w-full py-8 rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl sm:text-3xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-4"
        >
          {copied ? (
            <>
              <Check className="w-8 h-8" />
              {t('lite.receive.copied') || 'Copied!'}
            </>
          ) : (
            <>
              <Copy className="w-8 h-8" />
              {t('lite.receive.copyButton') || 'Copy My Username'}
            </>
          )}
        </button>

        {/* Instructions */}
        <div className="mt-12 rounded-3xl bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-200 dark:border-primary-700 p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t('lite.receive.instructions.title') || 'How to receive FairCoin'}
          </h3>
          <ol className="space-y-4 text-lg sm:text-xl text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <p>{t('lite.receive.instructions.step1') || 'Show this QR code to the person sending you FairCoin'}</p>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <p>{t('lite.receive.instructions.step2') || 'Or tap "Copy My Username" and send it to them'}</p>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <p>{t('lite.receive.instructions.step3') || 'FairCoin will arrive in your wallet instantly'}</p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
