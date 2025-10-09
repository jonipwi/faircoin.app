# Create Governance Section Component
$content = @'
"use client"

import { useEffect, useState } from 'react'
import { Vote, Users, Clock, CheckCircle, XCircle, Calendar, User } from 'lucide-react'
import { api, type GovernanceProposal, type VotingPower, type RecentVote } from '@/lib/api'

export function GovernanceSection() {
  const [proposals, setProposals] = useState<GovernanceProposal[]>([])
  const [votingPower, setVotingPower] = useState<VotingPower | null>(null)
  const [recentVotes, setRecentVotes] = useState<RecentVote[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'economic' | 'governance' | 'community'>('all')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'passed' | 'rejected'>('all')

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

  const getProposalEmoji = (category: string) => {
    switch (category) {
      case 'economic': return '💰'
      case 'governance': return '🌍'
      case 'community': return '🎉'
      default: return '📊'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-400">PASSED</span>
          </div>
        )
      case 'rejected':
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-semibold text-red-400">REJECTED</span>
          </div>
        )
      case 'active':
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
            <Clock className="w-4 h-4 text-blue-500 animate-pulse" />
            <span className="text-sm font-semibold text-blue-400">VOTING IN PROGRESS</span>
          </div>
        )
      default:
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-500/20 border border-gray-500/30">
            <span className="text-sm font-semibold text-gray-400">PENDING</span>
          </div>
        )
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'economic': return 'text-purple-400 bg-purple-500/10 border-purple-500/30'
      case 'governance': return 'text-blue-400 bg-blue-500/10 border-blue-500/30'
      case 'community': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  const filteredProposals = proposals.filter(p => {
    const categoryMatch = selectedCategory === 'all' || p.category === selectedCategory
    const statusMatch = selectedStatus === 'all' || p.status === selectedStatus
    return categoryMatch && statusMatch
  })

  const stats = {
    total: proposals.length,
    active: proposals.filter(p => p.status === 'active').length,
    passed: proposals.filter(p => p.status === 'passed').length,
    rejected: proposals.filter(p => p.status === 'rejected').length,
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

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="card p-6 text-center hover:shadow-xl transition-all">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Vote className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.total}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Proposals</p>
          </div>

          <div className="card p-6 text-center hover:shadow-xl transition-all">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.active}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Voting</p>
          </div>

          <div className="card p-6 text-center hover:shadow-xl transition-all">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.passed}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Passed</p>
          </div>

          <div className="card p-6 text-center hover:shadow-xl transition-all">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.rejected}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedStatus === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedStatus('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedStatus === 'active'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Active ({stats.active})
            </button>
            <button
              onClick={() => setSelectedStatus('passed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedStatus === 'passed'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Passed ({stats.passed})
            </button>
            <button
              onClick={() => setSelectedStatus('rejected')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedStatus === 'rejected'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Rejected ({stats.rejected})
            </button>
          </div>

          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All Categories
            </button>
            <button
              onClick={() => setSelectedCategory('economic')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === 'economic'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              💰 Economic
            </button>
            <button
              onClick={() => setSelectedCategory('governance')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === 'governance'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              🌍 Governance
            </button>
            <button
              onClick={() => setSelectedCategory('community')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === 'community'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              🎉 Community
            </button>
          </div>
        </div>

        {/* Proposals Grid */}
        <div className="space-y-6">
          {filteredProposals.map((proposal) => {
            const totalVotes = proposal.votes_for + proposal.votes_against
            const forPercentage = totalVotes > 0 ? (proposal.votes_for / totalVotes * 100) : 0
            const againstPercentage = totalVotes > 0 ? (proposal.votes_against / totalVotes * 100) : 0

            return (
              <div key={proposal.id} className="card p-8 hover:shadow-2xl transition-all border-l-4 border-primary-500">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <span className="text-3xl">{getProposalEmoji(proposal.category)}</span>
                      <span>Proposal #{proposal.id}: {proposal.title}</span>
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {getStatusBadge(proposal.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(proposal.category)}`}>
                      {proposal.category.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Author & Date */}
                <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">
                      <span className="text-gray-500 dark:text-gray-500">Author:</span>{' '}
                      <span className="font-medium text-gray-900 dark:text-white">{proposal.author}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      <span className="text-gray-500 dark:text-gray-500">Voting Period:</span>{' '}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {proposal.status === 'active' ? 'Ends' : 'Ended'} {formatDate(proposal.end_date)}
                      </span>
                    </span>
                  </div>
                  {proposal.time_remaining && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500 animate-pulse" />
                      <span className="text-sm font-medium text-blue-400">
                        {proposal.time_remaining} remaining
                      </span>
                    </div>
                  )}
                </div>

                {/* Proposal Description */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Proposal:</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {proposal.description}
                  </p>
                </div>

                {/* Quorum & Participation */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="card p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Quorum Required</div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {proposal.quorum_percentage}%
                    </div>
                  </div>
                  <div className="card p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Participation</div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {proposal.current_participation.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Voting Results */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-4">
                    {proposal.status === 'active' ? 'Current Votes:' : 'Final Votes:'}
                  </h4>
                  
                  <div className="space-y-4">
                    {/* For Votes */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">For</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {proposal.votes_for.toLocaleString()} ({forPercentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${forPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Against Votes */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-5 h-5 text-red-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Against</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {proposal.votes_against.toLocaleString()} ({againstPercentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-red-400 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${againstPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Total Participation Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-purple-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Participation</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {totalVotes.toLocaleString()} votes
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-purple-400 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((proposal.current_participation / proposal.quorum_percentage) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>0%</span>
                        <span className="font-medium">{proposal.quorum_percentage}% Quorum</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Result Banner */}
                {proposal.status === 'passed' && (
                  <div className="p-4 rounded-lg bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                    <span className="text-lg font-bold text-emerald-400">✅ PASSED</span>
                  </div>
                )}
                {proposal.status === 'rejected' && (
                  <div className="p-4 rounded-lg bg-red-500/20 border-2 border-red-500 flex items-center justify-center gap-3">
                    <XCircle className="w-6 h-6 text-red-500" />
                    <span className="text-lg font-bold text-red-400">❌ REJECTED</span>
                  </div>
                )}

                {/* Action Buttons */}
                {proposal.status === 'active' && (
                  <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button className="btn flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Vote For
                    </button>
                    <button className="btn flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all">
                      <XCircle className="w-5 h-5 mr-2" />
                      Vote Against
                    </button>
                    <button className="btn btn-outline">
                      Learn More
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {filteredProposals.length === 0 && (
          <div className="text-center py-12">
            <Vote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No proposals found matching your filters.</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="card p-8 bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Voice Matters
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Higher PFI gives you more voting power, but every community member's voice is heard. 
              Participate in governance to shape FairCoin's future.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="btn btn-primary">
                <Vote className="w-5 h-5 mr-2" />
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
'@

# Write to file with UTF-8 encoding
$content | Out-File -FilePath "components\GovernanceSection.tsx" -Encoding UTF8
Write-Host "✅ GovernanceSection.tsx created successfully!"
