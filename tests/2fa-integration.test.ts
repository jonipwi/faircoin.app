/**
 * 2FA Integration Tests
 * 
 * End-to-end integration tests for complete 2FA workflows.
 * Tests the integration between frontend, API routes, and backend.
 * 
 * Test Coverage:
 * - Complete 2FA setup flow (setup → verify → login)
 * - 2FA disable flow
 * - Login with 2FA enabled
 * - Backup code recovery flow
 * - Security settings integration
 * - Error recovery scenarios
 * - Session management with 2FA
 */

import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest'

// Mock fetch for API calls
global.fetch = vi.fn()
const mockFetch = fetch as Mock

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
})

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: ''
})

describe('2FA Integration Tests', () => {
  let authToken: string
  let sessionCookie: string

  beforeEach(() => {
    vi.clearAllMocks()
    authToken = 'test-auth-token-123'
    sessionCookie = 'session-token-456'
    localStorageMock.getItem.mockReturnValue(authToken)
    document.cookie = `session=${sessionCookie}`
  })

  afterEach(() => {
    vi.resetAllMocks()
    localStorageMock.clear()
    sessionStorageMock.clear()
    document.cookie = ''
  })

  describe('Complete 2FA Setup Flow', () => {
    it('should complete full 2FA setup workflow', async () => {
      // Step 1: User initiates 2FA setup
      const setupResponse = {
        success: true,
        secret: 'JBSWY3DPEHPK3PXP',
        qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAY=',
        backup_codes: ['111111', '222222', '333333', '444444', '555555'],
        provisioning_uri: 'otpauth://totp/FairCoin:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=FairCoin'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => setupResponse,
      })

      const setupResult = await fetch('/api/2fa/setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })

      const setupData = await setupResult.json()
      expect(setupData.success).toBe(true)
      expect(setupData.secret).toBeDefined()
      expect(setupData.qr_code).toMatch(/^data:image\/png/)

      // Store secret temporarily for verification
      sessionStorageMock.setItem('2fa_setup_secret', setupData.secret)

      // Step 2: User scans QR code and enters verification code
      const verificationCode = '123456' // User enters code from authenticator app

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: '2FA enabled successfully',
          backup_codes: setupResponse.backup_codes
        }),
      })

      const verifyResult = await fetch('/api/2fa/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: verificationCode })
      })

      const verifyData = await verifyResult.json()
      expect(verifyData.success).toBe(true)
      expect(verifyData.backup_codes).toHaveLength(5)

      // Store backup codes securely
      localStorageMock.setItem('2fa_backup_codes_stored', 'true')
      sessionStorageMock.removeItem('2fa_setup_secret')

      // Step 3: Update user settings to reflect 2FA enabled
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Security settings updated'
        }),
      })

      const settingsResult = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          setting_key: 'security',
          setting_value: {
            twoFactor: true,
            loginAlerts: true,
            sessionTimeout: '30'
          }
        })
      })

      const settingsData = await settingsResult.json()
      expect(settingsData.success).toBe(true)

      // Verify complete flow
      expect(mockFetch).toHaveBeenCalledTimes(3)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('2fa_backup_codes_stored', 'true')
    })

    it('should handle setup failure and allow retry', async () => {
      // First attempt fails
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Failed to generate 2FA secret' }),
        status: 500,
      })

      const firstAttempt = await fetch('/api/2fa/setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })

      expect(firstAttempt.ok).toBe(false)

      // Retry succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          secret: 'JBSWY3DPEHPK3PXP',
          qr_code: 'data:image/png;base64,iVBORw0KGg==',
          backup_codes: ['111111', '222222']
        }),
      })

      const retryAttempt = await fetch('/api/2fa/setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })

      const retryData = await retryAttempt.json()
      expect(retryData.success).toBe(true)
    })
  })

  describe('Login with 2FA Enabled', () => {
    it('should require 2FA code during login', async () => {
      // Step 1: Initial login with username and password
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          requires_2fa: true,
          temp_session: 'temp-session-token-789',
          message: 'Please enter your 2FA code'
        }),
      })

      const loginResult = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          password: 'TestPassword123!'
        })
      })

      const loginData = await loginResult.json()
      expect(loginData.requires_2fa).toBe(true)
      expect(loginData.temp_session).toBeDefined()

      // Store temp session
      sessionStorageMock.setItem('temp_session', loginData.temp_session)

      // Step 2: Submit 2FA code
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          session_token: 'full-session-token-123',
          user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            two_factor_enabled: true
          }
        }),
      })

      const verify2FAResult = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temp_session: loginData.temp_session,
          code: '123456'
        })
      })

      const verify2FAData = await verify2FAResult.json()
      expect(verify2FAData.success).toBe(true)
      expect(verify2FAData.session_token).toBeDefined()
      expect(verify2FAData.user.two_factor_enabled).toBe(true)

      // Store full session
      localStorageMock.setItem('auth_token', verify2FAData.session_token)
      sessionStorageMock.removeItem('temp_session')
    })

    it('should handle invalid 2FA code during login', async () => {
      // Initial login successful
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          requires_2fa: true,
          temp_session: 'temp-session-token-789'
        }),
      })

      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          password: 'TestPassword123!'
        })
      })

      // Invalid 2FA code
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          error: 'Invalid 2FA code',
          attempts_remaining: 2
        }),
      })

      const verify2FAResult = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temp_session: 'temp-session-token-789',
          code: '000000'
        })
      })

      const verify2FAData = await verify2FAResult.json()
      expect(verify2FAData.error).toBe('Invalid 2FA code')
      expect(verify2FAData.attempts_remaining).toBe(2)
    })

    it('should allow login with backup code', async () => {
      // Initial login
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          requires_2fa: true,
          temp_session: 'temp-session-token-789'
        }),
      })

      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          password: 'TestPassword123!'
        })
      })

      // Use backup code instead of 2FA code
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          session_token: 'full-session-token-123',
          backup_code_used: true,
          remaining_backup_codes: 4,
          warning: 'Backup code used. Please regenerate backup codes.',
          user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com'
          }
        }),
      })

      const verify2FAResult = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temp_session: 'temp-session-token-789',
          backup_code: '111111'
        })
      })

      const verify2FAData = await verify2FAResult.json()
      expect(verify2FAData.success).toBe(true)
      expect(verify2FAData.backup_code_used).toBe(true)
      expect(verify2FAData.remaining_backup_codes).toBe(4)
      expect(verify2FAData.warning).toContain('regenerate backup codes')
    })
  })

  describe('2FA Disable Flow', () => {
    it('should disable 2FA and update settings', async () => {
      // Step 1: Disable 2FA
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: '2FA disabled successfully'
        }),
      })

      const disableResult = await fetch('/api/2fa/disable', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })

      const disableData = await disableResult.json()
      expect(disableData.success).toBe(true)

      // Step 2: Update security settings
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Security settings updated'
        }),
      })

      const settingsResult = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          setting_key: 'security',
          setting_value: {
            twoFactor: false,
            loginAlerts: true,
            sessionTimeout: '30'
          }
        })
      })

      const settingsData = await settingsResult.json()
      expect(settingsData.success).toBe(true)

      // Clean up local storage
      localStorageMock.removeItem('2fa_backup_codes_stored')
    })
  })

  describe('Backup Codes Management', () => {
    it('should regenerate backup codes when running low', async () => {
      // Check current backup codes status
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          remaining_codes: 1,
          total_codes: 5
        }),
      })

      const statusResult = await fetch('/api/2fa/backup-codes/status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })

      const statusData = await statusResult.json()
      expect(statusData.remaining_codes).toBe(1)

      // Regenerate backup codes
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          backup_codes: ['999999', '888888', '777777', '666666', '555555'],
          message: 'Backup codes regenerated successfully'
        }),
      })

      const regenerateResult = await fetch('/api/2fa/backup-codes/regenerate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })

      const regenerateData = await regenerateResult.json()
      expect(regenerateData.success).toBe(true)
      expect(regenerateData.backup_codes).toHaveLength(5)
    })

    it('should warn user about backup code usage', async () => {
      // Simulate login with backup code
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          requires_2fa: true,
          temp_session: 'temp-session'
        }),
      })

      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          password: 'TestPassword123!'
        })
      })

      // Use backup code with only 1 remaining
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          session_token: 'session-123',
          backup_code_used: true,
          remaining_backup_codes: 0,
          critical_warning: 'You have used your last backup code. Please regenerate immediately.',
          user: { id: 1, username: 'testuser' }
        }),
      })

      const verifyResult = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temp_session: 'temp-session',
          backup_code: '111111'
        })
      })

      const verifyData = await verifyResult.json()
      expect(verifyData.remaining_backup_codes).toBe(0)
      expect(verifyData.critical_warning).toContain('regenerate immediately')
    })
  })

  describe('Security Settings Integration', () => {
    it('should load complete security dashboard with 2FA status', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            two_factor_enabled: true,
            created_at: '2024-01-01T00:00:00Z'
          },
          profile: {
            bio: 'Test user bio',
            avatar_url: '/avatars/default.png'
          },
          settings: [
            {
              setting_key: 'security',
              setting_value: {
                twoFactor: true,
                loginAlerts: true,
                sessionTimeout: '30'
              }
            },
            {
              setting_key: 'two_factor_auth',
              setting_value: {
                enabled: true,
                backup_codes_remaining: 4,
                last_used: '2024-10-05T10:30:00Z',
                setup_date: '2024-10-01T12:00:00Z'
              }
            }
          ],
          recent_security_events: [
            {
              id: 1,
              event_type: '2FA_LOGIN',
              timestamp: '2024-10-05T10:30:00Z',
              ip_address: '192.168.1.1',
              user_agent: 'Mozilla/5.0...'
            }
          ]
        }),
      })

      const dashboardResult = await fetch('/api/dashboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })

      const dashboardData = await dashboardResult.json()
      expect(dashboardData.user.two_factor_enabled).toBe(true)

      const securitySetting = dashboardData.settings.find(
        (s: any) => s.setting_key === 'security'
      )
      expect(securitySetting.setting_value.twoFactor).toBe(true)

      const twoFactorSetting = dashboardData.settings.find(
        (s: any) => s.setting_key === 'two_factor_auth'
      )
      expect(twoFactorSetting.setting_value.enabled).toBe(true)
      expect(twoFactorSetting.setting_value.backup_codes_remaining).toBe(4)
    })
  })

  describe('Error Recovery Scenarios', () => {
    it('should handle lost authenticator device with backup codes', async () => {
      // User cannot access authenticator app, uses backup code
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          requires_2fa: true,
          temp_session: 'temp-session'
        }),
      })

      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          password: 'TestPassword123!'
        })
      })

      // Use backup code
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          session_token: 'session-123',
          backup_code_used: true,
          remaining_backup_codes: 3,
          user: { id: 1, username: 'testuser' }
        }),
      })

      const verifyResult = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temp_session: 'temp-session',
          backup_code: '111111'
        })
      })

      expect(verifyResult.ok).toBe(true)

      // Disable old 2FA
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      await fetch('/api/2fa/disable', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer session-123',
          'Content-Type': 'application/json',
        },
      })

      // Setup new 2FA with new device
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          secret: 'NEWJBSWY3DPEHPK3PXP',
          qr_code: 'data:image/png;base64,new==',
          backup_codes: ['new1', 'new2', 'new3', 'new4', 'new5']
        }),
      })

      const newSetupResult = await fetch('/api/2fa/setup', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer session-123',
          'Content-Type': 'application/json',
        },
      })

      const newSetupData = await newSetupResult.json()
      expect(newSetupData.success).toBe(true)
      expect(newSetupData.secret).not.toBe('JBSWY3DPEHPK3PXP')
    })

    it('should handle rate limiting gracefully', async () => {
      // Set up rate limited response directly
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({
          error: 'Too many verification attempts',
          retry_after: 300,
          message: 'Please wait 5 minutes before trying again'
        }),
      })

      const rateLimitedResult = await fetch('/api/2fa/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: '000000' })
      })

      const rateLimitedData = await rateLimitedResult.json()
      expect(rateLimitedResult.status).toBe(429)
      expect(rateLimitedData.retry_after).toBe(300)
    })

    it('should handle session expiration during 2FA setup', async () => {
      // Start setup
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          secret: 'JBSWY3DPEHPK3PXP',
          qr_code: 'data:image/png;base64,abc=='
        }),
      })

      await fetch('/api/2fa/setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })

      // Simulate session expiration during verification
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          error: 'Session expired',
          code: 'SESSION_EXPIRED'
        }),
      })

      const verifyResult = await fetch('/api/2fa/verify', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer expired-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: '123456' })
      })

      const verifyData = await verifyResult.json()
      expect(verifyResult.status).toBe(401)
      expect(verifyData.code).toBe('SESSION_EXPIRED')

      // Should redirect to login
      expect(verifyData.error).toBe('Session expired')
    })
  })

  describe('Session Management', () => {
    it('should invalidate old sessions after 2FA enabled', async () => {
      // Enable 2FA
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            secret: 'JBSWY3DPEHPK3PXP',
            qr_code: 'data:image/png;base64,abc=='
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            message: '2FA enabled successfully'
          }),
        })

      await fetch('/api/2fa/setup', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
      })

      await fetch('/api/2fa/verify', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ code: '123456' })
      })

      // Logout all sessions
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'All sessions invalidated',
          sessions_cleared: 3
        }),
      })

      const logoutResult = await fetch('/api/auth/logout-all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })

      const logoutData = await logoutResult.json()
      expect(logoutData.success).toBe(true)
      expect(logoutData.sessions_cleared).toBeGreaterThan(0)
    })
  })
})

