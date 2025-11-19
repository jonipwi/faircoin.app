# Multi-Language Support — Internationalization (i18n)

## 🌍 Overview

FairCoin supports **15 languages** out of the box, making the platform accessible to users worldwide. Our internationalization (i18n) system provides seamless language switching, automatic locale detection, and comprehensive translation coverage across all features.

## 🗣️ Supported Languages

FairCoin currently supports the following languages:

| Language | Code | Flag | Direction | Native Name |
|----------|------|------|-----------|-------------|
| English | `en` | 🇬🇧 | LTR | English |
| Chinese (Simplified) | `zh` | 🇨🇳 | LTR | 中文 (简体) |
| Chinese (Traditional) | `zh-TW` | 🇹🇼 | LTR | 中文 (繁體) |
| Spanish | `es` | 🇪🇸 | LTR | Español |
| French | `fr` | 🇫🇷 | LTR | Français |
| German | `de` | 🇩🇪 | LTR | Deutsch |
| Hindi | `hi` | 🇮🇳 | LTR | हिन्दी |
| Russian | `ru` | 🇷🇺 | LTR | Русский |
| Indonesian | `id` | 🇮🇩 | LTR | Indonesia |
| Korean | `ko` | 🇰🇷 | LTR | 한국어 |
| Japanese | `ja` | 🇯🇵 | LTR | 日本語 |
| Hebrew | `he` | 🇮🇱 | RTL | עברית |
| Arabic | `ar` | 🇸🇦 | RTL | العربية |
| Dutch | `nl` | 🇳🇱 | LTR | Nederlands |
| Portuguese | `pt` | 🇵🇹 | LTR | Português |

### RTL (Right-to-Left) Support

FairCoin fully supports RTL languages (Hebrew and Arabic) with:
- Automatic text direction switching
- Mirrored layouts for navigation
- Proper alignment for all UI elements
- RTL-aware icons and components

## 🚀 Using Multi-Language Features

### For End Users

#### Changing Language

**Method 1: Language Selector (Full App)**
1. Click the globe icon (🌐) in the navigation bar
2. Select your preferred language from the dropdown menu
3. The interface updates immediately

**Method 2: Language Selector (Lite Mode)**
1. Open the mobile menu (on mobile/tablet)
2. Click the language selector
3. Choose your language

**Method 3: Direct URL**
Access any page in your preferred language using the URL pattern:
```
/{locale}/path
```

Examples:
- English: `https://faircoin.bixio.xyz/en`
- Indonesian: `https://faircoin.bixio.xyz/id/lite`
- Chinese: `https://faircoin.bixio.xyz/zh/dashboard`

#### Language Persistence

Your language preference is automatically saved in:
1. **Browser localStorage** - Persists across sessions
2. **URL path** - Shareable and bookmarkable
3. **HTML `lang` attribute** - For accessibility

#### Automatic Detection

If you visit FairCoin for the first time, the system automatically:
1. Checks the URL for a locale parameter
2. Falls back to your browser's language setting
3. Defaults to English if your browser language isn't supported

### For Developers

#### Basic Usage

Import and use the `useLanguage` hook:

```tsx
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function MyComponent() {
  const { t, locale, setLocale } = useLanguage()
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.description')}</p>
      <button onClick={() => setLocale('es')}>
        Switch to Spanish
      </button>
    </div>
  )
}
```

#### Translation with Parameters

Use parameter substitution for dynamic content:

```tsx
// Translation file (en.json)
{
  "welcome": "Welcome, {{username}}!"
}

// Component
const { t } = useLanguage()
const message = t('welcome', { username: 'John' })
// Output: "Welcome, John!"
```

#### Getting Current Locale

```tsx
const { locale } = useLanguage()
console.log(locale) // 'en', 'zh', 'id', etc.
```

#### Programmatic Language Switching

```tsx
const { setLocale } = useLanguage()

// Change to Indonesian
setLocale('id')

// Change to Japanese
setLocale('ja')
```

#### Using Localized Paths

```tsx
import { useLocalePath } from '@/lib/i18n/useLocalePath'

export function MyComponent() {
  const localePath = useLocalePath()
  
  return (
    <Link href={localePath('dashboard')}>
      Dashboard
    </Link>
  )
}
```

This automatically prefixes paths with the current locale.

## 🏗️ Technical Architecture

### File Structure

