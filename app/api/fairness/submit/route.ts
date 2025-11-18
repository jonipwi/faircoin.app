import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8100'

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

    const body = await request.json()

    // Validate required fields
    if (!body.category || !body.description || !body.score) {
      return NextResponse.json(
        { error: 'Missing required fields: category, description, score' },
        { status: 400 }
      )
    }

    // Validate category
    if (!['PFI', 'TFI', 'CBI'].includes(body.category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be PFI, TFI, or CBI' },
        { status: 400 }
      )
    }

    console.log('Submitting fairness action:', body)

    // Forward request to backend API
    const response = await fetch(`${API_URL}/api/v1/fairness/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Fairness submission error:', response.status, errorText)
      throw new Error(`Backend API returned ${response.status}`)
    }

    const data = await response.json()
    console.log('Fairness action submitted successfully')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Fairness submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit fairness action' },
      { status: 500 }
    )
  }
}
