import { language } from '../store/profile.js';
import { t } from '../utils/i18n.js';

export default function About() {
  const lang = language.value;

  return (
    <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-10">
      <div class="text-center space-y-3">
        <span class="w-12 h-12 mx-auto rounded-2xl bg-[#FF9933] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
          সে
        </span>
        <h1 class="text-3xl sm:text-4xl font-black text-gray-900">{t('about.title', {}, lang)}</h1>
        <p class="text-base text-gray-600 max-w-xl mx-auto leading-relaxed">{t('about.description', {}, lang)}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: '🔒', title: 'Zero-Data Tracking', desc: 'All evaluation runs directly in your browser. No Aadhaar numbers, phone numbers, or income documents are collected or transmitted.' },
          { icon: '⚡', title: 'Works Offline (PWA)', desc: 'Designed for 2G/3G networks across rural India. Instant responses with zero server roundtrips.' },
          { icon: '🌐', title: 'Indic Multilingual', desc: 'Available in English, हिन्दी (Hindi), and অসমীয়া (Assamese), with voice search support.' }
        ].map(p => (
          <div key={p.title} class="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-sm">
            <div class="text-2xl mb-2">{p.icon}</div>
            <h3 class="font-bold text-gray-900 mb-1">{p.title}</h3>
            <p class="text-xs text-gray-600 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 space-y-4">
        <h2 class="text-xl font-bold text-gray-900">Data Sourcing & Git-Based Verification</h2>
        <p class="text-sm text-gray-600 leading-relaxed">{t('about.data_note', {}, lang)}</p>
        <p class="text-sm text-gray-600 leading-relaxed">
          Every scheme in SchemeSetu is version-controlled on GitHub. When an official policy update occurs, maintainers update the JSON schema, verify official notification URLs, and automated CI pipelines run sanity tests before publishing.
        </p>
        <div class="pt-2">
          <a href="https://github.com/schemesetu/schemesetu" target="_blank" rel="noreferrer" class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-gray-800 transition-colors">
            <span>🐙 {t('about.contribute', {}, lang)}</span>
          </a>
        </div>
      </div>

      <div class="bg-amber-50/80 rounded-2xl border border-amber-200 p-6 space-y-2 text-xs text-amber-900">
        <h4 class="font-bold uppercase tracking-wider text-amber-800">Legal Disclaimer</h4>
        <p class="leading-relaxed">{t('about.disclaimer_full', {}, lang)}</p>
      </div>
    </div>
  );
}
