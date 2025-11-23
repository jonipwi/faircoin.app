import { NextRequest, NextResponse } from 'next/server'

// Force this route to be dynamic since it requires authentication
export const dynamic = 'force-dynamic'

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://faircoin-api.bixio.xyz/sandbox'
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || ''

/**
 * POST /api/2fa/backup-codes/regenerate
 * Generate new backup codes (invalidates old ones)
 */
export async function POST(req: NextRequest) {
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
    const response = await fetch(`${API_URL}/api/v1/2fa/backup-codes/regenerate`, {
      method: 'POST',
      headers: {
        'Cookie': `session=${authToken}`,
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to regenerate backup codes' }))
      return NextResponse.json(
        { error: error.error || 'Failed to regenerate backup codes' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json({
      backupCodes: data.backupCodes || data.backup_codes || [],
      message: 'Backup codes regenerated successfully'
    })
  } catch (error) {
    console.error('Backup codes regeneration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
