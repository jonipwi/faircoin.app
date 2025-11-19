"use client"

import { useState, useEffect, useRef } from 'react'
import { X, Maximize2, Minimize2, Sun, Moon, MessageCircle, Users, Headphones } from 'lucide-react'
import { generateXChatToken, hasValidAuth } from '@/lib/xchat-token'

interface FloatingChatWidgetProps {
  chatUrl?: string
  defaultRoom?: string
  defaultUsername?: string
  hideButton?: boolean
}

export function FloatingChatWidget({
  chatUrl = process.env.NEXT_PUBLIC_CHAT_URL || 'http://localhost:3031',
  defaultRoom = 'general',
  defaultUsername = 'guest',
  hideButton = false
}: FloatingChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [modalSize, setModalSize] = useState({ width: 0, height: 0, left: 0, top: 0 })
  const [isResizing, setIsResizing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [username, setUsername] = useState(defaultUsername)
  const [chatMode, setChatMode] = useState<'community' | 'support'>('community')
  const [supportUrl, setSupportUrl] = useState<string | null>(null)
  const [loadingSupport, setLoadingSupport] = useState(false)
  
  const modalContentRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 })
  const currentHandleRef = useRef<string | null>(null)

  // Get username from localStorage (wallet auth session)
  useEffect(() => {
    try {
      // Try to get from 'user' key first
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        if (user.username) {
          setUsername(user.username)
          return
        }
      }

      // Fallback: Try to get from auth token and fetch user info
      const authToken = localStorage.getItem('auth_token')
      if (authToken) {
        // Fetch user info from API
        fetch('/api/settings', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        })
          .then(res => res.json())
          .then(data => {
            if (data.user?.username) {
              setUsername(data.user.username)
            } else if (data.user?.full_name) {
              setUsername(data.user.full_name)
            }
          })
          .catch(e => console.warn('Failed to fetch user from API:', e))
      }
    } catch (e) {
      console.warn('Failed to load user from localStorage:', e)
    }
  }, [])

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initialize theme from localStorage and system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('xdiscord-theme') as 'light' | 'dark' | null
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initialTheme = savedTheme || systemTheme
    setTheme(initialTheme)
    document.documentElement.setAttribute('data-chat-theme', initialTheme)
  }, [])

  // Load saved modal size
  useEffect(() => {
    if (isOpen && !isMaximized && !isMobile) {
      const saved = localStorage.getItem('chatModalSize')
      if (saved) {
        try {
          const size = JSON.parse(saved)
          setModalSize(size)
        } catch (e) {
          console.warn('Failed to load saved modal size:', e)
        }
      }
    }
  }, [isOpen, isMaximized, isMobile])

  // Auto-maximize on mobile
  useEffect(() => {
    if (isOpen && isMobile && !isMaximized) {
      setIsMaximized(true)
    }
  }, [isOpen, isMobile, isMaximized])

  // Send theme to iframe
  useEffect(() => {
    if (iframeRef.current && isOpen) {
      const iframe = iframeRef.current
      const sendTheme = () => {
        try {
          iframe.contentWindow?.postMessage({ type: 'SET_THEME', theme }, '*')
        } catch (err) {
          console.warn('Failed to send theme to iframe:', err)
        }
      }
      // Send immediately and on load
      sendTheme()
      iframe.addEventListener('load', sendTheme)
      return () => iframe.removeEventListener('load', sendTheme)
    }
  }, [theme, isOpen])

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = event.data
        if (!data || typeof data !== 'object') return

        if (data.type === 'CLOSE_MODAL') {
          setIsOpen(false)
        } else if (data.type === 'THEME_CHANGED' && (data.theme === 'dark' || data.theme === 'light')) {
          applyTheme(data.theme)
        }
      } catch (e) {
        // ignore
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const applyTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
    localStorage.setItem('xdiscord-theme', newTheme)
    document.documentElement.setAttribute('data-chat-theme', newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    applyTheme(newTheme)
    // Send to iframe
    iframeRef.current?.contentWindow?.postMessage({ type: 'SET_THEME', theme: newTheme }, '*')
  }

  // Initialize support chat with token
  const initializeSupportChat = async () => {
    setLoadingSupport(true)
    try {
      const auth = hasValidAuth()
      if (!auth.valid || !auth.username) {
        console.warn('[FloatingChat] No valid auth for support chat')
        setLoadingSupport(false)
        return
      }

      const token = await generateXChatToken(auth.username, auth.wallet || '')
      const xchatUrl = process.env.NEXT_PUBLIC_XCHAT_URL || 'http://localhost:8088'
      const url = `${xchatUrl}/lite?token=${token}`
      setSupportUrl(url)
      setLoadingSupport(false)
    } catch (err) {
      console.error('[FloatingChat] Failed to initialize support chat:', err)
      setLoadingSupport(false)
    }
  }

  // Switch to support mode
  const switchToSupport = async () => {
    setChatMode('support')
    if (!supportUrl) {
      await initializeSupportChat()
    }
  }

  // Switch to community mode
  const switchToCommunity = () => {
    setChatMode('community')
  }

  const toggleMaximize = () => {
    if (isMobile) {
      setIsMaximized(true)
      return
    }
    setIsMaximized(!isMaximized)
  }

  const saveModalSize = (size: typeof modalSize) => {
    if (!isMaximized) {
      localStorage.setItem('chatModalSize', JSON.stringify(size))
    }
  }

  const startResize = (e: React.MouseEvent, handle: string) => {
    if (isMaximized) return
    e.preventDefault()
    
    const rect = modalContentRef.current?.getBoundingClientRect()
    if (!rect) return

    setIsResizing(true)
    currentHandleRef.current = handle
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: rect.width,
      height: rect.height,
      left: rect.left,
      top: rect.top
    }

    const handleMouseMove = (e: MouseEvent) => resize(e)
    const handleMouseUp = () => stopResize(handleMouseMove, handleMouseUp)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const resize = (e: MouseEvent) => {
    if (!isResizing || !currentHandleRef.current) return

    const dx = e.clientX - resizeStartRef.current.x
    const dy = e.clientY - resizeStartRef.current.y
    const handle = currentHandleRef.current
    
    let newWidth = resizeStartRef.current.width
    let newHeight = resizeStartRef.current.height
    let newLeft = resizeStartRef.current.left
    let newTop = resizeStartRef.current.top

    if (handle.includes('e')) {
      newWidth = Math.max(300, resizeStartRef.current.width + dx)
    }
    if (handle.includes('w')) {
      newWidth = Math.max(300, resizeStartRef.current.width - dx)
      newLeft = resizeStartRef.current.left + (resizeStartRef.current.width - newWidth)
    }
    if (handle.includes('s')) {
      newHeight = Math.max(400, resizeStartRef.current.height + dy)
    }
    if (handle.includes('n')) {
      newHeight = Math.max(400, resizeStartRef.current.height - dy)
      newTop = resizeStartRef.current.top + (resizeStartRef.current.height - newHeight)
    }

    setModalSize({ width: newWidth, height: newHeight, left: newLeft, top: newTop })
  }

  const stopResize = (moveHandler: (e: MouseEvent) => void, upHandler: () => void) => {
    setIsResizing(false)
    currentHandleRef.current = null
    saveModalSize(modalSize)
    document.removeEventListener('mousemove', moveHandler)
    document.removeEventListener('mouseup', upHandler)
  }

  const iframeUrl = chatMode === 'support' 
    ? supportUrl 
    : `${chatUrl}?modal=true&compact=true&maximized=true&hideHeader=true&room=${defaultRoom}&username=${username}`

  // Expose openChat function for external use (e.g., from lite version cards)
  useEffect(() => {
    // Always expose the function, not just when hideButton is true
    (window as any).__openFairCoinChat = () => setIsOpen(true)
    
    return () => {
      if ((window as any).__openFairCoinChat) {
        delete (window as any).__openFairCoinChat
      }
    }
  }, [])

  return (
    <>
      {/* Floating Chat Button - Hidden in lite version */}
      {!hideButton && (
        <div className="fixed bottom-5 right-5 z-[1000]">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 active:scale-105 flex items-center justify-center overflow-hidden"
            title="Open Chat"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-radial from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <MessageCircle className="w-7 h-7 relative z-10" />
          </button>
        </div>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div 
          className={`fixed inset-0 z-[1001] transition-all duration-300 ${
            isMaximized || isMobile ? 'bg-transparent' : 'bg-black/50 backdrop-blur-sm flex items-center justify-center'
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isResizing && !isMobile) {
              setIsOpen(false)
            }
          }}
        >
          <div
            ref={modalContentRef}
            className={`relative flex flex-col overflow-hidden transition-all duration-300 ${
              isMaximized || isMobile
                ? 'fixed inset-0 w-full h-full rounded-none' 
                : 'rounded-2xl shadow-2xl'
            } ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}
            style={
              isMaximized || isMobile
                ? { width: '100%', height: '100%' }
                : modalSize.width > 0 
                  ? {
                      width: `${modalSize.width}px`,
                      height: `${modalSize.height}px`,
                      position: 'absolute',
                      left: `${modalSize.left}px`,
                      top: `${modalSize.top}px`,
                    }
                  : {
                      width: '90vw',
                      height: '90vh',
                      maxWidth: '1200px',
                      maxHeight: '800px',
                    }
            }
          >
            {/* Resize Handles - Hidden on mobile and when maximized */}
            {!isMobile && !isMaximized && (
              <>
                <div className="absolute top-0 left-0 w-5 h-5 cursor-nw-resize z-10" onMouseDown={(e) => startResize(e, 'nw')} />
                <div className="absolute top-0 left-5 right-5 h-2.5 cursor-n-resize z-10" onMouseDown={(e) => startResize(e, 'n')} />
                <div className="absolute top-0 right-0 w-5 h-5 cursor-ne-resize z-10" onMouseDown={(e) => startResize(e, 'ne')} />
                <div className="absolute top-5 left-0 bottom-5 w-2.5 cursor-w-resize z-10" onMouseDown={(e) => startResize(e, 'w')} />
                <div className="absolute top-5 right-0 bottom-5 w-2.5 cursor-e-resize z-10" onMouseDown={(e) => startResize(e, 'e')} />
                <div className="absolute bottom-0 left-0 w-5 h-5 cursor-sw-resize z-10" onMouseDown={(e) => startResize(e, 'sw')} />
                <div className="absolute bottom-0 left-5 right-5 h-2.5 cursor-s-resize z-10" onMouseDown={(e) => startResize(e, 's')} />
                <div className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize z-10" onMouseDown={(e) => startResize(e, 'se')} />
              </>
            )}

            {/* Modal Header */}
            <div className={`flex items-center justify-between px-6 py-5 border-b flex-shrink-0 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <h3 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {chatMode === 'support' ? 'Support Chat' : 'Community Chat'}
                </h3>
                
                {/* Mode Switcher */}
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={switchToCommunity}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      chatMode === 'community'
                        ? theme === 'dark'
                          ? 'bg-primary-600 text-white'
                          : 'bg-primary-500 text-white'
                        : theme === 'dark'
                        ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    title="Community Chat"
                  >
                    <Users className="w-3.5 h-3.5 inline mr-1" />
                    Community
                  </button>
                  <button
                    onClick={switchToSupport}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      chatMode === 'support'
                        ? theme === 'dark'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-500 text-white'
                        : theme === 'dark'
                        ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    title="Support Chat"
                  >
                    <Headphones className="w-3.5 h-3.5 inline mr-1" />
                    Support
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-primary-400'
                      : 'hover:bg-gray-200 text-gray-600 hover:text-primary-600'
                  }`}
                  title="Toggle theme"
                >
                  {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>

                {/* Maximize/Minimize */}
                {!isMobile && (
                  <button
                    onClick={toggleMaximize}
                    className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                        : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                    }`}
                    title={isMaximized ? 'Restore' : 'Maximize'}
                  >
                    {isMaximized ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                )}

                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 hover:bg-red-100 hover:text-red-600 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Iframe Content */}
            {chatMode === 'support' && loadingSupport ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3" />
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Connecting to support...
                  </p>
                </div>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                src={iframeUrl || ''}
                className="w-full flex-1 border-0"
                title={chatMode === 'support' ? 'Support Chat' : 'Community Chat'}
                allow="clipboard-read; clipboard-write"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}
