"use client"

import { useEffect, useState } from 'react'
import { Vote, Users, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, ThumbsUp, ThumbsDown, Award, Shield, Activity, Scale } from 'lucide-react'
import { api, type GovernanceProposal, type VotingPower, type RecentVote, type FairnessDistribution, type AntiConcentration } from '@/lib/api'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function GovernanceSection() {
  const { t } = useLanguage()
  const [proposals, setProposals] = useState<GovernanceProposal[]>([])
  const [votingPower, setVotingPower] = useState<VotingPower | null>(null)
  const [recentVotes, setRecentVotes] = useState<RecentVote[]>([])
  const [fairness, setFairness] = useState<FairnessDistribution | null>(null)
  const [antiConcentration, setAntiConcentration] = useState<AntiConcentration | null>(null)
  const [loading, setLoading] = useState(true)

  const calculateTimeRemaining = (endDate: string): string => {
    const now = new Date()
    const end = new Date(endDate)
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return 'Ended'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h left`
    return `${hours}h left`
  }

  useEffect(() => {
    const fetchGovernanceData = async () => {
      try {
        const [proposalData, powerData, voteData, fairnessData, antiConcData] = await Promise.all([
          api.governance.proposals(),
          api.governance.votingPower(),
          api.governance.recentVotes(),
          api.fairness.distribution(),
          api.fairness.antiConcentration(),
        ])
        
        // Map proposal_type to category if needed
        const mappedProposals = proposalData.proposals.map((p: any) => {
          console.log('Proposal data:', p) // Debug: check what backend returns
          
          let timeRemaining = p.time_remaining
          
          // Calculate time remaining if not provided by backend
          if (p.status === 'active' && !timeRemaining) {
            if (p.end_date) {
              timeRemaining = calculateTimeRemaining(p.end_date)
              console.log(`Calculated time for proposal ${p.id}:`, timeRemaining, 'from end_date:', p.end_date)
            } else {
              // If no end_date, set a default (e.g., 14 days from now for demo)
              const defaultEndDate = new Date()
              defaultEndDate.setDate(defaultEndDate.getDate() + 14)
              timeRemaining = calculateTimeRemaining(defaultEndDate.toISOString())
              console.log(`No end_date for proposal ${p.id}, using default:`, timeRemaining)
            }
          }
          
          return {
            ...p,
            category: p.category || p.proposal_type || 'general',
            author: p.proposer_username || (p.proposer_id ? `User ${p.proposer_id}` : 'Unknown'),
            quorum_percentage: p.quorum_percentage || 50, // Default 50% quorum
            current_participation: p.current_participation || 0,
            time_remaining: timeRemaining
          }
        })
        
        console.log('Mapped proposals:', mappedProposals) // Debug: check mapped data
        setProposals(mappedProposals)
        setVotingPower(powerData)
        setRecentVotes(voteData.recent_votes)
        setFairness(fairnessData)
        setAntiConcentration(antiConcData)
      } catch (error) {
        console.error('Failed to fetch governance data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGovernanceData()
  }, [])

  const getProposalStatusIcon = (status: string, participation: number, quorum: number) => {
    if (status === 'passed') return <CheckCircle className="w-5 h-5 text-emerald-500" />
    if (status === 'rejected') return <XCircle className="w-5 h-5 text-red-500" />
    if (participation < quorum) return <AlertCircle className="w-5 h-5 text-orange-500" />
    return <Clock className="w-5 h-5 text-blue-500" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'from-green-500 to-emerald-500'
      case 'rejected': return 'from-red-500 to-pink-500'
      case 'active': return 'from-blue-500 to-cyan-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const formatEndDate = (endDate: string) => {
    try {
      const date = new Date(endDate)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return endDate
    }
  }

  if (loading) {
    return (
      <section id="governance" className="section">
        <div className="container">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">{t('governance.loading')}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="governance" className="section">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
            <Vote className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-white">{t('governance.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            {t('governance.title')}{' '}
            <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-purple-400 bg-clip-text text-transparent">
              {t('governance.titleHighlight')}
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            {t('governance.description')}
          </p>
        </div>

        {/* Voting Power Overview */}
        {votingPower?.voting_power && (
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="card p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {votingPower.voting_power.total_voting_power?.toFixed(1) || '0.0'}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('governance.totalVotingPower')}</p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {votingPower.voting_power.active_voters || 0}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('governance.activeVoters')}</p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {((votingPower.voting_power.governance_participation || 0) * 100).toFixed(0)}%
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('governance.participationRate')}</p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {t('governance.pfiWeighted')}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('governance.fairRepresentation')}</p>
            </div>
          </div>
        )}

        {/* Fairness Metrics */}
        {(fairness || antiConcentration) && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('governance.fairnessMetrics')}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Gini Coefficient */}
              {fairness?.distribution && typeof fairness.distribution.gini_coefficient === 'number' && (
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${fairness.distribution.gini_coefficient < 0.3 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : fairness.distribution.gini_coefficient < 0.5 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {fairness.distribution.gini_coefficient < 0.3 ? t('governance.excellent') : fairness.distribution.gini_coefficient < 0.5 ? t('governance.good') : t('governance.fair')}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('governance.giniCoefficient')}</h4>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {fairness.distribution.gini_coefficient.toFixed(2)}
                  </div>
                  <p className="text-xs text-gray-500">{t('governance.giniDescription')}</p>
                </div>
              )}

              {/* Average PFI */}
              {fairness?.distribution && typeof fairness.distribution.average_pfi === 'number' && (
                <div className="card p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('governance.averagePFI')}</h4>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {fairness.distribution.average_pfi.toFixed(1)}
                  </div>
                  <p className="text-xs text-gray-500">{t('governance.median')}: {typeof fairness.distribution.median_pfi === 'number' ? fairness.distribution.median_pfi.toFixed(1) : 'N/A'}</p>
                </div>
              )}

              {/* Fairness Score */}
              {antiConcentration?.metrics && (
                <div className="card p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('governance.fairnessScore')}</h4>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {(() => {
                      const fairnessScore = antiConcentration.metrics.fairness_score
                      if (typeof fairnessScore === 'number') {
                        return fairnessScore.toFixed(1)
                      } else if (fairnessScore && typeof fairnessScore === 'object' && 'pfi_average' in fairnessScore) {
                        const scoreObj = fairnessScore as { pfi_average?: number; participants?: number }
                        return typeof scoreObj.pfi_average === 'number' ? scoreObj.pfi_average.toFixed(1) : 'N/A'
                      }
                      return 'N/A'
                    })()}/10
                  </div>
                  <p className="text-xs text-gray-500">
                    {(() => {
                      const fairnessScore = antiConcentration.metrics.fairness_score
                      let scoreValue = 0
                      if (typeof fairnessScore === 'number') {
                        scoreValue = fairnessScore
                      } else if (fairnessScore && typeof fairnessScore === 'object' && 'pfi_average' in fairnessScore) {
                        const scoreObj = fairnessScore as { pfi_average?: number; participants?: number }
                        if (typeof scoreObj.pfi_average === 'number') {
                          scoreValue = scoreObj.pfi_average
                        }
                      }
                      return scoreValue >= 8 ? t('governance.excellent') : scoreValue >= 6 ? t('governance.good') : t('governance.fair')
                    })()} {t('governance.fairnessRating')}
                  </p>
                </div>
              )}

              {/* Anti-Concentration */}
              {antiConcentration?.metrics?.concentration_prevention && typeof antiConcentration.metrics.concentration_prevention.velocity_requirement === 'number' && (
                <div className="card p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('governance.velocityRequirement')}</h4>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {(antiConcentration.metrics.concentration_prevention.velocity_requirement * 100).toFixed(0)}%
                  </div>
                  <p className="text-xs text-gray-500">
                    {t('governance.current')}: {typeof antiConcentration.metrics.concentration_prevention.current_average_velocity === 'number' 
                      ? (antiConcentration.metrics.concentration_prevention.current_average_velocity * 100).toFixed(1) 
                      : 'N/A'}%
                  </p>
                </div>
              )}
            </div>

            {/* Detailed Anti-Concentration Metrics */}
            {antiConcentration?.metrics?.concentration_prevention && antiConcentration?.metrics?.wealth_distribution && (
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('governance.hoardingPenalties')}</h4>
                    {(antiConcentration.metrics.concentration_prevention.hoarding_penalties_active || 0) > 0 ? (
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {antiConcentration.metrics.concentration_prevention.hoarding_penalties_active || 0}
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('governance.circulationBonuses')}</h4>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {antiConcentration.metrics.concentration_prevention.circulation_bonus_recipients || 0}
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('governance.maxIndividualShare')}</h4>
                    {typeof antiConcentration.metrics.wealth_distribution.current_max_share === 'number' && 
                     typeof antiConcentration.metrics.wealth_distribution.max_individual_share === 'number' &&
                     antiConcentration.metrics.wealth_distribution.current_max_share < antiConcentration.metrics.wealth_distribution.max_individual_share ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                    )}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof antiConcentration.metrics.wealth_distribution.current_max_share === 'number'
                      ? `${(antiConcentration.metrics.wealth_distribution.current_max_share * 100).toFixed(1)}%`
                      : 'N/A'}
                  </div>
                  <p className="text-xs text-gray-500">
                    {t('governance.limit')}: {typeof antiConcentration.metrics.wealth_distribution.max_individual_share === 'number'
                      ? `${(antiConcentration.metrics.wealth_distribution.max_individual_share * 100).toFixed(0)}%`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active Proposals */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('governance.activeProposals')}</h3>
            <div className="space-y-6">
              {proposals.length === 0 ? (
                <div className="card p-6 text-center">
                  <Scale className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('governance.noProposals')}
                  </p>
                </div>
              ) : proposals.map((proposal) => {
                const totalVotes = proposal.votes_for + proposal.votes_against
                const forPercentage = totalVotes > 0 ? (proposal.votes_for / totalVotes * 100) : 0
                const againstPercentage = totalVotes > 0 ? (proposal.votes_against / totalVotes * 100) : 0
                
                return (
                  <div key={proposal.id} className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-shadow">
                    {/* Status Badge with Time */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${getStatusColor(proposal.status)} text-white`}>
                        {getProposalStatusIcon(proposal.status, 0, 0)}
                        <span className="font-semibold uppercase text-xs">
                          {proposal.status}
                        </span>
                      </div>
                      {proposal.status === 'active' && proposal.time_remaining && (
                        <span className="text-sm text-amber-600 dark:text-amber-400 font-semibold">
                          ⏰ {proposal.time_remaining}
                        </span>
                      )}
                    </div>

                    {/* Title & Category */}
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {proposal.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      📁 {proposal.category || 'general'}
                    </p>

                    {/* Description */}
                    <p className="text-base text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      {proposal.description}
                    </p>

                    {/* Voting Stats */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {totalVotes} {t('governance.totalVotes')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {t('governance.quorum')}: {proposal.quorum_required || 100} {t('governance.votes')}
                          </span>
                          {totalVotes >= (proposal.quorum_required || 100) ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                          )}
                        </div>
                      </div>

                      {/* Vote Progress Bar */}
                      <div className="space-y-2">
                        {/* Combined bar */}
                        <div className="flex h-6 rounded-full overflow-hidden shadow-sm">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center transition-all"
                            style={{ width: `${forPercentage}%` }}
                          >
                            {forPercentage > 25 && (
                              <span className="text-white font-medium text-xs">
                                {forPercentage.toFixed(1)}%
                              </span>
                            )}
                          </div>
                          <div
                            className="bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center transition-all"
                            style={{ width: `${againstPercentage}%` }}
                          >
                            {againstPercentage > 25 && (
                              <span className="text-white font-medium text-xs">
                                {againstPercentage.toFixed(1)}%
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Vote counts */}
                        <div className="flex justify-between text-sm">
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            👍 For: {proposal.votes_for}
                            <span className="ml-1.5 text-emerald-500 dark:text-emerald-300 font-semibold">
                              {forPercentage.toFixed(1)}%
                            </span>
                          </span>
                          <span className="text-rose-600 dark:text-rose-400 font-medium">
                            👎 Against: {proposal.votes_against}
                            <span className="ml-1.5 text-rose-500 dark:text-rose-300 font-semibold">
                              {againstPercentage.toFixed(1)}%
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Voting Buttons */}
                    {proposal.status === 'active' && (
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <button className="py-3 px-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-base font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg flex items-center justify-center gap-2">
                          <ThumbsUp className="w-5 h-5" />
                          {t('governance.voteFor')}
                        </button>
                        <button className="py-3 px-4 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white text-base font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg flex items-center justify-center gap-2">
                          <ThumbsDown className="w-5 h-5" />
                          {t('governance.voteAgainst')}
                        </button>
                      </div>
                    )}
                    
                    {/* Proposed by */}
                    <div className="mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('governance.proposedBy')}: <span className="font-semibold">{proposal.author || 'Unknown'}</span>
                      </p>
                    </div>
                  </div>
                )
              })}\n            </div>
          </div>

          {/* Recent Votes Sidebar */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('governance.recentVotes')}</h3>
            <div className="space-y-4">
              {recentVotes.length > 0 ? (
                recentVotes.map((vote, index) => {
                  // Find the proposal this vote is for
                  const proposal = proposals.find(p => p.id === vote.proposal_id)
                  
                  return (
                    <div key={index} className="card p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-2 h-2 rounded-full ${vote.vote === 'for' ? 'bg-emerald-500' : vote.vote === 'against' ? 'bg-red-500' : 'bg-gray-500'}`} />
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {vote.voter || 'Anonymous'}
                        </span>
                        {vote.voting_power > 0 && (
                          <span className="text-xs text-gray-500 ml-auto">
                            {(vote.voting_power || 0).toFixed(1)} PFI
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span className={vote.vote === 'for' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-red-600 dark:text-red-400 font-semibold'}>
                          {vote.vote === 'for' ? `👍 ${t('governance.votedFor')}` : `👎 ${t('governance.votedAgainst')}`}
                        </span>
                      </p>
                      {proposal && (
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-2 mb-1">
                          {proposal.title}
                        </p>
                      )}
                      {vote.reason && (
                        <p className="text-xs text-gray-500 italic line-clamp-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          &ldquo;{vote.reason}&rdquo;
                        </p>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="card p-6 text-center">
                  <Vote className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('governance.noVotes')}
                  </p>
                </div>
              )}
            </div>

            {/* Voting Power Distribution */}
            {votingPower?.voting_power?.distribution && typeof votingPower.voting_power.distribution === 'object' && Object.keys(votingPower.voting_power.distribution).length > 0 && (
              <div className="card p-4 mt-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">{t('governance.powerDistribution')}</h4>
                <div className="space-y-3">
                  {Object.entries(votingPower.voting_power.distribution)
                    .map(([range, data]: [string, any]) => {
                      // Extract values safely - handle both object and primitive data
                      let userCount: number | null = null
                      let powerValue: number | null = null
                      
                      if (typeof data === 'object' && data !== null) {
                        // Try to extract user count from various possible properties
                        if (typeof data.count === 'number') userCount = data.count
                        else if (typeof data.participants === 'number') userCount = data.participants
                        else if (typeof data.users === 'number') userCount = data.users
                        
                        // Try to extract power value from various possible properties
                        if (typeof data.total_power === 'number') powerValue = data.total_power
                        else if (typeof data.pfi_average === 'number') powerValue = data.pfi_average
                        else if (typeof data.average_power === 'number') powerValue = data.average_power
                        else if (typeof data.power === 'number') powerValue = data.power
                      } else if (typeof data === 'number') {
                        // If data is a primitive number, treat it as user count
                        userCount = data
                      }
                      
                      // Skip if we couldn't extract any meaningful data
                      if (userCount === null && powerValue === null) {
                        return null
                      }
                      
                      // Convert values to strings immediately to avoid object rendering
                      const userCountStr = userCount !== null ? `${userCount} users` : 'N/A'
                      const powerValueStr = powerValue !== null ? `${powerValue.toFixed(1)} power` : null
                      
                      return (
                        <div key={range} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {String(range).replace(/_/g, ' ').replace(/to/g, '-')}
                          </span>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {userCountStr}
                            </div>
                            {powerValueStr && (
                              <div className="text-xs text-gray-500">
                                {powerValueStr}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })
                    .filter((item) => item !== null)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="card p-8 bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('governance.yourVoice')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              {t('governance.yourVoiceDesc')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="btn btn-primary">
                {t('governance.viewAllProposals')}
              </button>
              <button className="btn btn-outline">
                {t('governance.createProposal')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
