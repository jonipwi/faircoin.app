"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/lite')
  }, [router])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-accent-500">
      <div className="text-center text-white">
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
          <span className="text-4xl font-bold">FC</span>
        </div>
        <p className="text-xl font-semibold">Loading FairCoin Lite...</p>
      </div>
    </div>
  )
}
