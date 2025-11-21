"use client"

import { useState } from 'react'
import { Store, Check, ArrowLeft, Phone, MapPin, User, Building2, Tag } from 'lucide-react'

interface FormData {
  businessName: string
  ownerName: string
  category: string
  phone: string
  location: string
  description: string
}

export default function LiteMerchantApply() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    ownerName: '',
    category: '',
    phone: '',
    location: '',
    description: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const categories = [
    { value: 'dailyEssentials', label: '🏪 Groceries / Essentials', icon: '🏪' },
    { value: 'foodDrinks', label: '🍲 Food & Beverages', icon: '🍲' },
    { value: 'householdServices', label: '👕 Household Services', icon: '👕' },
    { value: 'services', label: '🚖 Services & Help', icon: '🚖' },
    { value: 'petCare', label: '🐶 Pet Care', icon: '🐶' },
    { value: 'education', label: '📚 Community', icon: '📚' },
    { value: 'pharmacy', label: '💊 Pharmacy', icon: '💊' },
    { value: 'property', label: '🏠 Property & Housing', icon: '🏠' }
  ]

  const handleSubmit = async () => {
    // Simulate submission
    setSubmitted(true)
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
            Application Received! 🎉
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-400 mb-4">
            Thank you, <strong>{formData.ownerName}</strong>!
          </p>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
            We will review your application for <strong>{formData.businessName}</strong> and contact you within 2-3 business days at <strong>{formData.phone}</strong>.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => window.location.href = '/lite/merchants'}
              className="w-full py-8 px-8 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-2xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all shadow-2xl"
            >
              View Merchants
            </button>
            <button
              onClick={() => window.location.href = '/lite'}
              className="w-full py-8 px-8 rounded-3xl bg-gradient-to-r from-gray-500 to-gray-600 text-white text-2xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all shadow-2xl"
            >
              Back to Home
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
            Become a Merchant 🏪
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400">
            Join our trusted merchant community
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
            Step {step} of 3
          </p>
        </div>

        {/* Step 1: Business & Owner Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-8 shadow-xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-green-500" />
                  Business Name
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  What is your store or business called?
                </p>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => updateField('businessName', e.target.value)}
                  placeholder="Example: Green Market Co-op"
                  className="w-full px-6 py-6 rounded-2xl border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                />
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                  <User className="w-8 h-8 text-green-500" />
                  Your Name
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  What is the owner's full name?
                </p>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => updateField('ownerName', e.target.value)}
                  placeholder="Example: John Smith"
                  className="w-full px-6 py-6 rounded-2xl border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => window.location.href = '/lite/merchants'}
                className="flex-1 py-6 px-8 rounded-2xl bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-6 h-6" />
                Back
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!formData.businessName || !formData.ownerName}
                className={`flex-1 py-6 px-8 rounded-2xl text-white text-xl font-bold transition-all shadow-xl ${
                  formData.businessName && formData.ownerName
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                    : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                }`}
              >
                Next Step →
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
                  Business Type
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  What kind of business do you have?
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
                  Phone Number
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  How can we reach you?
                </p>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="Example: +1 234 567 8900"
                  className="w-full px-6 py-6 rounded-2xl border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
                />
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                  <MapPin className="w-8 h-8 text-green-500" />
                  Location
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  Where is your business located?
                </p>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="Example: 123 Main Street, Downtown"
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
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.category || !formData.phone || !formData.location}
                className={`flex-1 py-6 px-8 rounded-2xl text-white text-xl font-bold transition-all shadow-xl ${
                  formData.category && formData.phone && formData.location
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                    : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                }`}
              >
                Next Step →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Description & Submit */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Tell Us About Your Business
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                What makes your business special? What do you sell or offer?
              </p>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Example: We sell fresh organic produce and support local farmers. Open 7 days a week with friendly service."
                rows={6}
                className="w-full px-6 py-6 rounded-2xl border-4 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all resize-none"
              />

              {/* Summary */}
              <div className="mt-8 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Review Your Information
                </h3>
                <div className="space-y-3 text-lg">
                  <div><strong>Business:</strong> {formData.businessName}</div>
                  <div><strong>Owner:</strong> {formData.ownerName}</div>
                  <div><strong>Type:</strong> {categories.find(c => c.value === formData.category)?.label}</div>
                  <div><strong>Phone:</strong> {formData.phone}</div>
                  <div><strong>Location:</strong> {formData.location}</div>
                  {formData.description && <div><strong>Description:</strong> {formData.description}</div>}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-6 px-8 rounded-2xl bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-6 h-6" />
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.description}
                className={`flex-1 py-6 px-8 rounded-2xl text-white text-xl font-bold transition-all shadow-xl ${
                  formData.description
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                    : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                }`}
              >
                Submit Application ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
