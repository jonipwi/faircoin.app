import { NextRequest, NextResponse } from 'next/server'
import { createCloudflareBypassHeaders } from '@/lib/cloudflare-bypass'

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8100'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Forward request with browser headers to bypass Cloudflare
    const response = await fetch(`${API_URL}/api/v1/2fa/verify`, {
      method: 'POST',
      headers: createCloudflareBypassHeaders(req, {
        'Content-Type': 'application/json',
        'Cookie': req.headers.get('cookie') || '',
        'Authorization': req.headers.get('authorization') || '',
      }),
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.error || 'Failed to verify 2FA' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Forward the response
    return NextResponse.json(data)
  } catch (error) {
    console.error('2FA verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}