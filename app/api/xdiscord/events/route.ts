import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const data = JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })
      controller.enqueue(`data: ${data}\n\n`)
      
      // Keep-alive ping every 30 seconds
      const interval = setInterval(() => {
        try {
          controller.enqueue(`: ping\n\n`)
        } catch (e) {
          clearInterval(interval)
        }
      }, 30000)
      
      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        try {
          controller.close()
        } catch (e) {
          // Already closed
        }
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
