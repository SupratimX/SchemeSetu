import { language } from '../store/profile.js';
import { t } from '../utils/i18n.js';

export default function ProgressBar({ current, total }) {
  const pct = Math.min(100, Math.round((current / total) * 100));

  return (
    <div class="w-full max-w-xl mx-auto mb-6">
      <div class="flex justify-between items-center text-xs font-semibold text-gray-600 mb-1.5">
        <span>{t('quiz.progress', { current, total }, language.value)}</span>
        <span class="text-[#FF9933] font-bold">{pct}%</span>
      </div>
      <div class="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={current} aria-valuemin="1" aria-valuemax={total}>
        <div class="h-full bg-gradient-to-r from-[#FF9933] to-[#e67300] transition-all duration-300 rounded-full" style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
}