```
lib/i18n/
├── LanguageContext.tsx      # Context provider and hooks
├── languages.json            # Language metadata (name, flag, direction)
├── locales.ts               # Locale utilities
├── useLocalePath.ts         # Localized path helper
└── translations/            # Translation files
    ├── en.json              # English (master)
    ├── zh.json              # Chinese (Simplified)
    ├── zh-TW.json           # Chinese (Traditional)
    ├── es.json              # Spanish
    ├── fr.json              # French
    ├── de.json              # German
    ├── hi.json              # Hindi
    ├── ru.json              # Russian
    ├── id.json              # Indonesian
    ├── ko.json              # Korean
    ├── ja.json              # Japanese
    ├── he.json              # Hebrew
    ├── ar.json              # Arabic
    ├── nl.json              # Dutch
    └── pt.json              # Portuguese
```

### Core Components

#### 1. LanguageContext.tsx

The main context provider that manages language state and translation functionality.

**Key Features:**
- Centralized language state management
- Translation function (`t()`) with fallback support
- Automatic locale detection (URL → localStorage → browser)
- Direction (LTR/RTL) handling
- HTML attribute updates (`lang` and `dir`)

**Provider Setup:**
```tsx
import { LanguageProvider } from '@/lib/i18n/LanguageContext'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
```

#### 2. languages.json

Metadata for all supported languages:

```json
{
  "en": {
    "name": "English",
    "flag": "🇬🇧",
    "dir": "ltr"
  },
  "zh": {
    "name": "中文 (简体)",
    "flag": "🇨🇳",
    "dir": "ltr"
  }
  // ... other languages
}
```

#### 3. Translation Files

Each language has a JSON file with nested translation keys:

```json
{
  "nav": {
    "home": "Home",
    "wallet": "Wallet",
    "dashboard": "Dashboard"
  },
  "hero": {
    "title": "Light & Truth, Love & Mercy, Just & Peace",
    "subtitle": "A revolutionary fairness-first monetary system"
  },
  "wallet": {
    "title": "PFI Treasury",
    "balance": "Balance"
  }
}
```

**Translation Namespaces:**

| Namespace | Description | Example Keys |
|-----------|-------------|--------------|
| `nav` | Navigation items | `nav.home`, `nav.wallet` |
| `hero` | Hero section | `hero.title`, `hero.subtitle` |
| `wallet` | Wallet features | `wallet.balance`, `wallet.send` |
| `features` | Feature descriptions | `features.title` |
| `mission` | Mission section | `mission.holyPurpose` |
| `merchants` | Merchant features | `merchants.title` |
| `fairness` | Fairness metrics | `fairness.pfiScore` |
| `governance` | Governance system | `governance.vote` |
| `community` | Community features | `community.chat` |
| `donation` | Donation section | `donation.ethereumAddress` |
| `values` | Core values | `values.lightTruth` |
| `vision` | Vision section | `vision.communityOwned` |
| `common` | Common UI elements | `common.loading`, `common.error` |
| `home` | Home page specific | `home.welcome` |
| `actions` | Action buttons | `actions.send`, `actions.receive` |
| `help` | Help section | `help.faq`, `help.support` |
| `tutorials` | Tutorial content | `tutorials.gettingStarted` |
| `install` | Installation guides | `install.android`, `install.ios` |
| `footer` | Footer content | `footer.copyright` |
| `version` | Version info | `version.current` |

### Translation Fallback System

If a translation key is missing in the selected language, the system automatically falls back to English:

```tsx
// If Indonesian translation is missing
t('new.feature') // Returns English translation
```

This ensures the app never shows raw translation keys to users.

### Route-Based Localization

FairCoin uses Next.js App Router with locale prefixes:

```
app/
├── [locale]/              # Localized routes
│   ├── page.tsx          # Home page
│   ├── dashboard/
│   │   └── page.tsx      # Dashboard
│   ├── lite/
│   │   └── page.tsx      # Lite mode
│   └── ...
```

**URL Examples:**
- `/en` → English home page
- `/id/dashboard` → Indonesian dashboard
- `/zh/lite` → Chinese Lite mode
- `/ar/wallet` → Arabic wallet (RTL)

## 📝 Adding a New Language

### Step 1: Update languages.json

Add language metadata:

```json
{
  // ... existing languages
  "vi": {
    "name": "Tiếng Việt",
    "flag": "🇻🇳",
    "dir": "ltr"
  }
}
```

### Step 2: Create Translation File

