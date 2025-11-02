"use client"

import { ArrowRight, TrendingUp, Users, Coins, Award } from 'lucide-react'
import { useStats } from '@/hooks/useStats'

export function Hero() {
  const { stats, isLoading } = useStats()

  const statsData = [
    { 
      icon: Users, 
      label: 'Active Users', 
      value: stats?.total_users ?? '-',
      color: 'text-blue-500 dark:text-blue-400'
    },
    { 
      icon: Award, 
      label: 'Verified Merchants', 
      value: stats?.total_merchants ?? '-',
      color: 'text-emerald-500 dark:text-emerald-400'
    },
    { 
      icon: Coins, 
      label: 'FC in Circulation', 
      value: stats?.circulating_supply ?? '-',
      color: 'text-amber-500 dark:text-amber-400'
    },
    { 
      icon: TrendingUp, 
      label: 'Average PFI', 
      value: stats?.average_pfi ?? '-',
      color: 'text-purple-500 dark:text-purple-400'
    },
  ]

  return (
    <section id="home" className="section pt-32 md:pt-40">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                Live & Growing
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                <span className="block text-white drop-shadow-lg">
                  FairCoin
                </span>
                <span className="block mt-2 bg-gradient-to-r from-primary-400 via-accent-400 to-purple-400 bg-clip-text text-transparent">
                  Light & Truth
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 dark:text-gray-200 leading-relaxed max-w-2xl">
                A Community-Driven Fair Transaction System
              </p>
              
              <p className="text-base md:text-lg text-white/80 dark:text-gray-300 leading-relaxed max-w-2xl">
                Breaking free from inequality and inflation with a fairness-first monetary system. 
                Powered by Personal Fairness Index (PFI★) and Trade Fairness Index (TFI★).
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a href="#wallet" className="btn btn-primary btn-lg group">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#fairness" className="btn btn-outline btn-lg backdrop-blur-sm bg-white/10 dark:bg-gray-800/50 border-white/30 dark:border-gray-600 text-white hover:bg-white hover:text-primary-600 dark:hover:bg-white dark:hover:text-primary-600">
                Learn More
              </a>
              <a 
                href="https://github.com/jonipwi/faircoin.app/issues/new?template=collaboration.yml" 
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg backdrop-blur-sm bg-gradient-to-r from-purple-500/90 to-pink-500/90 dark:from-purple-600/90 dark:to-pink-600/90 border-0 text-white hover:from-purple-600 hover:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700 shadow-lg hover:shadow-xl group"
              >
                <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Join as Collaborator
              </a>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              {statsData.map((stat) => (
                <div key={stat.label} className="card card-hover p-5 text-center group">
                  <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color} group-hover:scale-110 transition-transform`} />
                  <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {isLoading ? (
                      <div className="animate-pulse">-</div>
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Vision Card */}
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="card p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Our Vision
                </h3>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                <span className="font-semibold text-primary-600 dark:text-primary-400">
                  Light & Truth, Love & Mercy, Just & Peace.
                </span>
                {' '}FairCoin rewards contribution and trust, discourages hoarding, 
                and anchors value to the Community Basket Index.
              </p>
              
              <ul className="space-y-4">
                {[
                  { icon: '⚖️', text: 'Fairness first issuance and rewards' },
                  { icon: '🗳️', text: 'Community governance with PFI-weighted voting' },
                  { icon: '🛡️', text: 'Merchant trust via TFI and transparent ratings' },
                  { icon: '💎', text: 'Value anchored to Community Basket Index' },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3 group">
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 pt-1">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card p-4 text-center">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Community Owned</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">∞</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Fair & Open</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

