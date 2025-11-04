"use client"

/**
 * Example: FloatingChatWidget with Authentication
 * 
 * This file demonstrates how to integrate the FloatingChatWidget
 * with the AuthContext to pass authenticated user data.
 * 
 * Usage:
 * 1. Replace the current FloatingChatWidget in app/layout.tsx
 * 2. Or create a wrapper component that uses this pattern
 */

import { FloatingChatWidget } from '@/components/FloatingChatWidget'
import { useAuth } from '@/contexts/AuthContext'

export function AuthenticatedChatWidget() {
  const { user, isAuthenticated } = useAuth()

  // Only show chat for authenticated users (optional)
  if (!isAuthenticated) {
    return null
  }

  return (
    <FloatingChatWidget 
      chatUrl={process.env.NEXT_PUBLIC_CHAT_URL || 'http://localhost:3031'}
      defaultRoom="general"
      defaultUsername={user?.username || user?.email || 'guest'}
    />
  )
}

/**
 * Alternative: Always show chat, but use different usernames
 */
export function PublicChatWidget() {
  const { user, isAuthenticated } = useAuth()

  const username = isAuthenticated 
    ? user?.username || user?.email || 'user'
    : 'guest'

  return (
    <FloatingChatWidget 
      chatUrl={process.env.NEXT_PUBLIC_CHAT_URL || 'http://localhost:3031'}
      defaultRoom="support"
      defaultUsername={username}
    />
  )
}

/**
 * Advanced: Dynamic room based on page or user data
 * Note: This example assumes you might extend AuthSession with a role field in the future
 */
export function SmartChatWidget() {
  const { user, isAuthenticated } = useAuth()

  // Simple room assignment - customize based on your needs
  // For role-based rooms, you would need to extend AuthSession type or fetch user role separately
  const room = 'general-support'

  const username = isAuthenticated 
    ? user?.username || user?.email || 'user'
    : 'guest'

  return (
    <FloatingChatWidget 
      chatUrl={process.env.NEXT_PUBLIC_CHAT_URL || 'http://localhost:3000'}
      defaultRoom={room}
      defaultUsername={username}
    />
  )
}
