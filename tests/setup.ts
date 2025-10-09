/**
 * Vitest Test Setup
 * 
 * Global setup for all tests including:
 * - Environment configuration
 * - Global mocks
 * - Test utilities
 */

import { beforeAll, afterEach, afterAll, vi } from 'vitest'

// Set environment variables for tests
process.env.BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080'
process.env.NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// Global test configuration
beforeAll(() => {
  // Any global setup needed before all tests
})

afterEach(() => {
  // Clear all mocks after each test
  vi.clearAllMocks()
})

afterAll(() => {
  // Cleanup after all tests
  vi.resetAllMocks()
})

// Mock Next.js specific APIs if needed
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}))

// Export test utilities
export {}
