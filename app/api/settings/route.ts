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
    console.log('[SETTINGS-POST] 📝 Settings update request...')
    console.log('[SETTINGS-POST] API_URL:', API_URL)
    
    // Get session token from cookies or headers
    const sessionToken = request.cookies.get('session')?.value || 
                        request.headers.get('authorization')?.replace('Bearer ', '') ||
                        request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!sessionToken) {
      console.log('[SETTINGS-POST] ❌ No session token found')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    console.log('[SETTINGS-POST] 🔑 Token:', sessionToken.substring(0, 10) + '...')

    // Get request body
    const body = await request.json()
    console.log('[SETTINGS-POST] 📦 Request body:', JSON.stringify(body, null, 2))
    console.log('[SETTINGS-POST] 🔧 Setting key:', body.setting_key)
    console.log('[SETTINGS-POST] 💾 Setting value:', body.setting_value)

    const backendUrl = `${API_URL}/api/v1/user/settings`
    console.log('[SETTINGS-POST] 📡 Calling backend:', backendUrl)
    
    const startTime = Date.now()

    // Forward request to frontend-api
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const duration = Date.now() - startTime
    console.log(`[SETTINGS-POST] ⏱️ Backend response in ${duration}ms - Status: ${response.status}`)

    const data = await response.json()
    console.log('[SETTINGS-POST] 📥 Backend response:', JSON.stringify(data, null, 2))

    if (!response.ok) {
      console.error('[SETTINGS-POST] ❌ Backend error:', response.status, data)
      return NextResponse.json(
        { error: data.message || `Backend returned ${response.status}` },
        { status: response.status }
      )
    }

    console.log('[SETTINGS-POST] ✅ Settings updated successfully')
    return NextResponse.json(data)
  } catch (error) {
    console.error('[SETTINGS-POST] 💥 Exception:', error)
    console.error('[SETTINGS-POST] 💥 Error stack:', error instanceof Error ? error.stack : 'No stack')
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to update settings: ${errorMessage}` },
      { status: 500 }
    )
  }
}