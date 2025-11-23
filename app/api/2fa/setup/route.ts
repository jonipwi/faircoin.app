import { NextRequest, NextResponse } from 'next/server'
import { createCloudflareBypassHeaders } from '@/lib/cloudflare-bypass'

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://faircoin-api.bixio.xyz/sandbox'
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || ''

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Forward request with browser headers to bypass Cloudflare
    const response = await fetch(`${API_URL}/api/v1/2fa/setup`, {
      method: 'POST',
      headers: createCloudflareBypassHeaders(req, {
        'Content-Type': 'application/json',
        'Cookie': req.headers.get('cookie') || '',
        'Authorization': req.headers.get('authorization') || '',
        'X-API-Key': API_KEY,
      }),
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.error || 'Failed to setup 2FA' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Forward the response
    return NextResponse.json(data)
  } catch (error) {
    console.error('2FA setup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}