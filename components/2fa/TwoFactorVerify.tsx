'use client'

import { useState } from 'react'
import { Shield, Key, ArrowLeft } from 'lucide-react'

interface TwoFactorVerifyProps {
  onVerify: (code: string, isBackupCode: boolean) => Promise<void>
  loading?: boolean
  error?: string
  title?: string
  description?: string
}

export default function TwoFactorVerify({
  onVerify,
  loading = false,
  error,
  title = 'Two-Factor Authentication',
  description = 'Enter the verification code from your authenticator app'
}: TwoFactorVerifyProps) {
  const [code, setCode] = useState('')
  const [useBackupCode, setUseBackupCode] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code || (useBackupCode ? code.length !== 8 : code.length !== 6)) {
      return
    }
    await onVerify(code, useBackupCode)
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
          {useBackupCode ? (
            <Key className="w-8 h-8 text-white" />
          ) : (
            <Shield className="w-8 h-8 text-white" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {useBackupCode 
            ? 'Enter one of your 8-character backup codes' 
            : description}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {useBackupCode ? 'Backup Code' : 'Authentication Code'}
          </label>
          <input
            type="text"
            value={code}
            maxLength={useBackupCode ? 8 : 6}
            autoFocus
            onChange={(e) => setCode(useBackupCode ? e.target.value.toUpperCase() : e.target.value.replace(/\D/g, ''))}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center text-lg font-mono tracking-wider"
            placeholder={useBackupCode ? 'XXXXXXXX' : '000000'}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (!useBackupCode && code.length !== 6) || (useBackupCode && code.length !== 8)}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify'
          )}
        </button>

        {/* Toggle backup code */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setUseBackupCode(!useBackupCode);
              setCode('');
            }}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors flex items-center gap-2 mx-auto"
          >
            {useBackupCode ? (
              <>
                <ArrowLeft className="w-4 h-4" />
                Use authenticator code
              </>
            ) : (
              <>
                <Key className="w-4 h-4" />
                Use backup code instead
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
