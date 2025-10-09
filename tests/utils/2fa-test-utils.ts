/**
 * 2FA Test Utilities
 * 
 * Shared utilities, mocks, and helpers for 2FA testing.
 * Can be imported and used across all 2FA test files.
 */

import { vi } from 'vitest'

/**
 * Mock Data Generators
 */
export const mock2FAData = {
  /**
   * Generate a valid 2FA setup response
   */
  setupSuccess: (overrides?: Partial<any>) => ({
    success: true,
    secret: 'JBSWY3DPEHPK3PXP',
    qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    backup_codes: ['111111', '222222', '333333', '444444', '555555'],
    provisioning_uri: 'otpauth://totp/FairCoin:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=FairCoin',
    ...overrides
  }),

  /**
   * Generate a 2FA verification success response
   */
  verifySuccess: (overrides?: Partial<any>) => ({
    success: true,
    message: '2FA enabled successfully',
    backup_codes: ['111111', '222222', '333333', '444444', '555555'],
    ...overrides
  }),

  /**
   * Generate a 2FA disable success response
   */
  disableSuccess: (overrides?: Partial<any>) => ({
    success: true,
    message: '2FA disabled successfully',
    ...overrides
  }),

  /**
   * Generate a login with 2FA response
   */
  loginWith2FA: (overrides?: Partial<any>) => ({
    requires_2fa: true,
    temp_session: 'temp-session-token-123',
    message: 'Please enter your 2FA code',
    ...overrides
  }),

  /**
   * Generate a successful 2FA verification for login
   */
  loginVerifySuccess: (overrides?: Partial<any>) => ({
    success: true,
    session_token: 'full-session-token-123',
    user: {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      two_factor_enabled: true,
      ...overrides?.user
    },
    ...overrides
  }),

  /**
   * Generate backup codes status response
   */
  backupCodesStatus: (remaining = 5, total = 5) => ({
    remaining_codes: remaining,
    total_codes: total,
    last_generated: '2024-10-01T12:00:00Z'
  }),

  /**
   * Generate error responses
   */
  errors: {
    invalidCode: () => ({
      error: 'Invalid verification code',
      status: 400
    }),
    expiredCode: () => ({
      error: 'Verification code has expired',
      status: 400
    }),
    unauthorized: () => ({
      error: 'Unauthorized',
      status: 401
    }),
    sessionExpired: () => ({
      error: 'Session expired',
      code: 'SESSION_EXPIRED',
      status: 401
    }),
    rateLimited: (retryAfter = 300) => ({
      error: 'Too many verification attempts',
      retry_after: retryAfter,
      status: 429
    }),
    serverError: () => ({
      error: 'Internal server error',
      status: 500
    }),
    networkError: () => new Error('Network error'),
    invalidJson: () => new Error('Invalid JSON')
  }
}

/**
 * Mock Fetch Helper
 */
export class MockFetchBuilder {
  private responses: Array<{
    ok: boolean
    status: number
    json: () => Promise<any>
  }> = []

  addResponse(data: any, status = 200) {
    this.responses.push({
      ok: status >= 200 && status < 300,
      status,
      json: async () => data
    })
    return this
  }

  addSuccessResponse(data: any) {
    return this.addResponse(data, 200)
  }

  addErrorResponse(error: string, status = 400) {
    return this.addResponse({ error }, status)
  }

  addNetworkError() {
    this.responses.push({
      ok: false,
      status: 0,
      json: async () => {
        throw new Error('Network error')
      }
    })
    return this
  }

  build() {
    return vi.fn()
      .mockImplementation(() => {
        const response = this.responses.shift()
        if (!response) {
          throw new Error('No more mock responses available')
        }
        return Promise.resolve(response)
      })
  }
}

/**
 * Test Environment Setup
 */
export const setupTestEnvironment = () => {
  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
  })

  // Mock sessionStorage
  const sessionStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }

  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
    writable: true
  })

  // Mock document.cookie
  Object.defineProperty(document, 'cookie', {
    writable: true,
    value: ''
  })

  return {
    localStorage: localStorageMock,
    sessionStorage: sessionStorageMock,
    setCookie: (cookie: string) => {
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: cookie
      })
    }
  }
}

/**
 * Authentication Helpers
 */
