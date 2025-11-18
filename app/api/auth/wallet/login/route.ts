import { NextRequest, NextResponse } from 'next/server'

// Use API_URL for server-side routes (NEXT_PUBLIC_ is for client-side)
const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8100'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mnemonic } = body

    if (!mnemonic || mnemonic.trim().split(/\s+/).length !== 12) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid secret phrase. Must be exactly 12 words' 
        },
        { status: 400 }
      )
    }

    // Call FairCoin API to authenticate with mnemonic
    const apiUrl = `${API_BASE_URL}/api/v1/auth/wallet/login`
    console.log('[WALLET-LOGIN] Calling API:', apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mnemonic: mnemonic.trim() }),
    })

    console.log('[WALLET-LOGIN] Response status:', response.status)
    console.log('[WALLET-LOGIN] Response headers:', Object.fromEntries(response.headers.entries()))

    // Check if response is JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      console.error('[WALLET-LOGIN] Non-JSON response:', text.substring(0, 500))
      return NextResponse.json(
        { 
          success: false, 
          error: `Backend endpoint not available. The wallet authentication endpoints are not yet implemented on the server. Status: ${response.status}` 
        },
        { status: 503 }
      )
    }

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          error: data.error || 'Invalid secret phrase' 
        },
        { status: response.status }
      )
    }

    // Return exact backend response (flat structure like PowerShell test)
    const sessionResponse = NextResponse.json(data)

    // Set session cookie
    sessionResponse.cookies.set('session', data.session_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    })

    return sessionResponse
  } catch (error) {
    console.error('Wallet login error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
