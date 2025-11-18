"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api, type AuthSession } from '@/lib/api'

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

  const getToken = () => {
    return localStorage.getItem('auth_token') || 
           document.cookie.split('; ').find(row => row.startsWith('session='))?.split('=')[1]
  }

  const checkAuth = async () => {
    try {
      const token = getToken()
      if (!token) {
        setIsAuthenticated(false)
        setUser(null)
        return
      }

      // Try to get user from localStorage first (wallet auth)
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setIsAuthenticated(true)
          setUser(userData)
          setLoading(false)
          return
        }
      } catch (e) {
        console.warn('Failed to load user from localStorage:', e)
      }

      // Fallback to API check (GitHub OAuth)
      const response = await api.auth.status(token)
      if (response.authenticated && response.session) {
        setIsAuthenticated(true)
        setUser(response.session)
      } else {
        setIsAuthenticated(false)
        setUser(null)
        // Clear invalid token
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      }
    } catch (error) {
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
  }, [])

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