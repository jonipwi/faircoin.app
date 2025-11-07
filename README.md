# FairCoin — Light & Truth, Love & Mercy, Just & Peace

A community-driven fair transaction system built on principles of transparency, compassion, and equity. FairCoin introduces **PFI★** (Personal Fairness Index) and **TFI★** (Transaction Fairness Index) as the foundation for a more just economic system.

**FairCoin is not a finance project—it is an ethical and peace-building initiative.** Born from the mission of JacobYellowBridge, FairCoin exists to help those affected by corruption, human trafficking, and scamming, addressing the non-balance between wealthy and poor through fairness in trade and personal index improvement.

![FairCoin Banner](https://img.shields.io/badge/FairCoin-Community_Driven-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
[![Sponsor](https://img.shields.io/badge/Sponsor-❤️-ff69b4?style=for-the-badge)](https://github.com/sponsors/jonipwi)

> 🎉 **DOMAIN RECOVERY UPDATE - jacobyellowbridge.com RECOVERED**
> 
> **Good News**: The domain **jacobyellowbridge.com** has been **RECOVERED** and is now back under legitimate control as of November 7, 2025.
> 
> **Domain Status**:
> - ✅ **jacobyellowbridge.com** - RECOVERED and verified - Safe to visit
> - ⚠️ **sobatam.com** - Recovery in progress (expected completion: ~November 14, 2025) - Avoid visiting until confirmed
> 
> See **[NOTICE.md](./NOTICE.md)** for complete details including verified domain ownership information.
> 
> **OFFICIAL DOMAINS**: 
> - ✅ https://jacobyellowbridge.com (RECOVERED - November 7, 2025)
> - ✅ https://faircoin.bixio.xyz (staging)
> - ✅ https://faircoin-app.vercel.app (staging)
> - ✅ https://github.com/jonipwi/faircoin.app (repository)

> ⚠️ **STAGING PROJECT - NOT FOR COMMERCIAL USE**
> 
> This project is currently in **staging/development mode** and is **NOT intended for commercial use or production deployment**. 
> 
> **Live Staging Sites:**
> - 🔗 [https://faircoin.bixio.xyz](https://faircoin.bixio.xyz) - Primary staging server
> - 🔗 [https://faircoin-app.vercel.app](https://faircoin-app.vercel.app) - Vercel deployment
> 
> These are **development and testing environments only**. Features may be incomplete, unstable, or subject to change without notice. Do not use for real financial transactions.
>
> **🛡️ Important Security Notice:** If you encounter a Google Safe Browsing warning on our staging domains, this is a false positive. These are legitimate development environments. See our [Security Policy](./SECURITY.md) and [Staging Guide](./STAGING.md) for verification, or visit our [Google Safe Browsing Reporting Guide](./GOOGLE_SAFE_BROWSING_REPORT.md) to help us resolve this issue.

## 🌟 Core Principles

### Light & Truth
Complete transparency in all transactions and governance decisions. Every action is recorded and visible to the community.

### Love & Mercy
Compassionate community support and second chances for all. We believe in rehabilitation and growth.

### Just & Peace
Fair resource distribution and equitable economic opportunities for everyone.

## 🕊️ Our Sacred Mission

**FairCoin** was born from the mission of JacobYellowBridge (domain **recovered** November 7, 2025 - see [NOTICE.md](./NOTICE.md)) with a holy purpose: to bring **light, fair peace, and truth** to a world burdened by corruption and inequality.

### Why FairCoin Exists

- **Fighting Corruption**: This world has a lot of corruption, and FairCoin provides a transparent, fair system that cannot be manipulated by those seeking to exploit others.

- **Helping Victims**: We specifically help people affected by **human trafficking** and **scamming**—providing a fair economic foundation for recovery and dignity.

- **Balancing Wealth & Poverty**: The non-balance between wealthy and poor is a fundamental injustice. FairCoin exists to mitigate this through fairness metrics (PFI★ and TFI★) that reward contribution over concentration.

- **Personal Index Improvement**: Through fairness in trade and transparent metrics, every individual can improve their Personal Fairness Index (PFI★) and contribute to a better world.

**JacobYellowBridge brings a light of fair peace and truth** because FairCoin can. This is not about profit—it's about creating an ethical bridge that helps the community and world maintain its good.

## ✨ Features

- 🔐 **Secure Authentication** - GitHub OAuth integration with 2FA support
- 💰 **Multi-Currency Support** - Real-time exchange rates for USD, IDR, SGD, and more
- 🏛️ **Community Governance** - Democratic voting system for platform decisions
- 📊 **Fairness Metrics** - PFI★ and TFI★ tracking for all users and transactions
- 🌓 **Dark Mode** - Beautiful UI with system-synchronized theme switching
- 📱 **Responsive Design** - Mobile-first approach for accessibility
- 🔒 **2FA Security** - TOTP-based two-factor authentication
- 🌐 **Exchange Integration** - Live cryptocurrency and fiat exchange rates

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jonipwi/faircoin.app.git
   cd faircoin/faircoin.app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   ```properties
   # Environment Mode
   NEXT_PUBLIC_DEV_MODE=development
   NEXT_PUBLIC_DEV_MODE_MESSAGE="Development Environment"

   # API Endpoints
   NEXT_PUBLIC_EXCHANGE_API_URL=https://bixio.xyz/exchangev2
   NEXT_PUBLIC_API_BASE=https://bixio.xyz/faircoin/api/v1
   BACKEND_URL=https://bixio.xyz/faircoin

   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build & Deploy

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Export Static Site
```bash
npm run build
npm run export
```

### PowerShell Build Scripts
Windows users can use the included PowerShell scripts:
```powershell
# Development build
.\build.ps1

```

## 📁 Project Structure

```
faircoin.app/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── 2fa/                  # Two-factor auth
│   │   ├── dashboard/            # Dashboard data
│   │   └── settings/             # User settings
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # User dashboard
│   ├── settings/                 # Settings pages
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                   # React components
│   ├── CommunitySection.tsx      # Community features
│   ├── GovernanceSection.tsx     # Governance voting
│   ├── WalletSection.tsx         # Wallet management
│   ├── Navbar.tsx                # Navigation
│   ├── ThemeProvider.tsx         # Theme context
│   └── 2fa/                      # 2FA components
├── contexts/                     # React contexts
│   ├── AuthContext.tsx           # Authentication state
│   └── ExchangeContext.tsx       # Exchange rate state
├── hooks/                        # Custom React hooks
│   ├── useExchange.ts            # Exchange rate hook
│   └── useStats.ts               # Statistics hook
├── lib/                          # Utility libraries
│   ├── api.ts                    # API client
│   ├── exchange-api.ts           # Exchange API
│   └── community-debug.ts        # Debug utilities
├── tests/                        # Test files
│   ├── 2fa-integration.test.ts   # 2FA tests
│   └── frontend-api-2fa.test.ts  # API tests
├── public/                       # Static assets
├── .env                          # Environment variables
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS config
└── tsconfig.json                 # TypeScript config
```

## 🔐 Security Features

### Two-Factor Authentication (2FA)
- TOTP-based authentication using Google Authenticator or similar apps
- QR code generation for easy setup
- Backup codes for account recovery
- Session management with secure tokens

### Authentication Flow
1. GitHub OAuth login
2. Terms of Service acceptance
3. Optional 2FA setup
4. Secure session creation
5. Dashboard access with protected routes

### Security Best Practices
- All API calls use HTTPS
- JWT tokens for session management
- CORS protection
- Input validation and sanitization
- Rate limiting on sensitive endpoints

## 🌐 API Integration

### Exchange API
Real-time exchange rates for multiple currencies:
```typescript
import { useExchange } from '@/hooks/useExchange'

const { convertCurrency, rates, loading } = useExchange()

// Convert amounts
const usdAmount = convertCurrency(100, 'IDR', 'USD')
```

### Authentication API
```typescript
import { api } from '@/lib/api'

// Initialize OAuth
const { auth_url } = await api.auth.init()

// Accept terms
await api.auth.acceptTerms({
  user_id: 123,
  version: '1.0',
  session_id: 'session_token'
})
```

## 🎨 UI Components

### Theme System
FairCoin supports light and dark themes with automatic system detection:
```tsx
import { ThemeSwitcher } from '@/components/ThemeSwitcher'

<ThemeSwitcher />
```

### Currency Display
Multi-currency balance display with real-time conversion:
```tsx
import { MultiCurrencyBalance } from '@/components/MultiCurrencyBalance'

<MultiCurrencyBalance 
  amount={1000} 
  baseCurrency="USD"
  displayCurrencies={['USD', 'IDR', 'SGD']} 
/>
```

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test -- 2fa-integration.test.ts

# Watch mode
npm test -- --watch
```

### Test Coverage
- Authentication flow tests
- 2FA integration tests
- API endpoint tests
- Component rendering tests

## 📊 Environment Modes

FairCoin supports multiple environment modes with visual indicators:

### Development Mode
Shows a prominent warning banner:
```properties
NEXT_PUBLIC_DEV_MODE=development
NEXT_PUBLIC_DEV_MODE_MESSAGE="Development Environment - Testing Only"
```

### Staging Mode
Shows warning for staging sites:
```properties
NEXT_PUBLIC_DEV_MODE=staging
NEXT_PUBLIC_DEV_MODE_MESSAGE="Staging Site - Not a Phishing Page"
```

### Production Mode
No banner shown:
```properties
NEXT_PUBLIC_DEV_MODE=production
```

## 🤝 Contributing

We welcome all forms of contribution to FairCoin! Whether you're a developer, designer, marketer, writer, or simply passionate about building a fairer economic system, there's a place for you in our community.

### Ways to Contribute

- 💻 **Code**: Frontend, backend, testing, and bug fixes
- 🎨 **Design**: UI/UX improvements and visual assets
- 📝 **Documentation**: Technical docs, tutorials, and translations
- 📢 **Marketing**: Content creation, social media, and community outreach
- 🔍 **Research**: Economic models, security audits, and data analysis
- 🤝 **Community**: Support users, organize events, and spread the word

### Quick Start for Contributors

1. **Read our [Contributing Guide](./CONTRIBUTING.md)** - Comprehensive guide for all contribution types
2. **Check [Good First Issues](https://github.com/jonipwi/faircoin.app/labels/good%20first%20issue)** - Perfect for newcomers
3. **Join as a Collaborator** - [Express your interest](https://github.com/jonipwi/faircoin.app/issues/new?template=collaboration.yml)
4. **Fork & Code** - Fork the repo, make changes, and submit a PR

For detailed contribution guidelines, code standards, and development workflow, please see our **[CONTRIBUTING.md](./CONTRIBUTING.md)** guide.

## 📖 Documentation

Detailed documentation is available:

### Core Documentation
- [README](./README.md) - Project overview and quick start
- [NOTICE.md](./NOTICE.md) - ✅ Domain status: jacobyellowbridge.com recovered, sobatam.com recovery in progress
- [WHITEPAPER](./docs/WHITEPAPER.md) - Official FairCoin Whitepaper by JacobYellowBridge
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines for all types of contributors
- [DISCUSSIONS_ACTION_REQUIRED.md](./DISCUSSIONS_ACTION_REQUIRED.md) - ⚡ **Quick action**: Enable GitHub Discussions (60 seconds)
- [DISCUSSIONS_SETUP.md](./DISCUSSIONS_SETUP.md) - Complete guide to GitHub Discussions setup
- [SECURITY.md](./SECURITY.md) - Security policy and legitimacy verification
- [STAGING.md](./STAGING.md) - Staging environment explanation
- [GOOGLE_SAFE_BROWSING_REPORT.md](./GOOGLE_SAFE_BROWSING_REPORT.md) - Guide for reporting false positives
- [SPONSORS_GUIDE.md](./SPONSORS_GUIDE.md) - GitHub Sponsors setup and visibility guide

### Feature Documentation
- [2FA Implementation Guide](./docs/2FA_IMPLEMENTATION.md)
- [2FA Integration Summary](./docs/2FA_INTEGRATION_SUMMARY.md)
- [Test Architecture](./tests/2FA-ARCHITECTURE.md)
- [Quick Reference](./tests/2FA-QUICK-REFERENCE.md)

### Security Resources
- [security.txt](/.well-known/security.txt) - RFC 9116 security contact file
- [Staging Info Page](/staging-info) - Web-based explanation for users

## 🛠️ Troubleshooting

### Port Already in Use
If port 3000 is in use, Next.js will automatically try 3001:
```bash
# Or specify a custom port
PORT=3002 npm run dev
```

### Build Errors
Clear Next.js cache:
```bash
# Windows PowerShell
Remove-Item -Recurse -Force .next
npm run build

# Linux/Mac
rm -rf .next
npm run build
```

### SSL Certificate Issues
For production deployment, ensure proper SSL certificates are configured in your web server (Apache/Nginx).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌍 Community

> ⚡ **Repository Admin**: GitHub Discussions is ready to enable! See [`DISCUSSIONS_ACTION_REQUIRED.md`](./DISCUSSIONS_ACTION_REQUIRED.md) for 60-second setup instructions.

### Connect With Us

- 💬 **[GitHub Discussions](https://github.com/jonipwi/faircoin.app/discussions)** - Ask questions, share ideas, and connect with the community
- 📝 **[GitHub Issues](https://github.com/jonipwi/faircoin.app/issues)** - Report bugs and request features
- 🤝 **[GitHub](https://github.com/jonipwi/faircoin.app)** - Source code and contributions
- 💬 **Discord**: Join our community (coming soon)
- 🐦 **Twitter**: Follow us @FairCoin (coming soon)

### Staging Sites (Development Only - Not for Commercial Use)

- [https://faircoin.bixio.xyz](https://faircoin.bixio.xyz) - Primary staging server
- [https://faircoin-app.vercel.app](https://faircoin-app.vercel.app) - Vercel deployment

> **Note**: The staging sites listed above are for **development and testing purposes only**. They are not production-ready and should not be used for any commercial transactions or real-world financial activities.

## 💖 Support

If you find FairCoin valuable, please consider:
- 💝 **[Sponsor this project on GitHub](https://github.com/sponsors/jonipwi)** - Support ongoing development
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 📝 Contributing to documentation
- 🤝 Sharing with others

### Sponsorship

FairCoin is an open-source, community-driven project. Your sponsorship helps us:
- 🚀 Continue development of new features
- 🔒 Maintain security and reliability
- 📚 Improve documentation and tutorials
- 🌍 Build a fairer economic system for everyone

[Become a sponsor](https://github.com/sponsors/jonipwi) to support the project and get recognition in our community!

> **📘 Repository Owners:** See [SPONSORS_GUIDE.md](./SPONSORS_GUIDE.md) for instructions on making this repository discoverable to sponsors. GitHub Sponsors requires **public** repositories.

---

**Built with ❤️ by the FairCoin Community**

*Light & Truth • Love & Mercy • Just & Peace*
