import { NextRequest, NextResponse } from 'next/server'

const FRONTEND_API_URL = process.env.FRONTEND_API_URL || 'http://localhost:8090'

// Mark this route as dynamic to prevent static optimization
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Get session token from cookies or headers
    const sessionToken = request.cookies.get('session')?.value || 
                        request.headers.get('authorization')?.replace('Bearer ', '') ||
                        request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get request body
    const body = await request.json()

    // Validate required fields
    if (!body.currentPassword || !body.newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      )
    }

    console.log('Changing password for token:', sessionToken.substring(0, 10) + '...')

    // Forward request to frontend-api
    const response = await fetch(`${FRONTEND_API_URL}/api/v1/user/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    console.log('Password change response:', response.status, data)

    if (!response.ok) {
      throw new Error(data.message || 'Failed to change password')
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to change password' },
      { status: 500 }
    )
  }
}