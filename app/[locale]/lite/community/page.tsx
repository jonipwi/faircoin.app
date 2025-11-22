"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, Users, Calendar, Trophy, Star, MapPin, UserCheck, MessageCircle } from 'lucide-react'
import { api, type CommunityFeedItem, type CommunityAchievement, type CommunityEvent } from '@/lib/api'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function LiteCommunityPage() {
  const { t } = useLanguage()
  const [feed, setFeed] = useState<CommunityFeedItem[]>([])
  const [achievements, setAchievements] = useState<CommunityAchievement[]>([])
  const [events, setEvents] = useState<CommunityEvent[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'feed' | 'events' | 'achievements'>('feed')

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const [feedData, achievementData, eventData, statsData] = await Promise.all([
          api.community.feed(),
          api.community.achievements(),
          api.community.events(),
          api.community.stats()
        ])
        
        setFeed(feedData.feed)
        setAchievements(achievementData.achievements)
        setEvents(eventData.events)
        setStats(statsData)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch community data:', error)
        console.log('Using fallback mock data')
        
        // Set fallback mock data
        setFeed([
          {
            id: '1',
            type: 'milestone',
            title: 'FairCoin Community Milestone 🎉',
            description: 'Welcome to FairCoin! Our community is growing every day. Join us in building a fairer financial future.',
            user: 'FairCoin Team',
            timestamp: new Date().toISOString(),
            reactions: { '🎉': 5, '❤️': 3 }
          },
          {
            id: '2',
            type: 'governance',
            title: 'New Governance Proposal',
            description: 'Community voting is now live! Help shape the future of FairCoin by participating in our governance system.',
            user: 'Community Manager',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            reactions: { '👍': 8, '🔥': 4 }
          }
        ])
        
        setAchievements([
          {
            id: '1',
            title: 'Early Adopter',
            description: 'Join the FairCoin community in its early days',
            icon: '🌟',
            rarity: 'common',
            holders: 100,
            requirements: {}
          },
          {
            id: '2',
            title: 'Community Builder',
            description: 'Help grow the FairCoin community',
            icon: '🏗️',
            rarity: 'rare',
            holders: 45,
            requirements: {}
          },
          {
            id: '3',
            title: 'Governance Participant',
            description: 'Vote on your first proposal',
            icon: '🗳️',
            rarity: 'epic',
            holders: 23,
            requirements: {}
          }
        ])
        
        setEvents([
          {
            id: '1',
            title: 'Community Launch Event',
            description: 'Join us for the official FairCoin community launch! Meet the team and fellow community members.',
            type: 'meetup',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Online (Discord)',
            organizer: 'FairCoin Team',
            attendees: 12,
            max_capacity: 100,
            tags: ['community', 'launch', 'meetup']
          },
          {
            id: '2',
            title: 'FairCoin Workshop',
            description: 'Learn about Personal Fairness Index (PFI) and how to maximize your community contribution.',
            type: 'workshop',
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Online',
            organizer: 'Education Team',
            attendees: 8,
            max_capacity: 50,
            tags: ['education', 'pfi', 'workshop']
          }
        ])
        
        setStats({
          active_members: 150,
          achievements_earned: 45,
          events_this_month: 2,
          member_satisfaction: 95
        })
        
        setLoading(false)
      }
    }

    fetchCommunityData()
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Trophy className="w-8 h-8 text-amber-500" />
      case 'governance': return <Users className="w-8 h-8 text-blue-500" />
      case 'merchant': return <Star className="w-8 h-8 text-emerald-500" />
      case 'milestone': return <Calendar className="w-8 h-8 text-purple-500" />
      default: return <Heart className="w-8 h-8 text-primary-500" />
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
      case 'rare': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
      case 'epic': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
      case 'legendary': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
    }
  }

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays > 0) return `In ${diffDays} days`
    return date.toLocaleDateString()
  }

  // Format markdown text (simplified version for Lite)
  const formatText = (text: string) => {
    if (!text) return ''
    // Remove markdown formatting for simplicity
    return text
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/<#([^>]+)>/g, '#$1')
      .replace(/[•\-✨]\s+/g, '• ')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-6" />
          <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300">{t('lite.community.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-6">
            <Heart className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <span className="text-2xl font-semibold text-primary-700 dark:text-primary-300">
              {t('lite.community.title')}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {t('lite.community.welcome')}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('lite.community.subtitle')}
          </p>
        </div>

        {/* Community Stats - Large Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-blue-200 dark:border-blue-800 p-8 text-center shadow-xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {typeof stats?.active_members === 'number' ? stats.active_members.toLocaleString() : '0'}
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">{t('lite.community.stats.activeMembers')}</p>
          </div>

          <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-emerald-200 dark:border-emerald-800 p-8 text-center shadow-xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {typeof stats?.achievements_earned === 'number' ? stats.achievements_earned.toLocaleString() : '0'}
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">{t('lite.community.stats.achievements')}</p>
          </div>

          <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-purple-200 dark:border-purple-800 p-8 text-center shadow-xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {typeof stats?.events_this_month === 'number' ? stats.events_this_month.toString() : '0'}
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">{t('lite.community.stats.events')}</p>
          </div>

          <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-amber-200 dark:border-amber-800 p-8 text-center shadow-xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {typeof stats?.member_satisfaction === 'number' ? Math.round(stats.member_satisfaction) : '0'}%
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">{t('lite.community.stats.happyMembers')}</p>
          </div>
        </div>

        {/* Tab Buttons - Large and Simple */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <button
            onClick={() => setActiveTab('feed')}
            className={`py-6 px-8 rounded-2xl text-xl font-bold transition-all border-4 ${
              activeTab === 'feed'
                ? 'bg-primary-500 text-white border-primary-600 shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary-300'
            }`}
          >
            {t('lite.community.tabs.feed')}
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`py-6 px-8 rounded-2xl text-xl font-bold transition-all border-4 ${
              activeTab === 'events'
                ? 'bg-primary-500 text-white border-primary-600 shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary-300'
            }`}
          >
            {t('lite.community.tabs.events')}
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`py-6 px-8 rounded-2xl text-xl font-bold transition-all border-4 ${
              activeTab === 'achievements'
                ? 'bg-primary-500 text-white border-primary-600 shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary-300'
            }`}
          >
            {t('lite.community.tabs.achievements')}
          </button>
        </div>

        {/* Activity Feed */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            {feed.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border-4 border-gray-200 dark:border-gray-700">
                <MessageCircle className="w-20 h-20 mx-auto mb-6 text-gray-400" />
                <p className="text-2xl text-gray-500 dark:text-gray-400">No recent activity</p>
              </div>
            ) : (
              feed.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-3xl border-4 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 p-8 shadow-xl transition-all"
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {getActivityIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        <span className="text-lg text-gray-500">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xl text-gray-700 dark:text-gray-300 mb-4 leading-relaxed whitespace-pre-line">
                        {formatText(item.description)}
                      </p>
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <span className="text-lg text-gray-600 dark:text-gray-400">
                          {t('lite.community.feed.by')} {item.user}
                        </span>
                        <div className="flex items-center gap-3">
                          {Object.entries(item.reactions).map(([emoji, count]) => (
                            <button
                              key={emoji}
                              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border-2 border-gray-300 dark:border-gray-600"
                            >
                              <span className="text-2xl">{emoji}</span>
                              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">{count}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Events */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            {events.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border-4 border-gray-200 dark:border-gray-700">
                <Calendar className="w-20 h-20 mx-auto mb-6 text-gray-400" />
                <p className="text-2xl text-gray-500 dark:text-gray-400">{t('lite.community.events.noEvents')}</p>
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white dark:bg-gray-800 rounded-3xl border-4 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 p-8 shadow-xl transition-all"
                >
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="px-4 py-2 rounded-full text-base font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                          {event.type}
                        </span>
                        <span className="text-xl font-semibold text-primary-600 dark:text-primary-400">
                          📅 {formatEventDate(event.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-lg text-gray-700 dark:text-gray-300">
                      <MapPin className="w-6 h-6 text-gray-500" />
                      <span className="font-medium">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-lg text-gray-700 dark:text-gray-300">
                      <UserCheck className="w-6 h-6 text-gray-500" />
                      <span className="font-medium">
                        {t('lite.community.events.peopleAttending', { current: event.attendees.toString(), max: event.max_capacity.toString() })}
                      </span>
                    </div>
                  </div>

                  <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed whitespace-pre-line">
                    {formatText(event.description)}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button className="w-full py-5 px-8 rounded-2xl text-xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600 transition-all shadow-lg hover:shadow-xl">
                    {t('lite.community.events.joinEvent')}
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Achievements */}
        {activeTab === 'achievements' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border-4 border-gray-200 dark:border-gray-700">
                <Trophy className="w-20 h-20 mx-auto mb-6 text-gray-400" />
                <p className="text-2xl text-gray-500 dark:text-gray-400">{t('lite.community.achievements.noAchievements')}</p>
              </div>
            ) : (
              achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-white dark:bg-gray-800 rounded-3xl border-4 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 p-8 shadow-xl transition-all text-center"
                >
                  <div className="text-6xl mb-4">{achievement.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {achievement.title}
                  </h3>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className={`px-4 py-2 rounded-full text-base font-semibold ${getRarityColor(achievement.rarity)}`}>
                      {t(`lite.community.achievements.rarity.${achievement.rarity.toLowerCase()}`)}
                    </span>
                    <span className="text-base text-gray-600 dark:text-gray-400">
                      {t('lite.community.achievements.holders', { count: achievement.holders.toString() })}
                    </span>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    {achievement.description}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl p-10 text-center text-white shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Join Our Discord Community! 💬
          </h2>
          <p className="text-xl sm:text-2xl mb-8 opacity-95">
            Connect with thousands of FairCoin members around the world
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="https://discord.gg/faircoin"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-5 bg-white text-primary-700 rounded-2xl text-xl font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
            >
              <MessageCircle className="w-7 h-7" />
              Join Discord
            </Link>
            <Link
              href="/lite/chat"
              className="inline-flex items-center gap-3 px-8 py-5 bg-white/20 text-white border-4 border-white rounded-2xl text-xl font-bold hover:bg-white/30 transition-all hover:scale-105"
            >
              Chat Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
