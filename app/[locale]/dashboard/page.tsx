"use client"

import { useEffect, useState, useRef } from 'react'
import { Coins, Users, TrendingUp, Award, LogOut, Settings, Eye, Calendar, Trophy, ArrowUpRight, ArrowDownLeft, Menu, X } from 'lucide-react'
import { api, type UserDashboard } from '@/lib/api'
import { useLocalePath } from '@/lib/i18n/useLocalePath'

interface DashboardHeaderProps {
  user: any
  profile: any
  onLogout: () => void
}

function DashboardHeader({ user, profile, onLogout }: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const localePath = useLocalePath()

  // Close menu when clicking outside
  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development'
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element
      
      // Don't close if clicking on menu buttons or menu content
      if (target.closest('.mobile-menu-content') || target.closest('.mobile-menu-button')) {
        if (isDev) console.log('Click was on menu element, not closing')
        return
      }
      
      if (isDev) console.log('Clicked outside, closing menu')
      setMobileMenuOpen(false)
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (isDev) console.log('Escape pressed, closing menu')
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      if (isDev) console.log('Menu opened, adding event listeners')
      // Add a small delay to prevent immediate closing
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscapeKey)
      }, 150)
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
      
      return () => {
        if (isDev) console.log('Menu closed, removing event listeners')
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscapeKey)
        document.body.style.overflow = 'unset'
      }
    }
  }, [mobileMenuOpen])

  return (
    <>
      <div className="card p-4 sm:p-6">
        <div className="flex items-center justify-between">
          {/* Left side - User Info */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile?.avatar_url || user.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.username}`}
              alt={user.username}
              className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full border-2 border-primary-200 dark:border-primary-800 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                {user.is_verified && (
                  <span className="px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex-shrink-0">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-sm lg:text-base font-medium text-gray-900 dark:text-white">
                Welcome back, {user.username}!
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                {user.email || 'Member since ' + new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Right side - Navigation */}
          <div className="flex items-center gap-2">
            {/* Desktop/Tablet Navigation (visible on lg+ screens) */}
            <div className="hidden lg:flex items-center gap-2">
              <a href={localePath('')} className="btn btn-ghost btn-sm gap-2">
                <Coins className="w-4 h-4" />
                <span>Home</span>
              </a>
              <a href={localePath('settings')} className="btn btn-ghost btn-sm gap-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </a>
              <button onClick={onLogout} className="btn btn-outline btn-sm gap-2">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Tablet Navigation (visible on md-lg screens) */}
            <div className="hidden md:flex lg:hidden items-center gap-1">
              <a href={localePath('')} className="btn btn-ghost btn-sm gap-1">
                <Coins className="w-4 h-4" />
                <span className="text-sm">Home</span>
              </a>
              <a href={localePath('settings')} className="btn btn-ghost btn-sm gap-1">
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </a>
              <button onClick={onLogout} className="btn btn-outline btn-sm gap-1">
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button (visible on sm and below) */}
            <div className="md:hidden relative" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (process.env.NODE_ENV === 'development') console.log('Mobile menu clicked, current state:', mobileMenuOpen)
                  setMobileMenuOpen(!mobileMenuOpen)
                }}
                className="btn btn-ghost btn-sm p-2 mobile-menu-button"
                style={{ zIndex: 1000 }}
                type="button"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Using same theme as Navbar */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2147483647 }}>
          {/* Backdrop */}
          <div 
            onClick={(e) => {
              e.preventDefault()
              if (process.env.NODE_ENV === 'development') console.log('Backdrop clicked, closing menu')
              setMobileMenuOpen(false)
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              zIndex: 2147483646
            }}
          />
          
          {/* Menu Card - Same styling as Navbar */}
          <div 
            className="card shadow-2xl mobile-menu-content"
            style={{
              position: 'absolute',
              top: '80px',
              left: '16px',
              right: '16px',
              maxWidth: '300px',
              margin: '0 auto',
              zIndex: 2147483647
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="grid gap-2">
                <button 
                  onClick={() => {
                    if (process.env.NODE_ENV === 'development') console.log('Mobile Home clicked')
                    setMobileMenuOpen(false)
                    window.location.href = localePath('')
                  }}
                  className="btn btn-ghost justify-start mobile-menu-button"
                >
                  <Coins className="w-4 h-4" />
                  Home
                </button>
                
                <button 
                  onClick={() => {
                    if (process.env.NODE_ENV === 'development') console.log('Mobile Settings clicked')
                    setMobileMenuOpen(false)
                    window.location.href = localePath('settings')
                  }}
                  className="btn btn-ghost justify-start mobile-menu-button"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={() => {
                      if (process.env.NODE_ENV === 'development') console.log('Mobile Logout clicked')
                      setMobileMenuOpen(false)
                      onLogout()
                    }}
                    className="btn btn-ghost justify-start w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 mobile-menu-button"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


    </>
  )
}

export default function DashboardPage() {
  const localePath = useLocalePath()
  const [dashboard, setDashboard] = useState<UserDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Get session token from localStorage or cookie
        const sessionToken = localStorage.getItem('auth_token') || 
                           document.cookie.split('; ').find(row => row.startsWith('session='))?.split('=')[1]
        
        if (!sessionToken) {
          setError('No authentication token found')
          return
        }

        const data = await api.user.dashboard(sessionToken)
        setDashboard(data)
      } catch (err) {
        console.error('Dashboard load error:', err)
        if (err instanceof Error && (err.message.includes('404') || err.message.includes('401'))) {
          // Authentication failed, redirect to login
          window.location.href = localePath('auth')
          return
        }
        setError(err instanceof Error ? err.message : 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const handleLogout = async () => {
    const isDev = process.env.NODE_ENV === 'development'
    if (isDev) console.log('handleLogout called')
    try {
      const sessionToken = localStorage.getItem('auth_token') || 
                         document.cookie.split('; ').find(row => row.startsWith('session='))?.split('=')[1]
      
      if (isDev) console.log('Session token found:', !!sessionToken)
      
      if (sessionToken) {
        if (isDev) console.log('Calling API logout...')
        await api.auth.logout(sessionToken)
        if (isDev) console.log('API logout successful')
      }
      
      // Clear stored tokens
      if (isDev) console.log('Clearing tokens...')
      localStorage.removeItem('auth_token')
      document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      
      if (isDev) console.log('Redirecting to /auth...')
      window.location.href = localePath('auth')
    } catch (err) {
      console.error('Logout failed:', err)
      // Force redirect anyway
      if (isDev) console.log('Force clearing tokens and redirecting...')
      localStorage.removeItem('auth_token')
      document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      window.location.href = localePath('auth')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="card p-8 max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || 'Failed to load dashboard data'}
          </p>
          <div className="flex gap-3">
            <button onClick={() => window.location.reload()} className="btn btn-outline">
              Retry
            </button>
            {error?.includes('authentication') || error?.includes('token') ? (
              <button 
                onClick={() => window.location.href = localePath('auth')} 
                className="btn btn-primary"
              >
                Sign In
              </button>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  const { user, profile, wallet, stats, recent_transactions, achievements } = dashboard

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container py-6 lg:py-8 space-y-6 lg:space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Header - Single Row Layout */}
        <DashboardHeader 
          user={user}
          profile={profile}
          onLogout={handleLogout}
        />

        {/* Stats Grid - improved responsiveness for tablet sizes */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="card p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {wallet.fc_balance} FC
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Available Balance</p>
            {wallet.locked_balance > 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                {wallet.locked_balance} FC locked
              </p>
            )}
          </div>

          <div className="card p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {user.pfi}★
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Personal Fairness Index</p>
            <p className="text-xs text-gray-500 mt-1">
              Rank #{stats.community_rank}
            </p>
          </div>

          <div className="card p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.total_transactions}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.days_active} days active
            </p>
          </div>

          <div className="card p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.achievements_count}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Achievements</p>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round(stats.governance_participation * 100)}% governance participation
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Recent Transactions
                </h2>
                <button className="btn btn-ghost btn-sm gap-2">
                  <Eye className="w-4 h-4" />
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {recent_transactions && recent_transactions.length > 0 ? (
                  recent_transactions.slice(0, 5).map((tx: any, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          tx.type === 'received' || tx.amount > 0 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          {tx.type === 'received' || tx.amount > 0 ? (
                            <ArrowDownLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {tx.description || (tx.amount > 0 ? 'Received' : 'Sent')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(tx.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount} FC
                        </p>
                        <p className="text-sm text-gray-500">
                          {tx.status}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Coins className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No transactions yet</p>
                    <p className="text-sm text-gray-400">Start by receiving your first FairCoins</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Achievements & Profile */}
          <div className="space-y-6">
            {/* Recent Achievements */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Recent Achievements
                </h3>
                <Trophy className="w-5 h-5 text-amber-500" />
              </div>
              
              <div className="space-y-3">
                {achievements && achievements.length > 0 ? (
                  achievements.map((achievement: any, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {achievement.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                          {new Date(achievement.earned_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Trophy className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">No achievements yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Summary */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Profile Summary
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Joined</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(user.created_at).toLocaleDateString()} {new Date(user.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last Login</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(user.last_login).toLocaleDateString()} {new Date(user.last_login).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                {profile?.location && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Location</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {profile.location}
                    </span>
                  </div>
                )}
                
                {profile?.bio && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Bio</span>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {profile.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          
          <div className="grid md:grid-cols-4 gap-4">
            <button className="btn btn-primary gap-2">
              <Coins className="w-4 h-4" />
              Send FairCoin
            </button>
            <button className="btn btn-outline gap-2">
              <Eye className="w-4 h-4" />
              View Transactions
            </button>
            <button className="btn btn-outline gap-2">
              <Users className="w-4 h-4" />
              Join Governance
            </button>
            <button className="btn btn-outline gap-2">
              <Calendar className="w-4 h-4" />
              Community Events
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}