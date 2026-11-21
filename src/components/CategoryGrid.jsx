import { language } from '../store/profile.js';
import { t } from '../utils/i18n.js';

export default function CategoryGrid({ onSelectCategory }) {
  const lang = language.value;
  const categories = [
    { id: 'agriculture', icon: '🌾', label: t('browse.cat_agriculture', {}, lang), color: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-900' },
    { id: 'education', icon: '📚', label: t('browse.cat_education', {}, lang), color: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-900' },
    { id: 'health', icon: '🏥', label: t('browse.cat_health', {}, lang), color: 'bg-red-50 hover:bg-red-100 border-red-200 text-red-900' },
    { id: 'housing', icon: '🏠', label: t('browse.cat_housing', {}, lang), color: 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900' },
    { id: 'employment', icon: '💼', label: t('browse.cat_employment', {}, lang), color: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-900' },
    { id: 'women-child', icon: '👩‍👧', label: t('browse.cat_women_child', {}, lang), color: 'bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-900' },
    { id: 'pension', icon: '👴', label: t('browse.cat_pension', {}, lang), color: 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-900' },
    { id: 'skill', icon: '🎓', label: t('browse.cat_skill', {}, lang), color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-900' }
  ];

  const handleClick = (id) => onSelectCategory ? onSelectCategory(id) : (window.location.hash = `#/browse?category=${id}`);

  return (
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {categories.map(c => (
        <button
          key={c.id}
          type="button"
          onClick={() => handleClick(c.id)}
          class={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-sm ${c.color}`}
        >
          <span class="text-3xl mb-2">{c.icon}</span>
          <span class="font-bold text-xs sm:text-sm leading-snug">{c.label}</span>
        </button>
      ))}
    </div>
  );
}
