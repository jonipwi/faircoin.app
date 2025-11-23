import { generateSignedHeaders } from './request-signing'

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || (process.env.NEXT_PUBLIC_API_URL || 'https://faircoin-api.bixio.xyz/sandbox') + '/api/v1'

export type ApiResult<T> = { data: T; error?: string }

// Type definitions
export interface User {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  pfi: number
  tfi: number
  is_merchant: boolean
  is_verified: boolean
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  to_user_id?: string
  type: string
  amount: number
  fee: number
  description: string
  status: string
  created_at: string
}

export interface Merchant extends User {
  merchant_id?: number
  business_name?: string
  business_type?: string
  category?: string
  description?: string
  website_url?: string
  business_address?: string
  business_phone?: string
  business_email?: string
  verification_status?: 'pending' | 'verified' | 'rejected'
  average_rating?: number
  total_ratings?: number
  total_sales?: number
  updated_at?: string
}

export interface MerchantApplication {
  business_name: string
  business_type: string
  category: string
  description: string
  website_url?: string
  business_address: string
  business_phone: string
  business_email: string
}

export interface MerchantCategory {
  id: number
  icon: string
  display_name: string
  folder: string
  examples: string
  avg_cbi: number
  merchant_count: string
  cbi_range: string
  rating: string
  is_active: number
  created_at: string
  updated_at: string
}

export interface Stats {
  total_users: number
  total_merchants: number
  total_transactions: number
  circulating_supply: number
  average_pfi: number
}

export interface CBI {
  cbi: {
    value: number
    food_index: number
    labor_index: number
    energy_index: number
    housing_index: number
  }
}

// Fairness Types
export interface FairnessDistribution {
  distribution: {
    gini_coefficient: number
    median_pfi: number
    average_pfi: number
    top_10_percent_share: number
    bottom_50_percent_share: number
    concentration_index: number
    last_updated: string
  }
}

export interface PFILeaderboard {
  leaderboard: Array<{
    rank: number
    username: string
    pfi: number
    contribution_type: string
  }>
}

export interface AntiConcentration {
  metrics: {
    concentration_prevention: {
      velocity_requirement: number
      current_average_velocity: number
      hoarding_penalties_active: number
      circulation_bonus_recipients: number
    }
    wealth_distribution: {
      max_individual_share: number
      current_max_share: number
      redistribution_events_this_month: number
      community_fund_percentage: number
    }
    fairness_score: number
    last_updated: string
  }
}

// Governance Types
export interface GovernanceProposal {
  id: string
  title: string
  description: string
  author: string // Changed from 'proposer' to match backend
  status: 'active' | 'passed' | 'rejected' | 'pending'
  votes_for: number
  votes_against: number
  end_date: string
  category: 'economic' | 'governance' | 'community'
  quorum_percentage: number // Changed from 'required_quorum'
  quorum_required: number // Added: minimum votes needed
  current_participation: number
  time_remaining?: string // Added: "5d 3h" format for active proposals
}

export interface VotingPower {
  voting_power: {
    total_voting_power: number
    active_voters: number
    pfi_weighted_system: boolean
    distribution: Record<string, { count: number; total_power: number }>
    governance_participation: number
    last_updated: string
  }
}

export interface RecentVote {
  proposal_id: string
  voter: string
  vote: 'for' | 'against' | 'abstain'
  voting_power: number
  timestamp: string
  reason?: string
}

// Community Types
export interface CommunityFeedItem {
  id: string
  type: 'achievement' | 'governance' | 'merchant' | 'milestone'
  title: string
  description: string
  user: string
  timestamp: string
  reactions: Record<string, number>
}

export interface CommunityAchievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  holders: number
  requirements: Record<string, any>
}

export interface CommunityEvent {
  id: string
  title: string
  description: string
  type: 'meetup' | 'workshop' | 'governance'
  date: string
  location: string
  organizer: string
  attendees: number
  max_capacity: number
  tags: string[]
}

// Authentication Types
export interface AuthSession {
  id: string
  user_id: number
  username: string
  email: string
  avatar_url: string
  full_name?: string
  wallet_address?: string
  created_at: string
  expires_at: string
}

