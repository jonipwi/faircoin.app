"use client"

import { useEffect, useState } from 'react'
import { Vote, Users, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react'
import { api, type GovernanceProposal, type VotingPower, type RecentVote } from '@/lib/api'

export function GovernanceSection() {
  const [proposals, setProposals] = useState<GovernanceProposal[]>([])
  const [votingPower, setVotingPower] = useState<VotingPower | null>(null)
  const [recentVotes, setRecentVotes] = useState<RecentVote[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGovernanceData = async () => {
      try {
        const [proposalData, powerData, voteData] = await Promise.all([
          api.governance.proposals(),
          api.governance.votingPower(),
          api.governance.recentVotes(),
        ])
        setProposals(proposalData.proposals)
        setVotingPower(powerData)
        setRecentVotes(voteData.recent_votes)
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
      case 'passed': return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20'
      case 'rejected': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
      case 'active': return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
      default: return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800/50'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'economic': return 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20'
      case 'governance': return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
      case 'community': return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20'
      default: return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800/50'
    }
  }

  const formatTimeRemaining = (timeRemaining?: string) => {
    if (!timeRemaining) return null
    return timeRemaining + ' remaining'
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
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading governance data...</p>
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
            <span className="text-sm font-medium text-white">Community Governance</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Democracy in{' '}
            <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-purple-400 bg-clip-text text-transparent">
              Action
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Every voice matters. Participate in PFI-weighted voting to shape the future of FairCoin.
          </p>
        </div>

        {/* Voting Power Overview */}
        {votingPower && (
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="card p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {votingPower.voting_power.total_voting_power.toFixed(1)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Voting Power</p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {votingPower.voting_power.active_voters}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Voters</p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {(votingPower.voting_power.governance_participation * 100).toFixed(0)}%
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Participation Rate</p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                PFI-Weighted
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Fair Representation</p>
            </div>
          </div>
        )}

        {/* Active Proposals */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Active Proposals</h3>
            <div className="space-y-6">
              {proposals.map((proposal) => {
                const totalVotes = proposal.votes_for + proposal.votes_against
                const forPercentage = totalVotes > 0 ? (proposal.votes_for / totalVotes * 100) : 0
                const againstPercentage = totalVotes > 0 ? (proposal.votes_against / totalVotes * 100) : 0
                
                return (
                  <div key={proposal.id} className="card p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4 mb-4">
                      {getProposalStatusIcon(proposal.status, proposal.current_participation, proposal.quorum_percentage)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                            {proposal.title}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                            {proposal.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(proposal.category)}`}>
                            {proposal.category}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                          {proposal.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>By {proposal.author}</span>
                          {proposal.status === 'active' && proposal.time_remaining && (
                            <span className="text-blue-500 font-medium">{formatTimeRemaining(proposal.time_remaining)}</span>
                          )}
                          {(proposal.status === 'passed' || proposal.status === 'rejected') && (
                            <span className="text-gray-500 dark:text-gray-400">
                              Ended: {formatEndDate(proposal.end_date)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Voting Progress - NEW LAYOUT */}
                    <div className="space-y-3">
                      {/* Top: Total Participation & Quorum */}
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Total Participation: <span className="font-bold text-gray-900 dark:text-white">{totalVotes.toLocaleString()} votes ({proposal.current_participation.toFixed(1)}%)</span>
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          Quorum: <span className="font-bold text-gray-900 dark:text-white">{proposal.quorum_percentage}%</span>
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((proposal.current_participation / proposal.quorum_percentage) * 100, 100)}%` }}
                        />
                      </div>
                      
                      {/* Bottom: For vs Against */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-emerald-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            For: <span className="font-bold text-gray-900 dark:text-white">{proposal.votes_for.toLocaleString()} ({forPercentage.toFixed(1)}%)</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Against: <span className="font-bold text-gray-900 dark:text-white">{proposal.votes_against.toLocaleString()} ({againstPercentage.toFixed(1)}%)</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {proposal.status === 'active' && (
                      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white">
                          Vote For
                        </button>
                        <button className="btn btn-sm bg-red-500 hover:bg-red-600 text-white">
                          Vote Against
                        </button>
                        <button className="btn btn-outline btn-sm">
                          Learn More
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Votes Sidebar */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Votes</h3>
            <div className="space-y-4">
              {recentVotes.map((vote, index) => (
                <div key={index} className="card p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-2 h-2 rounded-full ${vote.vote === 'for' ? 'bg-emerald-500' : vote.vote === 'against' ? 'bg-red-500' : 'bg-gray-500'}`} />
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {vote.voter}
                    </span>
                    <span className="text-xs text-gray-500">
                      {vote.voting_power.toFixed(1)} PFI
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Voted <span className="font-medium">{vote.vote}</span> on {vote.proposal_id}
                  </p>
                  {vote.reason && (
                    <p className="text-xs text-gray-500 italic line-clamp-2">
                      &ldquo;{vote.reason}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Voting Power Distribution */}
            {votingPower && (
              <div className="card p-4 mt-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Power Distribution</h4>
                <div className="space-y-3">
                  {Object.entries(votingPower.voting_power.distribution).map(([range, data]) => (
                    <div key={range} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {range.replace('_', ' ').replace('to', '-')}
                      </span>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {data.count} users
                        </div>
                        <div className="text-xs text-gray-500">
                          {data.total_power.toFixed(1)} power
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="card p-8 bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Voice Matters
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Higher PFI gives you more voting power, but every community member&apos;s voice is heard. 
              Participate in governance to shape FairCoin&apos;s future.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="btn btn-primary">
                View All Proposals
              </button>
              <button className="btn btn-outline">
                Create Proposal
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
