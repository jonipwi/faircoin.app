import { NextRequest, NextResponse } from 'next/server'
import { readMessages, appendMessage, updateOnlineUser, getOnlineUsers } from '../../../lib/xdiscord-store'

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
        avatarUrl: data.session.avatar_url,
      }
    }
    return null
  } catch (e) {
    console.error('Failed to get user from token', e)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get session token - authentication optional for reading
    const sessionToken = request.cookies.get('session')?.value || 
                        request.headers.get('authorization')?.replace('Bearer ', '') ||
                        request.headers.get('Authorization')?.replace('Bearer ', '')

    let user = null
    if (sessionToken) {
      user = await getUserFromToken(sessionToken)
      if (user) {
        // Update online status for authenticated users
        await updateOnlineUser({ userId: user.userId, username: user.username, avatarUrl: user.avatarUrl })
      }
    }

    const messages = await readMessages()
    const onlineUsers = await getOnlineUsers()
    
    return NextResponse.json({ 
      messages,
      onlineUsers,
      currentUser: user 
    })
  } catch (e) {
    console.error('GET /api/xdiscord failed', e)
    return NextResponse.json({ error: 'Failed to read messages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authentication required for posting
    const sessionToken = request.cookies.get('session')?.value || 
                        request.headers.get('authorization')?.replace('Bearer ', '') ||
                        request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Authentication required to post messages' },
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
    const text = (body.text || '').toString().trim().slice(0, 2000)

    if (!text || text.length === 0) {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 })
    }

    // Update online status
    await updateOnlineUser({ userId: user.userId, username: user.username, avatarUrl: user.avatarUrl })

    const created = await appendMessage({
      userId: user.userId,
      username: user.username,
      avatarUrl: user.avatarUrl,
      text,
    })
    
    return NextResponse.json({ message: created }, { status: 201 })
  } catch (e) {
    console.error('POST /api/xdiscord failed', e)
    return NextResponse.json({ error: 'Failed to append message' }, { status: 500 })
  }
}
