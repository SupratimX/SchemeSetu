import { language, checkedDocuments, toggleDocumentCheck } from '../store/profile.js';
import { t } from '../utils/i18n.js';
import { printChecklist } from '../utils/pdf.js';

export default function DocumentChecklist({ schemes = [], allDocuments = {} }) {
  const lang = language.value, checkedDocs = checkedDocuments.value;

  const docToSchemesMap = {};
  schemes.forEach(s => {
    if (Array.isArray(s.documents)) {
      s.documents.forEach(docId => {
        if (!docToSchemesMap[docId]) docToSchemesMap[docId] = [];
        docToSchemesMap[docId].push(s.name?.[lang] || s.name?.en || s.id);
      });
    }
  });

  const uniqueDocIds = Object.keys(docToSchemesMap);
  const total = uniqueDocIds.length;
  const readyCount = uniqueDocIds.filter(id => !!checkedDocs[id]).length;

  if (total === 0) {
    return (
      <div class="text-center py-12 bg-white rounded-3xl border border-gray-200 p-8">
        <div class="text-4xl mb-3">📄</div>
        <h3 class="text-lg font-bold text-gray-800 mb-1">No documents required</h3>
        <p class="text-sm text-gray-500">Find eligible schemes first to generate your master checklist.</p>
      </div>
    );
  }

  return (
    <div class="bg-white rounded-3xl border border-gray-200/90 shadow-md p-6 sm:p-8 space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{t('docs.title', {}, lang)}</h2>
          <p class="text-sm text-gray-600 mt-1">{t('docs.subtitle', { count: total }, lang)} ({schemes.length} schemes)</p>
        </div>
        <button
          onClick={() => printChecklist({ schemes, documents: allDocuments, lang })}
          class="px-5 py-2.5 bg-[#FF9933] hover:bg-[#e67300] text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2 text-sm self-start sm:self-auto"
        >
          <span>🖨️</span>
          <span>{t('docs.print', {}, lang)}</span>
        </button>
      </div>

      <div class="flex items-center justify-between bg-orange-50/60 border border-orange-100 rounded-2xl p-4">
        <div>
          <span class="text-xs font-semibold text-gray-600 uppercase">Documents Ready</span>
          <div class="text-xl font-black text-[#FF9933]">{readyCount} of {total} Prepared</div>
        </div>
        <div class="text-xs text-gray-500 max-w-[200px] text-right">{t('docs.tick_instruction', {}, lang)}</div>
      </div>

      <div class="space-y-3">
        {uniqueDocIds.map(docId => {
          const docMeta = allDocuments[docId] || {};
          const title = docMeta[lang] || docMeta.en || docId;
          const howTo = docMeta.howToGet?.[lang] || docMeta.howToGet?.en || '';
          const needed = docToSchemesMap[docId] || [];
          const checked = !!checkedDocs[docId];

          return (
            <div
              key={docId}
              onClick={() => toggleDocumentCheck(docId)}
              class={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                checked ? 'bg-emerald-50/60 border-emerald-300 shadow-sm' : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input type="checkbox" checked={checked} readOnly class="mt-1 w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h4 class={`font-bold text-base ${checked ? 'text-emerald-900 line-through' : 'text-gray-900'}`}>{title}</h4>
                  {checked && <span class="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Ready ✓</span>}
                </div>
                {howTo && <p class="text-xs text-gray-600 mt-1"><strong>{t('docs.how_to_get', {}, lang)}</strong> {howTo}</p>}
                <div class="text-xs text-gray-500 mt-1.5 flex flex-wrap gap-1 items-center">
                  <span class="font-medium text-gray-700">{t('docs.needed_for', {}, lang)}</span>
                  {needed.map((name, i) => (
                    <span key={i} class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[11px]">{name}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