export const authHelpers = {
  /**
   * Create a mock auth token
   */
  createToken: (userId = 1) => `test-auth-token-${userId}`,

  /**
   * Create a mock session cookie
   */
  createSessionCookie: (sessionId = '123') => `session=session-token-${sessionId}`,

  /**
   * Setup authenticated environment
   */
  setupAuthenticatedUser: (userId = 1, sessionId = '123') => {
    const env = setupTestEnvironment()
    const token = authHelpers.createToken(userId)
    const cookie = authHelpers.createSessionCookie(sessionId)

    env.localStorage.getItem.mockReturnValue(token)
    env.setCookie(cookie)

    return {
      token,
      cookie,
      userId,
      sessionId,
      ...env
    }
  }
}

/**
 * API Call Helpers
 */
export const apiHelpers = {
  /**
   * Create headers for authenticated requests
   */
  createAuthHeaders: (token: string, additionalHeaders = {}) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...additionalHeaders
  }),

  /**
   * Call 2FA setup endpoint
   */
  setup2FA: async (token: string) => {
    return fetch('/api/2fa/setup', {
      method: 'POST',
      headers: apiHelpers.createAuthHeaders(token)
    })
  },

  /**
   * Call 2FA verify endpoint
   */
  verify2FA: async (token: string, code: string) => {
    return fetch('/api/2fa/verify', {
      method: 'POST',
      headers: apiHelpers.createAuthHeaders(token),
      body: JSON.stringify({ code })
    })
  },

  /**
   * Call 2FA disable endpoint
   */
  disable2FA: async (token: string) => {
    return fetch('/api/2fa/disable', {
      method: 'POST',
      headers: apiHelpers.createAuthHeaders(token)
    })
  },

  /**
   * Login with credentials
   */
  login: async (username: string, password: string) => {
    return fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
  },

  /**
   * Verify 2FA during login
   */
  verifyLogin2FA: async (tempSession: string, code: string) => {
    return fetch('/api/auth/verify-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        temp_session: tempSession,
        code
      })
    })
  },

  /**
   * Use backup code during login
   */
  loginWithBackupCode: async (tempSession: string, backupCode: string) => {
    return fetch('/api/auth/verify-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        temp_session: tempSession,
        backup_code: backupCode
      })
    })
  },

  /**
   * Get backup codes status
   */
  getBackupCodesStatus: async (token: string) => {
    return fetch('/api/2fa/backup-codes/status', {
      method: 'GET',
      headers: apiHelpers.createAuthHeaders(token)
    })
  },

  /**
   * Regenerate backup codes
   */
  regenerateBackupCodes: async (token: string) => {
    return fetch('/api/2fa/backup-codes/regenerate', {
      method: 'POST',
      headers: apiHelpers.createAuthHeaders(token)
    })
  }
}

/**
 * Validation Helpers
 */
export const validationHelpers = {
  /**
   * Validate 2FA setup response
   */
  isValidSetupResponse: (data: any) => {
    return (
      data.success === true &&
      typeof data.secret === 'string' &&
      data.secret.length > 0 &&
      typeof data.qr_code === 'string' &&
      data.qr_code.startsWith('data:image/png;base64,') &&
      Array.isArray(data.backup_codes) &&
      data.backup_codes.length >= 5 &&
      typeof data.provisioning_uri === 'string' &&
      data.provisioning_uri.startsWith('otpauth://totp/')
    )
  },

  /**
   * Validate 2FA verification response
   */
  isValidVerifyResponse: (data: any) => {
    return (
      data.success === true &&
      typeof data.message === 'string' &&
      Array.isArray(data.backup_codes) &&
      data.backup_codes.length >= 5
    )
  },

  /**
   * Validate backup codes
   */
  isValidBackupCode: (code: string) => {
    return /^[0-9]{6}$/.test(code)
  },

  /**
   * Validate 2FA code format
   */
  isValid2FACode: (code: string) => {
    return /^[0-9]{6}$/.test(code)
  },

  /**
   * Validate secret format
   */
  isValidSecret: (secret: string) => {
    return /^[A-Z2-7]+ $/.test(secret) && secret.length >= 16
  }
}

/**
 * Test Scenario Builders
 */
