"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Coins, LogIn, UserPlus, User, LogOut, LayoutDashboard } from 'lucide-react'
import { ThemeSwitcher } from './ThemeSwitcher'
import { useAuth } from '@/contexts/AuthContext'
import { LanguageSelector } from './lite/LanguageSelector'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user, loading, logout } = useAuth()
  const { t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: t('nav.home'), href: '/full' },
    { label: t('nav.wallet'), href: '#wallet' },
    { label: t('nav.merchants'), href: '#merchants' },
    { label: t('nav.fairness'), href: '#fairness' },
    { label: t('nav.governance'), href: '#governance' },
    { label: t('nav.community'), href: '#community' },
  ]

  const handleLogout = async () => {
    await logout()
    // Redirect to home page after logout
    window.location.href = '/'
  }

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className="container">
        <div className={`card ${scrolled ? 'shadow-2xl' : 'shadow-xl'} px-4 py-3 transition-all duration-300`}>
          {/* Top Row: Logo + Live & Growing + Language/User Menu */}
          <div className="flex items-center justify-between mb-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Coins className="w-8 h-8 text-primary-500 group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 bg-primary-500/20 blur-xl group-hover:bg-primary-500/30 transition-all duration-300" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-accent-400">
                FairCoin
              </span>
            </Link>

            {/* Right Side: Language Selector + Theme + Auth (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSelector />
              <ThemeSwitcher />
              
              {loading ? (
                <div className="w-8 h-8 animate-spin border-2 border-primary-500 border-t-transparent rounded-full" />
              ) : isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link href="/dashboard" className="btn btn-ghost btn-sm">
                    <LayoutDashboard className="w-4 h-4" />
                    {t('nav.dashboard')}
                  </Link>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30">
                    <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                      {user?.username}
                    </span>
                  </div>
                  <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                    <LogOut className="w-4 h-4" />
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth" className="btn btn-ghost btn-sm">
                    <LogIn className="w-4 h-4" />
                    {t('nav.login')}
                  </Link>
                  <Link href="/auth" className="btn btn-primary btn-sm">
                    <UserPlus className="w-4 h-4" />
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <LanguageSelector />
              <ThemeSwitcher />
              <button 
                className="btn btn-ghost btn-sm p-2" 
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Bottom Row: Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center justify-center gap-6 pt-3 border-t border-gray-200 dark:border-gray-700">
            {navLinks.map((link) => 
              link.href.startsWith('#') ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" />
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href as any}
                  className="relative text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" />
                </Link>
              )
            )}
            
            <Link
              href="/lite"
              className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors px-3 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50"
            >
              ✨ {t('nav.liteMode')}
            </Link>
          </div>

          {/* Mobile Menu */}
          {open && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-slide-down">
              <div className="grid gap-2">
                {navLinks.map((link) => 
                  link.href.startsWith('#') ? (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="btn btn-ghost justify-start"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href as any}
                      onClick={() => setOpen(false)}
                      className="btn btn-ghost justify-start"
                    >
                      {link.label}
                    </Link>
                  )
                )}
                
                <Link
                  href="/lite"
                  onClick={() => setOpen(false)}
                  className="btn btn-ghost justify-start text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30"
                >
                  ✨ Lite Mode
                </Link>
                
                {loading ? (
                  <div className="flex justify-center py-2">
                    <div className="w-6 h-6 animate-spin border-2 border-primary-500 border-t-transparent rounded-full" />
                  </div>
                ) : isAuthenticated ? (
                  <div className="space-y-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/30">
                      <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                        {user?.username}
                      </span>
                    </div>
                    <Link href="/dashboard" className="btn btn-outline btn-sm w-full">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button onClick={handleLogout} className="btn btn-ghost btn-sm w-full">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <Link href="/auth" className="btn btn-outline btn-sm">
                      <LogIn className="w-4 h-4" />
                      Login
                    </Link>
                    <Link href="/auth" className="btn btn-primary btn-sm">
                      <UserPlus className="w-4 h-4" />
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

