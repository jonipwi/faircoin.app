'use client'

import { useState } from 'react'
import { Shield, CheckCircle, X, Key, Copy, Download } from 'lucide-react'

interface TwoFactorSetupProps {
  qrCode: string
  secret: string
  backupCodes?: string[]
  onVerify: (code: string) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export default function TwoFactorSetup({
  qrCode,
  secret,
  backupCodes = [],
  onVerify,
  onCancel,
  loading = false
}: TwoFactorSetupProps) {
  const [verificationCode, setVerificationCode] = useState('')
  const [step, setStep] = useState<'scan' | 'verify' | 'backup'>(backupCodes.length > 0 ? 'backup' : 'scan')
  const [copied, setCopied] = useState(false)

  const handleCopySecret = async () => {
    await navigator.clipboard.writeText(secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVerify = async () => {
    if (verificationCode.length === 6) {
      await onVerify(verificationCode)
    }
  }

  const downloadBackupCodes = () => {
    const content = `FairCoin 2FA Backup Codes\nGenerated: ${new Date().toLocaleString()}\n\n${backupCodes.join('\n')}\n\nKeep these codes safe - each can only be used once.`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'faircoin-backup-codes.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2">
        <div className={`flex items-center gap-2 ${step === 'scan' || step === 'verify' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 'scan' || step === 'verify' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            1
          </div>
          <span className="text-sm font-medium hidden sm:inline">Setup</span>
        </div>
        <div className="w-8 h-0.5 bg-gray-300" />
        <div className={`flex items-center gap-2 ${step === 'verify' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 'verify' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            2
          </div>
          <span className="text-sm font-medium hidden sm:inline">Verify</span>
        </div>
        <div className="w-8 h-0.5 bg-gray-300" />
        <div className={`flex items-center gap-2 ${step === 'backup' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 'backup' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            3
          </div>
          <span className="text-sm font-medium hidden sm:inline">Backup</span>
        </div>
      </div>

      {/* Scan QR Code Step */}
      {step === 'scan' && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Scan QR Code
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Use Google Authenticator, Authy, or any TOTP app
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-white rounded-lg border-2 border-gray-200 dark:border-gray-600">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
            </div>

            <div className="w-full max-w-md">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 text-center">
                Or enter this code manually:
              </p>
              <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <code className="flex-1 text-center font-mono text-sm">{secret}</code>
                <button
                  onClick={handleCopySecret}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  title="Copy secret"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setStep('verify')}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Verify Code Step */}
      {step === 'verify' && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Enter Verification Code
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          <div className="max-w-xs mx-auto">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center text-lg font-mono tracking-wider"
              placeholder="000000"
              maxLength={6}
              autoFocus
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep('scan')}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleVerify}
              disabled={loading || verificationCode.length !== 6}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              Verify & Enable
            </button>
          </div>
        </div>
      )}

      {/* Backup Codes Step */}
      {step === 'backup' && backupCodes.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              2FA Successfully Enabled!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Save these backup codes in a safe place
            </p>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-3 mb-4">
              <Key className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  Important: Save Your Backup Codes
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Each code can be used once if you lose access to your authenticator device.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 font-mono text-sm mb-4">
              {backupCodes.map((code, index) => (
                <div key={index} className="p-2 bg-white dark:bg-gray-800 border border-yellow-300 dark:border-yellow-700 rounded text-center">
                  {code}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={downloadBackupCodes}
                className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Codes
              </button>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(backupCodes.join('\n'))
                }}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy All
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={onCancel}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
