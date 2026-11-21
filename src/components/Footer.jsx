import { language } from '../store/profile.js';
import { t } from '../utils/i18n.js';

export default function Footer() {
  const lang = language.value;

  return (
    <footer class="bg-gray-900 text-gray-400 py-10 px-4 sm:px-6 border-t border-gray-800 text-sm">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Mission */}
          <div class="md:col-span-2">
            <div class="flex items-center gap-2 mb-3">
              <span class="w-7 h-7 rounded-lg bg-[#FF9933] text-white flex items-center justify-center font-bold text-sm">সে</span>
              <span class="text-white text-lg font-bold">SchemeSetu</span>
            </div>
            <p class="text-xs text-gray-400 leading-relaxed mb-4 max-w-md">
              {t('home.hero_subtitle', {}, lang)}
            </p>
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-gray-800/80 rounded-full text-xs text-emerald-400">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {t('home.privacy_note', {}, lang)}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 class="text-white font-semibold text-xs tracking-wider uppercase mb-3">Quick Navigation</h4>
            <ul class="space-y-2 text-xs">
              <li><a href="#/" class="hover:text-white transition-colors">{t('nav.home', {}, lang)}</a></li>
              <li><a href="#/quiz" class="hover:text-white transition-colors">{t('home.find_btn', {}, lang)}</a></li>
              <li><a href="#/browse" class="hover:text-white transition-colors">{t('nav.browse', {}, lang)}</a></li>
              <li><a href="#/checklist" class="hover:text-white transition-colors">{t('nav.checklist', {}, lang)}</a></li>
              <li><a href="#/saved" class="hover:text-white transition-colors">{t('nav.saved', {}, lang)}</a></li>
            </ul>
          </div>

          {/* Col 3: Trust & Open Data */}
          <div>
            <h4 class="text-white font-semibold text-xs tracking-wider uppercase mb-3">Open Governance</h4>
            <ul class="space-y-2 text-xs">
              <li><a href="#/about" class="hover:text-white transition-colors">{t('footer.about', {}, lang)}</a></li>
              <li><a href="https://github.com/schemesetu/schemesetu" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">{t('footer.contribute', {}, lang)} (GitHub)</a></li>
              <li><a href="https://github.com/schemesetu/schemesetu/issues/new" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors text-amber-400">{t('footer.report_link', {}, lang)}</a></li>
              <li><a href="#/about" class="hover:text-white transition-colors">{t('footer.privacy', {}, lang)}</a></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div class="pt-6 border-t border-gray-800 text-xs text-center text-gray-500 space-y-1">
          <p>{t('footer.disclaimer', {}, lang)}</p>
          <p>{t('footer.data_note', {}, lang)} • Made for Indian citizens • 100% Free & Open Source</p>
        </div>
      </div>
    </footer>
  );
}
