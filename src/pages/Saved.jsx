import { useEffect } from 'preact/hooks';
import { savedSchemes, language, profile, toggleSaveScheme } from '../store/profile.js';
import { t } from '../utils/i18n.js';
import SchemeCard from '../components/SchemeCard.jsx';
import centralSchemes from '../data/schemes/central.json';
import assamSchemes from '../data/schemes/assam.json';
import documentsMeta from '../data/documents.json';
import { evaluateScheme } from '../engine/evaluate.js';
import { printChecklist } from '../utils/pdf.js';

const allSchemes = [...centralSchemes, ...assamSchemes];

export default function Saved() {
  const lang = language.value, savedIds = savedSchemes.value;

  // Support importing shared bookmarks via hash query (e.g. #/saved?ids=pm-kisan,orunodoi)
  useEffect(() => {
    const hash = window.location.hash || '';
    const match = hash.match(/ids=([a-zA-Z0-9_,-]+)/);
    if (match && match[1]) {
      const incomingIds = match[1].split(',');
      incomingIds.forEach(id => {
        if (id && !savedIds.has(id)) toggleSaveScheme(id);
      });
    }
  }, []);

  const savedList = allSchemes.filter(s => savedIds.has(s.id));

  const copyShareLink = () => {
    const ids = Array.from(savedIds).join(',');
    const url = `${window.location.origin}/#/saved?ids=${encodeURIComponent(ids)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert('Shareable bookmark link copied to clipboard!');
    }
  };

  return (
    <div class="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 class="text-3xl font-black text-gray-900">{t('saved.title', {}, lang)}</h1>
          <p class="text-sm text-gray-500 mt-1">{t('saved.count', { count: savedList.length }, lang)} bookmarked for offline review</p>
        </div>
        {savedList.length > 0 && (
          <div class="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={copyShareLink}
              class="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#FF9933]"
            >
              <span aria-hidden="true">🔗</span>
              <span>Share List</span>
            </button>
            <button
              type="button"
              onClick={() => printChecklist({ schemes: savedList, documents: documentsMeta, lang })}
              class="px-5 py-2.5 bg-[#FF9933] hover:bg-[#e67300] text-white text-sm font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#FF9933]"
            >
              <span aria-hidden="true">🖨️</span>
              <span>Print Combined Checklist</span>
            </button>
          </div>
        )}
      </div>

      {savedList.length === 0 ? (
        <div class="text-center py-20 bg-white rounded-3xl border border-gray-200 p-8 space-y-4">
          <div class="text-5xl" aria-hidden="true">🔖</div>
          <h3 class="text-lg font-bold text-gray-800">{t('saved.empty', {}, lang)}</h3>
          <p class="text-xs text-gray-500 max-w-md mx-auto">Tap the bookmark icon on any scheme card to save it here for fast reference.</p>
          <a href="#/browse" class="inline-block px-6 py-2.5 bg-gray-900 text-white font-semibold text-sm rounded-xl hover:bg-gray-800 focus:ring-2 focus:ring-black">
            {t('home.browse_btn', {}, lang)}
          </a>
        </div>
      ) : (
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedList.map(s => <SchemeCard key={s.id} scheme={s} evaluation={evaluateScheme(s, profile.value || {})} />)}
        </div>
      )}
    </div>
  );
}
