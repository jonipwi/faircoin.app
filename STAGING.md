# Staging Environment Documentation

## 🚀 Overview

This document explains the staging environments for the FairCoin project and addresses concerns about Google Safe Browsing warnings.

## 🌐 Staging Domains

FairCoin maintains the following **LEGITIMATE** staging environments:

### Primary Staging Server
- **URL**: https://faircoin.bixio.xyz
- **Purpose**: Primary development and testing environment
- **Status**: Active staging (NOT production)
- **Owner**: FairCoin Community (GitHub: jonipwi/faircoin.app)

### Secondary Vercel Deployment
- **URL**: https://faircoin-app.vercel.app
- **Purpose**: Vercel-based deployment testing
- **Status**: Active staging (NOT production)
- **Owner**: FairCoin Community (GitHub: jonipwi/faircoin.app)

## ⚠️ Google Safe Browsing Warning - EXPLAINED

### Why Chrome Shows "Dangerous site" Warning

If you encounter a Google Safe Browsing warning on our staging domains, here's why:

#### Common Reasons for Warnings

1. **New/Unverified Domain**: 
   - `bixio.xyz` may be a relatively new domain
   - Google hasn't established trust yet
   - No history of legitimate use in Google's database

2. **Shared Hosting/Subdomain**:
   - Other sites on the same hosting provider may have been flagged
   - Subdomain reputation can be affected by parent domain
   - IP address reputation may be impacted by neighbors

3. **OAuth Callback URLs**:
   - Authentication callback URLs can trigger warnings
   - URLs with query parameters (e.g., `?code=...&state=...`) may appear suspicious
   - This is normal for OAuth flows but can be misinterpreted

4. **Frequent Changes**:
   - Staging environments update frequently
   - Constant code changes may appear suspicious to automated systems
   - Test data and user accounts may trigger heuristics

5. **Non-HTTPS Content** (if applicable):
   - Mixed content warnings
   - API endpoints using HTTP instead of HTTPS

### This is NOT a Phishing Site - Here's Proof

✅ **Open Source**: All code is publicly available at https://github.com/jonipwi/faircoin.app

✅ **Documented**: Comprehensive README and documentation

✅ **Clear Warning Banners**: Visible staging environment warnings on all pages

✅ **No Commercial Use**: Explicitly stated as NOT for production

✅ **Security.txt**: Standard security contact file at `/.well-known/security.txt`

✅ **Community Driven**: Transparent development process on GitHub

✅ **MIT Licensed**: Legitimate open-source license

## 📋 How to Report to Google Safe Browsing

If you believe our staging sites are incorrectly flagged, you can help by reporting them as safe:

### Report URL as Safe

1. **Visit Google Safe Browsing Report Page**:
   - https://safebrowsing.google.com/safebrowsing/report_error/

2. **Select "This page is safe"**

3. **Enter the URL**:
   - `https://faircoin.bixio.xyz`
   - OR specific callback URL that was flagged

4. **Explain the Situation**:
   ```
   This is a legitimate staging/development environment for the open-source 
   FairCoin project (https://github.com/jonipwi/faircoin.app). 
   
   It is NOT a phishing site. Evidence:
   - Open-source code repository: https://github.com/jonipwi/faircoin.app
   - Security documentation: https://github.com/jonipwi/faircoin.app/blob/main/SECURITY.md
   - Clear staging environment warnings displayed on the site
   - Security.txt file: https://faircoin.bixio.xyz/.well-known/security.txt
   - Explicitly documented as a development/testing environment
   
   The OAuth callback URLs (e.g., /api/auth/callback/github?code=...&state=...)
   are legitimate GitHub OAuth flows for authentication testing.
   
   This is a staging environment for a community-driven fair transaction 
   system project and should be considered safe for developers and testers.
   ```

5. **Submit the Report**

### Alternative: Contact Google Webmaster Tools

If you manage the domain:

1. Verify ownership in Google Search Console
2. Submit a reconsideration request
3. Provide evidence of legitimacy
4. Monitor for status updates

## 🔐 Legitimacy Evidence

### 1. GitHub Repository
- **URL**: https://github.com/jonipwi/faircoin.app
- **Public**: Fully open-source
- **Active**: Regular commits and updates
- **Documented**: Comprehensive README and docs

