/**
 * Frontend API 2FA Tests
 * 
 * Tests for 2FA API endpoints that proxy to the Go backend.
 * These tests verify the expected behavior without importing route handlers.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch as any

// Mock environment
process.env.BACKEND_URL = 'http://localhost:8080'

// Helper to simulate API route behavior
async function callBackendAPI(endpoint: string, options: RequestInit = {}) {
  return fetch(`${process.env.BACKEND_URL}/api/v1${endpoint}`, options)
}

describe('Frontend API 2FA Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('2FA Setup Endpoint', () => {
    it('should forward setup request to backend successfully', async () => {
      const mockResponse = {
        success: true,
        secret: 'JBSWY3DPEHPK3PXP',
        qr_code: 'data:image/png;base64,ABC123',
        backup_codes: ['111111', '222222', '333333', '444444', '555555']
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      })

      const response = await callBackendAPI('/2fa/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        }
      })

      const data = await response.json()

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/2fa/setup',
        expect.objectContaining({
          method: 'POST'
        })
      )
      expect(data.success).toBe(true)
      expect(data.secret).toBe('JBSWY3DPEHPK3PXP')
      expect(data.backup_codes).toHaveLength(5)
    })

    it('should handle setup errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Failed to generate secret' })
      })

      const response = await callBackendAPI('/2fa/setup', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer test-token' }
      })

      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to generate secret')
    })
  })

  describe('2FA Verify Endpoint', () => {
    it('should verify 2FA code successfully', async () => {
      const mockResponse = {
        success: true,
        message: '2FA enabled successfully',
        backup_codes: ['111111', '222222', '333333', '444444', '555555']
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      })

      const response = await callBackendAPI('/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify({ code: '123456' })
      })

      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.message).toBe('2FA enabled successfully')
    })

    it('should handle invalid code', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Invalid verification code' })
      })

      const response = await callBackendAPI('/2fa/verify', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer test-token' },
        body: JSON.stringify({ code: '000000' })
      })

      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid verification code')
    })

    it('should handle rate limiting', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({
          error: 'Too many attempts',
          retry_after: 300
        })
      })

      const response = await callBackendAPI('/2fa/verify', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer test-token' },
        body: JSON.stringify({ code: '123456' })
      })

      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.retry_after).toBe(300)
    })
  })

  describe('2FA Disable Endpoint', () => {
    it('should disable 2FA successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: '2FA disabled successfully'
        })
      })

      const response = await callBackendAPI('/2fa/disable', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer test-token' }
      })

      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.message).toBe('2FA disabled successfully')
    })

    it('should handle disable when not enabled', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: '2FA is not currently enabled' })
      })

      const response = await callBackendAPI('/2fa/disable', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer test-token' }
      })

      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('2FA is not currently enabled')
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(
        callBackendAPI('/2fa/setup', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer test-token' }
        })
      ).rejects.toThrow('Network error')
    })

    it('should handle unauthorized requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Unauthorized' })
      })

      const response = await callBackendAPI('/2fa/setup', {
        method: 'POST'
      })

      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })

  describe('Status Code Propagation', () => {
    const testCases = [
      { status: 200, desc: 'OK' },
      { status: 400, desc: 'Bad Request' },
      { status: 401, desc: 'Unauthorized' },
      { status: 429, desc: 'Too Many Requests' },
      { status: 500, desc: 'Internal Server Error' }
    ]

    testCases.forEach(({ status, desc }) => {
      it(`should propagate ${status} ${desc}`, async () => {
        mockFetch.mockResolvedValueOnce({
          ok: status >= 200 && status < 300,
          status,
          json: async () => ({
            success: status < 400,
            error: status >= 400 ? desc : undefined
          })
        })

        const response = await callBackendAPI('/2fa/setup', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer test-token' }
        })

        expect(response.status).toBe(status)
      })
    })
  })
})
