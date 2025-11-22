"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Vote, ThumbsUp, ThumbsDown, Clock, CheckCircle, XCircle, Users } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Proposal {
  id: number
  title: string
  description: string
  status: 'active' | 'passed' | 'rejected'
  votesFor: number
  votesAgainst: number
  endsAt: Date
  createdBy: string
  category: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8100'

export default function LiteProposals() {
  const { user, isAuthenticated, checkAuth } = useAuth()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [votingOn, setVotingOn] = useState<number | null>(null)

  useEffect(() => {
    checkAuth()
    fetchProposals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchProposals = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/public/governance/proposals`)
      if (response.ok) {
        const data = await response.json()
        if (data.proposals) {
          setProposals(data.proposals.map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            status: p.status,
            votesFor: p.votes_for || 0,
            votesAgainst: p.votes_against || 0,
            endsAt: new Date(p.end_date || p.endsAt),
            createdBy: p.proposer_id ? `User ${p.proposer_id}` : 'Unknown',
            category: p.proposal_type || 'general'
          })))
        }
      }
    } catch (error) {
      console.error('Failed to fetch proposals:', error)
    } finally {
      setLoading(false)
    }
  }

  const castVote = async (proposalId: number, support: boolean) => {
    // Check if user is authenticated
    const authToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    
    if (!authToken || !isAuthenticated || !user) {
      if (confirm('You need to sign in to vote. Go to sign in page?')) {
        window.location.href = '/auth/signin'
      }
      return
    }

    setVotingOn(proposalId)

    try {
      console.log('Casting vote:', { proposalId, support, user: user.username })

      const response = await fetch(`${API_BASE_URL}/api/v1/governance/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          proposalId,
          username: user.username,
          support
        })
      })

      console.log('Vote response:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Vote error response:', errorText)
        
        // Try to parse as JSON for better error message
        try {
          const errorData = JSON.parse(errorText)
          throw new Error(errorData.error || `HTTP ${response.status}`)
        } catch {
          throw new Error(`HTTP ${response.status}: ${errorText}`)
        }
      }

      const data = await response.json()
      console.log('Vote success:', data)
      
      if (data.success) {
        alert(`✅ Vote ${support ? 'FOR' : 'AGAINST'} recorded!`)
        // Refresh proposals after a short delay to ensure DB is updated
        setTimeout(() => fetchProposals(), 500)
      } else {
        alert(data.error || 'Failed to vote')
      }
    } catch (error) {
      console.error('Failed to vote:', error)
      alert(`Failed to vote: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setVotingOn(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'from-blue-500 to-cyan-500'
      case 'passed': return 'from-green-500 to-emerald-500'
      case 'rejected': return 'from-red-500 to-pink-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="w-6 h-6" />
      case 'passed': return <CheckCircle className="w-6 h-6" />
      case 'rejected': return <XCircle className="w-6 h-6" />
      default: return <Vote className="w-6 h-6" />
    }
  }

  const getTimeRemaining = (endsAt: Date) => {
    const now = new Date()
    const diff = endsAt.getTime() - now.getTime()
    
    if (diff <= 0) return 'Ended'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h left`
    return `${hours}h left`
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
            <Vote className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Community Proposals 🗳️
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400">
            Vote on decisions that shape FairCoin
          </p>
        </div>

        {!isAuthenticated && (
          <div className="rounded-3xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-4 border-amber-200 dark:border-amber-700 p-6 sm:p-8 mb-8 text-center">
            <p className="text-xl text-amber-900 dark:text-amber-100 mb-4">
              Sign in to vote on proposals
            </p>
            <Link
              href="/auth"
              className="inline-block py-4 px-8 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-2xl text-lg font-bold hover:from-primary-600 hover:to-accent-600 transition-all shadow-xl"
            >
              Sign In
            </Link>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : proposals.length === 0 ? (
          <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-8 sm:p-12 text-center shadow-xl">
            <Vote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Active Proposals
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Check back soon for new community decisions
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {proposals.map((proposal) => {
              const totalVotes = proposal.votesFor + proposal.votesAgainst
              const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0
              const againstPercentage = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0

              return (
                <div
                  key={proposal.id}
                  className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-xl"
                >
                  {/* Status Badge */}
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getStatusColor(proposal.status)} text-white mb-4`}>
                    {getStatusIcon(proposal.status)}
                    <span className="font-bold uppercase text-sm">
                      {proposal.status}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {proposal.title}
                  </h2>
                  <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
                    📁 {proposal.category}
                  </p>

                  {/* Description */}
                  <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    {proposal.description}
                  </p>

                  {/* Voting Stats */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-500" />
                        <span className="text-lg text-gray-600 dark:text-gray-400">
                          {totalVotes} total votes
                        </span>
                      </div>
                      {proposal.status === 'active' && (
                        <span className="text-lg text-amber-600 dark:text-amber-400 font-semibold">
                          ⏰ {getTimeRemaining(proposal.endsAt)}
                        </span>
                      )}
                    </div>

                    {/* Vote Progress Bars */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-green-600 dark:text-green-400 font-semibold">
                            👍 For: {proposal.votesFor}
                          </span>
                          <span className="text-green-600 dark:text-green-400 font-bold">
                            {forPercentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-6 rounded-full transition-all"
                            style={{ width: `${forPercentage}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-red-600 dark:text-red-400 font-semibold">
                            👎 Against: {proposal.votesAgainst}
                          </span>
                          <span className="text-red-600 dark:text-red-400 font-bold">
                            {againstPercentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                          <div
                            className="bg-gradient-to-r from-red-500 to-pink-500 h-6 rounded-full transition-all"
                            style={{ width: `${againstPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Voting Buttons */}
                  {proposal.status === 'active' && isAuthenticated && (
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => castVote(proposal.id, true)}
                        disabled={votingOn === proposal.id}
                        className="py-5 px-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <ThumbsUp className="w-6 h-6" />
                        Vote FOR
                      </button>
                      <button
                        onClick={() => castVote(proposal.id, false)}
                        disabled={votingOn === proposal.id}
                        className="py-5 px-6 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 text-white text-xl font-bold hover:from-red-600 hover:to-pink-600 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <ThumbsDown className="w-6 h-6" />
                        Vote AGAINST
                      </button>
                    </div>
                  )}

                  {/* Proposal Info */}
                  <div className="mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Proposed by: <span className="font-semibold">{proposal.createdBy}</span>
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => window.location.href = '/lite'}
            className="block w-full py-6 px-8 rounded-2xl bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all shadow-xl text-center"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
