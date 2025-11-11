'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface FairnessIndex {
  user_id: number
  username: string
  pfi_total: number
  tfi_total: number
  cbi_total: number
  total_fairness_score: number
  pfi_count: number
  tfi_count: number
  cbi_count: number
  total_submissions: number
  approved_submissions: number
  pending_submissions: number
}

interface FairnessSubmission {
  id: number
  actor_name: string
  category: 'PFI' | 'TFI' | 'CBI'
  description: string
  score: number
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  approved_at?: string
  validator_name?: string
}

export default function FairnessIndexPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [userIndex, setUserIndex] = useState<FairnessIndex | null>(null)
  const [mySubmissions, setMySubmissions] = useState<FairnessSubmission[]>([])
  
  const [formData, setFormData] = useState({
    category: 'PFI' as 'PFI' | 'TFI' | 'CBI',
    description: '',
    score: 1,
    evidence_url: '',
  })

  const fetchUserIndex = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/fairness/indexes')
      
      if (response.status === 401) {
        router.push('/auth')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch fairness index')
      }

      const data = await response.json()
      
      if (data.success && data.index) {
        setUserIndex(data.index)
      }
    } catch (err) {
      console.error('Error fetching fairness index:', err)
      setError('Failed to load your fairness index')
    } finally {
      setLoading(false)
    }
  }, [router])

  const fetchMySubmissions = useCallback(async () => {
    try {
      const response = await fetch('/api/fairness/submissions')
      
      if (!response.ok) {
        throw new Error('Failed to fetch submissions')
      }

      const data = await response.json()
      
      if (data.success && data.submissions) {
        setMySubmissions(data.submissions)
      }
    } catch (err) {
      console.error('Error fetching submissions:', err)
    }
  }, [])

  // Fetch user's fairness index on mount
  useEffect(() => {
    fetchUserIndex()
    fetchMySubmissions()
  }, [fetchUserIndex, fetchMySubmissions])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/fairness/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit fairness action')
      }

      if (data.success) {
        setSuccess('Fairness action submitted successfully! It is now pending community validation.')
        setFormData({
          category: 'PFI',
          description: '',
          score: 1,
          evidence_url: '',
        })
        // Refresh submissions
        fetchMySubmissions()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit fairness action')
    } finally {
      setSubmitting(false)
    }
  }

  const getCategoryInfo = (category: 'PFI' | 'TFI' | 'CBI') => {
    const info = {
      PFI: {
        emoji: '🧍‍♂️',
        fullName: 'Personal Fairness Index',
        scope: 'Individual',
        description: 'Measures how fair and kind a person acts in daily life.',
        examples: 'Helps a neighbor, speaks truthfully, acts with empathy and respect.',
      },
      TFI: {
        emoji: '💱',
        fullName: 'Trade Fairness Index',
        scope: 'Trade & Exchange',
        description: 'Measures honesty and balance in trade, pricing, and services.',
        examples: 'Sells goods at fair price, transparent refund, truthful marketing.',
      },
      CBI: {
        emoji: '🏙️',
        fullName: 'Community Fairness Index',
        scope: 'Community',
        description: 'Reflects the fairness culture of an organization or local merchant group.',
        examples: 'Treats all customers equally, supports local causes, shares profits ethically.',
      },
    }
    return info[category]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🌍 Faircoin Community Ethics Framework
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            PFI ★ – TFI ★ – CBI ★ : The Indexes of Fairness
          </p>
          <p className="text-sm italic text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
            &ldquo;A community that implements fairness in personal, trade, and merchant life — producing peace through ethical economics.&rdquo;
            <br />— Faircoin Manifesto
          </p>
        </div>

        {/* User's Fairness Index Dashboard */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your fairness index...</p>
          </div>
        ) : userIndex ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Your Fairness Index
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* PFI Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-6">
                <div className="text-4xl mb-2">🧍‍♂️</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">PFI★</h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-300 my-2">
                  {userIndex.pfi_total.toFixed(1)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Personal Fairness Index
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {userIndex.pfi_count} submissions
                </p>
              </div>

              {/* TFI Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-6">
                <div className="text-4xl mb-2">💱</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">TFI★</h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-300 my-2">
                  {userIndex.tfi_total.toFixed(1)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Trade Fairness Index
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {userIndex.tfi_count} submissions
                </p>
              </div>

              {/* CBI Card */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-6">
                <div className="text-4xl mb-2">🏙️</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">CBI★</h3>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-300 my-2">
                  {userIndex.cbi_total.toFixed(1)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Community Fairness Index
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {userIndex.cbi_count} submissions
                </p>
              </div>
            </div>

            {/* Total Score */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Total Fairness Score
              </h3>
              <p className="text-5xl font-bold text-orange-600 dark:text-orange-300">
                ★ {userIndex.total_fairness_score.toFixed(1)}
              </p>
              <div className="flex justify-center gap-8 mt-4 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <p className="font-semibold">{userIndex.approved_submissions}</p>
                  <p>Approved</p>
                </div>
                <div>
                  <p className="font-semibold">{userIndex.pending_submissions}</p>
                  <p>Pending</p>
                </div>
                <div>
                  <p className="font-semibold">{userIndex.total_submissions}</p>
                  <p>Total</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Submit Fairness Action Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Submit a Fairness Action
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fairness Category
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['PFI', 'TFI', 'CBI'] as const).map((cat) => {
                  const info = getCategoryInfo(cat)
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.category === cat
                          ? 'border-green-600 bg-green-50 dark:bg-green-900'
                          : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                      }`}
                    >
                      <div className="text-2xl mb-1">{info.emoji}</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{cat}★</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {info.fullName}
                      </div>
                    </button>
                  )
                })}
              </div>
              
              {/* Category Description */}
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>{getCategoryInfo(formData.category).fullName}:</strong>{' '}
                  {getCategoryInfo(formData.category).description}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  <em>Example:</em> {getCategoryInfo(formData.category).examples}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description of Fairness Action *
              </label>
              <textarea
                id="description"
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Describe the fairness action you performed..."
              />
            </div>

            {/* Score */}
            <div>
              <label htmlFor="score" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estimated Fairness Score (1-10) *
              </label>
              <input
                id="score"
                type="number"
                min="0.1"
                max="10"
                step="0.1"
                required
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Self-assess the impact of your action. Community validators will review and may adjust.
              </p>
            </div>

            {/* Evidence URL */}
            <div>
              <label htmlFor="evidence_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Evidence URL (optional)
              </label>
              <input
                id="evidence_url"
                type="url"
                value={formData.evidence_url}
                onChange={(e) => setFormData({ ...formData, evidence_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com/proof"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Link to photo, document, or social media post that supports your submission.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Fairness Action'}
            </button>
          </form>
        </div>

        {/* My Submissions */}
        {mySubmissions.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              My Submissions
            </h2>
            
            <div className="space-y-4">
              {mySubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getCategoryInfo(submission.category).emoji}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {submission.category}★
                        </span>
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          +{submission.score.toFixed(1)}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            submission.status
                          )}`}
                        >
                          {submission.status}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-2">
                        {submission.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          Submitted: {new Date(submission.created_at).toLocaleDateString()}
                        </span>
                        {submission.approved_at && (
                          <span>
                            Approved: {new Date(submission.approved_at).toLocaleDateString()}
                          </span>
                        )}
                        {submission.validator_name && (
                          <span>Validator: {submission.validator_name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Philosophy Footer */}
        <div className="mt-12 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            🕊️ The Philosophy Behind Faircoin
          </h3>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Faircoin&apos;s indexes are not about competition, but cooperation under conscience.
            <br />
            <em>&ldquo;Blessed are the peacemakers, for they shall be called the children of God.&rdquo; — Matthew 5:9</em>
            <br />
            <br />
            Each fairness act — personal, trade, or communal — becomes a light that strengthens peace in society.
          </p>
        </div>
      </div>
    </div>
  )
}
