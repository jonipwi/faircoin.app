"use client"

import { useState, useEffect } from 'react'
import { Send, User, ArrowRight, Check, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { useLocalePath } from '@/lib/i18n/useLocalePath'

export default function LiteSend() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const localePath = useLocalePath()
  const { t } = useLanguage()
  const [step, setStep] = useState<'contact' | 'amount' | 'confirm'>('contact')
  const [selectedContact, setSelectedContact] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  // Mock contacts - replace with actual API call
  const contacts = [
    { id: '1', name: 'John Elder', username: 'john_e', avatar: 'JE' },
    { id: '2', name: 'Maria Santos', username: 'maria_s', avatar: 'MS' },
    { id: '3', name: 'David Chen', username: 'david_c', avatar: 'DC' },
    { id: '4', name: 'Sarah Johnson', username: 'sarah_j', avatar: 'SJ' },
  ]

  const handleSend = async () => {
    setStatus('sending')
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setStatus('success')
    setTimeout(() => {
      setStep('contact')
      setSelectedContact('')
      setAmount('')
      setStatus('idle')
    }, 2000)
  }

  const addDigit = (digit: string) => {
    if (amount.length < 10) {
      setAmount(prev => prev + digit)
    }
  }

  const clearAmount = () => setAmount('')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(localePath('auth') as any)
    }
  }, [loading, isAuthenticated, router, localePath])

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6">
            <Send className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {t('lite.send.header') || 'Send FairCoin'}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400">
            {step === 'contact' && (t('lite.send.chooseRecipient') || 'Choose who to send to')}
            {step === 'amount' && (t('lite.send.enterAmount') || 'Enter amount to send')}
            {step === 'confirm' && (t('lite.send.confirmTransfer') || 'Confirm your transfer')}
          </p>
        </div>

        {/* Step 1: Select Contact */}
        {step === 'contact' && (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => {
                  setSelectedContact(contact.id)
                  setStep('amount')
                }}
                className="w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl">
                    {contact.avatar}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {contact.name}
                    </h3>
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
                      @{contact.username}
                    </p>
                  </div>
                  <ArrowRight className="w-8 h-8 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Enter Amount */}
        {step === 'amount' && (
          <div className="space-y-8">
            {/* Amount Display */}
            <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-primary-200 dark:border-primary-700 p-8 text-center">
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">{t('lite.send.amount') || 'Amount'}</p>
              <p className="text-6xl sm:text-7xl font-extrabold text-primary-600 dark:text-primary-400 mb-2">
                {amount || '0'}
              </p>
              <p className="text-2xl text-gray-500 dark:text-gray-500">FC</p>
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '←'].map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    if (key === '←') clearAmount()
                    else addDigit(key)
                  }}
                  className="h-20 sm:h-24 rounded-2xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  {key}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => setStep('contact')}
                className="flex-1 py-6 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-2xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                {t('lite.send.buttons.back') || 'Back'}
              </button>
              <button
                onClick={() => setStep('confirm')}
                disabled={!amount || amount === '0'}
                className="flex-1 py-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-2xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
              >
                {t('lite.send.buttons.continue') || 'Continue'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 'confirm' && status !== 'success' && (
          <div className="space-y-8">
            <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-primary-200 dark:border-primary-700 p-8 space-y-6">
              <div className="text-center">
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">{t('lite.send.confirm.youAreSending') || 'You are sending'}</p>
                <p className="text-6xl font-extrabold text-primary-600 dark:text-primary-400 mb-2">
                  {amount} FC
                </p>
              </div>
              <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-6 text-center">
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">{t('lite.send.confirm.to') || 'To'}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {contacts.find(c => c.id === selectedContact)?.name}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep('amount')}
                disabled={status === 'sending'}
                className="flex-1 py-6 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-2xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
              >
                {t('lite.send.buttons.back') || 'Back'}
              </button>
              <button
                onClick={handleSend}
                disabled={status === 'sending'}
                className="flex-1 py-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-2xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 shadow-xl flex items-center justify-center gap-3"
              >
                {status === 'sending' ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    {t('lite.send.buttons.sending') || 'Sending...'}
                  </>
                ) : (
                  t('lite.send.buttons.sendNow') || 'Send Now'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="text-center space-y-8">
            <div className="w-32 h-32 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
              <Check className="w-16 h-16 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
              {t('lite.send.success.title') || 'Sent Successfully!'}
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-400">
              {t('lite.send.success.message', { 
                amount: amount, 
                recipient: contacts.find(c => c.id === selectedContact)?.name || 'recipient'
              }) || `${amount} FC sent to ${contacts.find(c => c.id === selectedContact)?.name || 'recipient'}`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
