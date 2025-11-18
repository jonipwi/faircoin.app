import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8100'

// Mark this route as dynamic to prevent static optimization
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
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

    console.log('Fetching settings for token:', sessionToken.substring(0, 10) + '...')

    // Forward request to frontend-api
    const response = await fetch(`${API_URL}/api/v1/user/settings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    console.log('Settings API response:', response.status, data)

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch settings')
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Settings API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

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

    console.log('Updating settings:', body.setting_key, 'for token:', sessionToken.substring(0, 10) + '...')

    // Forward request to frontend-api
    const response = await fetch(`${API_URL}/api/v1/user/settings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    console.log('Settings update response:', response.status, data)

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update settings')
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update settings' },
      { status: 500 }
    )
  }
}