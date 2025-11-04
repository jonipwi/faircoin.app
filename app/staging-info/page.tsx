"use client"

import { Navbar } from '@/components/Navbar'
import { Shield, CheckCircle, AlertTriangle, ExternalLink, Github } from 'lucide-react'

export default function StagingInfoPage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
            <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
              LEGITIMATE STAGING ENVIRONMENT
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white">
            This is NOT a Phishing Site
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Understanding Google Safe Browsing Warnings
          </p>
        </div>

        {/* Warning Card */}
        <div className="card p-8 mb-8 border-2 border-amber-400 dark:border-amber-600">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                If You See a Google Safe Browsing Warning
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                This staging environment may trigger Google Safe Browsing warnings due to being a new/unverified domain 
                or OAuth callback URLs. This is a <strong>false positive</strong>. This site is:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>A legitimate open-source project hosted on GitHub</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Clearly documented as a staging/development environment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Fully transparent with all code publicly available</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Not collecting real user data or credentials</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Verification Section */}
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Verify Our Legitimacy
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                1. Check GitHub Repository
              </h3>
              <a 
                href="https://github.com/jonipwi/faircoin.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
              >
                <Github className="w-5 h-5" />
                <span>View Source Code</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All code is open-source and publicly auditable
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                2. Read Security Policy
              </h3>
              <a 
                href="https://github.com/jonipwi/faircoin.app/blob/main/SECURITY.md"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
              >
                <Shield className="w-5 h-5" />
                <span>Security Documentation</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Comprehensive security and staging information
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                3. Check security.txt
              </h3>
              <a 
                href="/.well-known/security.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
              >
                <Shield className="w-5 h-5" />
                <span>RFC 9116 Security File</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Standard security contact information
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                4. Review Documentation
              </h3>
              <a 
                href="https://github.com/jonipwi/faircoin.app/blob/main/STAGING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Staging Environment Guide</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Detailed explanation of our staging setup
              </p>
            </div>
          </div>
        </div>

        {/* Why This Warning Appears */}
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Why Google May Flag This Site
          </h2>
          
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold mb-2">1. New/Unverified Domain</h3>
              <p className="text-sm">
                The domain <code className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">bixio.xyz</code> may be 
                relatively new and not yet established in Google&apos;s trust database.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">2. OAuth Callback URLs</h3>
              <p className="text-sm">
                URLs like <code className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">/api/auth/callback/github?code=...&state=...</code> are 
                legitimate OAuth flows but can appear suspicious to automated scanners.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">3. Frequent Changes</h3>
              <p className="text-sm">
                Staging environments update frequently with new code, which can trigger automated security systems.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">4. Subdomain on Shared Hosting</h3>
              <p className="text-sm">
                The reputation of other sites on the same hosting provider or parent domain can affect subdomain ratings.
              </p>
            </div>
          </div>
        </div>

        {/* Help Us */}
        <div className="card p-8 mb-8 bg-primary-50 dark:bg-primary-900/20">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Help Us Fix This False Positive
          </h2>
          
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            You can help by reporting this site as safe to Google Safe Browsing:
          </p>
          
          <ol className="space-y-3 text-gray-700 dark:text-gray-300 mb-6 list-decimal list-inside">
            <li>Visit <a href="https://safebrowsing.google.com/safebrowsing/report_error/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Google Safe Browsing Report Page</a></li>
            <li>Select &ldquo;This page is safe&rdquo;</li>
            <li>Enter the URL: <code className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">https://faircoin.bixio.xyz</code></li>
            <li>Explain that it&rsquo;s a legitimate open-source staging environment</li>
          </ol>
          
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-semibold">
              Example explanation you can use:
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-900 p-3 rounded">
              This is a legitimate staging/development environment for the open-source FairCoin project 
              (https://github.com/jonipwi/faircoin.app). It is NOT a phishing site. All code is publicly 
              available, clearly documented as a staging environment, and includes proper security.txt files.
            </p>
          </div>
        </div>

        {/* About FairCoin */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            About FairCoin
          </h2>
          
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            FairCoin is a community-driven fair transaction system built on principles of transparency, 
            compassion, and equity. We&rsquo;re developing an alternative economic system based on fairness metrics 
            (PFI★ and TFI★) rather than traditional monetary systems.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a 
              href="/"
              className="btn bg-primary-600 text-white hover:bg-primary-700"
            >
              Go to Home
            </a>
            <a 
              href="https://github.com/jonipwi/faircoin.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
