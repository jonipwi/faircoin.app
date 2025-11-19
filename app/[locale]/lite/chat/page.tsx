"use client"

import { MessageCircle, Users, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function LiteChat() {
  const { t } = useLanguage()
  const chatUrl = process.env.NEXT_PUBLIC_CHAT_URL || 'http://localhost:3031'
  const [username, setUsername] = useState('guest')
  const [walletAddress, setWalletAddress] = useState('')

  // Get username and wallet from localStorage
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        if (user.username) {
          setUsername(user.username)
        }
        if (user.wallet_address) {
          setWalletAddress(user.wallet_address)
        }
      }
    } catch (e) {
      console.warn('Failed to load user from localStorage:', e)
    }
  }, [])

  // Construct iframe URL pointing directly to chat room
  const iframeUrl = `${chatUrl}/lite/chat?room=friendly-lounge&roomId=1&username=${encodeURIComponent(username)}${walletAddress ? `&wallet=${encodeURIComponent(walletAddress)}` : ''}`

  // Debug logging
  useEffect(() => {
    console.log('🔍 Chat Page Debug:')
    console.log('  Username:', username)
    console.log('  Wallet:', walletAddress)
    console.log('  Full URL:', iframeUrl)
  }, [username, walletAddress, iframeUrl])

  return (
    <div className="fixed inset-0 pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="h-full flex flex-col">
        {/* Chat Header */}
        <div className="bg-white dark:bg-gray-800 border-b-4 border-primary-500 px-6 py-5 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {t('lite.chat.header') || 'Community Chat'}
                  </h1>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                    {t('lite.chat.room') || 'Friendly Lounge — always welcoming'}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-6">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Users className="w-6 h-6" />
                  <span className="text-lg font-semibold">{t('lite.chat.liveHelp') || 'Live Help'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="w-6 h-6" />
                  <span className="text-lg">{t('lite.chat.available') || '24/7'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Iframe */}
        <div className="flex-1 bg-white dark:bg-gray-800">
          <iframe
            key={`${username}-${walletAddress}`}
            src={iframeUrl}
            className="w-full h-full border-0"
            title="FairCoin Community Chat"
          />
        </div>
      </div>
    </div>
  )
}
