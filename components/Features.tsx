"use client"

import { Scale, TrendingUp, Users, Shield, Heart, Globe, Award, Zap } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function Features() {
  const { t } = useLanguage()
  
  const features = [
    {
      icon: Scale,
      title: t('features.fairnessFirst'),
      description: t('features.fairnessFirstDesc'),
      color: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    },
    {
      icon: TrendingUp,
      title: t('features.stableValue'),
      description: t('features.stableValueDesc'),
      color: 'from-emerald-500 to-teal-500',
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    },
    {
      icon: Users,
      title: t('features.communityGoverned'),
      description: t('features.communityGovernedDesc'),
      color: 'from-purple-500 to-pink-500',
      iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    },
    {
      icon: Shield,
      title: t('features.antiConcentration'),
      description: t('features.antiConcentrationDesc'),
      color: 'from-amber-500 to-orange-500',
      iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    },
    {
      icon: Heart,
      title: t('features.loveMercy'),
      description: t('features.loveMercyDesc'),
      color: 'from-rose-500 to-red-500',
      iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    },
    {
      icon: Globe,
      title: t('features.globalAccess'),
      description: t('features.globalAccessDesc'),
      color: 'from-indigo-500 to-blue-500',
      iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    },
    {
      icon: Award,
      title: t('features.meritBased'),
      description: t('features.meritBasedDesc'),
      color: 'from-violet-500 to-purple-500',
      iconBg: 'bg-violet-500/10 dark:bg-violet-500/20',
    },
    {
      icon: Zap,
      title: t('features.fastEfficient'),
      description: t('features.fastEfficientDesc'),
      color: 'from-yellow-500 to-amber-500',
      iconBg: 'bg-yellow-500/10 dark:bg-yellow-500/20',
    },
  ]

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, index) => (
        <div
          key={feature.title}
          className="card card-hover p-6 group relative overflow-hidden"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Background Gradient on Hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
          
          {/* Content */}
          <div className="relative z-10 space-y-4">
            {/* Icon */}
            <div className={`w-14 h-14 rounded-xl ${feature.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <feature.icon className={`w-7 h-7 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`} style={{ stroke: 'url(#gradient)' }} />
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className="text-primary-500" style={{ stopColor: 'currentColor' }} />
                    <stop offset="100%" className="text-accent-500" style={{ stopColor: 'currentColor' }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {feature.description}
            </p>
          </div>

          {/* Decorative Element */}
          <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
        </div>
      ))}
    </div>
  )
}

