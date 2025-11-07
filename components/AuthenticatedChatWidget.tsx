"use client"

/**
 * AuthenticatedChatWidget - xdiscord Integration
 * 
 * This component integrates the xdiscord open source chat application
 * with FairCoin's authentication system.
 * 
 * Features:
 * - Uses authenticated username when user is logged in
 * - Falls back to "guest" for non-authenticated users
 * - Maintains all FloatingChatWidget functionality
 * - Theme synchronization between FairCoin and xdiscord
 * 
 * xdiscord Repository: https://github.com/jonipwi/xdiscord
 */

import { FloatingChatWidget } from '@/components/FloatingChatWidget'
import { useAuth } from '@/contexts/AuthContext'

export function AuthenticatedChatWidget() {
  const { user, isAuthenticated } = useAuth()

  // Determine username based on authentication status
  // Prefer username, fallback to email prefix (before @), or generate one
  const username = isAuthenticated 
    ? user?.username || user?.email?.split('@')[0] || `user_${user?.user_id || 'guest'}`
    : 'guest'

  return (
    <FloatingChatWidget 
      chatUrl={process.env.NEXT_PUBLIC_CHAT_URL || 'http://localhost:3031'}
      defaultRoom="general"
      defaultUsername={username}
    />
  )
}
