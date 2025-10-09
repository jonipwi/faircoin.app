import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    // Forward the request to the Go backend
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/2fa/disable`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.get('cookie') || '',
        'Authorization': req.headers.get('authorization') || '',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.error || 'Failed to disable 2FA' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Forward the response
    return NextResponse.json(data)
  } catch (error) {
    console.error('2FA disable error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}