import { useState, useMemo, useEffect } from 'preact/hooks';
import { language, profile } from '../store/profile.js';
import { t } from '../utils/i18n.js';
import SearchBar from '../components/SearchBar.jsx';
import Filters from '../components/Filters.jsx';
import SchemeCard from '../components/SchemeCard.jsx';
import centralSchemes from '../data/schemes/central.json';
import assamSchemes from '../data/schemes/assam.json';
import { buildSearchIndex, searchSchemes } from '../utils/search.js';
import { evaluateScheme } from '../engine/evaluate.js';

const allSchemes = [...centralSchemes, ...assamSchemes];

const getCat = () => {
  const match = window.location.hash.match(/category=([a-zA-Z0-9_-]+)/);
  return match ? match[1].toLowerCase() : 'all';
};

/**
 * Extracts a numeric benefit estimate for sorting.
 */
function extractNumericBenefit(scheme) {
  if (!scheme.benefit) return 0;
  const str = String(scheme.benefit.amount || '');
  const match = str.replace(/,/g, '').match(/(\d+)/);
  return match ? parseInt(match[0], 10) : 0;
}

export default function Browse() {
  const lang = language.value;
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ level: 'all', category: getCat(), deadlineType: 'all', sort: 'relevance' });

  useEffect(() => { buildSearchIndex(allSchemes); }, []);

  useEffect(() => {
    const onHash = () => {
      const c = getCat();
      setFilters(f => f.category !== c ? { ...f, category: c } : f);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const filtered = useMemo(() => {
    const matched = searchSchemes(query);
    return allSchemes.filter(s => {
      if (matched !== null && !matched.has(s.id)) return false;
      if (filters.level === 'central' && s.level !== 'central') return false;
      if (filters.level === 'state' && s.level === 'central') return false;
      if (filters.category !== 'all' && !(Array.isArray(s.category) ? s.category : [s.category]).includes(filters.category)) return false;
      if (filters.deadlineType === 'rolling' && s.deadlineType !== 'rolling') return false;
      if (filters.deadlineType === 'timebound' && s.deadlineType === 'rolling') return false;
      return true;
    }).sort((a, b) => {
      if (filters.sort === 'newest') {
        return (b.lastVerified || '').localeCompare(a.lastVerified || '');
      }
      if (filters.sort === 'benefit') {
        return extractNumericBenefit(b) - extractNumericBenefit(a);
      }
      return 0;
    });
  }, [query, filters]);

  const resetFilters = () => {
    setQuery('');
    setFilters({ level: 'all', category: 'all', deadlineType: 'all', sort: 'relevance' });
  };

  const resultsAnnouncement = t('browse.results_count', { count: filtered.length }, lang);

  return (
    <div class="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      <div class="text-center space-y-4">
        <h1 class="text-3xl font-black text-gray-900">{t('browse.title', {}, lang)}</h1>
        <p class="text-sm text-gray-600 max-w-lg mx-auto">
          Explore all Central and State welfare programs. Filter by category, application deadline, or search by keyword.
        </p>
        <SearchBar value={query} onChange={setQuery} placeholder={t('browse.search_placeholder', {}, lang)} />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="md:col-span-1">
          <Filters filters={filters} onChange={setFilters} onReset={resetFilters} />
        </div>

        <div class="md:col-span-3 space-y-4">
          <div class="flex items-center justify-between text-xs font-semibold text-gray-500">
            <span aria-live="polite" role="status">{resultsAnnouncement}</span>
            <div class="flex items-center gap-2">
              {filters.deadlineType !== 'all' && (
                <span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px]">
                  Window: {filters.deadlineType === 'rolling' ? 'Open Year-Round' : 'Time-Bound'}
                </span>
              )}
              {filters.category !== 'all' && (
                <span class="px-2 py-0.5 rounded-full bg-orange-100 text-[#FF9933] text-[11px]">#{filters.category}</span>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div class="py-16 bg-white rounded-3xl border border-dashed border-gray-300 text-center space-y-3">
              <div class="text-4xl" aria-hidden="true">🔍</div>
              <h3 class="text-base font-bold text-gray-800">No schemes match your criteria</h3>
              <p class="text-xs text-gray-500">Try clearing some filters or searching for broader terms.</p>
              <button
                type="button"
                onClick={resetFilters}
                class="px-4 py-2 bg-gray-100 text-xs font-semibold text-gray-700 rounded-xl hover:bg-gray-200 focus:ring-2 focus:ring-[#FF9933]"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(s => (
                <SchemeCard key={s.id} scheme={s} evaluation={evaluateScheme(s, profile.value || {})} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
