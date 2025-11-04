"use client"

import { Heart, Shield, Users, Scale, Sparkles, HandHeart } from 'lucide-react'

export function MissionSection() {
  return (
    <section id="mission" className="section bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
              <Heart className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Our Sacred Mission</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
              A Bridge of{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Light, Peace & Truth
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              FairCoin is not a finance project—it is an <strong className="text-purple-600 dark:text-purple-400">ethical and peace-building initiative</strong> born from the mission of JacobYellowBridge to bring light, fair peace, and truth to a world burdened by corruption and inequality.
            </p>
          </div>

          {/* Mission Statement Card */}
          <div className="card p-8 md:p-10 mb-12 bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-800 dark:to-purple-900/20 border-2 border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  The Holy Purpose of Fairness
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  FairCoin was born from <strong className="text-purple-600 dark:text-purple-400">jacobyellowbridge.com</strong> to help those in need, especially people affected by human trafficking, scamming, and other outrageous injustices. We seek to achieve the holy purpose of truth and justice through fairness in trade and personal index improvement.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-center italic text-lg">
                "Because this world has a lot of corruption and non-balance between wealthy and poor, FairCoin exists to mitigate these injustices and help the community and world maintain its good."
              </p>
            </div>
          </div>

          {/* Why We Exist - Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="card p-6 group hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Fighting Corruption & Injustice
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    We stand against the corruption that plagues our world. FairCoin provides a transparent, fair system that cannot be manipulated by those seeking to exploit others.
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6 group hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <HandHeart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Helping Trafficking & Scam Victims
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    FairCoin was specifically created to help those affected by human trafficking and scamming—providing a fair economic foundation for recovery and dignity.
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6 group hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Balancing Wealth & Poverty
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    The non-balance between wealthy and poor is a fundamental injustice. Our fairness metrics (PFI★ and TFI★) create equity and reward contribution over concentration.
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6 group hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Personal Index Improvement
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Through fairness in trade and transparent metrics, every individual can improve their Personal Fairness Index (PFI★) and contribute to a better world.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* JacobYellowBridge Connection */}
          <div className="card p-8 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-2 border-amber-200 dark:border-amber-800">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                JacobYellowBridge: A Light of Truth
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
                <strong className="text-amber-700 dark:text-amber-400">JacobYellowBridge</strong> brings a light of fair peace and truth because the FairCoin project can. This is not about profit—it's about creating an ethical bridge that spans the gap between corruption and justice, between poverty and dignity, between darkness and light.
              </p>
              <div className="pt-4">
                <a 
                  href="https://jacobyellowbridge.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white border-0 shadow-lg hover:shadow-xl transition-all"
                >
                  Learn More at JacobYellowBridge.com
                </a>
              </div>
            </div>
          </div>

          {/* Biblical Foundation */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-purple-200 dark:border-purple-800">
              <p className="text-xl md:text-2xl italic text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                "Speak up for those who cannot speak for themselves,<br />
                for the rights of all who are destitute.<br />
                Speak up and judge fairly;<br />
                defend the rights of the poor and needy."
              </p>
              <p className="text-base font-semibold text-purple-600 dark:text-purple-400">
                — Proverbs 31:8-9
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
