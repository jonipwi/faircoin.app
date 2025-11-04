import fs from 'fs'
import path from 'path'

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

const DATA_FILE = path.join(process.cwd(), 'xdiscord-messages.json')
const ONLINE_FILE = path.join(process.cwd(), 'xdiscord-online.json')
const MAX_MESSAGES = 1000
const ONLINE_TIMEOUT = 30000 // 30 seconds

async function ensureFile(file: string) {
  try {
    await fs.promises.access(file, fs.constants.F_OK)
  } catch (e) {
    await fs.promises.writeFile(file, JSON.stringify([]), 'utf8')
  }
}

export async function readMessages(): Promise<XMessage[]> {
  await ensureFile(DATA_FILE)
  try {
    const raw = await fs.promises.readFile(DATA_FILE, 'utf8')
    const parsed = JSON.parse(raw) as XMessage[]
    if (!Array.isArray(parsed)) return []
    // Filter out deleted messages from response
    return parsed.filter(m => !m.deleted).slice(-MAX_MESSAGES)
  } catch (e) {
    console.error('Failed to read xdiscord messages', e)
    return []
  }
}

export async function appendMessage(msg: Omit<XMessage, 'id'|'createdAt'>): Promise<XMessage> {
  await ensureFile(DATA_FILE)
  const messages = await readAllMessages()
  const newMsg: XMessage = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    userId: msg.userId,
    username: msg.username,
    avatarUrl: msg.avatarUrl,
    text: msg.text || '',
    createdAt: new Date().toISOString(),
  }
  messages.push(newMsg)
  const toStore = messages.slice(-MAX_MESSAGES)
  try {
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(toStore, null, 2), 'utf8')
  } catch (e) {
    console.error('Failed to write xdiscord messages', e)
  }
  return newMsg
}

async function readAllMessages(): Promise<XMessage[]> {
  await ensureFile(DATA_FILE)
  try {
    const raw = await fs.promises.readFile(DATA_FILE, 'utf8')
    const parsed = JSON.parse(raw) as XMessage[]
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch (e) {
    console.error('Failed to read all xdiscord messages', e)
    return []
  }
}

export async function deleteMessage(messageId: string, deletedBy: string): Promise<boolean> {
  await ensureFile(DATA_FILE)
  const messages = await readAllMessages()
  const msgIndex = messages.findIndex(m => m.id === messageId)
  if (msgIndex === -1) return false
  
  messages[msgIndex].deleted = true
  messages[msgIndex].deletedAt = new Date().toISOString()
  messages[msgIndex].deletedBy = deletedBy
  
  try {
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(messages, null, 2), 'utf8')
    return true
  } catch (e) {
    console.error('Failed to delete message', e)
    return false
  }
}

export async function updateOnlineUser(user: Omit<OnlineUser, 'lastSeen'>): Promise<void> {
  await ensureFile(ONLINE_FILE)
  try {
    const raw = await fs.promises.readFile(ONLINE_FILE, 'utf8')
    let users = JSON.parse(raw) as OnlineUser[]
    if (!Array.isArray(users)) users = []
    
    // Remove expired users
    const now = Date.now()
    users = users.filter(u => now - new Date(u.lastSeen).getTime() < ONLINE_TIMEOUT)
    
    // Update or add current user
    const index = users.findIndex(u => u.userId === user.userId)
    const updated: OnlineUser = { ...user, lastSeen: new Date().toISOString() }
    if (index >= 0) {
      users[index] = updated
    } else {
      users.push(updated)
    }
    
    await fs.promises.writeFile(ONLINE_FILE, JSON.stringify(users, null, 2), 'utf8')
  } catch (e) {
    console.error('Failed to update online users', e)
  }
}

export async function getOnlineUsers(): Promise<OnlineUser[]> {
  await ensureFile(ONLINE_FILE)
  try {
    const raw = await fs.promises.readFile(ONLINE_FILE, 'utf8')
    let users = JSON.parse(raw) as OnlineUser[]
    if (!Array.isArray(users)) return []
    
    // Remove expired users
    const now = Date.now()
    users = users.filter(u => now - new Date(u.lastSeen).getTime() < ONLINE_TIMEOUT)
    
    // Update the file with cleaned data
    await fs.promises.writeFile(ONLINE_FILE, JSON.stringify(users, null, 2), 'utf8')
    return users
  } catch (e) {
    console.error('Failed to get online users', e)
    return []
  }
}
