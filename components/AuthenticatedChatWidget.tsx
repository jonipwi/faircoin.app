"use client"

/**
 * AuthenticatedChatWidget - xdiscord Integration
 * 
 * This component integrates the xdiscord open source chat application
 * with FairCoin's authentication system.
 * 
 * Features:
 * - Only shows when user is authenticated
 * - Uses authenticated username when user is logged in
 * - Falls back to "guest" for non-authenticated users
 * - Maintains all FloatingChatWidget functionality
 * - Theme synchronization between FairCoin and xdiscord
 * 
 * xdiscord Repository: https://github.com/jonipwi/xdiscord
 */

import { FloatingChatWidget } from '@/components/FloatingChatWidget'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'

export function AuthenticatedChatWidget() {
  const { user, isAuthenticated, loading } = useAuth()
  const pathname = usePathname()

  // Don't show widget while checking authentication
  if (loading) {
    return null
  }

  // Only show widget if user is authenticated
  if (!isAuthenticated) {
    return null
  }

  // Determine username based on authentication status
  // Prefer username, fallback to email prefix (before @), or generate one
  const username = user?.username || user?.email?.split('@')[0] || `user_${user?.user_id || 'guest'}`

  // Hide sticky button in lite version (lite version has Community Chat card instead)
  const isLiteVersion = pathname?.startsWith('/lite') || pathname?.includes('/lite')

  return (
    <FloatingChatWidget 
      chatUrl={process.env.NEXT_PUBLIC_CHAT_URL || 'http://localhost:3031'}
      defaultRoom="general"
      defaultUsername={username}
      hideButton={isLiteVersion}
    />
  )
}
