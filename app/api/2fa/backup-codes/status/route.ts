import { NextRequest, NextResponse } from 'next/server'

// Force this route to be dynamic since it requires authentication
export const dynamic = 'force-dynamic'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

/**
 * GET /api/2fa/backup-codes/status
 * Check the status of backup codes (remaining count)
 */
export async function GET(req: NextRequest) {
  try {
    // Get auth token from cookie or Authorization header
    const authToken = req.cookies.get('session')?.value || 
                     req.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/v1/2fa/backup-codes/status`, {
      method: 'GET',
      headers: {
        'Cookie': `session=${authToken}`,
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to check backup codes status' }))
      return NextResponse.json(
        { error: error.error || 'Failed to check backup codes status' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json({
      remaining: data.remaining || 0,
      total: data.total || 0,
      lastUsed: data.lastUsed || null
    })
  } catch (error) {
    console.error('Backup codes status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
