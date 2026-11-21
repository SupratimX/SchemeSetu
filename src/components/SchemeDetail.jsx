import { useState } from 'preact/hooks';
import { language, isSchemeSaved, toggleSaveScheme, checkedDocuments, toggleDocumentCheck } from '../store/profile.js';
import { t } from '../utils/i18n.js';
import { explainReason } from '../engine/explain.js';
import { printChecklist } from '../utils/pdf.js';
import { sanitizeUrl } from '../utils/security.js';

export default function SchemeDetail({ scheme, evaluation, documentsMeta = {} }) {
  const [feedbackGiven, setFeedbackGiven] = useState(null);
  const lang = language.value;
  const saved = isSchemeSaved(scheme.id);
  const checkedDocs = checkedDocuments.value;

  const name = scheme.name?.[lang] || scheme.name?.en || scheme.id;
  const summary = scheme.summary?.[lang] || scheme.summary?.en || '';
  const benefit = scheme.benefit?.amount || scheme.benefit?.type || '';
  const deadline = scheme.deadline || 'Open Year-Round (Rolling)';

  const isOutdated = scheme.lastVerified && ((new Date() - new Date(scheme.lastVerified)) / 86400000) > 180;

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) navigator.share({ title: name, text: summary, url }).catch(() => {});
    else { navigator.clipboard.writeText(url); alert(t('common.copied', {}, lang)); }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`*${name}*\n${summary}\n\nCheck your eligibility on SchemeSetu: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleFeedback = (type) => {
    setFeedbackGiven(type);
    try {
      const stored = JSON.parse(localStorage.getItem('schemesetu_feedback') || '{}');
      stored[scheme.id] = type;
      localStorage.setItem('schemesetu_feedback', JSON.stringify(stored));
    } catch {
      // storage unavailable
    }
  };

  const reportUrl = `https://github.com/SupratimX/SchemeSetu/issues/new?title=Data+Correction:+${encodeURIComponent(scheme.id)}&body=${encodeURIComponent(
    `Scheme: ${name} (ID: ${scheme.id})\nDescription of issue / correction:\n`
  )}`;

  return (
    <div class="bg-white rounded-3xl border border-gray-200/90 shadow-md p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
      <div>
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-3 py-1 text-xs font-bold rounded-full bg-orange-100 text-[#FF9933]">
              {scheme.level === 'central' ? 'Central Government Scheme' : `State Government Scheme (${scheme.state})`}
            </span>
            {isOutdated && (
              <span class="px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                {t('scheme.outdated_warning', {}, lang)}
              </span>
            )}
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleSaveScheme(scheme.id)}
              aria-label={saved ? `Remove ${name} from saved` : `Save ${name} for offline review`}
              aria-pressed={saved}
              class={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors focus:ring-2 focus:ring-[#FF9933] ${
                saved ? 'bg-orange-50 text-[#FF9933] border-orange-200' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg class="w-4 h-4" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {saved ? t('scheme.unsave', {}, lang) : t('scheme.save', {}, lang)}
            </button>
            <button
              type="button"
              onClick={handleShare}
              aria-label={`Share ${name}`}
              class="px-3 py-1.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 flex items-center gap-1.5 focus:ring-2 focus:ring-[#FF9933]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {t('scheme.share', {}, lang)}
            </button>
            <button
              type="button"
              onClick={handleWhatsAppShare}
              aria-label={`Share ${name} on WhatsApp`}
              class="px-3 py-1.5 rounded-xl border border-green-300 bg-green-50 text-green-800 text-xs font-semibold hover:bg-green-100 flex items-center gap-1.5 focus:ring-2 focus:ring-green-500"
            >
              <span>💬 WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={() => printChecklist({ schemes: [scheme], documents: documentsMeta, lang })}
              aria-label={`Print document checklist for ${name}`}
              class="px-3 py-1.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 flex items-center gap-1.5 focus:ring-2 focus:ring-[#FF9933]"
            >
              <span aria-hidden="true">🖨️</span> {t('common.print', {}, lang)}
            </button>
          </div>
        </div>

        <h1 class="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-3">{name}</h1>
        <p class="text-base text-gray-600 leading-relaxed">{summary}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gradient-to-br from-orange-50/80 to-amber-50/50 rounded-2xl border border-orange-100 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-[#FF9933] mb-2 flex items-center gap-1.5">
              <span aria-hidden="true">🎁</span> {t('scheme.benefits', {}, lang)}
            </h3>
            <div class="text-lg sm:text-xl font-black text-gray-900 mb-1">{benefit}</div>
          </div>
          {scheme.benefit?.frequency && <p class="text-xs text-gray-600 font-medium mt-2"><strong>Frequency:</strong> {scheme.benefit.frequency}</p>}
        </div>

        <div class="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 rounded-2xl border border-blue-100 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-1.5">
              <span aria-hidden="true">⏳</span> Last Date to Apply / Application Window
            </h3>
            <div class="text-lg sm:text-xl font-black text-gray-900 mb-1">{deadline}</div>
          </div>
          <p class="text-xs text-gray-600 mt-2">
            {scheme.deadlineType === 'rolling'
              ? '✅ Applications accepted on a continuous rolling basis throughout the financial year.'
              : '⚠️ Time-sensitive application window. Please verify cutoffs before applying.'}
          </p>
        </div>
      </div>

      {evaluation && evaluation.reasons && (
        <div class="space-y-3">
          <h3 class="text-base font-bold text-gray-900 flex items-center gap-2">
            <span aria-hidden="true">📋</span> {t('scheme.eligibility', {}, lang)}
          </h3>
          <div class="bg-gray-50 rounded-2xl border border-gray-200 divide-y divide-gray-200">
            {evaluation.reasons.map((r, i) => {
              const passed = r.type.startsWith('qualifier');
              const unknown = r.type === 'unknown' || r.result === null;
              return (
                <div key={i} class="p-3.5 flex items-center justify-between gap-3 text-sm">
                  <div class="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      class={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        passed ? 'bg-emerald-100 text-emerald-700' : (unknown ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700')
                      }`}
                    >
                      {passed ? '✓' : (unknown ? '?' : '✗')}
                    </span>
                    <span class="text-gray-800 font-medium">{explainReason(r, lang)}</span>
                  </div>
                  <span class="text-xs text-gray-500 uppercase font-semibold">{passed ? 'Matched' : (unknown ? 'To Confirm' : 'Unmatched')}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {Array.isArray(scheme.documents) && scheme.documents.length > 0 && (
        <div class="space-y-3">
          <h3 class="text-base font-bold text-gray-900 flex items-center gap-2">
            <span aria-hidden="true">📑</span> {t('scheme.documents', {}, lang)} ({scheme.documents.length})
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {scheme.documents.map(docId => {
              const docMeta = documentsMeta[docId] || {};
              const docName = docMeta[lang] || docMeta.en || docId;
              const howTo = docMeta.howToGet?.[lang] || docMeta.howToGet?.en || '';
              const isChecked = !!checkedDocs[docId];

              return (
                <div
                  key={docId}
                  role="checkbox"
                  aria-checked={isChecked}
                  tabIndex={0}
                  onClick={() => toggleDocumentCheck(docId)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDocumentCheck(docId); } }}
                  class={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all focus:ring-2 focus:ring-[#FF9933] ${
                    isChecked ? 'bg-emerald-50/70 border-emerald-300' : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                    tabIndex={-1}
                    aria-hidden="true"
                    class="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer pointer-events-none"
                  />
                  <div>
                    <div class="font-bold text-sm text-gray-900">{docName}</div>
                    {howTo && <div class="text-xs text-gray-500 mt-0.5">{howTo}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {Array.isArray(scheme.howToApply) && scheme.howToApply.length > 0 && (
        <div class="space-y-3">
          <h3 class="text-base font-bold text-gray-900 flex items-center gap-2">
            <span aria-hidden="true">🚀</span> {t('scheme.how_to_apply', {}, lang)}
          </h3>
          <div class="space-y-2.5">
            {scheme.howToApply.map((item, idx) => (
              <div key={idx} class="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <span class="w-6 h-6 rounded-full bg-[#FF9933] text-white flex items-center justify-center font-bold text-xs flex-shrink-0" aria-hidden="true">
                  {item.step || idx + 1}
                </span>
                <p class="text-sm text-gray-800 leading-snug">{item.text?.[lang] || item.text?.en || item.step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div class="pt-6 border-t border-gray-200 space-y-4">
        <h4 class="text-xs font-bold uppercase tracking-wider text-gray-500">Official Application Portals & Guidance</h4>
        <div class="flex flex-col sm:flex-row items-stretch gap-3">
          {scheme.links?.official && (
            <a
              href={sanitizeUrl(scheme.links.official)}
              target="_blank"
              rel="noopener noreferrer"
              class="flex-1 px-5 py-3.5 bg-[#138808] hover:bg-[#0f6b06] text-white text-center font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-black"
            >
              <span>🌐 Apply on Official Ministry Portal</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          {scheme.links?.myscheme && (
            <a
              href={sanitizeUrl(scheme.links.myscheme)}
              target="_blank"
              rel="noopener noreferrer"
              class="flex-1 px-5 py-3.5 bg-gray-900 hover:bg-gray-800 text-white text-center font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-black"
            >
              <span>🏛️ National myScheme Portal</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>

        {scheme.links?.helpline && (
          <div class="flex items-center justify-center pt-2">
            <a
              href={sanitizeUrl(`tel:${scheme.links.helpline}`, ['tel:'])}
              aria-label={`Official helpline: ${scheme.links.helpline}`}
              class="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-[#FF9933] font-semibold transition-colors focus:ring-2 focus:ring-[#FF9933] rounded px-2"
            >
              <span>📞 Official Helpline:</span>
              <span class="font-bold text-[#FF9933] underline">{scheme.links.helpline}</span>
            </a>
          </div>
        )}
      </div>

      {/* Result usefulness feedback widget (plan.md Section 2.7) */}
      <div class="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span class="font-semibold text-gray-700">Was this scheme information helpful?</span>
        <div class="flex items-center gap-2">
          {feedbackGiven ? (
            <span class="text-emerald-700 font-bold">Thank you for your feedback! ✓</span>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleFeedback('yes')}
                aria-label="Yes, this information was helpful"
                class="px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold text-gray-700 transition-colors focus:ring-2 focus:ring-[#FF9933]"
              >
                👍 Yes
              </button>
              <button
                type="button"
                onClick={() => handleFeedback('no')}
                aria-label="No, this information was not helpful"
                class="px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold text-gray-700 transition-colors focus:ring-2 focus:ring-[#FF9933]"
              >
                👎 No
              </button>
            </>
          )}
        </div>
      </div>

      <div class="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
        <div>
          {t('scheme.verified_on', {}, lang)}: <strong class="text-gray-700">{scheme.lastVerified || 'Recent'}</strong> {t('scheme.by', {}, lang)} <span class="text-gray-700">{scheme.verifiedBy || 'Maintainers'}</span>
        </div>
        <a
          href={reportUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="text-amber-600 hover:underline font-semibold focus:ring-2 focus:ring-amber-500 rounded px-1"
        >
          🚩 {t('scheme.report', {}, lang)}
        </a>
      </div>
    </div>
  );
}
