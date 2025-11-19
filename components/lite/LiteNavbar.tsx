"use client"

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Home, MessageCircle, HelpCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export function LiteNavbar() {
  const [open, setOpen] = useState(false)
  const { user, isAuthenticated } = useAuth()

  const navLinks = [
    { label: 'Home', href: '/lite', icon: Home },
    { label: 'Chat', href: '/lite/chat', icon: MessageCircle },
    { label: 'Help', href: '/lite/help', icon: HelpCircle },
  ]

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b-4 border-primary-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo + User */}
          <div className="flex items-center gap-4">
            <Link href="/lite" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-white">FC</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs uppercase tracking-wider text-primary-600 dark:text-primary-400 font-semibold">FairCoin</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">Lite</p>
              </div>
            </Link>
            {isAuthenticated && user && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-200 dark:border-primary-700">
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm">
                  {user.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-base font-semibold text-primary-700 dark:text-primary-300">
                  {user.username}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href as any}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-base text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/50 hover:text-primary-700 dark:hover:text-primary-300 transition-all"
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-base text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors ml-2 border-l-2 border-gray-200 dark:border-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden lg:inline">Full App</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-3 rounded-xl bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden pb-4 space-y-2 border-t-2 border-gray-100 dark:border-gray-800 pt-4 mt-2">
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-200 dark:border-primary-700 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                  {user.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-lg font-semibold text-primary-700 dark:text-primary-300">
                  {user.username}
                </span>
              </div>
            )}
            {navLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href as any}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-4 rounded-xl font-semibold text-lg text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-all"
              >
                <Icon className="w-6 h-6" />
                <span>{label}</span>
              </Link>
            ))}
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-4 rounded-xl font-semibold text-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border-t-2 border-gray-200 dark:border-gray-700 mt-2 pt-4"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>Back to Full App</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
