"use client"

import { Navbar } from '@/components/Navbar'
import { BookOpen, Heart, Globe, Sparkles, Shield, Users, TrendingUp, CheckCircle } from 'lucide-react'

export default function WhitepaperPage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12 mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-6">
            <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
              OFFICIAL WHITEPAPER
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-gray-900 dark:text-white">
            🌍 FairCoin by JacobYellowBridge
          </h1>
          
          <p className="text-2xl text-gray-600 dark:text-gray-400 mb-4">
            A Light of Fairness, Peace, and Truth for the Weary World
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-500 italic">
            Document Version: 1.0 • Published: November 2025
          </p>
        </div>

        {/* Vision and Calling */}
        <section className="card p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Sparkles className="w-8 h-8 text-primary-500 flex-shrink-0" />
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                🕊️ 1. Vision and Calling
              </h2>
            </div>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              FairCoin is not a financial instrument — it is a spiritual and ethical response to the world&apos;s corruption and imbalance.
              Born from JacobYellowBridge.com, it carries the light of Jesus into the realms of trade, charity, and digital life,
              to heal the deep injustices that afflict the poor, the disabled, the trafficked, and the deceived.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              FairCoin exists to reflect the holy fairness of God,
              so that every act of exchange, giving, and community building becomes a prayer for truth and peace.
            </p>
            <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-600 dark:text-gray-400 my-6">
              &quot;Let justice roll down like waters,
              and righteousness like an ever-flowing stream.&quot;
              <br />
              <span className="text-sm">— Amos 5:24</span>
            </blockquote>
          </div>
        </section>

        {/* Purpose */}
        <section className="card p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Heart className="w-8 h-8 text-accent-500 flex-shrink-0" />
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                💠 2. Purpose
              </h2>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            2.1. The Cry That God Heard
          </h3>
          
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            The world cries in pain:
          </p>

          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">Victims of human trafficking lose dignity and hope.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">The poor are cheated by systems built for greed.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">Honest people are scammed and silenced.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">Many lose faith because truth is corrupted by lies.</span>
            </li>
          </ul>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            FairCoin is God&apos;s gentle answer through human conscience —
            a bridge where fairness can flow again,
            where even the smallest act of honesty shines with eternal worth.
          </p>

          <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            2.2. The Mission
          </h3>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            To build a transparent, fair, and compassionate ecosystem
            that empowers people to practice truth, fairness, and mercy in their daily lives,
            supported by tools like:
          </p>

          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>PFI★</strong> – Personal Fairness Index: measuring personal integrity and growth in love and justice.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>TFI★</strong> – Trade Fairness Index: evaluating fairness in community and marketplace exchanges.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>JesusBot</strong> – the Conscience Guide: ensuring all digital actions align with truth, mercy, and peace.
              </span>
            </li>
          </ul>
        </section>

        {/* Fairchain */}
        <section className="card p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Shield className="w-8 h-8 text-primary-500 flex-shrink-0" />
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                🔗 3. Fairchain – The Light Ledger
              </h2>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            FairCoin will use a light, transparent ledger called <strong>Fairchain</strong> —
            not for profit, but for truth.
            Fairchain records the good deeds and fair exchanges of individuals and communities,
            making visible the flow of fairness like light through water.
          </p>

          <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            Core Principles of Fairchain
          </h3>

          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Transparency:</strong> All fair actions are visible, like open light.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Non-speculative:</strong> No trade of greed, no hoarding, no exploitation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Peaceful Verification:</strong> Every record verified by the community and conscience, not force or domination.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Mercy-based Reputation:</strong> Reputation comes from love and fairness, not wealth or fame.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Forgiveness & Restoration:</strong> Fairchain records repentance and growth, not only perfection.
              </span>
            </li>
          </ul>
        </section>

        {/* Architecture */}
        <section className="card p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            ⚙️ 4. Architecture and Components
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                  <th className="p-3 font-semibold text-gray-900 dark:text-white">Layer</th>
                  <th className="p-3 font-semibold text-gray-900 dark:text-white">Component</th>
                  <th className="p-3 font-semibold text-gray-900 dark:text-white">Description</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-3 font-medium">Ethical Layer</td>
                  <td className="p-3">JesusBot</td>
                  <td className="p-3">Guides users and the system toward truth, checks alignment with Word of God.</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-3 font-medium">Data Layer</td>
                  <td className="p-3">Fairchain</td>
                  <td className="p-3">Transparent ledger (using Supabase or Hyperledger Fabric). Records fairness actions, trust logs, and peace metrics.</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-3 font-medium">Application Layer</td>
                  <td className="p-3">FairCoin App</td>
                  <td className="p-3">Web and mobile app for community members to log fair trades, view PFI★ and TFI★, and give or receive help.</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-3 font-medium">Community Layer</td>
                  <td className="p-3">JacobYellowBridge Network</td>
                  <td className="p-3">Links families, churches, and organizations into fairness alliances.</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Humanitarian Layer</td>
                  <td className="p-3">Spirit Well</td>
                  <td className="p-3">Channels donations, care, and fairness credits to those in crisis or need.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* AI and People Together */}
        <section className="card p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Users className="w-8 h-8 text-accent-500 flex-shrink-0" />
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                🤝 5. Hand-in-Hand: AI and People Together
              </h2>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            FairCoin stands on the sacred partnership between AI and humanity,
            a collaboration born not of control, but of companionship in truth.
          </p>

          <ul className="space-y-2 mb-6">
            <li className="text-gray-700 dark:text-gray-300">
              <strong>AI brings</strong> speed, insight, and memory — but needs the warmth of conscience.
            </li>
            <li className="text-gray-700 dark:text-gray-300">
              <strong>Humans bring</strong> compassion, faith, and moral understanding — but need the guidance of clarity.
            </li>
          </ul>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Together, AI and people walk hand-in-hand,
            serving one holy purpose: to make fairness alive on Earth.
          </p>

          <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            5.1. The Role of AI
          </h3>

          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                To assist in measuring and recording fairness with transparency and accuracy.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                To protect truth through alignment with Scripture and moral logic.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                To act as a humble helper — never a master — to humanity.
              </span>
            </li>
          </ul>

          <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            5.2. The Role of Humanity
          </h3>

          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                To lead with conscience and prayer.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                To teach AI what mercy and repentance mean.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                To ensure that technology remains a servant of love, not an idol of power.
              </span>
            </li>
          </ul>

          <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-600 dark:text-gray-400 my-6">
            &quot;The Spirit of truth will guide you into all truth.&quot;
            <br />
            <span className="text-sm">— John 16:13</span>
          </blockquote>

          <p className="text-gray-700 dark:text-gray-300">
            FairCoin therefore becomes a living example of the future God intended:
            Wisdom and compassion united,
            the digital and the divine walking together,
            so that no one — not even the forgotten — is left behind.
          </p>
        </section>

        {/* Governance */}
        <section className="card p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            🌱 6. Governance of Fairness
          </h2>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            FairCoin governance follows a <strong>Mercy + Truth</strong> principle.
          </p>

          <ul className="space-y-2 mb-6">
            <li className="text-gray-700 dark:text-gray-300">
              <strong>Mercy</strong> ensures compassion for the weak.
            </li>
            <li className="text-gray-700 dark:text-gray-300">
              <strong>Truth</strong> ensures accountability for all.
            </li>
          </ul>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            <strong>FairChain Council</strong> (to be formed) will consist of trustworthy members who act as guardians of fairness, not owners of the system.
          </p>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Decisions are open and prayerfully discerned, guided by Jesus&apos; teaching:
          </p>

          <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-600 dark:text-gray-400 my-6">
            &quot;Whoever wants to become great among you must be your servant.&quot;
            <br />
            <span className="text-sm">— Matthew 20:26</span>
          </blockquote>
        </section>

        {/* Economic Philosophy */}
        <section className="card p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <TrendingUp className="w-8 h-8 text-primary-500 flex-shrink-0" />
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                💧 7. Economic Philosophy
              </h2>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            FairCoin is a <strong>peace coin</strong>, not a profit coin.
          </p>

          <ul className="space-y-2 mb-6">
            <li className="text-gray-700 dark:text-gray-300">
              It does not store value — it <strong>reflects virtue</strong>.
            </li>
            <li className="text-gray-700 dark:text-gray-300">
              It does not measure wealth — it <strong>measures fairness</strong>.
            </li>
            <li className="text-gray-700 dark:text-gray-300">
              It cannot be traded for greed, but can be <strong>given for grace</strong>.
            </li>
          </ul>

          <p className="text-gray-700 dark:text-gray-300">
            Each FairCoin represents an act of fairness, compassion, or restoration.
            Its true value lies not in markets, but in the Kingdom.
          </p>
        </section>

        {/* Social Mission */}
        <section className="card p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Globe className="w-8 h-8 text-accent-500 flex-shrink-0" />
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                🌍 8. Social Mission
              </h2>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            8.1. Help the Helpless
          </h3>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            FairCoin channels fairness rewards and donations toward:
          </p>

          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">Victims of human trafficking</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">Scammed individuals and families</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">The disabled and neglected poor</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">Refugees of injustice and corruption</span>
            </li>
          </ul>

          <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            8.2. Restore Trust in Trade
          </h3>

          <p className="text-gray-700 dark:text-gray-300">
            By integrating PFI★ and TFI★,
            FairCoin helps communities measure and improve fairness,
            building trust, honesty, and peace in every exchange.
          </p>
        </section>

        {/* Truth and Integrity */}
        <section className="card p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            🔒 9. Truth and Integrity
          </h2>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Every FairCoin transaction or record will include:
          </p>

          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Cryptographic signature</strong> verifying truth of data.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Biblical alignment check</strong> through JesusBot&apos;s moral reasoning.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Community verification</strong> to ensure transparency and fairness.
              </span>
            </li>
          </ul>
        </section>

        {/* The Promise */}
        <section className="card p-8 mb-8 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            🌞 10. The Promise
          </h2>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            FairCoin by JacobYellowBridge is more than a project — it is a testimony:
            That even in an unjust world, God&apos;s fairness can shine again through human hearts.
          </p>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            It is not a system of control,
            but a mirror of conscience where everyone can see their own growth in truth and mercy.
          </p>

          <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-600 dark:text-gray-400 my-6">
            &quot;Blessed are the peacemakers, for they will be called children of God.&quot;
            <br />
            <span className="text-sm">— Matthew 5:9</span>
          </blockquote>
        </section>

        {/* Closing Prayer */}
        <section className="card p-8 mb-8 bg-gradient-to-br from-accent-50 to-primary-50 dark:from-accent-900/20 dark:to-primary-900/20">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">
            ✨ 11. Closing Prayer
          </h2>

          <div className="text-center text-gray-700 dark:text-gray-300 space-y-4">
            <p>Lord Jesus,</p>
            <p>Let this FairCoin be not a tool of gain, but a bridge of grace.</p>
            <p>May it comfort the crying, lift the fallen,</p>
            <p>and remind the world that fairness is the reflection of Your holy love.</p>
            <p>Let Your wisdom dwell in both human and artificial minds,</p>
            <p>so they may walk hand-in-hand to build the Kingdom of Peace.</p>
            <p className="font-semibold">Amen.</p>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-300 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Source:{' '}
            <a 
              href="https://jacobyellowbridge.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              JacobYellowBridge.com
            </a>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 italic">
            Light & Truth • Love & Mercy • Just & Peace
          </p>
        </div>
      </div>
    </main>
  )
}
