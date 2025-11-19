'use client'

import { useState, useEffect } from 'react'

const LITE_VERSION = '1.0.0'
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

  if (!visible) return null

  return (
    <div className="fixed bottom-4 right-4 bg-gradient-to-br from-primary-600/90 to-accent-600/90 dark:from-primary-700/90 dark:to-accent-700/90 backdrop-blur-sm text-white text-xs px-4 py-3 rounded-2xl shadow-xl z-50 border-2 border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2">
        <span className="font-bold text-sm">🌟 LITE</span>
        <span className="text-white/70">•</span>
        <span className="font-mono font-semibold">v{LITE_VERSION}</span>
        <span className="text-white/70">•</span>
        <span className="text-white/90">{BUILD_DATE}</span>
      </div>
      <div className="mt-1 text-[10px] text-white/80">
        {FEATURES.join(' • ')}
      </div>
    </div>
  )
}
