"use client"

import { Heart, Shield, Copy, CheckCircle2, ExternalLink } from 'lucide-react'
import { useState } from 'react'

export function DonationSection() {
  const [copied, setCopied] = useState(false)
  const donationAddress = "0xfad9a53a851635797d597f28b16e7d0295ef2cd6"

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(donationAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <section id="donate" className="section bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-purple-900/20">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
              <Heart className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Support FairCoin</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
              🌍 Support FairCoin by{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                JacobYellowBridge
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              FairCoin is a community fairness and peace-building initiative under the mission of{' '}
              <a 
                href="https://jacobyellowbridge.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 dark:text-purple-400 hover:underline font-semibold inline-flex items-center gap-1"
              >
                JacobYellowBridge.com
                <ExternalLink className="w-3 h-3" />
              </a>
              , working to promote ethical exchange, compassion, and justice.
            </p>
          </div>

          {/* Donation Card */}
          <div className="card p-8 md:p-10 space-y-8">
            {/* Ethereum Address Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                  <span className="text-2xl">💠</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Ethereum Donation Address
                </h3>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between gap-4">
                  <code className="text-sm md:text-base font-mono text-purple-600 dark:text-purple-400 break-all flex-1">
                    {donationAddress}
                  </code>
                  <button
                    onClick={handleCopyAddress}
                    className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white border-0 flex-shrink-0 flex items-center gap-2 transition-all"
                    title="Copy address"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="hidden sm:inline">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Mission Statement */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    🔒 All contributions go toward developing FairCoin's community fairness tools 
                    (TFI★, PFI★, Fairchain) and maintaining JesusBot to spread truth and peace through technology.
                  </p>
                </div>
              </div>
            </div>

            {/* Biblical Quote */}
            <div className="text-center space-y-3 pt-4">
              <div className="inline-block">
                <p className="text-lg md:text-xl italic text-gray-700 dark:text-gray-300 leading-relaxed">
                  "Let justice roll on like a river,{' '}
                  righteousness like a never-failing stream."
                </p>
                <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mt-2">
                  — Amos 5:24
                </p>
              </div>
            </div>

            {/* Gratitude Message */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <span className="font-semibold">Thank you</span> for supporting our mission of fairness, peace, and justice
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
