import { NextRequest, NextResponse } from 'next/server'

// Use API_URL for server-side routes (NEXT_PUBLIC_ is for client-side)
const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://faircoin-api.bixio.xyz/sandbox'
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { full_name } = body

    if (!full_name || full_name.trim().length < 2) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Full name is required and must be at least 2 characters' 
        },
        { status: 400 }
      )
    }

    // Call FairCoin API to create wallet and user account
    const apiUrl = `${API_BASE_URL}/api/v1/auth/wallet/register`
    console.log('[WALLET-REGISTER] Environment check:', {
      API_URL: process.env.API_URL,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      resolved: API_BASE_URL
    })
    console.log('[WALLET-REGISTER] Calling API:', apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify({ full_name: full_name.trim() }),
    })

    console.log('[WALLET-REGISTER] Response status:', response.status)
    console.log('[WALLET-REGISTER] Response headers:', Object.fromEntries(response.headers.entries()))

    // Check if response is JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      console.error('[WALLET-REGISTER] Non-JSON response:', text.substring(0, 500))
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
          error: data.error || 'Failed to create wallet' 
        },
        { status: response.status }
      )
    }

    // Return exact backend response (flat structure like PowerShell test)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Wallet registration error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
