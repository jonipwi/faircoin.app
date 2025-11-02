# Contributing to FairCoin

Welcome! 🎉 We're thrilled that you're interested in contributing to FairCoin. This project is built on the principles of **Light & Truth**, **Love & Mercy**, and **Just & Peace**, and we welcome all forms of contribution from our community.

## 🌟 Ways to Contribute

FairCoin welcomes contributions in many forms:

### 💻 Code Contributions
- **Feature Development**: Build new features that align with our fairness principles
- **Bug Fixes**: Help us maintain a stable and reliable platform
- **Performance Improvements**: Optimize existing code for better performance
- **Testing**: Write tests to improve code coverage and reliability
- **Code Reviews**: Review pull requests from other contributors

### 📝 Documentation
- **Technical Documentation**: Improve API docs, code comments, and technical guides
- **User Guides**: Create tutorials and how-to guides for users
- **Translation**: Translate documentation into other languages
- **Examples**: Add code examples and use cases

### 🎨 Design & UX
- **UI/UX Design**: Improve the user interface and experience
- **Accessibility**: Make FairCoin more accessible to all users
- **Visual Assets**: Create icons, illustrations, and graphics
- **Mobile Design**: Enhance the mobile experience

### 📢 Marketing & Community
- **Content Creation**: Write blog posts, articles, and social media content
- **Community Management**: Help moderate discussions and support users
- **Event Organization**: Organize meetups, webinars, or conferences
- **Outreach**: Spread the word about FairCoin
- **Social Media**: Manage and grow our social media presence

### 🔍 Research & Analysis
- **Economic Research**: Study fairness metrics and economic models
- **Security Audits**: Help identify and report security vulnerabilities
- **User Research**: Conduct user interviews and surveys
- **Data Analysis**: Analyze platform usage and fairness metrics

### 🐛 Issue Reporting
- **Bug Reports**: Report issues you encounter
- **Feature Requests**: Suggest new features or improvements
- **Security Issues**: Responsibly disclose security vulnerabilities

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **Git** for version control
- **npm** or **yarn** package manager
- A **GitHub account**
- Basic knowledge of **TypeScript/JavaScript** (for code contributions)

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub by clicking the "Fork" button

2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/faircoin.app.git
   cd faircoin.app
   ```

3. **Add the upstream repository**:
   ```bash
   git remote add upstream https://github.com/jonipwi/faircoin.app.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

6. **Start the development server**:
   ```bash
   npm run dev
   ```

7. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Contribution Workflow

### For Code Contributions

1. **Create a new branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes** following our coding standards:
   - Write clean, readable code
   - Follow TypeScript best practices
   - Add comments for complex logic
   - Keep functions small and focused

3. **Test your changes**:
   ```bash
   npm run test
   npm run lint
   npm run build
   ```

