// Debug logger for frontend API calls and Discord data
// Enable/disable with localStorage.setItem('DEBUG_COMMUNITY', 'true')

class CommunityDebugLogger {
  private enabled: boolean

  constructor() {
    this.enabled = typeof window !== 'undefined' && 
                   localStorage.getItem('DEBUG_COMMUNITY') === 'true'
  }

  enable() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('DEBUG_COMMUNITY', 'true')
      this.enabled = true
      // These console logs are intentional - part of the debug tool's output
      console.log('%c✅ Community Debug Logging ENABLED', 'color: #10b981; font-weight: bold; font-size: 14px')
      console.log('%cTo disable: localStorage.removeItem("DEBUG_COMMUNITY")', 'color: #6b7280; font-style: italic')
    }
  }

  disable() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('DEBUG_COMMUNITY')
      this.enabled = false
      // This console log is intentional - part of the debug tool's output
      console.log('%c❌ Community Debug Logging DISABLED', 'color: #ef4444; font-weight: bold')
    }
  }

  logAPICall(endpoint: string, method: string = 'GET') {
    if (!this.enabled) return
    
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 3 })
    console.log(
      `%c[${timestamp}] 🌐 API Call`,
      'color: #3b82f6; font-weight: bold',
      `${method} ${endpoint}`
    )
  }

  logAPIResponse(endpoint: string, data: any, duration: number) {
    if (!this.enabled) return
    
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 3 })
    console.groupCollapsed(
      `%c[${timestamp}] ✅ API Response (${duration}ms)`,
      'color: #10b981; font-weight: bold',
      endpoint
    )
    console.log('Response Data:', data)
    console.log('Data Size:', JSON.stringify(data).length, 'bytes')
    console.groupEnd()
  }

  logAPIError(endpoint: string, error: any, duration: number) {
    if (!this.enabled) return
    
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 3 })
    console.groupCollapsed(
      `%c[${timestamp}] ❌ API Error (${duration}ms)`,
      'color: #ef4444; font-weight: bold',
      endpoint
    )
    console.error('Error:', error)
    console.groupEnd()
  }

  logFeedData(feed: any[]) {
    if (!this.enabled) return
    
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 3 })
    console.groupCollapsed(
      `%c[${timestamp}] 📰 Feed Data (${feed.length} items)`,
      'color: #8b5cf6; font-weight: bold'
    )
    
    feed.forEach((item, index) => {
      const typeColors: Record<string, string> = {
        achievement: '#f59e0b',
        governance: '#3b82f6',
        merchant: '#10b981',
        milestone: '#8b5cf6',
        message: '#6b7280'
      }
      
      const color = typeColors[item.type] || '#6b7280'
      console.log(
        `%c#${index + 1}`,
        `color: ${color}; font-weight: bold`,
        item.type.toUpperCase(),
        '|',
        item.title,
        '|',
        `by ${item.user}`
      )
    })
    
    console.table(feed.map(item => ({
      Type: item.type,
      Title: item.title?.substring(0, 50),
      User: item.user,
      Reactions: Object.keys(item.reactions || {}).length
    })))
    console.groupEnd()
  }

  logAchievementsData(achievements: any[]) {
    if (!this.enabled) return
    
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 3 })
    console.groupCollapsed(
      `%c[${timestamp}] 🏆 Achievements Data (${achievements.length} items)`,
      'color: #f59e0b; font-weight: bold'
    )
    
    achievements.forEach((achievement, index) => {
      const rarityColors: Record<string, string> = {
        common: '#6b7280',
        uncommon: '#10b981',
        rare: '#3b82f6',
        epic: '#8b5cf6',
        legendary: '#f59e0b'
      }
      
      const color = rarityColors[achievement.rarity] || '#6b7280'
      console.log(
        `%c#${index + 1}`,
        `color: ${color}; font-weight: bold`,
        achievement.rarity.toUpperCase(),
        '|',
        achievement.icon,
        achievement.title,
        '|',
        `${achievement.holders} holders`
      )
    })
    
    console.table(achievements.map(a => ({
      Icon: a.icon,
      Title: a.title,
      Rarity: a.rarity,
      Holders: a.holders
    })))
    console.groupEnd()
  }

  logEventsData(events: any[]) {
    if (!this.enabled) return
    
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 3 })
    console.groupCollapsed(
      `%c[${timestamp}] 📅 Events Data (${events.length} items)`,
      'color: #ec4899; font-weight: bold'
    )
    
    events.forEach((event, index) => {
      const typeColors: Record<string, string> = {
        meetup: '#3b82f6',
        workshop: '#10b981',
        governance: '#8b5cf6',
        community: '#6b7280'
      }
      
      const color = typeColors[event.type] || '#6b7280'
      console.log(
        `%c#${index + 1}`,
        `color: ${color}; font-weight: bold`,
        event.type.toUpperCase(),
        '|',
        event.title,
        '|',
        new Date(event.date).toLocaleDateString(),
        '|',
        `${event.attendees}/${event.max_capacity}`
      )
    })
    
    console.table(events.map(e => ({
      Title: e.title?.substring(0, 40),
      Type: e.type,
      Date: new Date(e.date).toLocaleDateString(),
      Attendees: `${e.attendees}/${e.max_capacity}`,
      Tags: e.tags?.join(', ')
    })))
    console.groupEnd()
  }

  logStatsData(stats: any) {
    if (!this.enabled) return
    
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 3 })
    console.groupCollapsed(
      `%c[${timestamp}] 📊 Stats Data`,
      'color: #06b6d4; font-weight: bold'
    )
    
    console.log('%cGuild Info:', 'color: #3b82f6; font-weight: bold')
    console.log('  Guild ID:', stats.guild_id)
    console.log('  Guild Name:', stats.guild_name)
    
    console.log('%cMembership:', 'color: #10b981; font-weight: bold')
    console.log('  Total Members:', stats.member_count)
    console.log('  Online:', stats.online_count)
    
    console.log('%cServer Structure:', 'color: #8b5cf6; font-weight: bold')
    console.log('  Channels:', stats.channel_count)
    console.log('  Roles:', stats.role_count)
    
    console.log('%cLast Updated:', 'color: #6b7280; font-style: italic')
    console.log('  ', new Date(stats.last_updated).toLocaleString())
    
    console.groupEnd()
  }

  logComponentMount(componentName: string) {
    if (!this.enabled) return
    
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 3 })
    console.log(
      `%c[${timestamp}] ⚛️ Component Mounted`,
      'color: #06b6d4; font-weight: bold',
      componentName
    )
  }

  logComponentUpdate(componentName: string, reason: string) {
    if (!this.enabled) return
    
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 3 })
    console.log(
      `%c[${timestamp}] 🔄 Component Updated`,
      'color: #f59e0b; font-weight: bold',
      componentName,
      '-',
      reason
    )
  }

  logDataFetch(type: string, startTime: number) {
    if (!this.enabled) return
    
    const duration = Date.now() - startTime
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 3 })
    console.log(
      `%c[${timestamp}] ⏱️ Data Fetch Complete`,
      'color: #10b981; font-weight: bold',
      type,
      `(${duration}ms)`
    )
  }

  logSummary(data: {
    feedCount: number
    achievementsCount: number
    eventsCount: number
    statsLoaded: boolean
    totalDuration: number
  }) {
    if (!this.enabled) return
    
    console.log('\n' + '='.repeat(60))
    console.log(
      '%c📊 COMMUNITY DATA SUMMARY',
      'color: #8b5cf6; font-weight: bold; font-size: 16px'
    )
    console.log('='.repeat(60))
    
    console.log(`📰 Feed Items:        ${data.feedCount}`)
    console.log(`🏆 Achievements:      ${data.achievementsCount}`)
    console.log(`📅 Events:            ${data.eventsCount}`)
    console.log(`📊 Stats Loaded:      ${data.statsLoaded ? '✅ Yes' : '❌ No'}`)
    console.log(`⏱️ Total Time:        ${data.totalDuration}ms`)
    
    console.log('='.repeat(60) + '\n')
  }
}

// Export singleton instance
export const communityDebug = new CommunityDebugLogger()

// Make it available globally for console access
if (typeof window !== 'undefined') {
  ;(window as any).communityDebug = communityDebug
  
  // Auto-enable if previously enabled
  if (localStorage.getItem('DEBUG_COMMUNITY') === 'true') {
    console.log(
      '%c🐛 Community Debug Mode is ACTIVE',
      'background: #8b5cf6; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold'
    )
    console.log('%cTo disable: communityDebug.disable() or localStorage.removeItem("DEBUG_COMMUNITY")', 'color: #6b7280')
  } else {
    console.log(
      '%c💡 Tip: Enable community debug logging with: communityDebug.enable()',
      'color: #6b7280; font-style: italic'
    )
  }
}
