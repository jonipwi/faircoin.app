import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ExchangeProvider } from '@/contexts/ExchangeContext'
import { AuthProvider } from '@/contexts/AuthContext'
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
  description: 'Community-driven fair transaction system with PFI★ and TFI★ at the core. Breaking free from inequality and inflation with a fairness-first monetary system.',
  keywords: ['FairCoin', 'cryptocurrency', 'fairness', 'community', 'PFI', 'TFI', 'blockchain'],
  authors: [{ name: 'FairCoin Community' }],
  openGraph: {
    title: 'FairCoin — Light & Truth, Love & Mercy, Just & Peace',
    description: 'Community-driven fair transaction system with PFI★ and TFI★',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ExchangeProvider defaultCurrency="USD" defaultDisplayCurrencies={['USD', 'IDR', 'SGD']}>
              {children}
            </ExchangeProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

