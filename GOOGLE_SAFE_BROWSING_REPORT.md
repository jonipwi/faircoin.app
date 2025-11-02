# Google Safe Browsing Reporting Guide

This document provides step-by-step instructions for reporting the FairCoin staging domains to Google Safe Browsing as legitimate sites that have been incorrectly flagged.

## 📋 Quick Reference

**Affected Domains:**
- Primary: https://faircoin.bixio.xyz
- Secondary: https://faircoin-app.vercel.app

**Status:** Legitimate staging/development environments (NOT phishing)

**GitHub Repository:** https://github.com/jonipwi/faircoin.app

## 🚀 How to Report to Google Safe Browsing

### Step 1: Visit the Report Page

Go to: https://safebrowsing.google.com/safebrowsing/report_error/

### Step 2: Select Report Type

Choose: **"This page is safe"**

### Step 3: Enter the URL

Enter the specific URL that was flagged:
- `https://faircoin.bixio.xyz` (main domain)
- OR the specific callback URL: `https://faircoin.bixio.xyz/api/auth/callback/github?code=...&state=...`

### Step 4: Provide Explanation

Copy and paste the following explanation (or customize it):

```
This is a LEGITIMATE staging/development environment for the open-source FairCoin 
project and is NOT a phishing or malicious site.

EVIDENCE OF LEGITIMACY:

1. Open Source Repository: https://github.com/jonipwi/faircoin.app
   - All source code is publicly available and auditable
   - Active development with documented commit history
   - Community-driven project with MIT license

2. Security Documentation:
   - Security Policy: https://github.com/jonipwi/faircoin.app/blob/main/SECURITY.md
   - Staging Guide: https://github.com/jonipwi/faircoin.app/blob/main/STAGING.md
   - RFC 9116 security.txt: https://faircoin.bixio.xyz/.well-known/security.txt

3. Clear Staging Indicators:
   - Prominent warning banners on every page identifying it as a staging environment
   - Explicitly documented as "NOT FOR COMMERCIAL USE"
   - robots.txt disallows indexing (staging only)
   - Metadata clearly states staging status

4. Legitimate Purpose:
   - Development and testing environment for FairCoin project
   - OAuth callbacks (e.g., /api/auth/callback/github) are legitimate GitHub 
     authentication flows
   - No real user data collection or financial transactions
   - Clear documentation explaining staging purpose

5. Transparency:
   - Fully transparent development on GitHub
   - Community governance model
   - All changes publicly documented
   - Security contact information provided

This is a false positive. The domain is being flagged likely due to:
- Being a relatively new/unverified domain (bixio.xyz)
- OAuth callback URLs that may appear suspicious to automated scanners
- Frequent code changes typical of staging environments

The site is safe for developers and testers. It includes proper security measures,
clear staging warnings, and comprehensive documentation proving its legitimacy.

Project: FairCoin - Community-driven fair transaction system
Mission: Light & Truth • Love & Mercy • Just & Peace
```

### Step 5: Submit the Report

Click the submit button and wait for Google to review.

## 🔍 Additional Verification Evidence

If Google requests additional information, you can provide:

### 1. Repository Information
- **GitHub**: https://github.com/jonipwi/faircoin.app
- **Stars/Forks**: Public engagement metrics
- **Contributors**: Community-driven development
- **License**: MIT (open-source)

### 2. Security Files
- **security.txt**: https://faircoin.bixio.xyz/.well-known/security.txt (RFC 9116 compliant)
- **SECURITY.md**: https://github.com/jonipwi/faircoin.app/blob/main/SECURITY.md
- **STAGING.md**: https://github.com/jonipwi/faircoin.app/blob/main/STAGING.md

### 3. Documentation Links
- **README**: https://github.com/jonipwi/faircoin.app/blob/main/README.md
- **Staging Info Page**: https://faircoin.bixio.xyz/staging-info

### 4. Security Headers
The site implements standard security headers:
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- X-Staging-Environment: true
- X-Project-Repository: https://github.com/jonipwi/faircoin.app

## 📞 Alternative Reporting Methods

### Google Search Console

If you have access to the domain:

