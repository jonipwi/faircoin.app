"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { api, type AuthSession } from '@/lib/api'
import { isValidLocale } from '@/lib/i18n/locales'

interface AuthContextType {
  isAuthenticated: boolean
  user: AuthSession | null
  loading: boolean
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)

  const loadSavedLanguageFromSettings = useCallback(async (token?: string) => {
    if (!token) return
    try {
      const response = await api.user.settings(token)
      const prefs = response.settings.find((setting) => setting.setting_key === 'preferences')
      if (!prefs?.setting_value) return

      const parsedValue = typeof prefs.setting_value === 'string'
        ? JSON.parse(prefs.setting_value)
        : prefs.setting_value
      const savedLocale = parsedValue?.language

      if (savedLocale && isValidLocale(savedLocale)) {
        localStorage.setItem('faircoin-locale', savedLocale)
        window.dispatchEvent(new CustomEvent('faircoin-locale-override', { detail: { locale: savedLocale } }))
      }
    } catch (error) {
      const isDev = process.env.NODE_ENV === 'development'
      if (isDev) console.warn('[Auth] Failed to load saved language preference:', error)
    }
  }, [])

  const getToken = () => {
    return localStorage.getItem('auth_token') || 
           document.cookie.split('; ').find(row => row.startsWith('session='))?.split('=')[1]
  }

  const checkAuth = async () => {
    const isDev = process.env.NODE_ENV === 'development'
    if (isDev) console.log('[Auth] checkAuth start')
    try {
      const token = getToken()
      if (isDev) console.log('[Auth] token retrieved', token)
      if (!token) {
        setIsAuthenticated(false)
        setUser(null)
        return
      }

      // Try to get user from localStorage first (wallet auth)
      try {
        const storedUser = localStorage.getItem('user')
        if (isDev) console.log('[Auth] storedUser raw', storedUser)
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          if (isDev) console.log('[Auth] parsed storedUser', userData)
          setIsAuthenticated(true)
          setUser(userData)
          await loadSavedLanguageFromSettings(token)
          return
        }
      } catch (e) {
        if (isDev) console.warn('Failed to load user from localStorage:', e)
      }

      // Fallback to API check (GitHub OAuth)
      const response = await api.auth.status(token)
      if (isDev) console.log('[Auth] API status response', response)
      if (response.authenticated && response.session) {
        setIsAuthenticated(true)
        setUser(response.session)
        await loadSavedLanguageFromSettings(token)
      } else {
        setIsAuthenticated(false)
        setUser(null)
        // Clear invalid token
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      }
    } catch (error) {
      // Keep critical auth errors in production
      console.error('Auth check failed:', error)
      setIsAuthenticated(false)
      setUser(null)
      // Clear tokens on auth failure
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      const token = getToken()
      if (token) {
        await api.auth.logout(token)
      }
    } catch (error) {
      // Keep logout errors in production for debugging
      console.error('Logout failed:', error)
    } finally {
      // Always clear tokens and update state
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      localStorage.removeItem('wallet')
      localStorage.removeItem('session')
      document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  useEffect(() => {
    checkAuth()
    
    // Listen for storage changes (across tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      const isDev = process.env.NODE_ENV === 'development'
      if (isDev) console.log('[Auth] storage event', e.key, e.newValue)
      if (e.key === 'auth_token' || e.key === 'user') {
        checkAuth()
      }
    }
    
    // Listen for custom auth events (same tab)
    const handleAuthChange = () => {
      const isDev = process.env.NODE_ENV === 'development'
      if (isDev) console.log('[Auth] authStateChanged event')
      checkAuth()
    }
    
    // Re-check auth when user returns to the tab/window
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAuth()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('authStateChanged', handleAuthChange)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authStateChanged', handleAuthChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    const handleLocaleChange = async (event: Event) => {
      const isDev = process.env.NODE_ENV === 'development'
      const detail = (event as CustomEvent<{ locale?: string }>).detail
      const selectedLocale = detail?.locale
      
      if (!selectedLocale || !isValidLocale(selectedLocale)) {
        if (isDev) console.log('[Auth] Invalid locale, skipping persistence:', selectedLocale)
        return
      }
      
      if (!isAuthenticated || !user) {
        if (isDev) console.log('[Auth] Not authenticated, skipping locale persistence')
        return
      }
      
      const token = getToken()
      if (!token) {
        if (isDev) console.log('[Auth] No auth token found, cannot persist locale preference')
        return
      }
      
      if (isDev) console.log('[Auth] Persisting locale preference:', selectedLocale, 'with token:', token.substring(0, 20) + '...')
      
      try {
        await api.user.updateSettings('preferences', { language: selectedLocale }, token)
        if (isDev) console.log('[Auth] Successfully persisted locale preference:', selectedLocale)
      } catch (error) {
        console.error('[Auth] Failed to persist language preference:', error)
        // If token is invalid/expired, trigger re-authentication
        if (error instanceof Error && error.message.includes('expired')) {
          if (isDev) console.warn('[Auth] Session expired, clearing auth state')
          await logout()
        }
      }
    }

    window.addEventListener('faircoin-locale-change', handleLocaleChange)
    return () => window.removeEventListener('faircoin-locale-change', handleLocaleChange)
  }, [isAuthenticated, user, logout])

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      loading,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}