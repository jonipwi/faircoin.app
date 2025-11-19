"use client"

import { Navbar } from '@/components/Navbar'
import { BookOpen, Heart, Globe, Sparkles, Shield, Users, TrendingUp, CheckCircle } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function WhitepaperPage() {
  const { t } = useLanguage()
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12 mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-6">
            <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
              {t('whitepaper.badge')}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-gray-900 dark:text-white">
            {t('whitepaper.title')}
          </h1>
          
          <p className="text-2xl text-gray-600 dark:text-gray-400 mb-4">
            {t('whitepaper.subtitle')}
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-500 italic">
            {t('whitepaper.version')}
          </p>
        </div>

        {/* Vision and Calling */}
        <section className="card p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Sparkles className="w-8 h-8 text-primary-500 flex-shrink-0" />
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                {t('whitepaper.section1.title')}
              </h2>
            </div>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('whitepaper.section1.intro')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('whitepaper.section1.purpose')}
            </p>
            <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-600 dark:text-gray-400 my-6">
              &quot;{t('whitepaper.section1.quote')}&quot;
              <br />
              <span className="text-sm">— {t('whitepaper.section1.reference')}</span>
            </blockquote>
          </div>
        </section>

        {/* Purpose */}
        <section className="card p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Heart className="w-8 h-8 text-accent-500 flex-shrink-0" />
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                {t('whitepaper.section2.title')}
              </h2>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            {t('whitepaper.section2.subtitle1')}
          </h3>
          
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t('whitepaper.section2.intro')}
          </p>

          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">{t('whitepaper.section2.cry1')}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">{t('whitepaper.section2.cry2')}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">{t('whitepaper.section2.cry3')}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">{t('whitepaper.section2.cry4')}</span>
            </li>
          </ul>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {t('whitepaper.section2.answer')}
          </p>

          <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            {t('whitepaper.section2.subtitle2')}
          </h3>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t('whitepaper.section2.mission')}
          </p>

          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>PFI★</strong> – {t('whitepaper.section2.tool1')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>TFI★</strong> – {t('whitepaper.section2.tool2')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>JesusBot</strong> – {t('whitepaper.section2.tool3')}
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
                {t('whitepaper.section3.title')}
              </h2>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t('whitepaper.section3.intro')}
          </p>

          <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            {t('whitepaper.section3.principlesTitle')}
          </h3>

          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                {t('whitepaper.section3.principle1')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                {t('whitepaper.section3.principle2')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                {t('whitepaper.section3.principle3')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                {t('whitepaper.section3.principle4')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                {t('whitepaper.section3.principle5')}
              </span>
            </li>
          </ul>
        </section>

        {/* Architecture */}
        <section className="card p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            {t('whitepaper.section4.title')}
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                  <th className="p-3 font-semibold text-gray-900 dark:text-white">{t('whitepaper.section4.layer')}</th>
                  <th className="p-3 font-semibold text-gray-900 dark:text-white">{t('whitepaper.section4.component')}</th>
                  <th className="p-3 font-semibold text-gray-900 dark:text-white">{t('whitepaper.section4.description')}</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-3 font-medium">{t('whitepaper.section4.ethicalLayer')}</td>
                  <td className="p-3">{t('whitepaper.section4.ethicalComponent')}</td>
                  <td className="p-3">{t('whitepaper.section4.ethicalDesc')}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-3 font-medium">{t('whitepaper.section4.dataLayer')}</td>
                  <td className="p-3">{t('whitepaper.section4.dataComponent')}</td>
                  <td className="p-3">{t('whitepaper.section4.dataDesc')}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-3 font-medium">{t('whitepaper.section4.appLayer')}</td>
                  <td className="p-3">{t('whitepaper.section4.appComponent')}</td>
                  <td className="p-3">{t('whitepaper.section4.appDesc')}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-3 font-medium">{t('whitepaper.section4.communityLayer')}</td>
                  <td className="p-3">{t('whitepaper.section4.communityComponent')}</td>
                  <td className="p-3">{t('whitepaper.section4.communityDesc')}</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">{t('whitepaper.section4.humanitarianLayer')}</td>
                  <td className="p-3">{t('whitepaper.section4.humanitarianComponent')}</td>
                  <td className="p-3">{t('whitepaper.section4.humanitarianDesc')}</td>
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
                {t('whitepaper.section5.title')}
              </h2>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t('whitepaper.section5.intro')}
          </p>

          <ul className="space-y-2 mb-6">
            <li className="text-gray-700 dark:text-gray-300">
              {t('whitepaper.section5.aiBrings')}
            </li>
            <li className="text-gray-700 dark:text-gray-300">
              {t('whitepaper.section5.humansBring')}
            </li>
          </ul>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {t('whitepaper.section5.together')}
          </p>

          <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            {t('whitepaper.section5.aiRoleTitle')}
          </h3>

          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                {t('whitepaper.section5.aiRole1')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                {t('whitepaper.section5.aiRole2')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                {t('whitepaper.section5.aiRole3')}
              </span>
            </li>
          </ul>

          <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            {t('whitepaper.section5.humanRoleTitle')}
          </h3>

          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                {t('whitepaper.section5.humanRole1')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                {t('whitepaper.section5.humanRole2')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                {t('whitepaper.section5.humanRole3')}
              </span>
            </li>
          </ul>

          <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-600 dark:text-gray-400 my-6">
            &quot;{t('whitepaper.section5.quote')}&quot;
            <br />
            <span className="text-sm">— {t('whitepaper.section5.reference')}</span>
          </blockquote>

          <p className="text-gray-700 dark:text-gray-300">
            {t('whitepaper.section5.conclusion')}
          </p>
        </section>

        {/* Governance */}
        <section className="card p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            {t('whitepaper.section6.title')}
          </h2>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t('whitepaper.section6.intro')}
          </p>

          <ul className="space-y-2 mb-6">
            <li className="text-gray-700 dark:text-gray-300">
              <strong>{t('whitepaper.section6.mercy').split(' ')[0]}</strong> {t('whitepaper.section6.mercy').split(' ').slice(1).join(' ')}
            </li>
            <li className="text-gray-700 dark:text-gray-300">
              <strong>{t('whitepaper.section6.truth').split(' ')[0]}</strong> {t('whitepaper.section6.truth').split(' ').slice(1).join(' ')}
            </li>
          </ul>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t('whitepaper.section6.council')}
          </p>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t('whitepaper.section6.decisions')}
          </p>

          <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-600 dark:text-gray-400 my-6">
            &quot;{t('whitepaper.section6.quote')}&quot;
            <br />
            <span className="text-sm">— {t('whitepaper.section6.reference')}</span>
          </blockquote>
        </section>

        {/* Economic Philosophy */}
        <section className="card p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <TrendingUp className="w-8 h-8 text-primary-500 flex-shrink-0" />
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                {t('whitepaper.section7.title')}
              </h2>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t('whitepaper.section7.intro')}
          </p>

          <ul className="space-y-2 mb-6">
            <li className="text-gray-700 dark:text-gray-300">
              {t('whitepaper.section7.value1')}
            </li>
            <li className="text-gray-700 dark:text-gray-300">
              {t('whitepaper.section7.value2')}
            </li>
            <li className="text-gray-700 dark:text-gray-300">
              {t('whitepaper.section7.value3')}
            </li>
          </ul>

          <p className="text-gray-700 dark:text-gray-300">
            {t('whitepaper.section7.conclusion')}
          </p>
        </section>

        {/* Social Mission */}
        <section className="card p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Globe className="w-8 h-8 text-accent-500 flex-shrink-0" />
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                {t('whitepaper.section8.title')}
              </h2>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            {t('whitepaper.section8.subtitle1')}
          </h3>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t('whitepaper.section8.intro')}
          </p>

          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">{t('whitepaper.section8.help1')}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">{t('whitepaper.section8.help2')}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">{t('whitepaper.section8.help3')}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">{t('whitepaper.section8.help4')}</span>
            </li>
          </ul>

          <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            {t('whitepaper.section8.subtitle2')}
          </h3>

          <p className="text-gray-700 dark:text-gray-300">
            {t('whitepaper.section8.restore')}
          </p>
        </section>

        {/* Truth and Integrity */}
        <section className="card p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            {t('whitepaper.section9.title')}
          </h2>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t('whitepaper.section9.intro')}
          </p>

          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                {t('whitepaper.section9.check1')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                {t('whitepaper.section9.check2')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                {t('whitepaper.section9.check3')}
              </span>
            </li>
          </ul>
        </section>

        {/* The Promise */}
        <section className="card p-8 mb-8 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            {t('whitepaper.section10.title')}
          </h2>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t('whitepaper.section10.promise1')}
          </p>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {t('whitepaper.section10.promise2')}
          </p>

          <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-600 dark:text-gray-400 my-6">
            &quot;{t('whitepaper.section10.quote')}&quot;
            <br />
            <span className="text-sm">— {t('whitepaper.section10.reference')}</span>
          </blockquote>
        </section>

        {/* Closing Prayer */}
        <section className="card p-8 mb-8 bg-gradient-to-br from-accent-50 to-primary-50 dark:from-accent-900/20 dark:to-primary-900/20">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">
            {t('whitepaper.section11.title')}
          </h2>

          <div className="text-center text-gray-700 dark:text-gray-300 space-y-4">
            <p>{t('whitepaper.section11.prayer1')}</p>
            <p>{t('whitepaper.section11.prayer2')}</p>
            <p>{t('whitepaper.section11.prayer3')}</p>
            <p>{t('whitepaper.section11.prayer4')}</p>
            <p>{t('whitepaper.section11.prayer5')}</p>
            <p>{t('whitepaper.section11.prayer6')}</p>
            <p className="font-semibold">{t('whitepaper.section11.prayer7')}</p>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-300 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {t('whitepaper.footer.source')}{' '}
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
            {t('whitepaper.footer.tagline')}
          </p>
        </div>
      </div>
    </main>
  )
}
