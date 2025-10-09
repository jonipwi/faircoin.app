"use client"

import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Features } from '@/components/Features'
import { WalletSection } from '@/components/WalletSection'
import { MerchantsSection } from '@/components/MerchantsSection'
import { FairnessSection } from '@/components/FairnessSection'
import { GovernanceSection } from '@/components/GovernanceSection'
import { CommunitySection } from '@/components/CommunitySection'
import { Sparkles, Heart, Scale } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const { isAuthenticated } = useAuth()
  
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <Navbar />
      <Hero />

      {/* Why FairCoin Section */}
      <section id="why" className="section bg-white/5 dark:bg-gray-900/30 backdrop-blur-sm">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-white">Why Choose FairCoin</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">
              Built on Principles of{' '}
              <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-purple-400 bg-clip-text text-transparent">
                Truth & Justice
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              More than just a currency—a movement towards a fairer economic system for all.
            </p>
          </div>
          <Features />
        </div>
      </section>

      {/* Mission Section */}
      <section className="section">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Light & Truth</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Transparency in all transactions and governance. Every action is visible, 
                every decision is documented, and every member has access to the truth.
              </p>
            </div>

            <div className="card p-8 text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Love & Mercy</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Compassion for all members of our community. We believe in second chances, 
                support systems, and building each other up rather than tearing down.
              </p>
            </div>

            <div className="card p-8 text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Just & Peace</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Fair distribution of resources and opportunities. We strive for economic peace 
                through equitable systems that reward contribution over concentration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-br from-primary-600 to-accent-600 dark:from-primary-900 dark:to-accent-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">
              Join the Fair Economy Movement
            </h2>
            <p className="text-xl text-white/90">
              Be part of a community that values fairness, transparency, and mutual support. 
              Start your FairCoin journey today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#wallet" className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100 hover:shadow-2xl">
                Create Your Wallet
              </a>
              <a href="#community" className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary-600">
                Explore Community
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Wallet Section */}
      <WalletSection />

      {/* Merchants Section */}
      <MerchantsSection />

      {/* Fairness Section */}
      <FairnessSection />

      {/* Governance Section */}
      <GovernanceSection />

      {/* Community Section */}
      <CommunitySection />

      {/* Footer */}
      <footer className="section bg-gray-900 dark:bg-black text-white">
        <div className="container">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                FairCoin
              </span>
            </div>
            <p className="text-gray-400 text-lg">
              Light & Truth • Love & Mercy • Just & Peace
            </p>
            <div className="pt-6 border-t border-gray-800">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} FairCoin Community. Built with ❤️ for a fairer world.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

