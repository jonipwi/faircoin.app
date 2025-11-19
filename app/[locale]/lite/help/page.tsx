"use client"

import Link from 'next/link'
import { HelpCircle, MessageCircle, Send, Download, Wallet, Video, FileText } from 'lucide-react'
import LiteVersionDisplay from '@/components/lite/LiteVersionDisplay'
import { useLocalePath } from '@/lib/i18n/useLocalePath'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function LiteHelp() {
  const localePath = useLocalePath()
  const { t } = useLanguage()
  
  const tutorials: Array<{
    title: string
    description: string
    icon: typeof MessageCircle
    href: string
    color: string
  }> = [
    {
      title: t('lite.help.tutorials.joinChat') || 'How to Join Community Chat',
      description: t('lite.help.tutorials.joinChatDesc') || 'Learn how to connect with helpers and make friends',
      icon: MessageCircle,
      href: 'lite/chat',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: t('lite.help.tutorials.sendCoins') || 'How to Send FairCoin',
      description: t('lite.help.tutorials.sendCoinsDesc') || 'Step-by-step guide to giving coins to friends',
      icon: Send,
      href: 'lite/send',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: t('lite.help.tutorials.receiveCoins') || 'How to Receive FairCoin',
      description: t('lite.help.tutorials.receiveCoinsDesc') || 'Show your QR code and get coins instantly',
      icon: Download,
      href: 'lite/receive',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: t('lite.help.tutorials.understandBalance') || 'Understanding Your Balance',
      description: t('lite.help.tutorials.understandBalanceDesc') || 'See your coins and transaction history',
      icon: Wallet,
      href: 'lite/balance',
      color: 'from-amber-500 to-orange-500'
    }
  ]

  const resources = [
    {
      title: t('lite.help.resources.videoTutorials') || 'Video Tutorials',
      description: t('lite.help.resources.videoDesc') || 'Watch simple video guides',
      icon: Video
    },
    {
      title: t('lite.help.resources.printableGuides') || 'Printable Guides',
      description: t('lite.help.resources.printableDesc') || 'Download easy-to-read PDF instructions',
      icon: FileText
    }
  ]

  return (
    <div className="min-h-screen py-12">
      <LiteVersionDisplay show={true} autoHideDelay={5000} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {t('lite.help.header') || 'Help & Tutorials'}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400">
            {t('lite.help.subtitle') || 'Everything you need to know, step by step'}
          </p>
        </div>

        {/* Emergency Help Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-red-500 to-pink-500 p-8 sm:p-10 text-center text-white shadow-2xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            {t('lite.help.emergency.title') || 'Need Help Right Now?'}
          </h2>
          <p className="text-xl sm:text-2xl mb-8 opacity-95">
            {t('lite.help.emergency.description') || 'Talk to a real person in the Community Chat'}
          </p>
          <Link
            href={localePath('lite/chat') as any}
            className="inline-flex items-center gap-3 px-8 py-5 bg-white text-red-600 rounded-2xl text-xl font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
          >
            <MessageCircle className="w-7 h-7" />
            {t('lite.help.emergency.button') || 'Open Chat Now'}
          </Link>
          <p className="mt-6 text-lg opacity-90">
            {t('lite.help.emergency.availability') || 'Moderators respond within 2 minutes • Available 24/7'}
          </p>
        </div>

        {/* Tutorial Cards */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            {t('lite.help.quickStart') || 'Quick Start Guides'}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {tutorials.map((tutorial) => {
              const Icon = tutorial.icon
              return (
                <Link
                  key={tutorial.href}
                  href={localePath(tutorial.href) as any}
                  className="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="p-8">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${tutorial.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                      {tutorial.title}
                    </h3>
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                      {tutorial.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Additional Resources */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            {t('lite.help.resources.title') || 'More Resources'}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {resources.map((resource) => {
              const Icon = resource.icon
              return (
                <div
                  key={resource.title}
                  className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-8 shadow-xl"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {resource.title}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {resource.description}
                  </p>
                  <button className="mt-6 px-6 py-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-all">
                    {t('lite.help.resources.comingSoon') || 'Coming Soon'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-12 rounded-3xl bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-200 dark:border-primary-700 p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('lite.help.support.title') || 'Still Need Help?'}
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            {t('lite.help.support.description') || 'Our support team is here for you'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href={localePath('lite/chat') as any}
              className="px-6 py-4 rounded-2xl bg-primary-600 text-white text-lg font-bold hover:bg-primary-700 transition-all"
            >
              {t('lite.help.support.chatButton') || 'Chat with Support'}
            </Link>
            <a
              href="mailto:joni.pwi@gmail.com"
              className="px-6 py-4 rounded-2xl bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 text-lg font-bold border-2 border-primary-600 dark:border-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700 transition-all"
            >
              {t('lite.help.support.emailButton') || 'Email Us'}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
