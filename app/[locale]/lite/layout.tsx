import type { Metadata } from 'next'
import { LiteNavbar } from '@/components/lite/LiteNavbar'

export const metadata: Metadata = {
  title: 'FairCoin Lite — Simple & Friendly',
  description: 'Elder-friendly FairCoin experience with big buttons, chat-first design, and essential features.',
}

export default function LiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <LiteNavbar />
      <main className="pt-20">
        {children}
      </main>
    </div>
  )
}
