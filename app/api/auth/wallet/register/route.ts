import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.FAIRCOIN_API_URL || 'http://localhost:8080'

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
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/wallet/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ full_name: full_name.trim() }),
    })

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

    // Return wallet data with mnemonic (only shown once)
    return NextResponse.json({
      success: true,
      data: {
        username: data.username,
        full_name: data.full_name,
        wallet_address: data.wallet_address,
        mnemonic: data.mnemonic, // 12-word secret phrase
        created_at: data.created_at,
      },
    })
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
