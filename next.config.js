const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
})

const { execSync } = require('child_process')

// Get git commit hash
const getGitCommit = () => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch (e) {
    return 'unknown'
  }
}

// Get git branch
const getGitBranch = () => {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
  } catch (e) {
    return 'unknown'
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_GIT_COMMIT: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || getGitCommit(),
    NEXT_PUBLIC_GIT_BRANCH: getGitBranch(),
    NEXT_PUBLIC_APP_VERSION: require('./package.json').version,
  },
  experimental: {
    typedRoutes: true,
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  images: {
    remotePatterns: []
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Staging-Environment',
            value: 'true',
          },
          {
            key: 'X-Project-Repository',
            value: 'https://github.com/jonipwi/faircoin.app',
          },
        ],
      },
    ]
  },
}

module.exports = withPWA(nextConfig)
