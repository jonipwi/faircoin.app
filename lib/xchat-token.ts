/**
 * XChat Token Generation for Secure Integration
 * Encrypts username and wallet address for passing to xchat iframe
 */

interface TokenPayload {
  username: string
  wallet_address: string
  timestamp: string
  expires_at: string
}

/**
 * Generate encrypted token for xchat authentication
 * This creates a secure token that can be validated by the xchat backend
 */
export async function generateXChatToken(username: string, walletAddress: string): Promise<string> {
  try {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000) // 1 hour expiry

    const payload: TokenPayload = {
      username,
      wallet_address: walletAddress,
      timestamp: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    }

    const payloadJson = JSON.stringify(payload)

    // Get encryption key from environment
    const keyString = process.env.NEXT_PUBLIC_XCHAT_TOKEN_KEY || 'faircoin-xchat-integration-key-2025'
    
    // Create SHA-256 hash of key string to get 32 bytes for AES-256
    const encoder = new TextEncoder()
    const keyData = encoder.encode(keyString)
    const hashBuffer = await crypto.subtle.digest('SHA-256', keyData)
    
    // Import key for AES-GCM encryption
    const key = await crypto.subtle.importKey(
      'raw',
      hashBuffer,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    )

    // Generate random IV (12 bytes for GCM)
    const iv = crypto.getRandomValues(new Uint8Array(12))

    // Encrypt the payload
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(payloadJson)
    )

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedData.byteLength)
    combined.set(iv, 0)
    combined.set(new Uint8Array(encryptedData), iv.length)

    // Convert to base64url for URL safety
    const base64 = btoa(String.fromCharCode(...combined))
    const base64url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')

    return base64url
  } catch (error) {
    console.error('Failed to generate xchat token:', error)
    throw new Error('Token generation failed')
  }
}

/**
 * Verify if user has valid authentication
 */
export function hasValidAuth(): { valid: boolean; username?: string; wallet?: string } {
  if (typeof window === 'undefined') {
    return { valid: false }
  }

  try {
    // Check for auth token
    const authToken = localStorage.getItem('auth_token')
    if (!authToken) {
      return { valid: false }
    }

    // Get user data
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      return { valid: false }
    }

    const user = JSON.parse(userStr)
    const username = user.username || user.email?.split('@')[0] || ''
    const wallet = user.wallet_address || localStorage.getItem('wallet') || ''

    if (!username) {
      return { valid: false }
    }

    return {
      valid: true,
      username,
      wallet,
    }
  } catch (error) {
    console.error('Auth validation error:', error)
    return { valid: false }
  }
}
