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

export default function Browse() {
  const lang = language.value;
  const allSchemes = useMemo(() => [...centralSchemes, ...assamSchemes], []);

  // Parse URL query parameters if present (e.g. #/browse?category=agriculture)
  const getInitialCategory = () => {
    const hash = window.location.hash;
    const match = hash.match(/category=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : 'all';
  };

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    level: 'all',
    category: getInitialCategory(),
    deadlineType: 'all',
    sort: 'relevance'
  });

  // Build search index once
  useEffect(() => {
    buildSearchIndex(allSchemes);
  }, [allSchemes]);

  // Update category when hash changes
  useEffect(() => {
    const handleHash = () => {
      const cat = getInitialCategory();
      if (cat !== filters.category) {
        setFilters(f => ({ ...f, category: cat }));
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Perform search & filter
  const filteredSchemes = useMemo(() => {
    const matchedIds = searchSchemes(query);

    return allSchemes.filter(s => {
      // 1. Search text filter
      if (matchedIds !== null && !matchedIds.has(s.id)) {
        return false;
      }

      // 2. Level filter
      if (filters.level !== 'all') {
        if (filters.level === 'central' && s.level !== 'central') return false;
        if (filters.level === 'state' && s.level === 'central') return false;
      }

      // 3. Category filter
      if (filters.category !== 'all') {
        const cats = Array.isArray(s.category) ? s.category : [s.category];
        if (!cats.includes(filters.category)) return false;
      }

      // 4. Deadline filter
      if (filters.deadlineType && filters.deadlineType !== 'all') {
        if (filters.deadlineType === 'rolling') {
          if (s.deadlineType !== 'rolling') return false;
        } else if (filters.deadlineType === 'timebound') {
          if (s.deadlineType === 'rolling') return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sort === 'newest') {
        return (b.lastVerified || '').localeCompare(a.lastVerified || '');
      }
      return 0;
    });
  }, [allSchemes, query, filters]);

  return (
    <div class="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Top Banner & Search */}
      <div class="text-center space-y-4">
        <h1 class="text-3xl font-black text-gray-900">
          {t('browse.title', {}, lang)}
        </h1>
        <p class="text-sm text-gray-600 max-w-lg mx-auto">
          Explore all Central and State welfare programs. Filter by category, application deadline, or search by keyword.
        </p>

        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={t('browse.search_placeholder', {}, lang)}
        />
      </div>

      {/* Main Grid: Filters Sidebar + Scheme Cards */}
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div class="md:col-span-1">
          <Filters
            filters={filters}
            onChange={setFilters}
            onReset={() => {
              setQuery('');
              setFilters({ level: 'all', category: 'all', deadlineType: 'all', sort: 'relevance' });
            }}
          />
        </div>

        {/* Results Stream */}
        <div class="md:col-span-3 space-y-4">
          <div class="flex items-center justify-between text-xs font-semibold text-gray-500">
            <span>{t('browse.results_count', { count: filteredSchemes.length }, lang)}</span>
            <div class="flex items-center gap-2">
              {filters.deadlineType !== 'all' && (
                <span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px]">
                  Window: {filters.deadlineType === 'rolling' ? 'Open Year-Round' : 'Time-Bound'}
                </span>
              )}
              {filters.category !== 'all' && (
                <span class="px-2 py-0.5 rounded-full bg-orange-100 text-[#FF9933] text-[11px]">
                  #{filters.category}
                </span>
              )}
            </div>
          </div>

          {filteredSchemes.length === 0 ? (
            <div class="py-16 bg-white rounded-3xl border border-dashed border-gray-300 text-center space-y-3">
              <div class="text-4xl">🔍</div>
              <h3 class="text-base font-bold text-gray-800">No schemes match your criteria</h3>
              <p class="text-xs text-gray-500">Try clearing some filters or searching for broader terms.</p>
              <button
                onClick={() => {
                  setQuery('');
                  setFilters({ level: 'all', category: 'all', deadlineType: 'all', sort: 'relevance' });
                }}
                class="px-4 py-2 bg-gray-100 text-xs font-semibold text-gray-700 rounded-xl hover:bg-gray-200"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSchemes.map(s => {
                const evalResult = evaluateScheme(s, profile.value || {});
                return (
                  <SchemeCard
                    key={s.id}
                    scheme={s}
                    evaluation={evalResult}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