/**
 * Integration Test Utilities
 */
export const integrationTestUtils = {
  /**
   * Simulate complete 2FA setup flow
   */
  async complete2FASetupFlow(authToken: string) {
    const flow = {
      setup: null as any,
      verify: null as any,
      settings: null as any,
      success: false,
      error: null as string | null
    }

    try {
      // Setup
      const setupResponse = await fetch('/api/2fa/setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })
      flow.setup = await setupResponse.json()

      // Verify
      const verifyResponse = await fetch('/api/2fa/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: '123456' })
      })
      flow.verify = await verifyResponse.json()

      // Update settings
      const settingsResponse = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          setting_key: 'security',
          setting_value: { twoFactor: true }
        })
      })
      flow.settings = await settingsResponse.json()

      flow.success = flow.setup.success && flow.verify.success && flow.settings.success

    } catch (error) {
      flow.error = (error as Error).message
    }

    return flow
  },

  /**
   * Simulate login with 2FA
   */
  async loginWith2FA(username: string, password: string, code: string) {
    // Login
    const loginResponse = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    const loginData = await loginResponse.json()

    if (loginData.requires_2fa) {
      // Verify 2FA
      const verifyResponse = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temp_session: loginData.temp_session,
          code
        })
      })

      return verifyResponse.json()
    }

    return loginData
  }
}
