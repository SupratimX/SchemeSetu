import { language } from '../store/profile.js';
import { t } from '../utils/i18n.js';
import CategoryGrid from '../components/CategoryGrid.jsx';
import SchemeCard from '../components/SchemeCard.jsx';
import centralSchemes from '../data/schemes/central.json';

export default function Home() {
  const lang = language.value;

  // Pick 3 high-impact featured schemes
  const featured = centralSchemes.filter(s =>
    ['pm-kisan', 'ayushman-bharat', 'pm-ujjwala'].includes(s.id)
  );

  return (
    <div class="space-y-16 pb-16">
      {/* Hero Section */}
      <section class="relative bg-gradient-to-b from-orange-50/70 via-white to-transparent pt-12 pb-16 px-4 sm:px-6">
        <div class="max-w-4xl mx-auto text-center space-y-6">
          {/* Trust Pill */}
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-xs font-bold text-[#FF9933]">
            <span>🇮🇳</span>
            <span>{t('home.stats', {}, lang)}</span>
          </div>

          <h1 class="text-3xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
            {t('home.hero_title', {}, lang)}
          </h1>

          <p class="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('home.hero_subtitle', {}, lang)}
          </p>

          {/* Call to Actions */}
          <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#/quiz"
              class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#FF9933] to-[#e67300] hover:from-[#e67300] hover:to-[#cc6600] text-white font-black text-base sm:text-lg rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-center"
            >
              {t('home.find_btn', {}, lang)}
            </a>
            <a
              href="#/browse"
              class="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-bold text-base sm:text-lg rounded-2xl border border-gray-300 shadow-sm hover:shadow transition-all text-center"
            >
              {t('home.browse_btn', {}, lang)}
            </a>
          </div>

          {/* Privacy Guarantee Note */}
          <div class="pt-4 flex items-center justify-center gap-2 text-xs font-semibold text-gray-500">
            <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>{t('home.privacy_note', {}, lang)}</span>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section class="max-w-5xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">
            {t('home.how_title', {}, lang)}
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div class="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm text-center relative">
            <div class="w-12 h-12 mx-auto mb-4 rounded-2xl bg-orange-100 text-[#FF9933] flex items-center justify-center text-xl font-black">
              1
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">
              {t('home.step1_title', {}, lang)}
            </h3>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {t('home.step1_desc', {}, lang)}
            </p>
          </div>

          <div class="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm text-center relative">
            <div class="w-12 h-12 mx-auto mb-4 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-black">
              2
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">
              {t('home.step2_title', {}, lang)}
            </h3>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {t('home.step2_desc', {}, lang)}
            </p>
          </div>

          <div class="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm text-center relative">
            <div class="w-12 h-12 mx-auto mb-4 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-black">
              3
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">
              {t('home.step3_title', {}, lang)}
            </h3>
            <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {t('home.step3_desc', {}, lang)}
            </p>
          </div>
        </div>
      </section>

      {/* Explore By Category */}
      <section class="max-w-5xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900">
            Explore Categories
          </h2>
          <a href="#/browse" class="text-xs sm:text-sm font-semibold text-[#FF9933] hover:underline">
            View All →
          </a>
        </div>
        <CategoryGrid onSelectCategory={(cat) => window.location.hash = `#/browse?category=${cat}`} />
      </section>

      {/* Popular Schemes Carousel / Grid */}
      <section class="max-w-5xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900">
              {t('home.featured_title', {}, lang)}
            </h2>
            <p class="text-xs text-gray-500">Major welfare schemes with highest coverage</p>
          </div>
          <a href="#/browse" class="text-xs sm:text-sm font-semibold text-[#FF9933] hover:underline">
            {t('home.browse_btn', {}, lang)} →
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {featured.map(s => (
            <SchemeCard
              key={s.id}
              scheme={s}
              evaluation={{ status: 'eligible', score: 90, reasons: [] }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
