"use client"

import Link from 'next/link'
import { MessageCircle, Send, Download, Wallet, HelpCircle, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLocalePath } from '@/lib/i18n/useLocalePath'

export default function LiteHome() {
  const { isAuthenticated, user } = useAuth()
  const localePath = useLocalePath()

  const quickActions = [
    {
      title: 'Community Chat',
      description: 'Join the conversation, get help, and meet friends',
      icon: MessageCircle,
      href: 'lite/chat',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Send FairCoin',
      description: 'Give FairCoin to friends and community',
      icon: Send,
      href: 'lite/send',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Receive FairCoin',
      description: 'Show your QR code to receive coins',
      icon: Download,
      href: 'lite/receive',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'My Balance',
      description: 'See your FairCoin and recent transactions',
      icon: Wallet,
      href: 'lite/balance',
      color: 'from-amber-500 to-orange-500'
    },
    {
      title: 'Help & Tutorial',
      description: 'Learn how to use FairCoin step-by-step',
      icon: HelpCircle,
      href: 'lite/help',
      color: 'from-indigo-500 to-violet-500'
    }
  ]

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-6">
            <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <span className="text-lg font-semibold text-primary-700 dark:text-primary-300">
              Welcome to FairCoin Lite
            </span>
          </div>
          {isAuthenticated && user && (
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              Hello, {user.username}!
            </h1>
          )}
          {!isAuthenticated && (
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              Simple & Friendly FairCoin
            </h1>
          )}
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Everything you need in big, clear buttons
          </p>
        </div>

        {/* Big Action Buttons */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.href}
                href={localePath(action.href) as any}
                className="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="p-8 sm:p-10">
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    {action.title}
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                    {action.description}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-primary-500 to-accent-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </Link>
            )
          })}
        </div>

        {/* Quick Info Banner */}
        {!isAuthenticated && (
          <div className="rounded-3xl bg-gradient-to-r from-primary-600 to-accent-600 p-8 sm:p-10 text-center text-white shadow-2xl">
            <h3 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Ready to join FairCoin?
            </h3>
            <p className="text-xl sm:text-2xl mb-8 opacity-95">
              Create your account in 3 easy steps
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center gap-3 px-8 py-5 bg-white text-primary-700 rounded-2xl text-xl font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
            >
              Get Started Now
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
