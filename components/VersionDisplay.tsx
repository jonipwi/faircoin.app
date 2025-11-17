'use client'

const VERSION = '1.1.0'
const BUILD_DATE = '2025-11-17'
const FEATURES = [
  'Wallet Authentication',
  'Email Registration',
  'BIP39 12-word Mnemonic',
  'Solana Integration'
]

export default function VersionDisplay() {
  return (
    <div className="fixed bottom-4 right-4 bg-gray-900/80 dark:bg-gray-800/80 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg shadow-lg z-50">
      <div className="flex items-center gap-2">
        <span className="font-mono">v{VERSION}</span>
        <span className="text-gray-400">•</span>
        <span className="text-gray-400">{BUILD_DATE}</span>
        <span className="text-gray-400">•</span>
        <span className="text-green-400">Build: {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || 'local'}</span>
      </div>
      <div className="mt-1 text-[10px] text-gray-400">
        Latest: {FEATURES.join(' • ')}
      </div>
    </div>
  )
}
