import { NextRequest, NextResponse } from 'next/server'

// Use API_URL for server-side routes (NEXT_PUBLIC_ is for client-side)
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8100'

// Mark this route as dynamic to prevent static optimization
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('[SETTINGS] API_URL:', API_URL)
    console.log('[SETTINGS] Request URL:', request.url)
    
    // Get session token from cookies or headers
    const sessionToken = request.cookies.get('session')?.value || 
                        request.headers.get('authorization')?.replace('Bearer ', '') ||
                        request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!sessionToken) {
      console.log('[SETTINGS] No session token found')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    console.log('[SETTINGS] Token:', sessionToken.substring(0, 10) + '...')
    
    const backendUrl = `${API_URL}/api/v1/user/settings`
    console.log('[SETTINGS] Calling backend:', backendUrl)

    // Forward request to frontend-api
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('[SETTINGS] Backend response status:', response.status)

    const data = await response.json()
    console.log('[SETTINGS] Backend response data:', data)

    if (!response.ok) {
      console.error('[SETTINGS] Backend error:', response.status, data)
      return NextResponse.json(
        { error: data.error || `Backend returned ${response.status}` },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[SETTINGS] Exception:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to fetch settings: ${errorMessage}` },
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