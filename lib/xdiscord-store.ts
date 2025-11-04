// xDiscord Database Store - Using frontend-api backend
// No file system operations - all data stored in PostgreSQL via API

const FRONTEND_API_URL = process.env.FRONTEND_API_URL || 'http://localhost:8090'

export type XMessage = {
  id: string
  userId: string
  username: string
  avatarUrl?: string
  text: string
  createdAt: string
  deleted?: boolean
  deletedAt?: string
  deletedBy?: string
}

export type OnlineUser = {
  userId: string
  username: string
  avatarUrl?: string
  lastSeen: string
}

async function apiRequest(endpoint: string, options?: RequestInit) {
  const url = `${FRONTEND_API_URL}/api/v1${endpoint}`
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  
  if (!response.ok) {
    const error = await response.text()
    console.error(`API request failed: ${endpoint}`, error)
    throw new Error(`API request failed: ${response.status}`)
  }
  
  return response.json()
}

export async function readMessages(): Promise<XMessage[]> {
  try {
    const data = await apiRequest('/xdiscord/messages')
    return data.messages || []
  } catch (e) {
    console.error('Failed to read xdiscord messages', e)
    return []
  }
}

export async function appendMessage(msg: Omit<XMessage, 'id'|'createdAt'>): Promise<XMessage> {
  try {
    const data = await apiRequest('/xdiscord/messages', {
      method: 'POST',
      body: JSON.stringify({
        user_id: msg.userId,
        username: msg.username,
        avatar_url: msg.avatarUrl,
        text: msg.text,
      }),
    })
    return data.message
  } catch (e) {
    console.error('Failed to append xdiscord message', e)
    throw e
  }
}

export async function deleteMessage(messageId: string, deletedBy: string): Promise<boolean> {
  try {
    await apiRequest(`/xdiscord/messages/${messageId}`, {
      method: 'DELETE',
      body: JSON.stringify({ deleted_by: deletedBy }),
    })
    return true
  } catch (e) {
    console.error('Failed to delete message', e)
    return false
  }
}

export async function updateOnlineUser(user: Omit<OnlineUser, 'lastSeen'>): Promise<void> {
  try {
    await apiRequest('/xdiscord/online', {
      method: 'POST',
      body: JSON.stringify({
        user_id: user.userId,
        username: user.username,
        avatar_url: user.avatarUrl,
      }),
    })
  } catch (e) {
    console.error('Failed to update online users', e)
  }
}

export async function getOnlineUsers(): Promise<OnlineUser[]> {
  try {
    const data = await apiRequest('/xdiscord/online')
    return data.users || []
  } catch (e) {
    console.error('Failed to get online users', e)
    return []
  }
}
