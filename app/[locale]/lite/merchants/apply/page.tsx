"use client"

import { useState } from 'react'
import { Store, Check, ArrowLeft, Phone, MapPin, User, Building2, Tag } from 'lucide-react'
import { useLocalePath } from '@/lib/i18n/useLocalePath'
import { useLanguage } from '@/lib/i18n/LanguageContext'
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

export default function LiteMerchantApply() {
  const localePath = useLocalePath()
  const { t } = useLanguage()
  const { isAuthenticated, user } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    businessType: '',
    category: '',
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
    { value: 'Groceries', label: '🏪 ' + t('lite.merchants.categories.dailyEssentials'), icon: '🏪' },
    { value: 'Food', label: '🍲 ' + t('lite.merchants.categories.foodDrinks'), icon: '🍲' },
    { value: 'Household', label: '👕 ' + t('lite.merchants.categories.clothingHousehold'), icon: '👕' },
    { value: 'Services', label: '🚖 ' + t('lite.merchants.categories.services'), icon: '🚖' },
    { value: 'Pet', label: '🐶 ' + t('lite.merchants.categories.petCare'), icon: '🐶' },
    { value: 'Community', label: '📚 ' + t('lite.merchants.categories.educationCommunity'), icon: '📚' },
    { value: 'Pharmacy', label: '💊 ' + t('lite.merchants.categories.pharmacy'), icon: '💊' },
    { value: 'Property', label: '🏠 ' + t('lite.merchants.categories.homeProperty'), icon: '🏠' }
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
            {t('lite.merchants.apply.success.title') || 'Application Received!'} 🎉
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-400 mb-4">
            {t('lite.merchants.apply.success.thankYou') || 'Thank you'}, <strong>{user?.username}</strong>!
          </p>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
            {t('lite.merchants.apply.success.review') || 'We will review your application for'} <strong>{formData.businessName}</strong> {t('lite.merchants.apply.success.contact') || 'and contact you within 2-3 business days at'} <strong>{formData.phone}</strong>.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => window.location.href = localePath('lite/merchants') as string}
              className="w-full py-8 px-8 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-2xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all shadow-2xl"
            >
              {t('lite.merchants.apply.success.viewMerchants') || 'View Merchants'}
            </button>
            <button
              onClick={() => window.location.href = localePath('lite') as string}
              className="w-full py-8 px-8 rounded-3xl bg-gradient-to-r from-gray-500 to-gray-600 text-white text-2xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all shadow-2xl"
            >
              {t('common.backToHome') || 'Back to Home'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6">
            <Store className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {t('lite.merchants.apply.title') || 'Become a Merchant'} 🏪
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400">
            {t('lite.merchants.apply.subtitle') || 'Join our trusted merchant community'}
          </p>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-4 mt-8">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
                  step >= num 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white scale-110' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  {num}
                </div>
                {num < 3 && (
                  <div className={`w-12 h-2 mx-2 rounded-full transition-all ${
                    step > num ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
            {t('lite.merchants.apply.step') || 'Step'} {step} {t('lite.merchants.apply.of') || 'of'} 3
          </p>
        </div>

        {/* Step 1: Business & Owner Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-8 shadow-xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-green-500" />
                  {t('lite.merchants.apply.businessName') || 'Business Name'}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  {t('lite.merchants.apply.businessNameHint') || 'What is your store or business called?'}
                </p>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => updateField('businessName', e.target.value)}
                  placeholder={t('lite.merchants.apply.businessNameExample') || 'Example: Green Market Co-op'}
                  className="w-full px-6 py-6 rounded-2xl border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                />
              </div>

            </div>

            <div className="flex gap-4">
              <button
                onClick={() => window.location.href = localePath('lite/merchants') as string}
                className="flex-1 py-6 px-8 rounded-2xl bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-6 h-6" />
                {t('common.back') || 'Back'}
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!formData.businessName}
                className={`flex-1 py-6 px-8 rounded-2xl text-white text-xl font-bold transition-all shadow-xl ${
                  formData.businessName
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                    : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                }`}
              >
                {t('lite.merchants.apply.nextStep') || 'Next Step'} →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Category & Contact */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-8 shadow-xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                  <Tag className="w-8 h-8 text-green-500" />
                  {t('lite.merchants.apply.category') || 'Category'}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  {t('lite.merchants.apply.categoryHint') || 'Choose the category that best describes your business'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => updateField('category', cat.value)}
                      className={`p-6 rounded-2xl border-4 text-xl font-bold transition-all ${
                        formData.category === cat.value
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-green-300'
                      }`}
                    >
                      <div className="text-4xl mb-2">{cat.icon}</div>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                  <Phone className="w-8 h-8 text-green-500" />
                  {t('lite.merchants.apply.phone') || 'Phone Number'}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  {t('lite.merchants.apply.phoneHint') || 'How can we reach you?'}
                </p>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder={t('lite.merchants.apply.phoneExample') || 'Example: +1 234 567 8900'}
                  className="w-full px-6 py-6 rounded-2xl border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                />
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                  <MapPin className="w-8 h-8 text-green-500" />
                  {t('lite.merchants.apply.location') || 'Business Address'}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  {t('lite.merchants.apply.locationHint') || 'Where is your business located?'}
                </p>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder={t('lite.merchants.apply.locationExample') || 'Example: 123 Main Street, Downtown'}
                  className="w-full px-6 py-6 rounded-2xl border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                />
              </div>

              <div className="mt-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                  <Phone className="w-8 h-8 text-green-500" />
                  {t('lite.merchants.apply.email') || 'Business Email'}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  {t('lite.merchants.apply.emailHint') || 'Business contact email'}
                </p>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder={t('lite.merchants.apply.emailExample') || 'Example: contact@business.com'}
                  className="w-full px-6 py-6 rounded-2xl border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-6 px-8 rounded-2xl bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-6 h-6" />
                {t('common.back') || 'Back'}
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.category || !formData.phone || !formData.address || !formData.email}
                className={`flex-1 py-6 px-8 rounded-2xl text-white text-xl font-bold transition-all shadow-xl ${
                  formData.category && formData.phone && formData.address && formData.email
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                    : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                }`}
              >
                {t('lite.merchants.apply.nextStep') || 'Next Step'} →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Description & Submit */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {t('lite.merchants.apply.website') || 'Business Website (Optional)'}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {t('lite.merchants.apply.websiteHint') || 'Your business website or social media page'}
              </p>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => updateField('website', e.target.value)}
                placeholder={t('lite.merchants.apply.websiteExample') || 'Example: https://mybusiness.com'}
                className="w-full px-6 py-6 rounded-2xl border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
              />

              <div className="mt-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('lite.merchants.apply.businessType') || 'Business Type'}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  {t('lite.merchants.apply.businessTypeHint') || 'What type of business entity?'}
                </p>
                <select
                  value={formData.businessType}
                  onChange={(e) => updateField('businessType', e.target.value)}
                  className="w-full px-6 py-6 rounded-2xl border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xl text-gray-900 dark:text-white focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                >
                  <option value="">{t('lite.merchants.apply.selectBusinessType') || 'Select type...'}</option>
                  <option value="individual">Individual/Sole Proprietor</option>
                  <option value="partnership">Partnership</option>
                  <option value="corporation">Corporation</option>
                  <option value="llc">LLC</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mt-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('lite.merchants.apply.description') || 'Tell Us About Your Business'}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  {t('lite.merchants.apply.descriptionHint') || 'What makes your business special? What do you sell or offer?'}
                </p>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder={t('lite.merchants.apply.descriptionExample') || 'Example: We sell fresh organic produce and support local farmers. Open 7 days a week with friendly service.'}
                  rows={6}
                  className="w-full px-6 py-6 rounded-2xl border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all resize-none"
                />
              </div>

              {/* Summary */}
              <div className="mt-8 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('lite.merchants.apply.review') || 'Review Your Information'}
                </h3>
                <div className="space-y-3 text-lg">
                  <div><strong>{t('lite.merchants.apply.businessName') || 'Business'}:</strong> {formData.businessName}</div>
                  <div><strong>{t('lite.merchants.apply.businessType') || 'Type'}:</strong> {formData.businessType || 'Not specified'}</div>
                  <div><strong>{t('lite.merchants.apply.category') || 'Category'}:</strong> {categories.find(c => c.value === formData.category)?.label}</div>
                  <div><strong>{t('lite.merchants.apply.phone') || 'Phone'}:</strong> {formData.phone}</div>
                  <div><strong>{t('lite.merchants.apply.email') || 'Email'}:</strong> {formData.email}</div>
                  <div><strong>{t('lite.merchants.apply.address') || 'Address'}:</strong> {formData.address}</div>
                  {formData.website && <div><strong>{t('lite.merchants.apply.website') || 'Website'}:</strong> {formData.website}</div>}
                  {formData.description && <div><strong>{t('lite.merchants.apply.description') || 'Description'}:</strong> {formData.description}</div>}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-6 px-8 rounded-2xl bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-6 h-6" />
                {t('common.back') || 'Back'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.description || !formData.businessType}
                className={`flex-1 py-6 px-8 rounded-2xl text-white text-xl font-bold transition-all shadow-xl ${
                  formData.description && formData.businessType
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                    : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                }`}
              >
                {t('lite.merchants.apply.submit') || 'Submit Application'} ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
