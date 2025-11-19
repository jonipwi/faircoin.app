"use client"

import Link from 'next/link'
import { Heart, Shield, Users, Scale, Sparkles, HandHeart, FileText } from 'lucide-react'
import { JACOB_YELLOW_BRIDGE_URL } from '@/lib/constants'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { useLocalePath } from '@/lib/i18n/useLocalePath'

export function MissionSection() {
  const { t } = useLanguage()
  const localePath = useLocalePath()
  
  return (
    <section id="mission" className="section bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
              <Heart className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('mission.badge')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
              {t('mission.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {t('mission.description')}
            </p>
            
            {/* Whitepaper Button */}
            <div className="pt-4">
              <Link 
                href={localePath('whitepaper') as any}
                className="inline-flex items-center gap-2 btn btn-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all group"
              >
                <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>{t('mission.whitepaperButton')}</span>
              </Link>
            </div>
          </div>

          {/* Mission Statement Card */}
          <div className="card p-8 md:p-10 mb-12 bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-800 dark:to-purple-900/20 border-2 border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('mission.holyPurpose')}
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('mission.holyPurposeDesc')}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-center italic text-lg">
                &ldquo;{t('mission.quote')}&rdquo;
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
                    {t('mission.fightingCorruption')}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('mission.fightingCorruptionDesc')}
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
                    {t('mission.helpingVictims')}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('mission.helpingVictimsDesc')}
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
                    {t('mission.balancingWealth')}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('mission.balancingWealthDesc')}
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
                    {t('mission.personalIndex')}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('mission.personalIndexDesc')}
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
                {t('mission.jacobBridge')}
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
                {t('mission.jacobBridgeDesc')}
              </p>
              <div className="pt-4">
                <a 
                  href={JACOB_YELLOW_BRIDGE_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white border-0 shadow-lg hover:shadow-xl transition-all"
                >
                  {t('mission.learnMore')}
                </a>
              </div>
            </div>
          </div>

          {/* Biblical Foundation */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-purple-200 dark:border-purple-800">
              <p className="text-xl md:text-2xl italic text-gray-700 dark:text-gray-300 leading-relaxed mb-4" style={{ whiteSpace: 'pre-line' }}>
                &ldquo;{t('mission.bibleVerse')}&rdquo;
              </p>
              <p className="text-base font-semibold text-purple-600 dark:text-purple-400">
                — {t('mission.bibleReference')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
