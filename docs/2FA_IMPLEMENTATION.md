# Two-Factor Authentication (2FA) Implementation

## Overview

FairCoin.app implements a comprehensive Two-Factor Authentication (2FA) system using TOTP (Time-based One-Time Password) with Google Authenticator compatible authentication.

## Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌──────────────┐
│   Frontend UI   │─────▶│  Next.js API     │─────▶│  Go Backend  │
│   Components    │      │  Routes (Proxy)  │      │  (TOTP/JWT)  │
└─────────────────┘      └──────────────────┘      └──────────────┘
```

### Components

- **UI Components** (`components/2fa/`)
  - `TwoFactorSetup.tsx` - QR code display and setup wizard
  - `TwoFactorVerify.tsx` - Code verification input with backup code support
  
- **API Routes** (`app/api/`)
  - `/api/2fa/setup` - Initialize 2FA setup, returns QR code + secret
  - `/api/2fa/verify` - Verify TOTP code during setup
  - `/api/2fa/disable` - Disable 2FA for account
  - `/api/2fa/backup-codes/status` - Check remaining backup codes
  - `/api/2fa/backup-codes/regenerate` - Generate new backup codes
  - `/api/auth/verify-2fa` - Verify 2FA during login

- **Pages**
  - `app/settings/page.tsx` - Full 2FA management interface

## Features

### ✅ Implemented

1. **2FA Setup Flow**
   - QR code generation for authenticator apps
   - Manual secret key entry fallback
   - 6-digit TOTP code verification
   - Backup codes generation (10 codes)

2. **Login with 2FA**
   - Standard TOTP code verification
   - Backup code authentication
   - Session management with 2FA

3. **Backup Codes Management**
   - View backup codes (hidden by default)
   - Download backup codes as text file
   - Regenerate backup codes
   - Status checking (remaining codes)

4. **Security Features**
   - Rate limiting on verification attempts
   - Secure session handling
   - Code validation and sanitization
   - Auto-logout on suspicious activity

5. **User Experience**
   - Step-by-step setup wizard
   - Clear visual feedback
   - Dark mode support
   - Mobile responsive design
   - Copy to clipboard functionality

## Usage

### User Flow: Enable 2FA

1. Navigate to Settings → Security
2. Click "Setup 2FA" button
3. Scan QR code with authenticator app (Google Authenticator, Authy, etc.)
4. Enter 6-digit verification code
5. Save backup codes (download or copy)
6. 2FA is now enabled

### User Flow: Login with 2FA

1. Enter username/email and password
2. If 2FA enabled, prompted for 6-digit code
3. Enter code from authenticator app (or use backup code)
4. Access granted on successful verification

### User Flow: Backup Codes

1. Go to Settings → Security
2. Click "Show Backup Codes"
3. Options:
   - Download codes as text file
   - Copy all codes to clipboard
   - Regenerate new codes (invalidates old ones)

## API Endpoints

### Setup 2FA
```typescript
POST /api/2fa/setup
Authorization: Bearer {token}

Response:
{
  "qrCode": "data:image/png;base64,...",
  "secret": "JBSWY3DPEHPK3PXP",
  "backupCodes": ["ABCD1234", "EFGH5678", ...]
}
```

### Verify Setup Code
```typescript
POST /api/2fa/verify
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "code": "123456"
}

Response:
{
  "success": true,
  "backupCodes": ["ABCD1234", "EFGH5678", ...]
}
```

### Disable 2FA
```typescript
POST /api/2fa/disable
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "2FA disabled successfully"
}
```

### Check Backup Codes Status
```typescript
GET /api/2fa/backup-codes/status
Authorization: Bearer {token}

Response:
{
  "remaining": 8,
  "total": 10,
  "lastUsed": "2024-01-15T10:30:00Z"
}
```

### Regenerate Backup Codes
```typescript
POST /api/2fa/backup-codes/regenerate
Authorization: Bearer {token}

Response:
{
  "backupCodes": ["NEW11111", "NEW22222", ...],
  "message": "Backup codes regenerated successfully"
}
```

### Login with 2FA
```typescript
POST /api/auth/verify-2fa
Content-Type: application/json

Body:
{
  "code": "123456",
  "sessionToken": "temp_session_token",
  "isBackupCode": false
}

Response:
{
  "success": true,
  "sessionToken": "final_session_token",
  "user": { ... }
}
```

## Component Usage

### TwoFactorSetup Component

```tsx
import TwoFactorSetup from '@/components/2fa/TwoFactorSetup'

<TwoFactorSetup
  qrCode={qrCodeDataUrl}
  secret={secretKey}
  backupCodes={codes}
  onVerify={async (code) => {
    // Verify code logic
  }}
  onCancel={() => {
    // Cancel setup logic
  }}
  loading={isLoading}
/>
```

### TwoFactorVerify Component

```tsx
import TwoFactorVerify from '@/components/2fa/TwoFactorVerify'

<TwoFactorVerify
  onVerify={async (code, isBackupCode) => {
    // Verify login code
  }}
  loading={isLoading}
  error={errorMessage}
  title="Login Verification"
  description="Enter your 2FA code"
/>
```

## Testing

Comprehensive test suite located in `tests/`:

- `tests/2fa-security.test.ts` - Security and edge cases (21 tests)
- `tests/frontend-api-2fa.test.ts` - API route tests (14 tests)
- `tests/2fa-integration.test.ts` - End-to-end flows (13 tests)
- `tests/utils/2fa-test-utils.ts` - Shared test utilities

**Run tests:**
```bash
npm test                    # Run all tests
npm run test:ui             # Visual test UI
npm run test:coverage       # Coverage report
```

## Security Considerations

1. **Secret Storage**
   - Secrets never exposed in frontend state longer than necessary
   - Backend stores encrypted TOTP secrets
   - Backup codes hashed before storage

2. **Rate Limiting**
   - Max 5 failed attempts per hour
   - Progressive delay on failed attempts
   - Account lockout after excessive failures

3. **Session Management**
   - 2FA required on new device/browser
   - "Remember this device" option (30 days)
   - Session invalidation on 2FA disable

4. **Backup Codes**
   - Single-use only
   - Regeneration invalidates all previous codes
   - Secure random generation
   - Download warning (save securely)

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

- `qrcode` - QR code generation (backend)
- `otpauth` - TOTP implementation (backend)
- React hooks for state management
- Next.js 14 App Router
- TypeScript for type safety

## Future Enhancements

- [ ] SMS 2FA fallback option
- [ ] Hardware security key support (WebAuthn)
- [ ] Trusted devices management
- [ ] 2FA recovery via email
- [ ] Multi-device 2FA sync
- [ ] Login history with 2FA events

## Troubleshooting

### "Invalid verification code"
- Ensure device time is synced (TOTP requires accurate time)
- Try next code if previous one just expired
- Check caps lock if entering backup code

### "QR code not scanning"
- Increase screen brightness
- Try manual secret entry
- Use different authenticator app

### "Lost authenticator device"
- Use backup codes to login
- Contact support if all codes used
- Account recovery process required

### "Backup codes not working"
- Ensure using correct case (uppercase)
- Each code works only once
- Regenerate if all codes used

## Support

For issues or questions:
- Check test suite for examples
- Review API documentation above
- Contact development team
- Submit bug report with logs

---

**Last Updated:** 2024
**Version:** 1.0.0
**Status:** ✅ Production Ready
