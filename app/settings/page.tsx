'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Moon, 
  Sun, 
  Monitor,
  ArrowLeft,
  Save,
  Mail,
  Phone,
  Shield,
  Eye,
  EyeOff,
  Coins,
  CreditCard,
  Smartphone,
  Settings as SettingsIcon,
  CheckCircle,
  AlertCircle,
  Palette,
  Languages,
  Clock,
  Key,
  X
} from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences'>('profile')
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [preferences, setPreferences] = useState({
    language: 'en',
    currency: 'FC',
    timezone: 'UTC'
  })
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: false
  })
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    bio: ''
  })
  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: '30'
  })
  const [twoFactorAuth, setTwoFactorAuth] = useState({
    enabled: false,
    secret: '',
    qrCode: '',
    backupCodes: [] as string[],
    setupStep: 'disabled' as 'disabled' | 'setup' | 'verify' | 'enabled'
  })
  const [verificationCode, setVerificationCode] = useState('')
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const loadUserDashboardData = useCallback(async () => {
    try {
      console.log('[SETTINGS] 🔍 Starting dashboard data load...')
      
      // Get the auth token
      const token = localStorage.getItem('auth_token') || 
                   document.cookie.split('; ').find(row => row.startsWith('session='))?.split('=')[1]
      
      console.log('[SETTINGS] 🔑 Token found:', token ? token.substring(0, 20) + '...' : 'NONE')
      
      if (!token) {
        console.error('[SETTINGS] ❌ No auth token found')
        return
      }

      console.log('[SETTINGS] 📡 Calling api.user.dashboard() - direct backend call...')
      const startTime = Date.now()
      
      // Use the same API method as dashboard page - direct backend call bypassing Cloudflare issues
      const dashboardData = await api.user.dashboard(token)

      const duration = Date.now() - startTime
      console.log(`[SETTINGS] ⏱️ Response received in ${duration}ms`)
      console.log('[SETTINGS] ✅ Dashboard data loaded successfully')
      console.log('[SETTINGS] 📊 Response keys:', Object.keys(dashboardData))
      console.log('[SETTINGS] 👤 User data:', dashboardData.user)
      console.log('[SETTINGS] 📝 Profile data:', dashboardData.profile)
      console.log('[SETTINGS] ⚙️ Settings count:', dashboardData.settings?.length || 0)

        // Update profile information from user data and profile data
        if (dashboardData.user || dashboardData.profile) {
          const userData = dashboardData.user || {}
          const profileData = dashboardData.profile || {}
          
          console.log('[SETTINGS] 🔍 Extracting profile data...')
          console.log('[SETTINGS]   - full_name:', userData.full_name)
          console.log('[SETTINGS]   - email:', userData.email)
          console.log('[SETTINGS]   - username:', userData.username)
          console.log('[SETTINGS]   - display_name:', profileData.display_name)
          
          const profileInfo = {
            name: userData.full_name || 
                  profileData.display_name || 
                  `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 
                  userData.username || '',
            email: userData.email || '',
            phone: (userData as any).phone || '',
            bio: profileData.bio || ''
          }
          
          console.log('[SETTINGS] 💾 Setting profile state:', profileInfo)
          setProfile(profileInfo)
        } else {
          console.log('[SETTINGS] ⚠️ No user or profile data in response')
        }

      // Process settings and update state
      if (dashboardData.settings) {
        dashboardData.settings.forEach((setting: any) => {
          switch (setting.setting_key) {
            case 'notifications':
              if (setting.setting_value) {
                setNotifications({
                  email: setting.setting_value.email ?? true,
                  push: setting.setting_value.push ?? false,
                  sms: setting.setting_value.sms ?? false,
                  marketing: setting.setting_value.marketing ?? false
                })
              }
              break
            case 'security':
              if (setting.setting_value) {
                setSecurity({
                  twoFactor: setting.setting_value.twoFactor ?? false,
                  loginAlerts: setting.setting_value.loginAlerts ?? true,
                  sessionTimeout: setting.setting_value.sessionTimeout ?? '30'
                })
              }
              break
            case 'preferences':
              if (setting.setting_value) {
                console.log('🔍 Loading preferences:', setting.setting_value)
                if (setting.setting_value.theme) {
                  setTheme(setting.setting_value.theme)
                }
                setPreferences(prev => ({
                  language: setting.setting_value.language || prev.language,
                  currency: setting.setting_value.currency || prev.currency,
                  timezone: setting.setting_value.timezone || prev.timezone
                }))
                console.log('✅ Preferences updated')
              }
              break
            case 'profile':
              if (setting.setting_value) {
                // Only update editable fields (phone, bio), keep name and email from OAuth
                setProfile(prev => ({
                  ...prev,
                  phone: setting.setting_value.phone || prev.phone,
                  bio: setting.setting_value.bio || prev.bio
                  // name and email remain from GitHub OAuth data
                }))
              }
              break
            case 'two_factor_auth':
              if (setting.setting_value) {
                setTwoFactorAuth(prev => ({
                  ...prev,
                  enabled: setting.setting_value.enabled ?? false,
                  setupStep: setting.setting_value.enabled ? 'enabled' : 'disabled',
                  backupCodes: setting.setting_value.backup_codes || []
                }))
              }
              break
          }
        })
      }
    } catch (error) {
      console.error('[SETTINGS] 💥 Exception loading dashboard:', error)
      console.error('[SETTINGS] 💥 Error stack:', error instanceof Error ? error.stack : 'No stack')
      
      // Check if it's an authentication error
      if (error instanceof Error && (error.message.includes('401') || error.message.includes('403'))) {
        console.error('[SETTINGS] ❌ Authentication error - redirecting to login')
        localStorage.removeItem('auth_token')
        document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        router.push('/auth?error=session_expired')
        return
      }
      
      // Try fallback approach for other errors
      const token = localStorage.getItem('auth_token') || 
                   document.cookie.split('; ').find(row => row.startsWith('session='))?.split('=')[1]
      if (token) {
        console.log('[SETTINGS] 🔄 Attempting fallback after exception...')
        await loadUserSettingsFallback(token)
      }
    }
  }, [router])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth')
      return
    }

    if (isAuthenticated && user) {
      loadUserDashboardData()
    }

    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system'
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [user, isAuthenticated, loading, router, loadUserDashboardData])

  const loadUserSettingsFallback = async (token: string) => {
    try {
      console.log('[SETTINGS] 🔄 Trying fallback settings API...')
      const startTime = Date.now()
      
      const response = await fetch('/api/settings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      const duration = Date.now() - startTime
      console.log(`[SETTINGS] ⏱️ Fallback response in ${duration}ms - Status: ${response.status}`)

      if (response.ok) {
        const result = await response.json()
        console.log('[SETTINGS] 📦 Fallback data:', result)
        if (result.success && result.settings) {
          // Process settings and update state
          result.settings.forEach((setting: any) => {
            switch (setting.setting_key) {
              case 'notifications':
                if (setting.setting_value) {
                  setNotifications({
                    email: setting.setting_value.email ?? true,
                    push: setting.setting_value.push ?? false,
                    sms: setting.setting_value.sms ?? false,
                    marketing: setting.setting_value.marketing ?? false
                  })
                }
                break
              case 'security':
                if (setting.setting_value) {
                  setSecurity({
                    twoFactor: setting.setting_value.twoFactor ?? false,
                    loginAlerts: setting.setting_value.loginAlerts ?? true,
                    sessionTimeout: setting.setting_value.sessionTimeout ?? '30'
                  })
                }
                break
              case 'preferences':
                if (setting.setting_value) {
                  if (setting.setting_value.theme) {
                    setTheme(setting.setting_value.theme)
                  }
                }
                break
              case 'profile':
                if (setting.setting_value) {
                  // Only update editable fields (phone, bio), keep name and email from OAuth
                  setProfile(prev => ({
                    ...prev,
                    phone: setting.setting_value.phone || prev.phone,
                    bio: setting.setting_value.bio || prev.bio
                    // name and email remain from GitHub OAuth data
                  }))
                }
                break
              case 'two_factor_auth':
                if (setting.setting_value) {
                  setTwoFactorAuth(prev => ({
                    ...prev,
                    enabled: setting.setting_value.enabled ?? false,
                    setupStep: setting.setting_value.enabled ? 'enabled' : 'disabled',
                    backupCodes: setting.setting_value.backup_codes || []
                  }))
                }
                break
            }
          })
        }
      }
    } catch (error) {
      console.error('Settings fallback failed:', error)
      // Continue with default values
    }
  }

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      // System theme
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      if (mediaQuery.matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  const handleSave = async (section: string) => {
    setSaving(true)
    setMessage(null)

    try {
      // Get the current setting data based on section
      let settingKey = ''
      let settingValue = {}

      switch (section.toLowerCase()) {
        case 'profile':
          settingKey = 'profile'
          // Only save editable fields (phone and bio), exclude name and email from GitHub OAuth
          settingValue = {
            phone: profile.phone,
            bio: profile.bio
          }
          break
        case 'notifications':
          settingKey = 'notifications'
          settingValue = {
            email: notifications.email,
            push: notifications.push,
            sms: notifications.sms,
            marketing: notifications.marketing
          }
          break
        case 'security':
          settingKey = 'security'
          settingValue = {
            twoFactor: security.twoFactor,
            loginAlerts: security.loginAlerts,
            sessionTimeout: security.sessionTimeout
          }
          break
        case 'preferences':
          settingKey = 'preferences'
          settingValue = {
            theme: theme,
            language: preferences.language,
            currency: preferences.currency,
            timezone: preferences.timezone
          }
          console.log('💾 Saving preferences:', settingValue)
          break
        default:
          throw new Error('Unknown settings section')
      }

      // Make API call to save settings
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          setting_key: settingKey,
          setting_value: settingValue
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save settings')
      }
      
      setMessage({ type: 'success', text: `${section} settings saved successfully!` })
      
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Settings save error:', error)
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to save settings. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const handleSetupTwoFactor = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const token = localStorage.getItem('auth_token') || 
                   document.cookie.split('; ').find(row => row.startsWith('session='))?.split('=')[1]

      const response = await fetch('/api/2fa/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to setup 2FA')
      }

      setTwoFactorAuth({
        ...twoFactorAuth,
        secret: result.secret,
        qrCode: result.qrCode,
        setupStep: 'setup'
      })
      
    } catch (error) {
      console.error('2FA setup error:', error)
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to setup 2FA. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const handleVerifyTwoFactor = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter a valid 6-digit code' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const token = localStorage.getItem('auth_token') || 
                   document.cookie.split('; ').find(row => row.startsWith('session='))?.split('=')[1]

      const response = await fetch('/api/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: verificationCode
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to verify 2FA')
      }

      setTwoFactorAuth({
        ...twoFactorAuth,
        enabled: true,
        setupStep: 'enabled',
        backupCodes: result.backupCodes || []
      })
      setSecurity({ ...security, twoFactor: true })
      setVerificationCode('')
      setMessage({ type: 'success', text: '2FA has been successfully enabled!' })
      
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('2FA verification error:', error)
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Invalid verification code. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDisableTwoFactor = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const token = localStorage.getItem('auth_token') || 
                   document.cookie.split('; ').find(row => row.startsWith('session='))?.split('=')[1]

      const response = await fetch('/api/2fa/disable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to disable 2FA')
      }

      setTwoFactorAuth({
        enabled: false,
        secret: '',
        qrCode: '',
        backupCodes: [],
        setupStep: 'disabled'
      })
      setSecurity({ ...security, twoFactor: false })
      setMessage({ type: 'success', text: '2FA has been disabled.' })
      
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('2FA disable error:', error)
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to disable 2FA. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const handleRegenerateBackupCodes = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const token = localStorage.getItem('auth_token') || 
                   document.cookie.split('; ').find(row => row.startsWith('session='))?.split('=')[1]

      const response = await fetch('/api/2fa/backup-codes/regenerate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to regenerate backup codes')
      }

      setTwoFactorAuth({
        ...twoFactorAuth,
        backupCodes: result.backupCodes || []
      })
      setShowBackupCodes(true)
      setMessage({ type: 'success', text: 'New backup codes generated successfully!' })
      
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Backup codes regeneration error:', error)
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to regenerate backup codes. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const downloadBackupCodes = () => {
    const content = `FairCoin 2FA Backup Codes\nGenerated: ${new Date().toLocaleString()}\n\n${twoFactorAuth.backupCodes.join('\n')}\n\nKeep these codes safe - each can only be used once.`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'faircoin-backup-codes.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container py-6 lg:py-8 space-y-6 lg:space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="card p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="btn btn-ghost btn-sm gap-2 self-start"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <SettingsIcon className="w-5 h-5 text-white" />
                </div>
                Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="card p-4 h-fit">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                    activeTab === 'profile' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activeTab === 'profile' 
                      ? 'bg-white/20' 
                      : 'bg-gradient-to-br from-blue-500 to-purple-500'
                  }`}>
                    <User className={`w-4 h-4 ${activeTab === 'profile' ? 'text-white' : 'text-white'}`} />
                  </div>
                  <span className="font-medium">Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                    activeTab === 'security' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activeTab === 'security' 
                      ? 'bg-white/20' 
                      : 'bg-gradient-to-br from-green-500 to-emerald-500'
                  }`}>
                    <Shield className={`w-4 h-4 ${activeTab === 'security' ? 'text-white' : 'text-white'}`} />
                  </div>
                  <span className="font-medium">Security</span>
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                    activeTab === 'notifications' 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activeTab === 'notifications' 
                      ? 'bg-white/20' 
                      : 'bg-gradient-to-br from-orange-500 to-red-500'
                  }`}>
                    <Bell className={`w-4 h-4 ${activeTab === 'notifications' ? 'text-white' : 'text-white'}`} />
                  </div>
                  <span className="font-medium">Notifications</span>
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                    activeTab === 'preferences' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activeTab === 'preferences' 
                      ? 'bg-white/20' 
                      : 'bg-gradient-to-br from-purple-500 to-pink-500'
                  }`}>
                    <Globe className={`w-4 h-4 ${activeTab === 'preferences' ? 'text-white' : 'text-white'}`} />
                  </div>
                  <span className="font-medium">Preferences</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Status Message */}
            {message && (
              <div className={`card p-4 mb-6 border-l-4 ${
                message.type === 'success' 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                  : 'border-red-500 bg-red-50 dark:bg-red-900/20'
              }`}>
                <div className="flex items-center gap-3">
                  {message.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className={`font-medium ${
                    message.type === 'success' 
                      ? 'text-green-800 dark:text-green-200' 
                      : 'text-red-800 dark:text-red-200'
                  }`}>{message.text}</span>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Header Card */}
                <div className="card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Profile Information
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Update your personal information. Name and email are from your GitHub account and cannot be changed here.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile Form Card */}
                <div className="card p-6 hover:shadow-lg transition-shadow">
                  {/* Info notice */}
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 text-blue-500 mt-0.5">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                          Profile Information
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Name and email are from your account registration and cannot be changed here.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name
                        <span className="text-xs text-gray-500 ml-2">(Read-only)</span>
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed transition-colors"
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address
                        <span className="text-xs text-gray-500 ml-2">(Read-only)</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={profile.email}
                          readOnly
                          className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed transition-colors"
                          placeholder="Your email address"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Bio
                      </label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors h-24 resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <button
                      onClick={() => handleSave('Profile')}
                      disabled={saving}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Security Header */}
                <div className="card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Security Settings
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Protect your account with advanced security features
                      </p>
                    </div>
                  </div>
                </div>

                {/* Google Authenticator Setup Card */}
                <div className="card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Google Authenticator</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {twoFactorAuth.setupStep === 'disabled' && 'Secure your account with Google Authenticator'}
                        {twoFactorAuth.setupStep === 'setup' && 'Scan the QR code with your authenticator app'}
                        {twoFactorAuth.setupStep === 'verify' && 'Enter the verification code from your app'}
                        {twoFactorAuth.setupStep === 'enabled' && 'Your account is protected with 2FA'}
                      </p>
                    </div>
                    {twoFactorAuth.enabled && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Active
                      </div>
                    )}
                  </div>

                  {/* Disabled State */}
                  {twoFactorAuth.setupStep === 'disabled' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 text-blue-500 mt-0.5">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                              Enhanced Security
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              Two-factor authentication adds an extra layer of security to your account. You&apos;ll need to provide a code from your authenticator app when signing in.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={handleSetupTwoFactor}
                          disabled={saving}
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {saving ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Shield className="w-4 h-4" />
                          )}
                          Setup 2FA
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Setup State */}
                  {twoFactorAuth.setupStep === 'setup' && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 dark:text-white">Step 1: Scan QR Code</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Use Google Authenticator, Authy, or any TOTP app to scan this QR code:
                          </p>
                          {twoFactorAuth.qrCode && (
                            <div className="p-4 bg-white rounded-lg border-2 border-gray-200 dark:border-gray-600 inline-block">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={twoFactorAuth.qrCode} alt="2FA QR Code" className="w-48 h-48" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 dark:text-white">Step 2: Enter Code</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Enter the 6-digit code from your authenticator app:
                          </p>
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center text-lg font-mono tracking-wider"
                              placeholder="000000"
                              maxLength={6}
                            />
                            <div className="flex justify-between">
                              <button
                                onClick={() => setTwoFactorAuth({ ...twoFactorAuth, setupStep: 'disabled' })}
                                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleVerifyTwoFactor}
                                disabled={saving || verificationCode.length !== 6}
                                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                {saving ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                                Verify & Enable
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Enabled State */}
                  {twoFactorAuth.setupStep === 'enabled' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                              Two-Factor Authentication Enabled
                            </h4>
                            <p className="text-sm text-green-700 dark:text-green-300">
                              Your account is now protected with Google Authenticator. You&apos;ll need to provide a code when signing in.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Backup Codes */}
                      {twoFactorAuth.backupCodes.length > 0 && (
                        <div className="space-y-3">
                          <button
                            onClick={() => setShowBackupCodes(!showBackupCodes)}
                            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                          >
                            <Key className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {showBackupCodes ? 'Hide' : 'Show'} Backup Codes
                            </span>
                          </button>
                          {showBackupCodes && (
                            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                              <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                                Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.
                              </p>
                              <div className="grid grid-cols-2 gap-2 font-mono text-sm mb-4">
                                {twoFactorAuth.backupCodes.map((code, index) => (
                                  <div key={index} className="p-2 bg-white dark:bg-gray-800 border border-yellow-300 dark:border-yellow-700 rounded text-center">
                                    {code}
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={downloadBackupCodes}
                                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  Download Codes
                                </button>
                                <button
                                  onClick={handleRegenerateBackupCodes}
                                  disabled={saving}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                  {saving ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                  )}
                                  Regenerate
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex justify-end">
                        <button
                          onClick={handleDisableTwoFactor}
                          disabled={saving}
                          className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-lg hover:from-red-600 hover:to-pink-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {saving ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          Disable 2FA
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Security Features Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Two-Factor Authentication Card */}
                  <div className="card p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={security.twoFactor}
                              onChange={(e) => setSecurity({ ...security, twoFactor: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                          </label>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Add an extra layer of security to your account with SMS or authenticator app verification
                        </p>
                        {security.twoFactor && (
                          <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Two-factor authentication is enabled</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Login Alerts Card */}
                  <div className="card p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Login Alerts</h3>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={security.loginAlerts}
                              onChange={(e) => setSecurity({ ...security, loginAlerts: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                          </label>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Get notified via email when someone logs into your account from a new device
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Session Timeout Card */}
                  <div className="card p-6 hover:shadow-lg transition-shadow md:col-span-2">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Session Timeout</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Automatically log out after period of inactivity</p>
                      </div>
                    </div>
                    <select
                      value={security.sessionTimeout}
                      onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                      <option value="0">Never</option>
                    </select>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSave('Security')}
                    disabled={saving}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Security Settings
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                {/* Notifications Header */}
                <div className="card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <Bell className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Notification Preferences
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Choose how and when you want to receive notifications
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notification Settings Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Email Notifications Card */}
                  <div className="card p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Notifications</h3>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications.email}
                              onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                          </label>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Receive important updates, security alerts, and account information via email
                        </p>
                        {notifications.email && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Email notifications enabled</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Push Notifications Card */}
                  <div className="card p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Push Notifications</h3>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications.push}
                              onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                          </label>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Get instant notifications directly to your device for real-time updates
                        </p>
                        {notifications.push && (
                          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Push notifications enabled</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SMS Notifications Card */}
                  <div className="card p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SMS Notifications</h3>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications.sms}
                              onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                          </label>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Receive critical security alerts and urgent notifications via text message
                        </p>
                        {notifications.sms && (
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">SMS notifications enabled</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Marketing Updates Card */}
                  <div className="card p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                        <Coins className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Marketing Updates</h3>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications.marketing}
                              onChange={(e) => setNotifications({ ...notifications, marketing: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                          </label>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Stay informed about new features, product updates, and special promotions
                        </p>
                        {notifications.marketing && (
                          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Marketing updates enabled</span>
                            </div>  
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification Summary Card */}
                <div className="card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notification Summary</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Current notification preferences overview</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className={`text-lg font-bold ${notifications.email ? 'text-blue-500' : 'text-gray-400'}`}>
                        {notifications.email ? '✓' : '✗'}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Email</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className={`text-lg font-bold ${notifications.push ? 'text-purple-500' : 'text-gray-400'}`}>
                        {notifications.push ? '✓' : '✗'}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Push</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className={`text-lg font-bold ${notifications.sms ? 'text-green-500' : 'text-gray-400'}`}>
                        {notifications.sms ? '✓' : '✗'}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">SMS</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className={`text-lg font-bold ${notifications.marketing ? 'text-amber-500' : 'text-gray-400'}`}>
                        {notifications.marketing ? '✓' : '✗'}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Marketing</div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSave('Notifications')}
                    disabled={saving}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-lg hover:from-orange-600 hover:to-red-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                {/* Preferences Header */}
                <div className="card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Globe className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        App Preferences
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Customize your app experience and display settings
                      </p>
                    </div>
                  </div>
                </div>

                {/* Theme Selection Card */}
                <div className="card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <Palette className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Theme</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred color scheme</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        theme === 'light' 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                        <Sun className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Light</span>
                    </button>
                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        theme === 'dark' 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <Moon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Dark</span>
                    </button>
                    <button
                      onClick={() => handleThemeChange('system')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        theme === 'system' 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
                        <Monitor className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">System</span>
                    </button>
                  </div>
                </div>

                {/* Display Settings Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Language Card */}
                  <div className="card p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <Languages className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Language</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Display language</p>
                      </div>
                    </div>
                    <select 
                      value={preferences.language}
                      onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    >
                      <option value="en">English (US)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="zh">Chinese</option>
                      <option value="ja">Japanese</option>
                    </select>
                  </div>

                  {/* Currency Card */}
                  <div className="card p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <Coins className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Currency</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Display currency</p>
                      </div>
                    </div>
                    <select 
                      value={preferences.currency}
                      onChange={(e) => setPreferences(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="SGD">SGD (S$)</option>
                      <option value="IDR">IDR (Rp.)</option>
                      <option value="FC">FC</option>
                    </select>
                  </div>

                  {/* Timezone Card */}
                  <div className="card p-6 hover:shadow-lg transition-shadow md:col-span-2">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Time Zone</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Your local time zone for timestamps</p>
                      </div>
                    </div>
                    <select 
                      value={preferences.timezone}
                      onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="UTC-8">UTC-8 (Pacific Time)</option>
                      <option value="UTC-5">UTC-5 (Eastern Time)</option>
                      <option value="UTC">UTC+0 (GMT)</option>
                      <option value="UTC+1">UTC+1 (Central European)</option>
                      <option value="UTC+8">UTC+8 (Beijing Time)</option>
                      <option value="UTC+9">UTC+9 (Tokyo Time)</option>
                    </select>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSave('Preferences')}
                    disabled={saving}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}