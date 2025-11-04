import { NextRequest, NextResponse } from 'next/server'
import { deleteMessage } from '../../../../lib/xdiscord-store'

const FRONTEND_API_URL = process.env.FRONTEND_API_URL || 'http://localhost:8090'

export const dynamic = 'force-dynamic'

async function getUserFromToken(sessionToken: string) {
  try {
    const response = await fetch(`${FRONTEND_API_URL}/api/v1/auth/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    if (data.authenticated && data.session) {
      return {
        userId: data.session.user_id?.toString() || data.session.id,
        username: data.session.username || 'Anonymous',
      }
    }
    return null
  } catch (e) {
    console.error('Failed to get user from token', e)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session')?.value || 
                        request.headers.get('authorization')?.replace('Bearer ', '') ||
                        request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = await getUserFromToken(sessionToken)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const messageId = body.messageId

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })
    }

    const deleted = await deleteMessage(messageId, user.userId)
    
    if (deleted) {
      return NextResponse.json({ success: true, message: 'Message deleted' })
    } else {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }
  } catch (e) {
    console.error('POST /api/xdiscord/delete failed', e)
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}
