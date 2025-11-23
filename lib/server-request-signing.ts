/**
 * Server-Side Request Signing Utility
 * For use in Next.js API routes (Node.js environment)
 */

import crypto from 'crypto'

/**
 * Compute HMAC-SHA256 signature for a request (server-side)
 * @param message - The message to sign (format: "METHOD:PATH:TIMESTAMP")
 * @param secret - The signing secret
 * @returns Hex-encoded HMAC signature
 */
function computeHMAC(message: string, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(message)
  return hmac.digest('hex')
}

/**
 * Generate signed headers for API request (server-side)
 * @param method - HTTP method (GET, POST, etc.)
 * @param path - Request path (e.g., "/api/v1/user/profile")
 * @returns Object with X-Request-Signature and X-Request-Timestamp headers
 */
export function generateSignedHeaders(
  method: string,
  path: string
): { 'X-Request-Signature': string; 'X-Request-Timestamp': string } | {} {
  const secret = process.env.NEXT_PUBLIC_REQUEST_SIGNING_SECRET

  // If no secret configured, return empty object (signing disabled)
  if (!secret) {
    return {}
  }

  // Generate timestamp in RFC3339 format
  const timestamp = new Date().toISOString()

  // Create message to sign: "METHOD:PATH:TIMESTAMP"
  const message = `${method}:${path}:${timestamp}`

  // Compute HMAC signature
  const signature = computeHMAC(message, secret)

  return {
    'X-Request-Signature': signature,
    'X-Request-Timestamp': timestamp
  }
}

/**
 * Add request signing headers to an existing headers object (server-side)
 * @param headers - Existing headers object
 * @param method - HTTP method
 * @param path - Request path
 * @returns Updated headers object with signing headers
 */
export function addSignedHeaders(
  headers: Record<string, string>,
  method: string,
  path: string
): Record<string, string> {
  const signedHeaders = generateSignedHeaders(method, path)
  
  return {
    ...headers,
    ...signedHeaders
  }
}
