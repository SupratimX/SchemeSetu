import { useState } from 'preact/hooks';
import { quizResults, language } from '../store/profile.js';
import { t } from '../utils/i18n.js';
import SchemeCard from '../components/SchemeCard.jsx';

export default function Results() {
  const [showNotEligible, setShowNotEligible] = useState(false);
  const lang = language.value;
  const results = quizResults.value;

  if (!results) {
    return (
      <div class="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <div class="text-5xl">🧭</div>
        <h2 class="text-2xl font-bold text-gray-900">{t('results.no_results', {}, lang)}</h2>
        <p class="text-sm text-gray-600">Answer 8 quick questions to find welfare schemes you qualify for.</p>
        <a href="#/quiz" class="inline-block mt-4 px-6 py-3 bg-[#FF9933] text-white font-bold rounded-xl shadow hover:bg-[#e67300] transition-colors">
          {t('home.find_btn', {}, lang)}
        </a>
      </div>
    );
  }

  const eligible = results.eligible || [], maybe = results.maybe || [], notEligible = results.not_eligible || [];

  return (
    <div class="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-10">
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-[#FF9933]">Eligibility Engine Results</span>
          <h1 class="text-2xl sm:text-3xl font-black text-gray-900 mt-1">{t('results.title', {}, lang)}</h1>
          <div class="flex flex-wrap items-center gap-2 mt-3">
            <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">✓ {t('results.eligible_count', { count: eligible.length }, lang)}</span>
            <span class="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">? {t('results.maybe_count', { count: maybe.length }, lang)}</span>
            <span class="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">✗ {t('results.not_eligible_count', { count: notEligible.length }, lang)}</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a href="#/checklist" class="px-5 py-3 bg-[#138808] hover:bg-[#0f6b06] text-white text-sm font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2 text-center">
            <span>📑</span>
            <span>{t('results.get_checklist', {}, lang)}</span>
          </a>
          <a href="#/quiz" class="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors text-center">
            ✏️ {t('results.refine', {}, lang)}
          </a>
        </div>
      </div>

      <section class="space-y-4">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
          <h2 class="text-xl font-bold text-gray-900">{t('results.eligible', {}, lang)} ({eligible.length})</h2>
        </div>
        {eligible.length === 0 ? (
          <div class="p-6 bg-white rounded-2xl border border-dashed border-gray-300 text-center text-sm text-gray-500">
            No exact matches found. Check the "May Be Eligible" section below!
          </div>
        ) : (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eligible.map(s => <SchemeCard key={s.id} scheme={s} evaluation={s.evaluation} />)}
          </div>
        )}
      </section>

      {maybe.length > 0 && (
        <section class="space-y-4 pt-4 border-t border-gray-200">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-amber-500"></span>
            <div>
              <h2 class="text-xl font-bold text-gray-900">{t('results.maybe', {}, lang)} ({maybe.length})</h2>
              <p class="text-xs text-gray-500">Criteria are partially matched or some questions were skipped.</p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {maybe.map(s => <SchemeCard key={s.id} scheme={s} evaluation={s.evaluation} />)}
          </div>
        </section>
      )}

      {notEligible.length > 0 && (
        <section class="pt-6 border-t border-gray-200">
          <button
            onClick={() => setShowNotEligible(!showNotEligible)}
            class="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-2xl font-bold text-sm text-gray-700 flex items-center justify-between transition-colors"
          >
            <span>{showNotEligible ? 'Hide' : t('results.show_not_eligible', {}, lang)} ({notEligible.length})</span>
            <span class="text-xs text-gray-500">{showNotEligible ? '▲' : '▼'}</span>
          </button>
          {showNotEligible && (
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {notEligible.map(s => <SchemeCard key={s.id} scheme={s} evaluation={s.evaluation} />)}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