export interface LoginResponse {
  success: boolean
  message: string
  session?: AuthSession
  redirect_url?: string
}

export interface AuthInitResponse {
  success: boolean
  auth_url: string
  state: string
  redirect_uri: string
}

export interface AuthStatusResponse {
  authenticated: boolean
  session?: AuthSession
}

export interface TermsSection {
  title: string
  content: string
}

export interface TermsResponse {
  terms: {
    version: string
    last_updated: string
    sections: TermsSection[]
  }
}

export interface AcceptTermsRequest {
  user_id: number
  version: string
  session_id?: string // legacy field
  session_token?: string // preferred
}

export interface AcceptTermsResponse {
  success: boolean
  message: string
  session_token?: string // unified naming
  session_id?: string // backward compatibility
  user?: {
    id: number
    username?: string
    full_name?: string
    email?: string
    terms_accepted: boolean
    terms_version: string
    terms_accepted_at: string
  }
  acceptance?: {
    user_id: number
    version: string
    accepted_at: string
    ip_address: string
    user_agent: string
  }
}

// User Profile & Dashboard Types
export interface UserProfile {
  id: number
  user_id: number
  provider: string
  provider_id: string
  display_name: string
  first_name: string
  last_name: string
  avatar_url: string
  bio: string
  location: string
  website_url: string
  company: string
  blog_url: string
  twitter_username: string
  public_repos: number
  followers: number
  following: number
  raw_profile_data: Record<string, any>
  created_at: string
  updated_at: string
}

export interface UserSettings {
  id: number
  user_id: number
  setting_key: string
  setting_value: Record<string, any>
  created_at: string
  updated_at: string
}

export interface UserDashboard {
  user: Record<string, any>
  profile: UserProfile
  wallet: Record<string, any>
  settings: UserSettings[]
  stats: Record<string, any>
  recent_transactions: any[]
  achievements: any[]
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  // Get auth token from localStorage if available
  const authToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  
  // Get API key from environment
  const apiKey = process.env.NEXT_PUBLIC_API_KEY
  
  const headers = new Headers({
    'Content-Type': 'application/json',
  })
  
  // Add API key if available
  if (apiKey) {
    headers.set('X-API-Key', apiKey)
  }
  
  // Add request signing headers
  // IMPORTANT: Sign the FULL path including /api/v1 prefix to match backend validation
  const method = init?.method || 'GET'
  const fullPath = `/api/v1${path}` // Backend validates against full URL path
  const signingHeaders = await generateSignedHeaders(method, fullPath)
  if (signingHeaders['X-Request-Signature']) {
    headers.set('X-Request-Signature', signingHeaders['X-Request-Signature'])
    headers.set('X-Request-Timestamp', signingHeaders['X-Request-Timestamp'])
  }
  
  // Add any additional headers from init
  if (init?.headers) {
    if (init.headers instanceof Headers) {
      init.headers.forEach((value, key) => {
        headers.set(key, value)
      })
    } else if (typeof init.headers === 'object') {
      Object.entries(init.headers).forEach(([key, value]) => {
        headers.set(key, value as string)
      })
    }
  }
  
