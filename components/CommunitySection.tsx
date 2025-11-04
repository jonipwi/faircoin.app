"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, Users, Calendar, Trophy, Star, MapPin, Clock, UserCheck } from 'lucide-react'
import { api, type CommunityFeedItem, type CommunityAchievement, type CommunityEvent } from '@/lib/api'
import { communityDebug } from '@/lib/community-debug'

export function CommunitySection() {
  const [feed, setFeed] = useState<CommunityFeedItem[]>([])
  const [achievements, setAchievements] = useState<CommunityAchievement[]>([])
  const [events, setEvents] = useState<CommunityEvent[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    communityDebug.logComponentMount('CommunitySection')
    
    const fetchCommunityData = async () => {
      const startTime = Date.now()
      
      try {
        // Feed
        communityDebug.logAPICall('/api/community/feed', 'GET')
        const feedStart = Date.now()
        const feedData = await api.community.feed()
        communityDebug.logAPIResponse('/api/community/feed', feedData, Date.now() - feedStart)
        communityDebug.logFeedData(feedData.feed)
        setFeed(feedData.feed)
        
        // Achievements
        communityDebug.logAPICall('/api/community/achievements', 'GET')
        const achievementsStart = Date.now()
        const achievementData = await api.community.achievements()
        communityDebug.logAPIResponse('/api/community/achievements', achievementData, Date.now() - achievementsStart)
        communityDebug.logAchievementsData(achievementData.achievements)
        setAchievements(achievementData.achievements)
        
        // Events
        communityDebug.logAPICall('/api/community/events', 'GET')
        const eventsStart = Date.now()
        const eventData = await api.community.events()
        communityDebug.logAPIResponse('/api/community/events', eventData, Date.now() - eventsStart)
        communityDebug.logEventsData(eventData.events)
        setEvents(eventData.events)
        
        // Stats
        communityDebug.logAPICall('/api/community/stats', 'GET')
        const statsStart = Date.now()
        const statsData = await api.community.stats()
        communityDebug.logAPIResponse('/api/community/stats', statsData, Date.now() - statsStart)
        communityDebug.logStatsData(statsData)
        setStats(statsData)
        
        // Summary
        communityDebug.logSummary({
          feedCount: feedData.feed.length,
          achievementsCount: achievementData.achievements.length,
          eventsCount: eventData.events.length,
          statsLoaded: !!statsData,
          totalDuration: Date.now() - startTime
        })
      } catch (error) {
        console.error('Failed to fetch community data:', error)
        communityDebug.logAPIError('community data', error, Date.now() - startTime)
      } finally {
        setLoading(false)
      }
    }

    fetchCommunityData()
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Trophy className="w-5 h-5 text-amber-500" />
      case 'governance': return <Users className="w-5 h-5 text-blue-500" />
      case 'merchant': return <Star className="w-5 h-5 text-emerald-500" />
      case 'milestone': return <Calendar className="w-5 h-5 text-purple-500" />
      default: return <Heart className="w-5 h-5 text-primary-500" />
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800'
      case 'rare': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30'
      case 'epic': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30'
      case 'legendary': return 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800'
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meetup': return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
      case 'workshop': return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20'
      case 'governance': return 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20'
      default: return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800/50'
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

  // Convert Discord markdown to formatted JSX
  const formatMarkdownText = (text: string) => {
    if (!text) return null
    
    // Split text into lines for processing
    const lines = text.split('\n')
    const elements: JSX.Element[] = []
    let inList = false
    
    lines.forEach((line, lineIndex) => {
      // Skip empty lines but maintain spacing
      if (!line.trim()) {
        if (inList) {
          inList = false
        }
        elements.push(<div key={`space-${lineIndex}`} className="h-2" />)
        return
      }
      
      // Process the line for inline markdown
      let processedLine: (string | JSX.Element)[] = [line]
      
      // Bold: **text**
      processedLine = processedLine.flatMap((segment, segIndex) => {
        if (typeof segment !== 'string') return segment
        const parts = segment.split(/(\*\*[^*]+\*\*)/g)
        return parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={`bold-${lineIndex}-${segIndex}-${i}`} className="font-semibold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>
          }
          return part
        }).filter(p => p !== '')
      })
      
      // Discord channel references: <#channelname>
      processedLine = processedLine.flatMap((segment, segIndex) => {
        if (typeof segment !== 'string') return segment
        const parts = segment.split(/(<#[^>]+>)/g)
        return parts.map((part, i) => {
          if (part.startsWith('<#') && part.endsWith('>')) {
            const channelName = part.slice(2, -1)
            return <span key={`channel-${lineIndex}-${segIndex}-${i}`} className="text-primary-500 font-medium">#{channelName}</span>
          }
          return part
        }).filter(p => p !== '')
      })
      
      // Check if line is a bullet point
      const isBullet = line.trim().match(/^[•\-✨]\s+/)
      
      if (isBullet) {
        if (!inList) {
          inList = true
        }
        
        elements.push(
          <div key={`li-${lineIndex}`} className="flex gap-2 ml-2">
            <span className="text-primary-500 flex-shrink-0">•</span>
            <span className="flex-1 text-gray-700 dark:text-gray-300">
              {processedLine.map((seg, i) => {
                if (typeof seg === 'string') {
                  return seg.replace(/^[•\-✨]\s*/, '')
                }
                return <span key={i}>{seg}</span>
              })}
            </span>
          </div>
        )
      } else {
        if (inList) {
          inList = false
        }
        
        // Check if it's a date line (starts with 📅 or contains "Date:")
        const isDateLine = line.includes('📅') || (line.includes('Date:') && line.includes('**'))
        const isTimeLine = line.includes('⏰') || line.includes('Time:')
        
        if (isDateLine || isTimeLine) {
          elements.push(
            <div key={`line-${lineIndex}`} className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200">
              {processedLine}
            </div>
          )
        } else {
          elements.push(
            <div key={`line-${lineIndex}`} className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {processedLine}
            </div>
          )
        }
      }
    })
    
    return <div className="space-y-1.5">{elements}</div>
  }

  if (loading) {
    return (
      <section id="community" className="section">
        <div className="container">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading community data...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="community" className="section bg-white/5 dark:bg-gray-900/30 backdrop-blur-sm">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
            <Heart className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-white">Community Hub</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Building{' '}
            <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-purple-400 bg-clip-text text-transparent">
              Together
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Connect, contribute, and celebrate with the FairCoin community. Love & Mercy in action.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Community Feed */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Community Activity</h3>
            <div className="space-y-6">
              {feed.map((item) => (
                <div key={item.id} className="card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {getActivityIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                          {item.title}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm leading-relaxed mb-3">
                        {formatMarkdownText(item.description)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          by {item.user}
                        </span>
                        <div className="flex items-center gap-4">
                          {Object.entries(item.reactions).map(([emoji, count]) => (
                            <button 
                              key={emoji}
                              className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                              <span>{emoji}</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">{count}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Sidebar */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Community Achievements</h3>
            <div className="space-y-4 mb-8 max-h-[600px] overflow-y-auto pr-2">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="card p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">
                        {achievement.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                          {achievement.rarity}
                        </span>
                        <span className="text-xs text-gray-500">
                          {achievement.holders} holders
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Upcoming Events */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Upcoming Events</h3>
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="card p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-primary-500 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                          {event.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatEventDate(event.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <UserCheck className="w-3 h-3" />
                      <span>{event.attendees}/{event.max_capacity} attending</span>
                    </div>
                  </div>

                  <div className="text-xs mb-3">
                    {formatMarkdownText(event.description)}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {event.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button className="w-full btn btn-sm btn-primary">
                    RSVP
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="card p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stats?.active_members?.toLocaleString() || '0'}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Members</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stats?.achievements_earned?.toLocaleString() || '0'}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Achievements Earned</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stats?.events_this_month?.toString() || '0'}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Events This Month</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stats?.member_satisfaction?.toFixed(0) || '0'}%
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Members Online</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="card p-8 bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Join Our Community
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Connect with like-minded individuals who believe in fairness, transparency, and economic justice. 
              Together, we&apos;re building a better financial future.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="https://discord.gg/faircoin" target="_blank" rel="noopener noreferrer">
                <button className="btn btn-primary">
                  Join Community
                </button>
              </Link>
              <button className="btn btn-outline">
                View All Events
              </button>
              <button className="btn btn-outline">
                Earn Achievements
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}