export const scenarioBuilders = {
  /**
   * Build a complete 2FA setup scenario
   */
  complete2FASetup: (token: string) => ({
    description: 'Complete 2FA setup flow',
    steps: [
      {
        name: 'Setup 2FA',
        action: () => apiHelpers.setup2FA(token),
        validate: (response: any) => validationHelpers.isValidSetupResponse(response)
      },
      {
        name: 'Verify 2FA code',
        action: () => apiHelpers.verify2FA(token, '123456'),
        validate: (response: any) => validationHelpers.isValidVerifyResponse(response)
      }
    ]
  }),

  /**
   * Build a login with 2FA scenario
   */
  loginWith2FA: (username: string, password: string, code: string) => ({
    description: 'Login with 2FA enabled',
    steps: [
      {
        name: 'Initial login',
        action: () => apiHelpers.login(username, password),
        validate: (response: any) => response.requires_2fa === true
      },
      {
        name: 'Verify 2FA',
        action: (loginResponse: any) => apiHelpers.verifyLogin2FA(loginResponse.temp_session, code),
        validate: (response: any) => response.success === true && response.session_token
      }
    ]
  }),

  /**
   * Build a backup code recovery scenario
   */
  backupCodeRecovery: (username: string, password: string, backupCode: string) => ({
    description: 'Login with backup code',
    steps: [
      {
        name: 'Initial login',
        action: () => apiHelpers.login(username, password),
        validate: (response: any) => response.requires_2fa === true
      },
      {
        name: 'Use backup code',
        action: (loginResponse: any) => apiHelpers.loginWithBackupCode(loginResponse.temp_session, backupCode),
        validate: (response: any) => response.success === true && response.backup_code_used === true
      }
    ]
  })
}

/**
 * Assertion Helpers
 */
export const assertionHelpers = {
  /**
   * Assert response is successful
   */
  assertSuccess: (response: any, message?: string) => {
    if (!response.success) {
      throw new Error(message || `Expected success but got: ${JSON.stringify(response)}`)
    }
  },

  /**
   * Assert response has error
   */
  assertError: (response: any, expectedError?: string) => {
    if (!response.error) {
      throw new Error(`Expected error but got: ${JSON.stringify(response)}`)
    }
    if (expectedError && response.error !== expectedError) {
      throw new Error(`Expected error "${expectedError}" but got "${response.error}"`)
    }
  },

  /**
   * Assert status code
   */
  assertStatus: (actual: number, expected: number) => {
    if (actual !== expected) {
      throw new Error(`Expected status ${expected} but got ${actual}`)
    }
  },

  /**
   * Assert 2FA is enabled
   */
  assert2FAEnabled: (settings: any) => {
    const securitySetting = settings.find((s: any) => s.setting_key === 'security')
    if (!securitySetting || !securitySetting.setting_value.twoFactor) {
      throw new Error('2FA is not enabled in settings')
    }
  }
}

/**
 * Cleanup Helpers
 */
export const cleanupHelpers = {
  /**
   * Reset all mocks
   */
  resetAllMocks: () => {
    vi.resetAllMocks()
  },

  /**
   * Clear storage
   */
  clearStorage: () => {
    localStorage.clear()
    sessionStorage.clear()
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: ''
    })
  },

  /**
   * Complete cleanup
   */
  cleanup: () => {
    cleanupHelpers.resetAllMocks()
    cleanupHelpers.clearStorage()
  }
}

/**
 * Time-based Helpers
 */
export const timeHelpers = {
  /**
   * Generate current timestamp
   */
  now: () => new Date().toISOString(),

  /**
   * Generate timestamp in the past
   */
  past: (minutesAgo: number) => {
    const date = new Date()
    date.setMinutes(date.getMinutes() - minutesAgo)
    return date.toISOString()
  },

  /**
   * Generate timestamp in the future
   */
  future: (minutesFromNow: number) => {
    const date = new Date()
    date.setMinutes(date.getMinutes() + minutesFromNow)
    return date.toISOString()
  },

  /**
   * Wait for specified milliseconds
   */
  wait: (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Export all utilities
 */
export default {
  mock2FAData,
  MockFetchBuilder,
  setupTestEnvironment,
  authHelpers,
  apiHelpers,
  validationHelpers,
  scenarioBuilders,
  assertionHelpers,
  cleanupHelpers,
  timeHelpers
}
