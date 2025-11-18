"use client"

import { useState, useEffect, useRef } from 'react'
import { X, Maximize2, Minimize2, Sun, Moon, MessageCircle } from 'lucide-react'

interface FloatingChatWidgetProps {
  chatUrl?: string
  defaultRoom?: string
  defaultUsername?: string
}

export function FloatingChatWidget({
  chatUrl = process.env.NEXT_PUBLIC_CHAT_URL || 'http://localhost:3031',
  defaultRoom = 'general',
  defaultUsername = 'guest'
}: FloatingChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [modalSize, setModalSize] = useState({ width: 0, height: 0, left: 0, top: 0 })
  const [isResizing, setIsResizing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [username, setUsername] = useState(defaultUsername)
  
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

  const iframeUrl = `${chatUrl}?modal=true&compact=true&maximized=true&hideHeader=true&room=${defaultRoom}&username=${username}`

  return (
    <>
      {/* Floating Chat Button */}
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
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Chat Support
              </h3>
              
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
            <iframe
              ref={iframeRef}
              src={iframeUrl}
              className="w-full flex-1 border-0"
              title="Chat"
            />
          </div>
        </div>
      )}
    </>
  )
}
