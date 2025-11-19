"use client"

import { useEffect, useState } from 'react'
import { Scale, TrendingUp, Users, Shield, Award, BarChart3 } from 'lucide-react'
import { api, type FairnessDistribution, type PFILeaderboard, type AntiConcentration } from '@/lib/api'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function FairnessSection() {
  const { t } = useLanguage()
  const [distribution, setDistribution] = useState<FairnessDistribution | null>(null)
  const [leaderboard, setLeaderboard] = useState<PFILeaderboard | null>(null)
  const [antiConcentration, setAntiConcentration] = useState<AntiConcentration | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFairnessData = async () => {
      try {
        const [distData, leaderData, antiData] = await Promise.all([
          api.fairness.distribution(),
          api.fairness.pfiLeaderboard(),
          api.fairness.antiConcentration(),
        ])
        setDistribution(distData)
        setLeaderboard(leaderData)
        setAntiConcentration(antiData)
      } catch (error) {
        console.error('Failed to fetch fairness data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFairnessData()
  }, [])

  if (loading) {
    return (
      <section id="fairness" className="section">
        <div className="container">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">{t('fairness.loading')}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="fairness" className="section bg-white/5 dark:bg-gray-900/30 backdrop-blur-sm">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
            <Scale className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-white">{t('fairness.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            {t('fairness.title')}{' '}
            <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-purple-400 bg-clip-text text-transparent">
              {t('fairness.titleHighlight')}
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            {t('fairness.description')}
          </p>
        </div>

        {/* Distribution Metrics */}
        {distribution && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="card p-6 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('fairness.giniCoefficient')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('fairness.inequalityMeasure')}</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {distribution.distribution.gini_coefficient.toFixed(2)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('fairness.giniExplanation')}
              </p>
            </div>

            <div className="card p-6 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('fairness.averagePFI')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('fairness.communityContribution')}</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                {distribution.distribution.average_pfi.toFixed(1)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('fairness.median')}: {distribution.distribution.median_pfi.toFixed(1)}
              </p>
            </div>

            <div className="card p-6 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('fairness.fairnessScore')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('fairness.overallRating')}</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {antiConcentration?.metrics.fairness_score.toFixed(1)}/10
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('fairness.excellentRating')}
              </p>
            </div>
          </div>
        )}

        {/* PFI Leaderboard */}
        {leaderboard && (
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-6 h-6 text-primary-500" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('fairness.pfiLeaderboard')}</h3>
              </div>
              <div className="space-y-4">
                {leaderboard.leaderboard.slice(0, 5).map((entry) => (
                  <div key={entry.rank} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
                      {entry.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{entry.username}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{entry.contribution_type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600 dark:text-primary-400">{entry.pfi}</p>
                      <p className="text-xs text-gray-500">{t('fairness.pfi')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Anti-Concentration Metrics */}
            {antiConcentration && (
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-6 h-6 text-emerald-500" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('fairness.antiConcentration')}</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('fairness.velocityRequirement')}</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {(antiConcentration.metrics.concentration_prevention.velocity_requirement * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative overflow-hidden">
                      {/* Requirement marker */}
                      <div 
                        className="absolute top-0 h-full w-0.5 bg-red-400 z-10"
                        style={{ 
                          left: `${Math.min((antiConcentration.metrics.concentration_prevention.velocity_requirement * 100), 100)}%` 
                        }}
                      />
                      {/* Progress bar */}
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          antiConcentration.metrics.concentration_prevention.current_average_velocity >= antiConcentration.metrics.concentration_prevention.velocity_requirement
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                            : 'bg-gradient-to-r from-orange-500 to-red-500'
                        }`}
                        style={{ 
                          width: `${Math.min((antiConcentration.metrics.concentration_prevention.current_average_velocity * 100), 100)}%` 
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">
                        {t('fairness.current')}: {(antiConcentration.metrics.concentration_prevention.current_average_velocity * 100).toFixed(1)}%
                      </p>
                      <p className={`text-xs font-medium ${
                        antiConcentration.metrics.concentration_prevention.current_average_velocity >= antiConcentration.metrics.concentration_prevention.velocity_requirement
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-orange-600 dark:text-orange-400'
                      }`}>
                        {antiConcentration.metrics.concentration_prevention.current_average_velocity >= antiConcentration.metrics.concentration_prevention.velocity_requirement
                          ? `✓ ${t('fairness.requirementMet')}`
                          : '⚠ Below Requirement'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {antiConcentration.metrics.concentration_prevention.hoarding_penalties_active}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{t('fairness.hoardingPenalties')}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {antiConcentration.metrics.concentration_prevention.circulation_bonus_recipients}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{t('fairness.circulationBonuses')}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('fairness.maxShare')}</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {(antiConcentration.metrics.wealth_distribution.current_max_share * 100).toFixed(1)}% / {(antiConcentration.metrics.wealth_distribution.max_individual_share * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-gray-500">{t('fairness.wellBelow')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <div className="card p-8 bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('fairness.joinMovement')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              {t('fairness.joinDesc')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#wallet" className="btn btn-primary">
                {t('fairness.startEarning')}
              </a>
              <a href="#governance" className="btn btn-outline">
                {t('fairness.joinGovernance')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}