"use client"

import { useState, useEffect, Suspense } from 'react'
import { Store, Check, ArrowLeft, Phone, MapPin, User, Building2, Tag, Mail, Globe } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { useLocalePath } from '@/lib/i18n/useLocalePath'
import { useAuth } from '@/contexts/AuthContext'
import { api, type MerchantApplication } from '@/lib/api'

interface FormData {
  businessName: string
  businessType: string
  category: string
  phone: string
  email: string
  address: string
  website: string
  description: string
}

function MerchantApplyForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const localePath = useLocalePath()
  const { isAuthenticated, user } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    businessType: '',
    category: searchParams.get('category') || '',
    phone: '',
    email: '',
    address: '',
    website: '',
    description: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const categories = [
    { value: 'Groceries', label: '🏪 ' + t('merchants.categories.dailyEssentials'), icon: '🏪' },
    { value: 'Food', label: '🍲 ' + t('merchants.categories.foodDrinks'), icon: '🍲' },
    { value: 'Household', label: '👕 ' + t('merchants.categories.clothingHousehold'), icon: '👕' },
    { value: 'Services', label: '🚖 ' + t('merchants.categories.services'), icon: '🚖' },
    { value: 'Pet', label: '🐶 ' + t('merchants.categories.petCare'), icon: '🐶' },
    { value: 'Community', label: '📚 ' + t('merchants.categories.educationCommunity'), icon: '📚' },
    { value: 'Pharmacy', label: '💊 ' + t('merchants.categories.pharmacy'), icon: '💊' },
    { value: 'Property', label: '🏠 ' + t('merchants.categories.homeProperty'), icon: '🏠' }
  ]

  const handleSubmit = async () => {
    if (!isAuthenticated || !user) {
      setError('Please login to submit a merchant application')
      return
    }

    setSubmitting(true)
    setError('')
    
    const isDev = process.env.NODE_ENV === 'development'
    
    try {
      const token = localStorage.getItem('auth_token')
      const application: MerchantApplication = {
        business_name: formData.businessName,
        business_type: formData.businessType,
        category: formData.category,
        description: formData.description,
        website_url: formData.website,
        business_address: formData.address,
        business_phone: formData.phone,
        business_email: formData.email
      }
      
      const response = await api.merchant.apply(application, token || undefined)
      
      if (response.success) {
        setSubmitted(true)
      } else {
        setError(response.message || 'Failed to submit application')
      }
    } catch (err) {
      if (isDev) console.error('Application submission error:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  const updateField = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center animate-bounce">
            <Check className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
            {t('merchants.apply.success.title') || 'Application Received!'} 🎉
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-400 mb-4">
            {t('merchants.apply.success.thankYou') || 'Thank you'}, <strong>{user?.username}</strong>!
          </p>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
            {t('merchants.apply.success.review') || 'We will review your application for'} <strong>{formData.businessName}</strong> {t('merchants.apply.success.contact') || 'and contact you within 2-3 business days at'} <strong>{formData.phone}</strong>.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => router.back()}
              className="w-full py-6 px-8 rounded-xl bg-primary-500 text-white text-xl font-bold hover:bg-primary-600 transition-all shadow-xl"
            >
              {t('merchants.apply.success.viewMerchants') || 'Back to Merchants'}
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full py-6 px-8 rounded-xl bg-gray-500 text-white text-xl font-bold hover:bg-gray-600 transition-all shadow-xl"
            >
              {t('common.backToHome') || 'Back to Home'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6">
            <Store className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {t('merchants.apply.title') || 'Become a Merchant'} 🏪
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400">
            {t('merchants.apply.subtitle') || 'Join our trusted merchant community'}
          </p>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-4 mt-8">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                  step >= num 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white scale-110' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  {num}
                </div>
                {num < 3 && (
                  <div className={`w-12 h-1 mx-2 rounded-full transition-all ${
                    step > num ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-4">
            {t('merchants.apply.step') || 'Step'} {step} {t('merchants.apply.of') || 'of'} 3
          </p>
        </div>

        {/* Step 1: Business Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="card p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-green-500" />
                  {t('merchants.apply.businessName') || 'Business Name'}
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
                  {t('merchants.apply.businessNameHint') || 'What is your store or business called?'}
                </p>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => updateField('businessName', e.target.value)}
                  placeholder={t('merchants.apply.businessNameExample') || 'Example: Green Market Co-op'}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => router.back()}
                className="flex-1 btn btn-secondary flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                {t('common.back') || 'Back'}
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!formData.businessName}
                className="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('merchants.apply.nextStep') || 'Next Step'} →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Category & Contact */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="card p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                  <Tag className="w-6 h-6 text-green-500" />
                  {t('merchants.apply.category') || 'Category'}
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
                  {t('merchants.apply.categoryHint') || 'Choose the category that best describes your business'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => updateField('category', cat.value)}
                      className={`p-4 rounded-lg border-2 text-base font-semibold transition-all ${
                        formData.category === cat.value
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-green-300'
                      }`}
                    >
                      <div className="text-3xl mb-1">{cat.icon}</div>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                  <Phone className="w-6 h-6 text-green-500" />
                  {t('merchants.apply.phone') || 'Phone Number'}
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
                  {t('merchants.apply.phoneHint') || 'How can we reach you?'}
                </p>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder={t('merchants.apply.phoneExample') || 'Example: +1 234 567 8900'}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-green-500" />
                  {t('merchants.apply.address') || 'Business Address'}
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
                  {t('merchants.apply.addressHint') || 'Where is your business located?'}
                </p>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder={t('merchants.apply.addressExample') || 'Example: 123 Main Street, Downtown'}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                />
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-green-500" />
                  {t('merchants.apply.email') || 'Business Email'}
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
                  {t('merchants.apply.emailHint') || 'Business contact email'}
                </p>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder={t('merchants.apply.emailExample') || 'Example: contact@business.com'}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 btn btn-secondary flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                {t('common.back') || 'Back'}
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.category || !formData.phone || !formData.address || !formData.email}
                className="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('merchants.apply.nextStep') || 'Next Step'} →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Additional Details & Submit */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="card p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-green-500" />
                  {t('merchants.apply.website') || 'Business Website (Optional)'}
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
                  {t('merchants.apply.websiteHint') || 'Your business website or social media page'}
                </p>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => updateField('website', e.target.value)}
                  placeholder={t('merchants.apply.websiteExample') || 'Example: https://mybusiness.com'}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                />
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-green-500" />
                  {t('merchants.apply.businessType') || 'Business Type'}
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
                  {t('merchants.apply.businessTypeHint') || 'What type of business entity?'}
                </p>
                <select
                  value={formData.businessType}
                  onChange={(e) => updateField('businessType', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                >
                  <option value="">{t('merchants.apply.selectBusinessType') || 'Select type...'}</option>
                  <option value="individual">Individual/Sole Proprietor</option>
                  <option value="partnership">Partnership</option>
                  <option value="corporation">Corporation</option>
                  <option value="llc">LLC</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('merchants.apply.description') || 'Tell Us About Your Business'}
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
                {t('merchants.apply.descriptionHint') || 'What makes your business special? What do you sell or offer?'}
              </p>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder={t('merchants.apply.descriptionExample') || 'Example: We sell fresh organic produce and support local farmers. Open 7 days a week with friendly service.'}
                rows={6}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all resize-none"
              />

              {/* Summary */}
              <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('merchants.apply.review') || 'Review Your Information'}
                </h3>
                <div className="space-y-2 text-base">
                  <div><strong>{t('merchants.apply.businessName') || 'Business'}:</strong> {formData.businessName}</div>
                  <div><strong>{t('merchants.apply.businessType') || 'Type'}:</strong> {formData.businessType || 'Not specified'}</div>
                  <div><strong>{t('merchants.apply.category') || 'Category'}:</strong> {categories.find(c => c.value === formData.category)?.label}</div>
                  <div><strong>{t('merchants.apply.phone') || 'Phone'}:</strong> {formData.phone}</div>
                  <div><strong>{t('merchants.apply.email') || 'Email'}:</strong> {formData.email}</div>
                  <div><strong>{t('merchants.apply.address') || 'Address'}:</strong> {formData.address}</div>
                  {formData.website && <div><strong>{t('merchants.apply.website') || 'Website'}:</strong> {formData.website}</div>}
                  {formData.description && <div><strong>{t('merchants.apply.description') || 'Description'}:</strong> {formData.description}</div>}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 btn btn-secondary flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                {t('common.back') || 'Back'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.description || !formData.businessType || submitting}
                className="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (t('common.loading') || 'Submitting...') : (t('merchants.apply.submit') || 'Submit Application')} ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function MerchantApply() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <MerchantApplyForm />
    </Suspense>
  )
}
