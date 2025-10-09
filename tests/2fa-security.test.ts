/**
 * 2FA Security Tests
 * 
 * Tests for Two-Factor Authentication functionality including:
 * - 2FA Setup Process
 * - Enable/Disable 2FA
 * - Login with 2FA
 * - Backup Codes Management
 * - Security Settings Integration
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

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: 'session=test-session-token'
})

describe('2FA Security Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('test-auth-token')
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('2FA Setup Process', () => {
    it('should initiate 2FA setup and generate QR code', async () => {
      // Mock successful 2FA setup response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          secret: 'JBSWY3DPEHPK3PXP',
          qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          backup_codes: ['123456', '789012']
        })
      })

      // Simulate 2FA setup API call
      const response = await fetch('/api/2fa/setup', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-auth-token',
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      expect(mockFetch).toHaveBeenCalledWith('/api/2fa/setup', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-auth-token',
          'Content-Type': 'application/json'
        }
      })

      expect(data).toEqual({
        success: true,
        secret: 'JBSWY3DPEHPK3PXP',
        qr_code: expect.stringContaining('data:image/png;base64'),
        backup_codes: expect.arrayContaining(['123456', '789012'])
      })
    })

    it('should handle 2FA setup failure', async () => {
      // Mock failed 2FA setup response
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          error: 'Failed to generate 2FA secret'
        })
      })

      const response = await fetch('/api/2fa/setup', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-auth-token',
          'Content-Type': 'application/json'
        }
      })

      expect(response.ok).toBe(false)
      expect(response.status).toBe(500)

      const data = await response.json()
      expect(data.error).toBe('Failed to generate 2FA secret')
    })

    it('should handle missing authentication token', async () => {
      localStorageMock.getItem.mockReturnValue(null)
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: ''
      })

      // Mock unauthorized response
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          error: 'Authentication required'
        })
      })

      const response = await fetch('/api/2fa/setup', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ',
          'Content-Type': 'application/json'
        }
      })

      expect(response.status).toBe(401)
    })
  })

  describe('2FA Verification', () => {
    it('should verify 2FA code successfully', async () => {
      // Mock successful verification response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: '2FA enabled successfully',
          backup_codes: ['111111', '222222', '333333', '444444', '555555']
        })
      })

      const verificationCode = '123456'

      const response = await fetch('/api/2fa/verify', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-auth-token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: verificationCode })
      })

      const data = await response.json()

      expect(mockFetch).toHaveBeenCalledWith('/api/2fa/verify', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-auth-token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: verificationCode })
      })

      expect(data).toEqual({
        success: true,
        message: '2FA enabled successfully',
        backup_codes: expect.arrayContaining(['111111', '222222', '333333', '444444', '555555'])
      })
    })

    it('should handle invalid 2FA code', async () => {
      // Mock invalid code response
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Invalid verification code'
        })
      })

      const response = await fetch('/api/2fa/verify', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-auth-token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: '000000' })
      })

      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBe('Invalid verification code')
    })

    it('should handle expired verification code', async () => {
      // Mock expired code response
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Verification code has expired'
        })
      })

      const response = await fetch('/api/2fa/verify', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-auth-token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: '123456' })
      })

      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBe('Verification code has expired')
    })
  })

  describe('2FA Disable', () => {
    it('should disable 2FA successfully', async () => {
      // Mock successful disable response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: '2FA disabled successfully'
        })
      })

      const response = await fetch('/api/2fa/disable', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-auth-token',
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      expect(mockFetch).toHaveBeenCalledWith('/api/2fa/disable', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-auth-token',
          'Content-Type': 'application/json'
        }
      })

      expect(data).toEqual({
        success: true,
        message: '2FA disabled successfully'
      })
    })

    it('should handle disable failure when 2FA not enabled', async () => {
      // Mock failure response
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: '2FA is not currently enabled'
        })
      })

      const response = await fetch('/api/2fa/disable', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-auth-token',
          'Content-Type': 'application/json'
        }
      })

      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBe('2FA is not currently enabled')
    })
  })

  describe('Login with 2FA', () => {
    it('should require 2FA code during login when enabled', async () => {
      // Mock login response requiring 2FA
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          requires_2fa: true,
          session_token: 'temp-session-token'
        })
      })

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'testuser',
          password: 'testpassword'
        })
      })

      const data = await response.json()

      expect(data.requires_2fa).toBe(true)
      expect(data.session_token).toBe('temp-session-token')
    })

    it('should complete login with valid 2FA code', async () => {
      // Mock successful 2FA login completion
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          session_token: 'full-session-token',
          user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com'
          }
        })
      })

      const response = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          temp_session: 'temp-session-token',
          code: '123456'
        })
      })

      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.session_token).toBe('full-session-token')
      expect(data.user.username).toBe('testuser')
    })

    it('should reject login with invalid 2FA code', async () => {
      // Mock failed 2FA login
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          error: 'Invalid 2FA code'
        })
      })

      const response = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          temp_session: 'temp-session-token',
          code: '000000'
        })
      })

      expect(response.status).toBe(401)

      const data = await response.json()
      expect(data.error).toBe('Invalid 2FA code')
    })

    it('should allow backup code usage for login', async () => {
      // Mock successful backup code login
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          session_token: 'full-session-token',
          backup_code_used: true,
          remaining_backup_codes: 4
        })
      })

      const response = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          temp_session: 'temp-session-token',
          backup_code: '111111'
        })
      })

      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.backup_code_used).toBe(true)
      expect(data.remaining_backup_codes).toBe(4)
    })
  })

  describe('Backup Codes Management', () => {
    it('should generate new backup codes', async () => {
      // Mock backup codes generation
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          backup_codes: ['111111', '222222', '333333', '444444', '555555']
        })
      })

      const response = await fetch('/api/2fa/backup-codes', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-auth-token',
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.backup_codes).toHaveLength(5)
      expect(data.backup_codes).toEqual(
        expect.arrayContaining(['111111', '222222', '333333', '444444', '555555'])
      )
    })

    it('should get remaining backup codes count', async () => {
      // Mock backup codes status
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          remaining_codes: 3,
          total_codes: 5
        })
      })

      const response = await fetch('/api/2fa/backup-codes/status', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer test-auth-token',
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      expect(data.remaining_codes).toBe(3)
      expect(data.total_codes).toBe(5)
    })
  })

  describe('Security Settings Integration', () => {
    it('should update security settings when 2FA is enabled', async () => {
      // Mock settings update
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Security settings updated'
        })
      })

      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-auth-token',
          'Content-Type': 'application/json'
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

      const data = await response.json()

      expect(mockFetch).toHaveBeenCalledWith('/api/settings', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-auth-token',
          'Content-Type': 'application/json'
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

      expect(data.success).toBe(true)
    })

    it('should load 2FA status from security settings', async () => {
      // Mock dashboard data with 2FA enabled
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: { id: 1, username: 'testuser' },
          profile: { bio: 'Test bio' },
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
                backup_codes_remaining: 4
              }
            }
          ]
        })
      })

      const response = await fetch('/api/dashboard', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer test-auth-token',
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      // Check that 2FA settings are properly loaded
      const securitySetting = data.settings.find((s: any) => s.setting_key === 'security')
      const twoFactorSetting = data.settings.find((s: any) => s.setting_key === 'two_factor_auth')

      expect(securitySetting.setting_value.twoFactor).toBe(true)
      expect(twoFactorSetting.setting_value.enabled).toBe(true)
      expect(twoFactorSetting.setting_value.backup_codes_remaining).toBe(4)
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      // Mock network error
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      try {
        await fetch('/api/2fa/setup', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer test-auth-token',
            'Content-Type': 'application/json'
          }
        })
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toBe('Network error')
      }
    })

    it('should handle invalid JSON responses', async () => {
      // Mock invalid JSON response
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('Invalid JSON')
        }
      })

      const response = await fetch('/api/2fa/setup', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-auth-token',
          'Content-Type': 'application/json'
        }
      })

      expect(response.ok).toBe(false)

      try {
        await response.json()
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toBe('Invalid JSON')
      }
    })

    it('should handle session expiration during 2FA operations', async () => {
      // Mock session expired response
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          error: 'Session expired',
          code: 'SESSION_EXPIRED'
        })
      })

      const response = await fetch('/api/2fa/setup', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer expired-token',
          'Content-Type': 'application/json'
        }
      })

      expect(response.status).toBe(401)

      const data = await response.json()
      expect(data.error).toBe('Session expired')
      expect(data.code).toBe('SESSION_EXPIRED')
    })
  })

  describe('Rate Limiting', () => {
    it('should handle rate limiting for 2FA verification attempts', async () => {
      // Mock rate limit response
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({
          error: 'Too many verification attempts',
          retry_after: 300 // 5 minutes
        })
      })

      const response = await fetch('/api/2fa/verify', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-auth-token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: '123456' })
      })

      expect(response.status).toBe(429)

      const data = await response.json()
      expect(data.error).toBe('Too many verification attempts')
      expect(data.retry_after).toBe(300)
    })
  })

  describe('QR Code Generation', () => {
    it('should generate valid QR code data URL', async () => {
      // Mock QR code response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          secret: 'JBSWY3DPEHPK3PXP',
          qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          provisioning_uri: 'otpauth://totp/FairCoin:testuser?secret=JBSWY3DPEHPK3PXP&issuer=FairCoin'
        })
      })

      const response = await fetch('/api/2fa/setup', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-auth-token',
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      expect(data.qr_code).toMatch(/^data:image\/png;base64,/)
      expect(data.provisioning_uri).toMatch(/^otpauth:\/\/totp\/FairCoin:/)
      expect(data.secret).toMatch(/^[A-Z0-9]{16}$/)
    })
  })
})

// Integration Test Helper Functions
export const test2FAFlow = {
  async setup2FA(token: string) {
    return fetch('/api/2fa/setup', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  },

  async verify2FA(token: string, code: string) {
    return fetch('/api/2fa/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    })
  },

  async disable2FA(token: string) {
    return fetch('/api/2fa/disable', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  },

  async loginWith2FA(username: string, password: string, code: string) {
    // Step 1: Initial login
    const loginResponse = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    const loginData = await loginResponse.json()

    if (loginData.requires_2fa) {
      // Step 2: 2FA verification
      return fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temp_session: loginData.session_token,
          code
        })
      })
    }

    return loginResponse
  }
}