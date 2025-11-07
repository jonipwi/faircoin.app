# Security Policy

> ✅ **DOMAIN RECOVERY UPDATE**: The domain **jacobyellowbridge.com** has been **RECOVERED** as of November 7, 2025 and is now safe to visit. 
> The domain **sobatam.com** recovery is in progress (expected completion: ~November 14, 2025). 
> See **[NOTICE.md](./NOTICE.md)** for complete details and verified ownership information.

## 🔒 About This Project

**FairCoin** is a legitimate, open-source community-driven fair transaction system. This repository contains the official staging and development environments for the FairCoin project.

### Domain Status

#### Recovered and Verified ✅
- **✅ jacobyellowbridge.com** - RECOVERED (November 7, 2025) - SAFE TO VISIT
  - Domain ownership verified
  - Under legitimate control
  - Affiliated with FairCoin project

#### Recovery In Progress ⚠️
- **⚠️ sobatam.com** - Recovery in progress with idwebhost.com
  - Expected completion: ~November 14, 2025
  - Avoid visiting until recovery is confirmed
  - Check [NOTICE.md](./NOTICE.md) for updates

For complete domain recovery information and verified ownership details, see **[NOTICE.md](./NOTICE.md)**.

### Staging Environments (Legitimate Development Sites)

The following domains are **LEGITIMATE** development and testing environments:

- **https://jacobyellowbridge.com** - RECOVERED domain (November 7, 2025)
- **https://faircoin.bixio.xyz** - Primary staging server
- **https://faircoin-app.vercel.app** - Vercel deployment

These sites are **NOT**:
- ❌ Phishing sites
- ❌ Malware distributors
- ❌ Commercial production sites
- ❌ Sites collecting real user credentials for malicious purposes

These sites **ARE**:
- ✅ Legitimate development environments
- ✅ Open-source project staging servers
- ✅ Testing platforms for new features
- ✅ Safe for developers and testers to use
- ✅ Publicly documented on GitHub

## 🎯 Purpose of Staging Environments

Our staging environments are used for:

1. **Feature Testing** - Testing new features before production release
2. **Integration Testing** - Validating API integrations and third-party services
3. **UI/UX Development** - Iterating on design and user experience
4. **Security Testing** - Conducting security audits and penetration testing
5. **Developer Demonstrations** - Showcasing work to stakeholders

## 🔐 Security Measures

### Authentication

- OAuth integration with GitHub (legitimate callback URLs)
- Test user accounts clearly labeled as "TEST" or "STAGING"
- No real financial transactions or sensitive data processing
- Session tokens used only for development purposes

### Data Protection

- All staging data is clearly marked as test data
- No production user data is used in staging
- Regular data cleanup and reset procedures
- Clear warnings displayed to users about staging status

### Security Headers

We implement standard security headers including:
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

## 🚨 Reporting Security Issues

If you discover a security vulnerability in FairCoin, please report it responsibly:

1. **DO NOT** open a public GitHub issue for security vulnerabilities
2. **DO** use GitHub Security Advisories: https://github.com/jonipwi/faircoin.app/security/advisories/new
3. **DO** include detailed information about the vulnerability
4. **DO** allow us time to address the issue before public disclosure

### What to Report

- Authentication bypass vulnerabilities
- Data exposure issues
- XSS or injection vulnerabilities
- CSRF vulnerabilities
- Security misconfigurations

### What NOT to Report

- Issues only affecting the staging environment that don't apply to production
- Social engineering attacks targeting test accounts
- DDoS or brute force attacks on staging servers
- Known issues already listed in our issue tracker

## 📋 Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| main    | ✅ (development)   |
| staging | ✅ (active testing)|

## 🛡️ Security Best Practices

When using our staging environments:

1. **Do not use real credentials** - Use only test accounts
2. **Do not submit real payment information** - All transactions are simulated
3. **Expect data resets** - Staging data may be cleared without notice
4. **Report unusual behavior** - Help us improve security

## 📞 Contact

- **Security Contact**: https://github.com/jonipwi/faircoin.app/security/advisories/new
- **Project Repository**: https://github.com/jonipwi/faircoin.app
- **Documentation**: https://github.com/jonipwi/faircoin.app/blob/main/README.md

## 🏛️ Legitimacy Verification

To verify the legitimacy of our staging environments:

1. **Check the repository**: https://github.com/jonipwi/faircoin.app
2. **Review the commit history**: All changes are publicly documented
3. **Check security.txt**: Available at `/.well-known/security.txt`
4. **Read the README**: Clearly states the project's purpose and staging status
5. **View the source code**: Fully open-source and auditable

## 📜 Transparency

FairCoin is built on principles of transparency:

- **Open Source**: All code is publicly available
- **Community Driven**: Governed by community consensus
- **Documented**: Comprehensive documentation for all features
- **Auditable**: All transactions and changes are logged

## ⚖️ Legal Notice

This project is licensed under the MIT License. The staging environments are provided "as is" without warranty of any kind. They are not intended for commercial use or production deployment.

### Not for Commercial Use

⚠️ **Important**: The staging environments are **NOT** production-ready and should **NOT** be used for:
- Real financial transactions
- Commercial operations
- Production user accounts
- Storing sensitive information
- Any mission-critical applications

## 🌐 For Security Researchers

We welcome security researchers to:
- Test our staging environments (within reasonable limits)
- Report vulnerabilities responsibly
- Contribute to improving our security posture
- Participate in our community

Please respect rate limits and do not perform DoS attacks or disruptive testing.

---

**Last Updated**: November 7, 2025

**Contact**: https://github.com/jonipwi/faircoin.app/security/advisories/new

*Light & Truth • Love & Mercy • Just & Peace*
