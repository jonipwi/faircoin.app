# FairCoin Wallet Authentication - Quick Reference

## What Changed

### ✅ Registration Process (Create New Wallet)
**Before:** GitHub OAuth login → Accept terms → Dashboard
**Now:** Enter full name → Get auto-generated username → Save 12-word secret phrase → Accept terms → Dashboard

### ✅ Login Process
**Before:** GitHub OAuth authentication
**Now:** Enter 12-word secret phrase → Authenticated

## User Experience Flow

### 1. Choice Screen
User sees two options:
- **Create New Wallet** - For new users
- **Login with Secret Phrase** - For returning users

### 2a. Registration Flow (New Users)
1. User enters their **full name**
2. System auto-generates **unique username** (e.g., "john_doe", "john_doe_1", etc.)
3. System generates:
   - Solana wallet address
   - 12-word BIP39 mnemonic phrase
4. User sees **CRITICAL screen** showing:
   - Generated username
   - Wallet address
   - 12-word secret phrase (displayed ONCE)
   - Copy button
   - Download backup button
5. User must acknowledge saving the phrase
6. User accepts terms
7. Redirected to dashboard

### 2b. Login Flow (Returning Users)
1. User enters their **12-word secret phrase**
2. System validates and authenticates
3. User accepts terms (if needed)
4. Redirected to dashboard

## Features Implemented

### Frontend (✅ Complete)
- [x] Registration page with full name input
- [x] Auto-generated username display
- [x] 12-word mnemonic generation and display
- [x] Copy to clipboard functionality
- [x] Download backup file feature
- [x] Login page with mnemonic input
- [x] Show/hide mnemonic toggle
- [x] Word count validation (12 words)
- [x] Security warnings and instructions
- [x] Terms acceptance flow
- [x] Session management
- [x] Mobile responsive design

### Backend (⚠️ Needs Implementation)
- [ ] Database schema updates (SQL file ready)
- [ ] POST /api/v1/auth/wallet/register endpoint
- [ ] POST /api/v1/auth/wallet/login endpoint
- [ ] Username auto-generation function
- [ ] Mnemonic encryption/decryption
- [ ] Session management

## Files Created/Modified

### Frontend Files
```
faircoin.app/
├── app/
│   ├── auth/page.tsx                          ← Modified (wallet UI)
│   └── api/
│       └── auth/wallet/
│           ├── register/route.ts              ← New
│           └── login/route.ts                 ← New
├── lib/api.ts                                 ← Modified (wallet methods)
└── contexts/AuthContext.tsx                   ← Already supports tokens
```

### Backend Files (Guide Only - Not Implemented)
```
faircoin-api/
└── docs/
    ├── wallet-auth-schema.sql                 ← New (database schema)
    └── WALLET_AUTH_IMPLEMENTATION.md          ← New (implementation guide)
```

## Security Features

### ✅ Implemented (Frontend)
- 12-word BIP39 standard mnemonic
- Show/hide mnemonic input
- One-time mnemonic display
- Secure warning messages
- Download backup functionality
- Copy protection hints

### ⚠️ Needs Backend Implementation
- AES-256-GCM encryption for stored mnemonics
- Secure session management (24-hour expiry)
- Rate limiting on auth endpoints
- Brute force protection

## Testing Instructions

### Test Registration (Once Backend Ready)
1. Go to `/auth`
2. Click "Create New Wallet"
3. Enter full name: "Test User"
4. See auto-generated username (e.g., "test_user")
5. Copy/download the 12-word phrase
6. Proceed to terms and dashboard

### Test Login (Once Backend Ready)
1. Go to `/auth`
2. Click "Login with Secret Phrase"
3. Enter the 12-word phrase from registration
4. Should authenticate successfully

## Important Notes

### For Users
⚠️ **CRITICAL:** The 12-word secret phrase is shown ONLY ONCE during registration
- Write it down on paper
- Store in a safe location
- Never share with anyone
- This is the ONLY way to access the wallet

### For Developers
📝 **Backend Implementation Required:**
- Follow the guide in `WALLET_AUTH_IMPLEMENTATION.md`
- Reference xchat's `wallet.go` for working code
- Apply database schema from `wallet-auth-schema.sql`
- Test thoroughly before production

## Environment Variables Needed

```bash
# Frontend (.env.local)
NEXT_PUBLIC_FAIRCOIN_API_URL=http://localhost:8080

# Backend
WALLET_ENCRYPTION_KEY=your-32-byte-encryption-key-here-change-this-in-production
DATABASE_URL=postgresql://user:pass@host:5432/faircoin_db
```

## What Works Right Now

✅ **Frontend is 100% ready:**
- Beautiful UI for registration and login
- Wallet creation interface
- Mnemonic display and backup
- All validation and security warnings
- Mobile responsive

⚠️ **Backend needs implementation:**
- The frontend calls `/api/auth/wallet/register` and `/api/auth/wallet/login`
- These proxy to `NEXT_PUBLIC_FAIRCOIN_API_URL/api/v1/auth/wallet/*`
- Backend must implement these endpoints using the guide provided

## Reference Files

### Working Examples
- **xchat wallet implementation:** `go-tools/8088-xchat/backend/handlers/wallet.go`
- **Frontend registration:** `faircoin.app/app/auth/page.tsx`
- **Settings page example:** `go-tools/8088-xchat/frontend/src/app/lite/settings/page.tsx`

### Documentation
- **Implementation guide:** `faircoin-api/docs/WALLET_AUTH_IMPLEMENTATION.md`
- **Database schema:** `faircoin-api/docs/wallet-auth-schema.sql`

## Next Steps

1. **Review the UI** - Check `/auth` page to see the new flow
2. **Review Backend Guide** - Read `WALLET_AUTH_IMPLEMENTATION.md`
3. **Apply Schema** - Run `wallet-auth-schema.sql` on database
4. **Implement Backend** - Follow the guide to create endpoints
5. **Test End-to-End** - Register and login with wallet
6. **Deploy** - Once tested, deploy to production

---

**Questions?** Review the implementation guide or check the xchat reference code.
