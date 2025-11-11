import { NextRequest, NextResponse } from 'next/server'

const FRONTEND_API_URL = process.env.FRONTEND_API_URL || 'http://localhost:8090'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const actorId = searchParams.get('actor_id')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')

    const params = new URLSearchParams()
    if (actorId) params.append('actor_id', actorId)
    if (category) params.append('category', category)
    if (status) params.append('status', status)
    if (limit) params.append('limit', limit)

    const url = `${FRONTEND_API_URL}/api/v1/fairness/submissions${params.toString() ? '?' + params.toString() : ''}`
    console.log('Fetching fairness submissions from:', url)

    // Fetch from backend API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Fairness submissions error:', response.status, errorText)
      throw new Error(`Backend API returned ${response.status}`)
    }

    const data = await response.json()
    console.log('Fairness submissions fetched successfully')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Fairness submissions error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fairness submissions' },
      { status: 500 }
    )
  }
}
