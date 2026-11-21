import { useMemo } from 'preact/hooks';
import { profile } from '../store/profile.js';
import SchemeDetail from '../components/SchemeDetail.jsx';
import centralSchemes from '../data/schemes/central.json';
import assamSchemes from '../data/schemes/assam.json';
import documentsMeta from '../data/documents.json';
import { evaluateScheme } from '../engine/evaluate.js';

export default function SchemeDetailPage({ id }) {
  const allSchemes = useMemo(() => [...centralSchemes, ...assamSchemes], []);
  const scheme = allSchemes.find(s => s.id === id);

  if (!scheme) {
    return (
      <div class="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <div class="text-5xl">🔍</div>
        <h2 class="text-2xl font-bold text-gray-900">Scheme not found</h2>
        <p class="text-sm text-gray-500">The scheme with ID "{id}" could not be located.</p>
        <a href="#/browse" class="inline-block mt-4 px-6 py-2.5 bg-[#FF9933] text-white font-semibold rounded-xl">
          Browse Schemes
        </a>
      </div>
    );
  }

  // Re-evaluate against the current profile answers
  const evaluation = evaluateScheme(scheme, profile.value || {});

  return (
    <div class="py-8 px-4 sm:px-6">
      <div class="max-w-4xl mx-auto mb-4">
        <a
          href="javascript:history.back()"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#FF9933] transition-colors"
        >
          ← Back
        </a>
      </div>

      <SchemeDetail
        scheme={scheme}
        evaluation={evaluation}
        documentsMeta={documentsMeta}
      />
    </div>
  );
}