Create `lib/i18n/translations/vi.json`:

```json
{
  "nav": {
    "home": "Trang chủ",
    "wallet": "Ví",
    // ... translate all keys
  },
  "hero": {
    "title": "...",
    // ... translate all keys
  }
  // ... continue for all namespaces
}
```

**Important:** Copy the structure from `en.json` to ensure all keys are present.

### Step 3: Import in LanguageContext

Edit `lib/i18n/LanguageContext.tsx`:

```tsx
// Add import
import vi from './translations/vi.json'

// Add to translations object
const translations: Record<string, any> = {
  en, zh, 'zh-TW': zhTW, es, fr, de, hi, ru, id, ko, ja, he, ar, nl, pt,
  vi // Add new language
}
```

### Step 4: Test

1. Clear browser cache
2. Navigate to `/{new-locale}` (e.g., `/vi`)
3. Verify all translations appear correctly
4. Test language selector shows new language
5. Verify fallback to English for missing keys

### Step 5: Validation

Run the i18n verification script:

```bash
npm run check:i18n
```

This checks for:
- Missing translation keys
- Inconsistent structure
- Formatting issues

## 🔍 Translation Coverage

### Current Status

Based on [TRANSLATION_STATUS.md](../TRANSLATION_STATUS.md):

| Section | Keys | Coverage |
|---------|------|----------|
| Navigation | 15 | ✅ 100% (all languages) |
| Hero | 10 | ✅ 100% (all languages) |
| Wallet | 26 | ✅ 100% (all languages) |
| Home | 7 | ✅ 100% (all languages) |
| Actions | 10 | ✅ 100% (all languages) |
| Help | 14 | ✅ 100% (all languages) |
| Tutorials | 8 | ✅ 100% (all languages) |
| Install | 21 | ✅ 100% (all languages) |
| Footer | 3 | ✅ 100% (all languages) |
| Version | 2 | ✅ 100% (all languages) |
| Common | 9 | ✅ 100% (all languages) |
| Features | 17 | ✅ English only |
| Mission | 18 | ✅ English only |
| Merchants | 8 | ✅ English only |
| Fairness | 25 | ✅ English only |
| Governance | 35 | ✅ English only |
| Community | 18 | ✅ English only |
| Donation | 8 | ✅ English only |
| Values | 12 | ✅ English only |
| Vision | 9 | ✅ English only |

**Total Translation Keys:** ~250+

**Note:** Sections showing "English only" will display English content when other languages are selected until translations are added.

## 🧪 Testing Translations

### Manual Testing

1. **Change Language:**
   - Use language selector
   - Verify all text updates

2. **Check RTL Support:**
   - Switch to Hebrew (`he`) or Arabic (`ar`)
   - Verify layout mirrors correctly
   - Check text alignment

3. **Test URL Navigation:**
   - Navigate to `/{locale}/page`
   - Verify correct language loads
   - Check browser back/forward buttons

4. **Verify Persistence:**
   - Change language
   - Refresh page
   - Verify language persists

5. **Test Fallback:**
   - Switch to language with incomplete translations
   - Verify English fallback for missing keys

### Automated Testing

```bash
# Run i18n verification
npm run check:i18n

# Run all tests (includes i18n tests)
npm test
```

## 🎨 UI Components for i18n

### Language Selector (Full App)

Standard language selector in navbar:

```tsx
import { LanguageSelector } from '@/components/LanguageSelector'

<LanguageSelector />
```

Features:
- Globe icon with current language flag
- Dropdown with all languages
- Search functionality (future)
- Visual selection indicator

### Language Selector (Lite Mode)

Simplified selector for Lite mode:

```tsx
import { LanguageSelector } from '@/components/lite/LanguageSelector'

<LanguageSelector />
```

Features:
- Larger buttons
- Simplified UI
- Mobile-optimized

## 📱 Mobile & Desktop Behavior

### Desktop
- Language selector in top navigation
- Hover effects on language options
- Dropdown menu

### Tablet
- Language selector in navigation
- Touch-friendly dropdown
- Larger touch targets

### Mobile
- Language selector in hamburger menu
- Full-screen language selection
- Large, clear options

## ♿ Accessibility

### HTML Attributes

The system automatically sets:

```html
<html lang="en" dir="ltr">
  <!-- LTR language -->
</html>

<html lang="ar" dir="rtl">
  <!-- RTL language -->
</html>
```

### Screen Reader Support

