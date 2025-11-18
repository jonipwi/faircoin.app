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

    console.log('Fetching dashboard for token:', sessionToken.substring(0, 10) + '...')

    // Forward request to frontend-api
    const response = await fetch(`${API_URL}/api/v1/user/dashboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Dashboard API error:', response.status, errorText)
      throw new Error(`Dashboard API returned ${response.status}`)
    }

    const data = await response.json()
    console.log('Dashboard data fetched successfully')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}