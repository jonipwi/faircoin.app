# 2FA Testing Suite

Comprehensive test suite for Two-Factor Authentication (2FA) functionality in FairCoin App.

## 📋 Table of Contents

- [Overview](#overview)
- [Test Files](#test-files)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Test Utilities](#test-utilities)
- [Writing New Tests](#writing-new-tests)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This test suite provides comprehensive coverage for all 2FA-related functionality including:

- **Setup & Configuration**: 2FA initialization, QR code generation, secret management
- **Verification**: Code validation, backup codes, rate limiting
- **Authentication**: Login flows with 2FA enabled
- **Security**: Session management, error handling, recovery scenarios
- **Integration**: Frontend-backend communication, API proxying

## 📁 Test Files

### 1. `2fa-security.test.ts`
**Original comprehensive security tests**

Tests the core 2FA functionality from the user's perspective:
- 2FA setup process and QR code generation
- 2FA verification and enabling
- 2FA disable functionality
- Login with 2FA enabled
- Backup codes management
- Security settings integration
- Error handling and edge cases
- Rate limiting
- QR code validation

**Run with:**
```bash
npm test 2fa-security.test.ts
```

### 2. `frontend-api-2fa.test.ts`
**Frontend API route tests**

Tests the Next.js API routes that act as a proxy between frontend and Go backend:
- `/api/2fa/setup` endpoint testing
- `/api/2fa/verify` endpoint testing
- `/api/2fa/disable` endpoint testing
- Request/response forwarding
- Cookie and authorization header handling
- Error response propagation
- Status code handling
- Environment configuration

**Run with:**
```bash
npm test frontend-api-2fa.test.ts
```

### 3. `2fa-integration.test.ts`
**End-to-end integration tests**

Tests complete user workflows and integration scenarios:
- Complete 2FA setup workflow (setup → verify → settings update)
- Login with 2FA enabled (password → 2FA code → session)
- 2FA disable and settings cleanup
- Backup codes management and regeneration
- Security dashboard integration
- Error recovery scenarios
- Session management and invalidation
- Lost authenticator device recovery
- Rate limiting behavior
- Session expiration handling

**Run with:**
```bash
npm test 2fa-integration.test.ts
```

### 4. `utils/2fa-test-utils.ts`
**Shared test utilities and helpers**

Reusable utilities for all 2FA tests:
- Mock data generators
- MockFetchBuilder for complex scenarios
- Environment setup helpers
- Authentication helpers
- API call helpers
- Validation helpers
- Scenario builders
- Assertion helpers
- Cleanup utilities
- Time-based helpers

**Import in tests:**
```typescript
import { mock2FAData, apiHelpers, authHelpers } from './utils/2fa-test-utils'
```

## 🚀 Running Tests

### Navigate to Project
```bash
cd c:\Job\faircoin\faircoin.app
```

### Run All Tests
```bash
npm test
```

### Run Tests with UI
```bash
npm run test:ui
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Watch Mode
Vitest runs in watch mode by default. Tests will automatically re-run when you save files.

To exit watch mode, press `q` in the terminal.

## 📊 Test Coverage

### Current Coverage Areas

#### ✅ Core Functionality
- [x] 2FA setup and initialization
- [x] QR code generation and validation
- [x] Secret generation
- [x] Backup codes creation (5 codes)
- [x] 2FA code verification
- [x] 2FA enable/disable
- [x] Settings integration

#### ✅ Authentication Flows
- [x] Standard login with 2FA
- [x] 2FA code verification during login
- [x] Backup code usage during login
- [x] Session management with 2FA
- [x] Temporary session handling
- [x] Full session creation after 2FA

#### ✅ Error Handling
- [x] Invalid 2FA codes
- [x] Expired verification codes
- [x] Rate limiting (429 status)
- [x] Unauthorized access (401 status)
- [x] Session expiration
- [x] Network errors
- [x] Invalid JSON responses
- [x] Backend timeout
- [x] Malformed request bodies

#### ✅ Security Features
- [x] Authorization header forwarding
- [x] Cookie management
- [x] Session invalidation
- [x] Backup code tracking
- [x] Low backup code warnings
- [x] Critical backup code alerts

#### ✅ Recovery Scenarios
- [x] Lost authenticator device recovery
- [x] Backup code usage
- [x] 2FA reset and re-setup
- [x] Multiple failed attempts
- [x] Account recovery flow

#### ✅ API Integration
- [x] Frontend → Backend forwarding
- [x] Status code propagation
- [x] Error message forwarding
- [x] Response data transformation
- [x] Environment configuration

### Coverage Goals
- **Line Coverage**: > 80%
- **Branch Coverage**: > 75%
- **Function Coverage**: > 85%
- **Statement Coverage**: > 80%

## 🛠️ Test Utilities

### Mock Data Generators

```typescript
import { mock2FAData } from './utils/2fa-test-utils'

// Generate setup success response
const setupData = mock2FAData.setupSuccess()

// Generate verification success
const verifyData = mock2FAData.verifySuccess()

// Generate error responses
const error = mock2FAData.errors.invalidCode()
```

### API Helpers

```typescript
import { apiHelpers } from './utils/2fa-test-utils'

// Call 2FA endpoints
await apiHelpers.setup2FA(token)
await apiHelpers.verify2FA(token, '123456')
await apiHelpers.disable2FA(token)

// Login with 2FA
await apiHelpers.login('username', 'password')
await apiHelpers.verifyLogin2FA(tempSession, '123456')
await apiHelpers.loginWithBackupCode(tempSession, '111111')
```

### MockFetchBuilder

```typescript
import { MockFetchBuilder } from './utils/2fa-test-utils'

const mockFetch = new MockFetchBuilder()
  .addSuccessResponse({ success: true })
  .addErrorResponse('Invalid code', 400)
  .addNetworkError()
  .build()

global.fetch = mockFetch
```

### Validation Helpers

```typescript
import { validationHelpers } from './utils/2fa-test-utils'

// Validate responses
validationHelpers.isValidSetupResponse(data)
validationHelpers.isValidVerifyResponse(data)
validationHelpers.isValid2FACode('123456')
validationHelpers.isValidBackupCode('111111')
```

## ✍️ Writing New Tests

### 1. Basic Test Structure

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setupTestEnvironment, mock2FAData, apiHelpers } from './utils/2fa-test-utils'

describe('My 2FA Feature', () => {
  let env: any

  beforeEach(() => {
    env = setupTestEnvironment()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should test specific feature', async () => {
    // Arrange
    const mockData = mock2FAData.setupSuccess()
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData
    })

    // Act
    const result = await apiHelpers.setup2FA('test-token')
    const data = await result.json()

    // Assert
    expect(data.success).toBe(true)
    expect(data.secret).toBeDefined()
  })
})
```

### 2. Integration Test Structure

```typescript
describe('Complete 2FA Flow', () => {
  it('should complete full workflow', async () => {
    // Setup
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mock2FAData.setupSuccess()
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mock2FAData.verifySuccess()
      })

    // Execute flow
    const setupResult = await apiHelpers.setup2FA('token')
    const verifyResult = await apiHelpers.verify2FA('token', '123456')

    // Validate
    expect(setupResult.ok).toBe(true)
    expect(verifyResult.ok).toBe(true)
  })
})
```

### 3. Error Handling Test

```typescript
it('should handle specific error', async () => {
  // Mock error response
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 400,
    json: async () => mock2FAData.errors.invalidCode()
  })

  // Execute
  const result = await apiHelpers.verify2FA('token', '000000')
  const data = await result.json()

  // Validate error
  expect(result.ok).toBe(false)
  expect(data.error).toBe('Invalid verification code')
})
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Mock Not Working
**Problem**: Mocks aren't being called or return unexpected values

**Solution**:
```typescript
// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.resetAllMocks()
})
```

#### 2. Async Test Failures
**Problem**: Tests fail intermittently or don't wait for promises

**Solution**:
```typescript
// Always use async/await
it('should test async code', async () => {
  const result = await apiHelpers.setup2FA('token')
  const data = await result.json()
  expect(data.success).toBe(true)
})
```

#### 3. LocalStorage Issues
**Problem**: localStorage is undefined in tests

**Solution**:
```typescript
import { setupTestEnvironment } from './utils/2fa-test-utils'

const env = setupTestEnvironment()
// Now localStorage is mocked and available
```

#### 4. Fetch Not Mocked
**Problem**: Real network calls being made

**Solution**:
```typescript
// Always mock fetch at the start
global.fetch = vi.fn()

// Or use MockFetchBuilder
import { MockFetchBuilder } from './utils/2fa-test-utils'
global.fetch = new MockFetchBuilder()
  .addSuccessResponse(data)
  .build()
```

### Debug Tips

#### Enable Verbose Output
```bash
npm test -- --reporter=verbose 2fa
```

#### Run Single Test
```bash
npm test -- -t "specific test name"
```

#### Check Coverage
```bash
npm test -- --coverage --reporter=html
# Open coverage/index.html
```

## 📝 Best Practices

1. **Always Clean Up**: Reset mocks and clear storage after each test
2. **Use Utilities**: Leverage test utilities for common operations
3. **Test Edge Cases**: Include error scenarios and boundary conditions
4. **Mock External Calls**: Never make real API calls in unit tests
5. **Descriptive Names**: Use clear, descriptive test names
6. **Arrange-Act-Assert**: Follow AAA pattern for test structure
7. **One Assertion**: Test one thing at a time when possible
8. **Async/Await**: Always handle promises properly
9. **Type Safety**: Use TypeScript for better test reliability
10. **Documentation**: Comment complex test scenarios

## 🔗 Related Documentation

- [2FA Implementation Guide](../docs/2fa-implementation.md)
- [Security Best Practices](../docs/security-best-practices.md)
- [API Documentation](../docs/api-documentation.md)
- [Vitest Documentation](https://vitest.dev)

## 📧 Support

For questions or issues with the test suite:
- Check existing tests for examples
- Review test utilities documentation
- Check troubleshooting section above
- Create an issue in the project repository

---

**Last Updated**: October 5, 2025  
**Version**: 1.0.0  
**Maintainer**: FairCoin Development Team
