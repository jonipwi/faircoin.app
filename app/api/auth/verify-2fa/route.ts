import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://faircoin-api.bixio.xyz/sandbox'

/**
 * POST /api/auth/verify-2fa
 * Verify 2FA code during login
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { code, sessionToken, isBackupCode } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Verification code is required' },
        { status: 400 }
      )
    }

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Session token is required' },
        { status: 400 }
      )
    }

    // Forward request to backend
    const response = await fetch(`${API_URL}/api/v1/auth/verify-2fa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        code,
        is_backup_code: isBackupCode || false
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Invalid verification code' }))
      return NextResponse.json(
        { error: error.error || 'Invalid verification code' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Set session cookie if provided by backend
    const responseObj = NextResponse.json({
      success: true,
      sessionToken: data.sessionToken || data.session_token,
      user: data.user,
      message: 'Two-factor authentication successful'
    })

    if (data.sessionToken || data.session_token) {
      responseObj.cookies.set('session', data.sessionToken || data.session_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })
    }

    return responseObj
  } catch (error) {
    console.error('2FA verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
