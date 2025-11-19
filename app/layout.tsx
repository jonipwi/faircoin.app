import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ExchangeProvider } from '@/contexts/ExchangeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { AuthenticatedChatWidget } from '@/components/AuthenticatedChatWidget'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'
import { AlertTriangle } from 'lucide-react'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'FairCoin — Light & Truth, Love & Mercy, Just & Peace',
  description: 'Community-driven fair transaction system with PFI★ and TFI★ at the core. Breaking free from inequality and inflation with a fairness-first monetary system. [STAGING ENVIRONMENT - Development & Testing Only]',
  keywords: ['FairCoin', 'ethical project', 'fairness', 'community', 'PFI', 'TFI', 'blockchain', 'staging', 'development'],
  authors: [{ name: 'FairCoin Community' }],
  manifest: '/manifest.json',
  themeColor: '#ffffff',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FairCoin',
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'FairCoin — Light & Truth, Love & Mercy, Just & Peace',
    description: 'Community-driven fair transaction system with PFI★ and TFI★ [STAGING]',
    type: 'website',
  },
  other: {
    'project-repository': 'https://github.com/jonipwi/faircoin.app',
    'security-policy': 'https://github.com/jonipwi/faircoin.app/blob/main/SECURITY.md',
    'staging-environment': 'true',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const devMode = process.env.NEXT_PUBLIC_DEV_MODE
  const devModeMessage = process.env.NEXT_PUBLIC_DEV_MODE_MESSAGE
  
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <AuthProvider>
              <ExchangeProvider defaultCurrency="USD" defaultDisplayCurrencies={['USD', 'IDR', 'SGD']}>
                {/* Staging/Development Environment Warning Banner */}
                {devMode && devMode !== 'production' && (
                <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 shadow-lg border-b-2 border-amber-600">
                  <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-center gap-3 text-white">
                      <AlertTriangle className="w-5 h-5 animate-pulse flex-shrink-0" />
                      <div className="text-center">
                        <p className="font-bold uppercase tracking-wide text-xs sm:text-sm">
                          {devMode.toUpperCase()} ENVIRONMENT - LEGITIMATE DEVELOPMENT SITE
                        </p>
                        <p className="text-xs sm:text-sm font-medium">
                          {devModeMessage?.replace(/"/g, '') || 'This is a development/testing environment'}
                        </p>
                      </div>
                      <AlertTriangle className="w-5 h-5 animate-pulse flex-shrink-0" />
                    </div>
                  </div>
                </div>
              )}
              
                {children}
                
                {/* xdiscord Open Source Chat Widget */}
                <AuthenticatedChatWidget />
              </ExchangeProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

