'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const BUILD_DATE = '2025-11-19'
const FEATURES = [
  'Big Buttons',
  'Chat-First',
  'Elder-Friendly',
  'Simplified UI'
]

interface LiteVersionDisplayProps {
  show?: boolean
  autoHideDelay?: number
}

export default function LiteVersionDisplay({ show = false, autoHideDelay }: LiteVersionDisplayProps) {
  const [visible, setVisible] = useState(show)
  const version = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
  const gitCommit = process.env.NEXT_PUBLIC_GIT_COMMIT || 'local'
  const gitBranch = process.env.NEXT_PUBLIC_GIT_BRANCH || 'main'

  useEffect(() => {
    if (show && autoHideDelay) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
      }, autoHideDelay)
      return () => clearTimeout(timer)
    } else {
      setVisible(show)
    }
  }, [show, autoHideDelay])

  const handleClose = () => {
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-4 bg-gradient-to-br from-primary-600/90 to-accent-600/90 dark:from-primary-700/90 dark:to-accent-700/90 backdrop-blur-sm text-white text-xs px-4 py-3 rounded-2xl shadow-xl z-50 border-2 border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={handleClose}
        className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-lg flex items-center justify-center transition-all hover:scale-110"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-2">
        <span className="font-bold text-sm">🌟 LITE</span>
        <span className="text-white/70">•</span>
        <span className="font-mono font-semibold">v{version}</span>
        <span className="text-white/70">•</span>
        <span className="text-white/90">{BUILD_DATE}</span>
        <span className="text-white/70">•</span>
        <span className="text-blue-300" title={`Branch: ${gitBranch}`}>{gitBranch}</span>
        <span className="text-white/70">•</span>
        <span className="text-green-300" title="Git commit hash">#{gitCommit}</span>
      </div>
      <div className="mt-1 text-[10px] text-white/80">
        {FEATURES.join(' • ')}
      </div>
    </div>
  )
}
