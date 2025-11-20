'use client'

const BUILD_DATE = '2025-11-17'
const FEATURES = [
  'Wallet Authentication',
  'Email Registration',
  'BIP39 12-word Mnemonic',
  'Solana Integration'
]

export default function VersionDisplay() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || '1.1.0'
  const gitCommit = process.env.NEXT_PUBLIC_GIT_COMMIT || 'local'
  const gitBranch = process.env.NEXT_PUBLIC_GIT_BRANCH || 'main'

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900/80 dark:bg-gray-800/80 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg shadow-lg z-50">
      <div className="flex items-center gap-2">
        <span className="font-mono">v{version}</span>
        <span className="text-gray-400">•</span>
        <span className="text-gray-400">{BUILD_DATE}</span>
        <span className="text-gray-400">•</span>
        <span className="text-blue-400" title={`Branch: ${gitBranch}`}>{gitBranch}</span>
        <span className="text-gray-400">•</span>
        <span className="text-green-400" title="Git commit hash">#{gitCommit}</span>
      </div>
      <div className="mt-1 text-[10px] text-gray-400">
        Latest: {FEATURES.join(' • ')}
      </div>
    </div>
  )
}
