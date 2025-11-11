import { NextRequest, NextResponse } from 'next/server'

const FRONTEND_API_URL = process.env.FRONTEND_API_URL || 'http://localhost:8090'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const username = searchParams.get('username')

    let url = `${FRONTEND_API_URL}/api/v1/fairness/indexes`
    if (userId) {
      url += `?user_id=${userId}`
    } else if (username) {
      url += `?username=${username}`
    }

    console.log('Fetching fairness indexes from:', url)

    // Fetch from backend API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Fairness indexes error:', response.status, errorText)
      throw new Error(`Backend API returned ${response.status}`)
    }

    const data = await response.json()
    console.log('Fairness indexes fetched successfully')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Fairness indexes error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fairness indexes' },
      { status: 500 }
    )
  }
}
