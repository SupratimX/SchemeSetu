import { language, isSchemeSaved, toggleSaveScheme } from '../store/profile.js';
import { t } from '../utils/i18n.js';
import { explainReason } from '../engine/explain.js';

export default function SchemeCard({ scheme, evaluation, onCardClick }) {
  const lang = language.value;
  const saved = isSchemeSaved(scheme.id);

  const status = evaluation?.status || 'maybe';
  const name = scheme.name?.[lang] || scheme.name?.en || scheme.id;
  const summary = scheme.summary?.[lang] || scheme.summary?.en || '';
  const benefit = scheme.benefit?.amount || scheme.benefit?.type || '';
  const deadline = scheme.deadline || 'Open Year-Round';

  // Get up to 2 notable reason lines
  const topReasons = (evaluation?.reasons || [])
    .filter(r => r.type === 'disqualifier' || r.type === 'disqualifier_none' || r.type.startsWith('qualifier'))
    .slice(0, 2);

  const statusConfig = {
    eligible: {
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      label: t('scheme.eligible_badge', {}, lang),
      barColor: 'bg-emerald-500'
    },
    maybe: {
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      label: t('scheme.maybe_badge', {}, lang),
      barColor: 'bg-amber-500'
    },
    not_eligible: {
      badgeBg: 'bg-gray-100 text-gray-700 border-gray-200',
      label: t('scheme.not_eligible_badge', {}, lang),
      barColor: 'bg-rose-400'
    }
  };

  const currStatus = statusConfig[status] || statusConfig.maybe;

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/#/scheme/${scheme.id}`;
    if (navigator.share) {
      navigator.share({
        title: name,
        text: `Check out ${name} on SchemeSetu:`,
        url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert(t('common.copied', {}, lang));
    }
  };

  const handleSaveToggle = (e) => {
    e.stopPropagation();
    toggleSaveScheme(scheme.id);
  };

  return (
    <div
      onClick={() => onCardClick ? onCardClick(scheme) : window.location.hash = `#/scheme/${scheme.id}`}
      class="bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between"
    >
      <div class="p-5">
        {/* Top Badges */}
        <div class="flex items-center justify-between gap-2 mb-3">
          <div class="flex items-center gap-2 flex-wrap">
            <span class={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${currStatus.badgeBg}`}>
              {currStatus.label}
            </span>
            <span class="px-2 py-0.5 text-xs font-semibold rounded-md bg-gray-100 text-gray-600 uppercase tracking-wide">
              {scheme.level === 'central' ? 'Central' : (scheme.state || 'State')}
            </span>
          </div>

          {/* Action buttons */}
          <div class="flex items-center gap-1">
            <button
              onClick={handleShare}
              title="Share Scheme"
              class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <button
              onClick={handleSaveToggle}
              title={saved ? 'Remove from Saved' : 'Save Scheme'}
              class={`p-1.5 rounded-lg transition-colors ${saved ? 'text-[#FF9933] bg-orange-50' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
            >
              <svg class="w-4 h-4" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 class="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#FF9933] transition-colors leading-snug mb-1">
          {name}
        </h3>

        {/* Category chips */}
        <div class="flex flex-wrap gap-1 mb-2.5">
          {Array.isArray(scheme.category) && scheme.category.map(cat => (
            <span key={cat} class="text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
              #{cat}
            </span>
          ))}
        </div>

        {/* Benefit Highlight */}
        {benefit && (
          <div class="mb-2.5 px-3 py-1.5 rounded-xl bg-orange-50/70 border border-orange-100 inline-block text-xs font-bold text-[#FF9933]">
            🎁 {benefit}
          </div>
        )}

        {/* Last Date to Apply / Deadline Badge */}
        <div class="mb-3 flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200/80 px-2.5 py-1.5 rounded-xl">
          <span class="text-amber-600">⏳</span>
          <span class="text-gray-500 font-medium">Last Date:</span>
          <span class="text-gray-900 truncate">{deadline}</span>
        </div>

        {/* Summary */}
        <p class="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4">
          {summary}
        </p>

        {/* Top Rule Reasons */}
        {topReasons.length > 0 && (
          <div class="space-y-1 pt-2 border-t border-gray-100 text-xs">
            {topReasons.map((r, i) => (
              <div key={i} class="flex items-center gap-1.5 text-gray-600">
                <span class={r.type.startsWith('qualifier') ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>
                  {r.type.startsWith('qualifier') ? '✓' : '✗'}
                </span>
                <span class="truncate">{explainReason(r, lang)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer link */}
      <div class="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-500">
        <span>{scheme.applyOnline ? '🌐 ' + t('scheme.apply_online', {}, lang) : '🏢 ' + t('scheme.apply_offline', {}, lang)}</span>
        <span class="text-[#FF9933] font-semibold flex items-center gap-1">
          {t('common.read_more', {}, lang)} →
        </span>
      </div>
    </div>
  );
}