- Proper `lang` attributes on all pages
- Semantic HTML structure
- ARIA labels for language selector
- Keyboard navigation support

### WCAG Compliance

- Color contrast ratios maintained across all languages
- Text remains readable at all sizes
- Focus indicators visible
- Proper heading hierarchy

## 🌐 SEO & i18n

### Language-Specific URLs

Each language has its own URL:
- Better SEO ranking
- Shareable localized links
- Proper browser history

### HTML Lang Tags

Automatic `lang` attribute for better SEO:

```html
<html lang="id">
  <!-- Indonesian content -->
</html>
```

### Future: hreflang Tags

Planned implementation of `hreflang` meta tags:

```html
<link rel="alternate" hreflang="en" href="https://faircoin.bixio.xyz/en" />
<link rel="alternate" hreflang="id" href="https://faircoin.bixio.xyz/id" />
```

## 🔧 Best Practices

### For Translators

1. **Maintain Context:** Keep the meaning and tone consistent
2. **Respect Culture:** Adapt idioms and cultural references
3. **Check Length:** Some languages are longer (German, Finnish)
4. **Test UI:** Verify text fits in buttons and layouts
5. **Use Native Speakers:** Professional translation is best

### For Developers

1. **Never Hard-Code Text:** Always use `t()` function
2. **Keep Keys Organized:** Use clear namespace hierarchy
3. **Add Parameters:** Use `{{param}}` for dynamic content
4. **Test All Languages:** Especially RTL languages
5. **Update Documentation:** Document new translation keys

### Translation Guidelines

```tsx
// ❌ Bad - Hard-coded text
<button>Send FairCoin</button>

// ✅ Good - Translated text
<button>{t('actions.send')}</button>

// ❌ Bad - String concatenation
const message = "Welcome " + username

// ✅ Good - Parameter substitution
const message = t('welcome', { username })

// ❌ Bad - Inline conditions
{isActive ? 'Active' : 'Inactive'}

// ✅ Good - Translated conditions
{isActive ? t('status.active') : t('status.inactive')}
```

## 📊 Statistics

- **Total Languages:** 15
- **Total Translation Keys:** ~250+
- **RTL Languages:** 2 (Hebrew, Arabic)
- **Coverage:** ~40% complete across all languages
- **File Size:** ~30-60KB per language file
- **Load Time:** <50ms (translations pre-loaded)

## 🗺️ Roadmap

### Short Term
- [ ] Complete translations for Features section (9 languages)
- [ ] Complete translations for Mission section (9 languages)
- [ ] Complete translations for Governance section (9 languages)
- [ ] Add translation progress indicator in UI

### Medium Term
- [ ] Add Turkish (tr) 🇹🇷
- [ ] Add Italian (it) 🇮🇹
- [ ] Add Thai (th) 🇹🇭
- [ ] Implement crowdsourced translation platform
- [ ] Add language-specific number/date formatting

### Long Term
- [ ] AI-assisted translation suggestions
- [ ] Community translation validation
- [ ] Regional dialect support (e.g., pt-BR vs pt-PT)
- [ ] Voice-to-text in multiple languages
- [ ] Translation memory for consistency

## 🤝 Contributing Translations

We welcome translation contributions! Here's how:

### Option 1: Direct Translation

1. Fork the repository
2. Create/edit translation file in `lib/i18n/translations/`
3. Translate all keys from `en.json`
4. Test your translations locally
5. Submit a Pull Request

### Option 2: Translation Issues

1. Open a GitHub Issue
2. Use the "Translation Request" template
3. Provide your translations in the issue
4. Maintainers will review and integrate

### Option 3: Community Translation

Join our translation community:
- Share your translations in Discussions
- Review others' translations
- Vote on translation quality
- Help maintain consistency

## 📞 Support

For translation-related questions:

- 💬 **GitHub Discussions:** [Translation category]
- 🐛 **Bug Reports:** Report missing/incorrect translations
- 📧 **Email:** For large translation contributions
- 🌐 **Community:** Join our translator community

## 🙏 Acknowledgments

Special thanks to our translation contributors:
- Community translators
- Native speakers who review translations
- Professional translation services
- AI translation tools (for initial drafts)

## 📄 License

Translation files are part of the FairCoin project and are licensed under the MIT License. See [LICENSE.md](../LICENSE.md) for details.

---

**Making FairCoin accessible to the world** 🌍

*Supporting 15 languages and counting*
