"use client"

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Trash2, Users, Wifi, WifiOff, Loader2 } from 'lucide-react'

type Message = {
  id: string
  userId: string
  username: string
  avatarUrl?: string
  text: string
  createdAt: string
}

type OnlineUser = {
  userId: string
  username: string
  avatarUrl?: string
  lastSeen: string
}

type CurrentUser = {
  userId: string
  username: string
  avatarUrl?: string
}

export default function XDiscordPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const pollIntervalRef = useRef<number | null>(null)

  async function fetchMessages() {
    try {
      const res = await fetch('/api/xdiscord')
      if (!res.ok) {
        setError('Failed to load messages')
        return
      }
      const data = await res.json()
      setMessages(data.messages || [])
      setOnlineUsers(data.onlineUsers || [])
      setCurrentUser(data.currentUser || null)
      setError(null)
    } catch (e) {
      console.error('Failed to fetch messages', e)
      setError('Connection error')
    }
  }

  // Initial load and polling fallback
  useEffect(() => {
    fetchMessages()
    
    // Poll every 5 seconds as fallback (SSE should update faster)
    pollIntervalRef.current = window.setInterval(fetchMessages, 5000)
    
    return () => {
      if (pollIntervalRef.current) {
        window.clearInterval(pollIntervalRef.current)
      }
    }
  }, [])

  // Server-Sent Events for real-time updates
  useEffect(() => {
    const eventSource = new EventSource('/api/xdiscord/events')
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      setConnected(true)
      console.log('SSE connected')
    }

    eventSource.onerror = () => {
      setConnected(false)
      console.error('SSE error')
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'new_message' || data.type === 'message_deleted') {
          fetchMessages()
        }
      } catch (e) {
        console.error('Failed to parse SSE message', e)
      }
    }

    return () => {
      eventSource.close()
      eventSourceRef.current = null
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault()
    if (!text.trim() || loading) return
    
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/xdiscord', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      })
      
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to send message')
        return
      }
      
      setText('')
      await fetchMessages()
    } catch (err) {
      console.error('send failed', err)
      setError('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(messageId: string) {
    if (deleting) return
    
    setDeleting(messageId)
    try {
      const res = await fetch('/api/xdiscord/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId }),
      })
      
      if (res.ok) {
        await fetchMessages()
      }
    } catch (err) {
      console.error('delete failed', err)
    } finally {
      setDeleting(null)
    }
  }

  function formatTime(timestamp: string) {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                xDiscord
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Local Faircoin Community Chat
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Online users */}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Users className="w-4 h-4" />
                <span className="font-medium">{onlineUsers.length}</span>
                <span className="text-gray-400">online</span>
              </div>
              
              {/* Connection status */}
              <div className="flex items-center gap-2">
                {connected ? (
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                    <Wifi className="w-4 h-4" />
                    <span>Live</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <WifiOff className="w-4 h-4" />
                    <span>Polling</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Online users sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Online Now
              </h3>
              <div className="space-y-2">
                {onlineUsers.length === 0 ? (
                  <p className="text-sm text-gray-400">No users online</p>
                ) : (
                  onlineUsers.map((user) => (
                    <div key={user.userId} className="flex items-center gap-2">
                      {user.avatarUrl ? (
                        <Image 
                          src={user.avatarUrl} 
                          alt={user.username}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                        {user.username}
                      </span>
                      <div className="w-2 h-2 rounded-full bg-green-500 ml-auto"></div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {!currentUser && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-700 dark:text-blue-400 text-sm">
                Please <a href="/auth" className="underline font-medium">sign in</a> to post messages
              </div>
            )}

            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
              {/* Messages container */}
              <div className="h-[60vh] overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No messages yet. Be the first to say hello! 👋
                  </div>
                )}
                
                {messages.map((m) => (
                  <div 
                    key={m.id} 
                    className="flex gap-3 group hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded-lg transition-colors"
                  >
                    {/* Avatar */}
                    {m.avatarUrl ? (
                      <Image 
                        src={m.avatarUrl} 
                        alt={m.username}
                        width={40}
                        height={40}
                        className="rounded-full flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {m.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    {/* Message content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">
                          {m.username}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatTime(m.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap break-words">
                        {m.text}
                      </p>
                    </div>

                    {/* Delete button (only for own messages) */}
                    {currentUser && m.userId === currentUser.userId && (
                      <button
                        onClick={() => handleDelete(m.id)}
                        disabled={deleting === m.id}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400 disabled:opacity-50"
                        title="Delete message"
                      >
                        {deleting === m.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Message input */}
              <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                <form onSubmit={handleSend} className="flex gap-2">
                  <input
                    placeholder={currentUser ? "Type a message..." : "Sign in to chat"}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={!currentUser || loading}
                    className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    maxLength={2000}
                  />
                  <button 
                    type="submit" 
                    disabled={!currentUser || loading || !text.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send'
                    )}
                  </button>
                </form>
                {text.length > 0 && (
                  <div className="text-xs text-gray-400 mt-2">
                    {text.length} / 2000 characters
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