  // Add Authorization header if token exists
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`)
  }
  
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  })
  if (!res.ok) {
    let msg = 'Request failed'
    try { const j = await res.json(); msg = j.error || msg } catch {}
    throw new Error(msg)
  }
  return res.json()
}

export const api = {
  // Core APIs
  stats: () => request<Stats>(`/public/stats`),
  cbi: () => request<CBI>(`/public/cbi`),
  merchants: () => request<{ merchants: Merchant[] }>(`/public/merchants`),
  transactions: (limit = 10) => request<{ transactions: Transaction[] }>(`/public/transactions?limit=${limit}`),
  users: () => request<{ users: User[] }>(`/public/users`),
  
  // Fairness APIs
  fairness: {
    distribution: () => request<FairnessDistribution>(`/public/fairness/distribution`),
    pfiLeaderboard: () => request<PFILeaderboard>(`/public/fairness/pfi-leaderboard`),
    antiConcentration: () => request<AntiConcentration>(`/public/fairness/anti-concentration`),
    indexes: (username: string) => request<{ success: boolean; index?: any; error?: string }>(`/fairness/indexes?user=${encodeURIComponent(username)}`),
  },
  
  // Governance APIs
  governance: {
    proposals: () => request<{ proposals: GovernanceProposal[] }>(`/public/governance/proposals`),
    votingPower: () => request<VotingPower>(`/public/governance/voting-power`),
    recentVotes: () => request<{ recent_votes: RecentVote[] }>(`/public/governance/recent-votes`),
    vote: (proposalId: number, username: string, support: boolean) => request<{ success: boolean; message?: string; error?: string }>(`/governance/vote`, {
      method: 'POST',
      body: JSON.stringify({ proposalId, username, support })
    }),
    createProposal: (title: string, description: string, proposal_type: string) => request<{ success: boolean; proposal_id?: number; message?: string; error?: string }>(`/governance/proposals`, {
      method: 'POST',
      body: JSON.stringify({ title, description, proposal_type })
    }),
  },
  
  // Community APIs
  community: {
    feed: () => request<{ feed: CommunityFeedItem[] }>(`/public/community/feed`),
    achievements: () => request<{ achievements: CommunityAchievement[] }>(`/public/community/achievements`),
    events: () => request<{ events: CommunityEvent[] }>(`/public/community/events`),
    stats: () => request<{
      active_members: number
      achievements_earned: number
      events_this_month: number
      member_satisfaction: number
      online_count: number
      channel_count: number
      role_count: number
      guild_name: string
      last_updated: string
    }>(`/public/community/stats`),
  },
  
  // Authentication APIs
  auth: {
    init: () => request<AuthInitResponse>(`/auth/init`),
    callback: (code: string, state: string) => 
      request<LoginResponse>(`/auth/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`),
    status: (token?: string) => request<AuthStatusResponse>(`/auth/status`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    }),
    logout: (token?: string) => request<{ success: boolean; message: string }>(`/auth/logout`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    }),
    terms: () => request<TermsResponse>(`/auth/terms`),
    acceptTerms: (data: AcceptTermsRequest) => request<AcceptTermsResponse>(`/auth/accept-terms`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    // Wallet-based authentication
    wallet: {
      register: (fullName: string) => fetch('/api/auth/wallet/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName })
      }).then(res => res.json()),
      login: (mnemonic: string) => fetch('/api/auth/wallet/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mnemonic })
      }).then(res => res.json()),
    },
  },
  
  // User Profile & Dashboard APIs
  user: {
    dashboard: (token?: string) => request<UserDashboard>(`/user/dashboard`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    }),
    profile: (userId?: string, token?: string) => {
      const url = userId ? `/user/profile?user_id=${userId}` : `/user/profile`
      return request<{ profile: UserProfile }>(url, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
    },
    settings: (token?: string) => request<{ settings: UserSettings[] }>(`/user/settings`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    }),
    updateSettings: (settingKey: string, settingValue: Record<string, any>, token?: string) => 
      request<{ success: boolean; message: string }>(`/user/settings`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: JSON.stringify({ setting_key: settingKey, setting_value: settingValue })
      }),
  },
  
  // Merchant APIs
  merchant: {
    list: () => request<{ merchants: Merchant[] }>(`/public/merchants`),
    categories: () => request<{ categories: MerchantCategory[] }>(`/public/merchant-categories`),
    getById: (id: number) => request<{ merchant: Merchant }>(`/public/merchants/${id}`),
    apply: (application: MerchantApplication, token?: string) => 
      request<{ success: boolean; message: string; merchant_id?: number }>(`/merchant/apply`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: JSON.stringify(application)
      }),
    update: (merchantId: number, data: Partial<MerchantApplication>, token?: string) =>
      request<{ success: boolean; message: string }>(`/merchant/${merchantId}`, {
        method: 'PUT',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: JSON.stringify(data)
      }),
    myMerchant: (token?: string) => request<{ merchant: Merchant | null }>(`/merchant/me`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    }),
  },
}
