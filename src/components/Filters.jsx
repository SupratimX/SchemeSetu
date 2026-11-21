import { language } from '../store/profile.js';
import { t } from '../utils/i18n.js';

export default function Filters({ filters, onChange, onReset }) {
  const lang = language.value;

  const categories = [
    { id: 'all', label: t('browse.cat_all', {}, lang) },
    { id: 'agriculture', label: t('browse.cat_agriculture', {}, lang) },
    { id: 'education', label: t('browse.cat_education', {}, lang) },
    { id: 'health', label: t('browse.cat_health', {}, lang) },
    { id: 'housing', label: t('browse.cat_housing', {}, lang) },
    { id: 'employment', label: t('browse.cat_employment', {}, lang) },
    { id: 'women-child', label: t('browse.cat_women_child', {}, lang) },
    { id: 'pension', label: t('browse.cat_pension', {}, lang) },
    { id: 'skill', label: t('browse.cat_skill', {}, lang) },
    { id: 'insurance', label: 'Insurance' },
    { id: 'energy', label: 'Solar & Energy' }
  ];

  return (
    <div class="bg-white rounded-2xl border border-gray-200/80 p-5 space-y-5">
      <div class="flex items-center justify-between">
        <h3 class="font-bold text-gray-900 text-sm tracking-wide uppercase">
          {t('browse.filter_level', {}, lang)} & {t('browse.filter_category', {}, lang)}
        </h3>
        {onReset && (
          <button onClick={onReset} class="text-xs text-[#FF9933] font-semibold hover:underline">
            {t('browse.reset_filters', {}, lang)}
          </button>
        )}
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-2">{t('browse.filter_level', {}, lang)}</label>
        <div class="grid grid-cols-3 gap-2">
          {[
            { id: 'all', label: t('browse.level_all', {}, lang) },
            { id: 'central', label: t('browse.level_central', {}, lang) },
            { id: 'state', label: t('browse.level_state', {}, lang) }
          ].map(lvl => (
            <button
              key={lvl.id}
              onClick={() => onChange({ ...filters, level: lvl.id })}
              class={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                filters.level === lvl.id
                  ? 'bg-[#FF9933] text-white border-[#FF9933] shadow-sm'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-2">Application Window</label>
        <div class="grid grid-cols-1 gap-1.5">
          {[
            { id: 'all', label: 'All Schemes' },
            { id: 'rolling', label: '✅ Open Year-Round / Rolling' },
            { id: 'timebound', label: '⏳ Time-Bound / Annual Cycle' }
          ].map(d => (
            <button
              key={d.id}
              onClick={() => onChange({ ...filters, deadlineType: d.id })}
              class={`py-2 px-3 text-xs font-semibold rounded-xl text-left border transition-all ${
                (filters.deadlineType || 'all') === d.id
                  ? 'bg-orange-50 border-[#FF9933] text-[#FF9933] font-bold'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-2">{t('browse.filter_category', {}, lang)}</label>
        <div class="flex flex-wrap gap-1.5">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onChange({ ...filters, category: cat.id })}
              class={`py-1.5 px-3 text-xs font-medium rounded-full border transition-all ${
                filters.category === cat.id
                  ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-2">{t('browse.sort', {}, lang)}</label>
        <select
          value={filters.sort || 'relevance'}
          onChange={(e) => onChange({ ...filters, sort: e.target.value })}
          class="w-full text-xs font-medium px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#FF9933] cursor-pointer"
        >
          <option value="relevance">{t('browse.sort_relevance', {}, lang)}</option>
          <option value="newest">{t('browse.sort_newest', {}, lang)}</option>
          <option value="benefit">{t('browse.sort_benefit', {}, lang)}</option>
        </select>
      </div>
    </div>
  );
}
