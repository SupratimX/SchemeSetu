import { useMemo } from 'preact/hooks';
import { quizResults, savedSchemes } from '../store/profile.js';
import DocumentChecklist from '../components/DocumentChecklist.jsx';
import centralSchemes from '../data/schemes/central.json';
import assamSchemes from '../data/schemes/assam.json';
import documentsMeta from '../data/documents.json';

const allSchemes = [...centralSchemes, ...assamSchemes];

export default function DocumentChecklistPage() {
  const results = quizResults.value, savedIds = savedSchemes.value;

  const relevantSchemes = useMemo(() => {
    if (results && (results.eligible?.length > 0 || results.maybe?.length > 0)) {
      return [...(results.eligible || []), ...(results.maybe || [])];
    }
    if (savedIds && savedIds.size > 0) return allSchemes.filter(s => savedIds.has(s.id));
    return allSchemes.slice(0, 4);
  }, [results, savedIds]);

  return (
    <div class="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-6">
      <div class="mb-4">
        <button
          type="button"
          onClick={() => window.history.length > 1 ? window.history.back() : (window.location.hash = '#/results')}
          class="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#FF9933] transition-colors"
        >
          ← Back
        </button>
      </div>
      <DocumentChecklist schemes={relevantSchemes} allDocuments={documentsMeta} />
    </div>
  );
}
