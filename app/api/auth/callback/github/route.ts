import { NextRequest, NextResponse } from 'next/server'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8090/api/v1'
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || ''

// Mark this route as dynamic to prevent static optimization
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Handle OAuth errors from GitHub
  if (error) {
    console.log('❌ GitHub OAuth error:', error, errorDescription)
    const redirectUrl = new URL('/auth', request.url)
    redirectUrl.searchParams.set('error', 'oauth_error')
    redirectUrl.searchParams.set('message', errorDescription || error)
    return NextResponse.redirect(redirectUrl)
  }

  if (!code || !state) {
    console.log('❌ Missing OAuth parameters')
    const redirectUrl = new URL('/auth', request.url)
    redirectUrl.searchParams.set('error', 'missing_params')
    return NextResponse.redirect(redirectUrl)
  }

  try {
    // Forward the OAuth callback to our backend API
    const response = await fetch(`${API_BASE}/auth/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.success && data.session) {
      // Successful authentication - redirect to auth page with session data
      const redirectUrl = new URL('/auth', request.url)
      redirectUrl.searchParams.set('success', 'true')
      redirectUrl.searchParams.set('user', data.session.username)
      redirectUrl.searchParams.set('email', data.session.email)
      redirectUrl.searchParams.set('avatar', data.session.avatar_url)
      redirectUrl.searchParams.set('session_id', data.session.id)
      redirectUrl.searchParams.set('user_id', data.session.user_id.toString())
      
      return NextResponse.redirect(redirectUrl)
    } else {
      // Authentication failed
      const redirectUrl = new URL('/auth', request.url)
      redirectUrl.searchParams.set('error', 'auth_failed')
      redirectUrl.searchParams.set('message', data.message || 'Authentication failed')
      return NextResponse.redirect(redirectUrl)
    }
  } catch (error) {
    console.error('❌ Error processing OAuth callback:', error)
    const redirectUrl = new URL('/auth', request.url)
    redirectUrl.searchParams.set('error', 'server_error')
    redirectUrl.searchParams.set('message', 'Internal server error')
    return NextResponse.redirect(redirectUrl)
  }
}