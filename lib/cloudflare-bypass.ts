/**
 * Helper to create headers that bypass Cloudflare bot detection
 * by forwarding browser headers from the incoming request
 */
export function createCloudflareBypassHeaders(
  request: Request,
  additionalHeaders: Record<string, string> = {}
): HeadersInit {
  const headers: Record<string, string> = {
    ...additionalHeaders,
  }

  // Forward User-Agent from browser - critical for Cloudflare
  const userAgent = request.headers.get('user-agent')
  if (userAgent) {
    headers['User-Agent'] = userAgent
  }

  // Forward other browser headers that help bypass bot detection
  const forwardHeaders = [
    'accept',
    'accept-language',
    'accept-encoding',
    'referer',
    'origin',
    'sec-ch-ua',
    'sec-ch-ua-mobile',
    'sec-ch-ua-platform',
    'sec-fetch-dest',
    'sec-fetch-mode',
    'sec-fetch-site',
  ]

  forwardHeaders.forEach(headerName => {
    const value = request.headers.get(headerName)
    if (value) {
      headers[headerName] = value
    }
  })

  return headers
}