1. Verify ownership in Google Search Console
2. Navigate to Security Issues
3. Submit a reconsideration request
4. Provide the same evidence listed above
5. Monitor for status updates

### Chrome Web Store Developer Dashboard

If the warning appears in Chrome extensions:

1. Log into Chrome Web Store Developer Dashboard
2. Navigate to your listing
3. Submit appeal with evidence
4. Wait for review

## 🛡️ What Makes This Site Legitimate

### Visual Proof
- ✅ Visible staging warning banners on all pages
- ✅ Clear "NOT FOR COMMERCIAL USE" disclaimers
- ✅ Link to GitHub repository in footer
- ✅ Security information prominently displayed

### Technical Proof
- ✅ Open-source code on GitHub
- ✅ Standard OAuth flows (GitHub authentication)
- ✅ Security headers properly configured
- ✅ RFC 9116 compliant security.txt
- ✅ No malicious code (auditable)

### Documentation Proof
- ✅ Comprehensive SECURITY.md
- ✅ Detailed STAGING.md guide
- ✅ Extensive README with project information
- ✅ Clear security contact information

### Community Proof
- ✅ Public GitHub repository
- ✅ Transparent development process
- ✅ Open issue tracking
- ✅ Community governance model

## ⚠️ Common Reasons for False Positives

1. **New Domain**: `bixio.xyz` may not be established in Google's trust database
2. **OAuth Callbacks**: URLs with `?code=...&state=...` parameters can trigger warnings
3. **Frequent Changes**: Staging environments update often, appearing suspicious
4. **Subdomain Reputation**: Parent domain or shared hosting reputation issues
5. **Automated Heuristics**: Pattern matching false positives

## 📊 Monitoring Status

### Check Current Status

1. **Google Transparency Report**: https://transparencyreport.google.com/safe-browsing/search
2. **Enter**: `faircoin.bixio.xyz`
3. **Review**: Current status and any warnings

### If Still Flagged

If the site remains flagged after reporting:

1. **Wait 24-48 hours** for Google's review
2. **Resubmit** if no response after 1 week
3. **Consider domain migration** if persistent (to verified domain)
4. **Update documentation** with any new evidence

## 🎯 Key Messages for Google

When reporting, emphasize:

1. **Open Source**: All code is publicly auditable on GitHub
2. **Staging Purpose**: Clearly documented as development environment
3. **No Malicious Intent**: Legitimate project with transparent goals
4. **Security Measures**: Proper implementation of security best practices
5. **Community Driven**: Public community governance and development

## 📝 Template for Quick Reporting

**Subject:** False Positive - Legitimate Staging Environment

**URL:** https://faircoin.bixio.xyz

**Issue:** Incorrectly flagged as dangerous/phishing

**Evidence:**
- GitHub Repo: https://github.com/jonipwi/faircoin.app
- Security Docs: https://github.com/jonipwi/faircoin.app/blob/main/SECURITY.md
- security.txt: https://faircoin.bixio.xyz/.well-known/security.txt
- Open Source & Fully Documented

**Request:** Please review and remove false positive warning

## 🔄 Follow-Up Actions

After reporting:

1. ✅ Monitor Google Transparency Report for status changes
2. ✅ Update documentation if Google requests more info
3. ✅ Consider domain verification through Google Search Console
4. ✅ Document the resolution for future reference
5. ✅ Share learnings with the community

## 💡 Prevention for Future

To avoid future false positives:

1. **Domain Verification**: Use Google Search Console verification
2. **HTTPS Everywhere**: Ensure all endpoints use HTTPS
3. **Clear Labeling**: Maintain visible staging indicators
4. **Regular Updates**: Keep documentation current
5. **Community Engagement**: Build domain reputation over time

## 📞 Need Help?

If you need assistance:

- **Security Issues**: https://github.com/jonipwi/faircoin.app/security/advisories/new
- **General Questions**: https://github.com/jonipwi/faircoin.app/issues
- **Documentation**: https://github.com/jonipwi/faircoin.app/blob/main/STAGING.md

---

**Last Updated:** November 2025

**Repository:** https://github.com/jonipwi/faircoin.app

*This guide helps report false positives to Google Safe Browsing for the FairCoin staging environments.*