### 2. Security.txt File
- **Location**: `/.well-known/security.txt`
- **Standard**: RFC 9116 compliant
- **Contact**: Security advisory reporting
- **Policy**: Links to SECURITY.md

### 3. Visible Warnings
Every page displays:
```
⚠️ STAGING ENVIRONMENT - LEGITIMATE DEVELOPMENT SITE
This is a development/testing environment
```

### 4. No Commercial Claims
- Clear disclaimer: "NOT FOR COMMERCIAL USE"
- No payment processing (test transactions only)
- No user data collection beyond test accounts
- Explicit staging status in all documentation

### 5. Open Development
- All changes tracked in Git
- Public issue tracking
- Community governance
- Transparent decision-making

## 🛡️ Security Measures

### For Developers and Testers

When using staging environments:

✅ **Safe to Use**: Legitimate testing environment
✅ **Test Accounts**: Use only test credentials
✅ **No Real Data**: All data is simulated
✅ **Clear Labeling**: Staging status always visible
✅ **Open Source**: Code is auditable

### Warning Signs This is NOT Phishing

- ✅ Doesn't ask for credit card numbers
- ✅ Doesn't request personal sensitive information
- ✅ Clearly labeled as staging/development
- ✅ Links to legitimate GitHub repository
- ✅ Uses standard OAuth flows (GitHub OAuth)
- ✅ Displays clear warning banners
- ✅ Open-source and transparent

## 📞 Contact & Verification

### Verify Legitimacy

1. **Check GitHub**: https://github.com/jonipwi/faircoin.app
2. **Read README**: https://github.com/jonipwi/faircoin.app/blob/main/README.md
3. **Review Security**: https://github.com/jonipwi/faircoin.app/blob/main/SECURITY.md
4. **View security.txt**: https://faircoin.bixio.xyz/.well-known/security.txt

### Report Issues

- **Security**: https://github.com/jonipwi/faircoin.app/security/advisories/new
- **Bugs**: https://github.com/jonipwi/faircoin.app/issues
- **Questions**: GitHub Discussions

## 🎯 Purpose of Staging

### What We Test

1. **Authentication Flows**
   - GitHub OAuth integration
   - Session management
   - 2FA implementation

2. **UI/UX Changes**
   - Design iterations
   - Responsive layout
   - Theme switching

3. **API Integration**
   - Exchange rate APIs
   - Backend communication
   - Error handling

4. **Feature Development**
   - New features before production
   - Breaking change testing
   - Performance optimization

### Why It's Safe

- No production data
- Test accounts only
- Clear warnings everywhere
- Open-source auditable code
- Standard OAuth flows
- Security best practices

## 📊 Environment Indicators

### Visual Indicators

All staging pages display:

```
⚠️ WARNING ⚠️
STAGING ENVIRONMENT - LEGITIMATE DEVELOPMENT SITE
This is a development/testing environment
```

### Environment Variables

```bash
NEXT_PUBLIC_DEV_MODE=staging
NEXT_PUBLIC_DEV_MODE_MESSAGE="Staging Site - Not a Phishing Page"
```

### Metadata

- Robots.txt: `Disallow: /` (not indexed)
- Security.txt: Available
- CSP Headers: Configured

## 🌟 Project Mission

FairCoin is built on:

- **Light & Truth**: Complete transparency
- **Love & Mercy**: Compassionate community
- **Just & Peace**: Fair distribution

This is a **legitimate** project working towards a fairer economic system.

## 🔄 Migration Path

### From Staging to Production

When ready for production:

1. Use verified domain
2. Implement full SSL/TLS
3. Remove staging warnings
4. Enable production mode
5. Complete security audit
6. Update all documentation

Currently: **IN STAGING - NOT PRODUCTION READY**

## 📝 FAQ

### Q: Is this a phishing site?
**A**: No. This is a legitimate open-source project in staging mode.

### Q: Why does Google flag it?
**A**: New domains, OAuth callbacks, and frequent changes can trigger false positives.

### Q: Is it safe to test?
**A**: Yes, but use only test credentials and understand it's a development environment.

### Q: Who owns this?
**A**: FairCoin Community (open-source project on GitHub).

### Q: Can I use it for real transactions?
**A**: No. This is staging only. No production use.

---

**Last Updated**: November 2025

**Repository**: https://github.com/jonipwi/faircoin.app

*This is a LEGITIMATE staging environment - NOT a phishing site*
