import { NextRequest, NextResponse } from 'next/server'
import { createCloudflareBypassHeaders } from '@/lib/cloudflare-bypass'

// Use API_URL for server-side routes (NEXT_PUBLIC_ is for client-side)
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8100'

// Mark this route as dynamic to prevent static optimization
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('[DASHBOARD] API_URL:', API_URL)
    console.log('[DASHBOARD] Request URL:', request.url)
    
    // Get session token from cookies or headers
    const sessionToken = request.cookies.get('session')?.value || 
                        request.headers.get('authorization')?.replace('Bearer ', '') ||
                        request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!sessionToken) {
      console.log('[DASHBOARD] No session token found')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    console.log('[DASHBOARD] Token:', sessionToken.substring(0, 10) + '...')
    
    const backendUrl = `${API_URL}/api/v1/user/dashboard`
    console.log('[DASHBOARD] Calling backend:', backendUrl)
    console.log('[DASHBOARD] 🌐 Forwarding User-Agent:', request.headers.get('user-agent')?.substring(0, 50) + '...')

    // Forward request with browser headers to bypass Cloudflare
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: createCloudflareBypassHeaders(request, {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      }),
    })

    console.log('[DASHBOARD] Backend response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[DASHBOARD] Backend error:', response.status, errorText)
      return NextResponse.json(
        { error: `Backend returned ${response.status}: ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('[DASHBOARD] Success - Data keys:', Object.keys(data))

    return NextResponse.json(data)
  } catch (error) {
    console.error('[DASHBOARD] Exception:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to fetch dashboard: ${errorMessage}` },
      { status: 500 }
    )
  }
}