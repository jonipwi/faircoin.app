"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function MerchantCategoryIndex() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to merchants home when accessing /merchants/category without a slug
    router.replace('/merchants')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