4. **Commit your changes** with a descriptive message:
   ```bash
   git add .
   git commit -m "feat: add new fairness metric calculation"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** on GitHub:
   - Provide a clear title and description
   - Reference any related issues
   - Add screenshots for UI changes
   - Request review from maintainers

### For Non-Code Contributions

1. **Marketing & Content**:
   - Create content in the `docs/` directory or appropriate location
   - Submit through a pull request or share in discussions
   - Coordinate with the community team

2. **Design**:
   - Share design mockups in issues or discussions
   - Use Figma, Sketch, or other design tools
   - Provide assets in appropriate formats (SVG, PNG)

3. **Documentation**:
   - Edit markdown files directly
   - Follow the existing documentation structure
   - Submit changes via pull request

## 💡 Coding Standards

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow the existing ESLint configuration
- Use meaningful variable and function names
- Prefer `const` over `let`, avoid `var`
- Use async/await over promises when possible

### React/Next.js
- Use functional components with hooks
- Keep components small and reusable
- Use proper TypeScript typing for props
- Follow the existing component structure
- Use Tailwind CSS for styling

### Commit Messages
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks
- `perf:` Performance improvements

Examples:
```
feat: add PFI calculation to user profile
fix: resolve wallet balance display issue
docs: update API documentation for governance endpoints
test: add integration tests for 2FA flow
```

## 🧪 Testing Guidelines

- Write tests for new features
- Ensure existing tests pass before submitting PR
- Aim for meaningful test coverage
- Test both success and error cases

Run tests:
```bash
npm test                 # Run all tests
npm run test:ui          # Run tests with UI
npm run test:coverage    # Check test coverage
```

## 📝 Pull Request Guidelines

### Before Submitting
- [ ] Code follows the project's style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex code
- [ ] Documentation updated if needed
- [ ] Tests added/updated and passing
- [ ] No linting errors
- [ ] Build succeeds without errors

### PR Description Should Include
- **Summary**: Brief description of changes
- **Motivation**: Why this change is needed
- **Changes**: List of specific changes made
- **Testing**: How you tested the changes
- **Screenshots**: For UI changes (required)
- **Related Issues**: Link to related issues

### PR Title Format
Use conventional commit format:
```
feat: add user reputation system
fix: correct PFI calculation error
docs: improve installation guide
```

## 🔒 Security

- **Never commit** sensitive data (API keys, passwords, tokens)
- **Report security vulnerabilities** privately to the maintainers
- Follow our [Security Policy](./SECURITY.md)
- Use environment variables for configuration

## 🤝 Code of Conduct

### Our Principles

FairCoin is built on:
- **Light & Truth**: Be honest and transparent in all communications
- **Love & Mercy**: Treat everyone with kindness and respect
- **Just & Peace**: Foster a welcoming, inclusive environment

### Expected Behavior
- Be respectful and professional
- Welcome newcomers warmly
- Provide constructive feedback
- Accept constructive criticism gracefully
- Focus on what's best for the community

### Unacceptable Behavior
- Harassment or discrimination of any kind
- Trolling, insulting, or derogatory comments
- Publishing others' private information
- Any conduct that could be deemed inappropriate

## 💬 Communication Channels

### Primary Channels

- **[GitHub Discussions](https://github.com/jonipwi/faircoin.app/discussions)** - **Start here!** Ask questions, share ideas, and engage with the community
  - 💡 Ideas & Feature Requests
  - 🙏 Q&A - Get help and answers
  - 🏗️ Development discussions
  - 🎨 Design & UX feedback
  - 🎉 Show and Tell
  - 💬 General community discussions

- **[GitHub Issues](https://github.com/jonipwi/faircoin.app/issues)** - Bug reports and approved feature requests
  - Use for specific, actionable tasks
  - Link related discussions for context

- **Pull Requests** - Code contributions and reviews
  - See our [PR Guidelines](#-pull-request-guidelines)

### Coming Soon
- **Discord**: Real-time community chat
- **Twitter**: Updates and announcements

## 🎯 Finding Something to Work On

### Good First Issues
Look for issues labeled `good first issue` - these are great for newcomers!

### Help Wanted
Issues labeled `help wanted` need community contributions.

### Feature Requests
Check the discussions for feature ideas that need implementation.

### Documentation
Documentation improvements are always welcome and a great way to start!

## 🏆 Recognition

We value all contributions! Contributors will be:
- Listed in our README
- Acknowledged in release notes
- Invited to join our contributor community
- Eligible for contributor swag (when available)

## 📚 Additional Resources

- [README](./README.md) - Project overview
- [Discussions Setup](./DISCUSSIONS_SETUP.md) - Guide to enabling GitHub Discussions
- [Security Policy](./SECURITY.md) - Security guidelines
- [Staging Guide](./STAGING.md) - Development environment info
- [2FA Documentation](./docs/2FA_IMPLEMENTATION.md) - Authentication system
- [Sponsors Guide](./SPONSORS_GUIDE.md) - Support the project

## ❓ Questions?

- Open a [GitHub Discussion](https://github.com/jonipwi/faircoin.app/discussions)
- Check existing issues and discussions
- Reach out to maintainers

## 🙏 Thank You!

Every contribution, no matter how small, helps build a fairer economic system for everyone. We're grateful for your interest in FairCoin and look forward to collaborating with you!

---

**Built with ❤️ by the FairCoin Community**

*Light & Truth • Love & Mercy • Just & Peace*
