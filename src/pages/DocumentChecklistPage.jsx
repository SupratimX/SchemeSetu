import { useMemo } from 'preact/hooks';
import { quizResults, savedSchemes } from '../store/profile.js';
import DocumentChecklist from '../components/DocumentChecklist.jsx';
import centralSchemes from '../data/schemes/central.json';
import assamSchemes from '../data/schemes/assam.json';
import documentsMeta from '../data/documents.json';

export default function DocumentChecklistPage() {
  const allSchemes = useMemo(() => [...centralSchemes, ...assamSchemes], []);

  // Determine which schemes to include:
  // Prefer eligible/maybe from quiz results; if none, check saved schemes; if still none, show popular schemes
  const results = quizResults.value;
  const savedIds = savedSchemes.value;

  const relevantSchemes = useMemo(() => {
    if (results && (results.eligible?.length > 0 || results.maybe?.length > 0)) {
      return [...(results.eligible || []), ...(results.maybe || [])];
    }
    if (savedIds && savedIds.size > 0) {
      return allSchemes.filter(s => savedIds.has(s.id));
    }
    // Default to first 4 central schemes
    return allSchemes.slice(0, 4);
  }, [results, savedIds, allSchemes]);

  return (
    <div class="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-6">
      <div class="mb-4">
        <a
          href="javascript:history.back()"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#FF9933] transition-colors"
        >
          ← Back
        </a>
      </div>

      <DocumentChecklist
        schemes={relevantSchemes}
        allDocuments={documentsMeta}
      />
    </div>
  );
}
