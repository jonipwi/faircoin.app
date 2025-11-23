/**
 * Request Signing Utility
 * Implements HMAC-SHA256 request signing for API security
 */

/**
 * Compute HMAC-SHA256 signature for a request
 * @param message - The message to sign (format: "METHOD:PATH:TIMESTAMP")
 * @param secret - The signing secret
 * @returns Hex-encoded HMAC signature
 */
async function computeHMAC(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const messageData = encoder.encode(message)

  // Import the secret key
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  // Sign the message
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)

  // Convert to hex string
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Generate signed headers for API request
 * @param method - HTTP method (GET, POST, etc.)
 * @param path - Request path (e.g., "/api/v1/user/profile")
 * @returns Object with X-Request-Signature and X-Request-Timestamp headers
 */
export async function generateSignedHeaders(
  method: string,
  path: string
): Promise<{ 'X-Request-Signature': string; 'X-Request-Timestamp': string }> {
  const secret = process.env.NEXT_PUBLIC_REQUEST_SIGNING_SECRET

  // If no secret configured, return empty headers (signing disabled)
  if (!secret) {
    return {
      'X-Request-Signature': '',
      'X-Request-Timestamp': ''
    }
  }

  // Generate timestamp in RFC3339 format
  const timestamp = new Date().toISOString()

  // Create message to sign: "METHOD:PATH:TIMESTAMP"
  const message = `${method}:${path}:${timestamp}`

  // Compute HMAC signature
  const signature = await computeHMAC(message, secret)

  return {
    'X-Request-Signature': signature,
    'X-Request-Timestamp': timestamp
  }
}

/**
 * Add request signing headers to an existing headers object
 * @param headers - Existing headers object
 * @param method - HTTP method
 * @param path - Request path
 * @returns Updated headers object with signing headers
 */
export async function addSignedHeaders(
  headers: HeadersInit,
  method: string,
  path: string
): Promise<HeadersInit> {
  const signedHeaders = await generateSignedHeaders(method, path)

  // Only add if signing is enabled (secret exists)
  if (signedHeaders['X-Request-Signature']) {
    if (headers instanceof Headers) {
      headers.set('X-Request-Signature', signedHeaders['X-Request-Signature'])
      headers.set('X-Request-Timestamp', signedHeaders['X-Request-Timestamp'])
      return headers
    } else if (Array.isArray(headers)) {
      return [
        ...headers,
        ['X-Request-Signature', signedHeaders['X-Request-Signature']],
        ['X-Request-Timestamp', signedHeaders['X-Request-Timestamp']]
      ]
    } else {
      return {
        ...headers,
        'X-Request-Signature': signedHeaders['X-Request-Signature'],
        'X-Request-Timestamp': signedHeaders['X-Request-Timestamp']
      }
    }
  }

  return headers
}
