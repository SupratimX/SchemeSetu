import { useState } from 'preact/hooks';
import { language, fontSize, highContrast, setLanguage, setFontSize, toggleHighContrast } from '../store/profile.js';
import { t } from '../utils/i18n.js';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const lang = language.value;
  const fs = fontSize.value;
  const hc = highContrast.value;

  const cycleFontSize = () => {
    if (fs === 'normal') setFontSize('large');
    else if (fs === 'large') setFontSize('x-large');
    else setFontSize('normal');
  };

  const navLinks = [
    { href: '#/', label: t('nav.home', {}, lang) },
    { href: '#/browse', label: t('nav.browse', {}, lang) },
    { href: '#/checklist', label: t('nav.checklist', {}, lang) },
    { href: '#/saved', label: t('nav.saved', {}, lang) },
    { href: '#/about', label: t('nav.about', {}, lang) },
  ];

  return (
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm transition-colors">
      {/* Tricolor top strip */}
      <div class="h-1 w-full flex">
        <div class="h-full w-1/3 bg-[#FF9933]"></div>
        <div class="h-full w-1/3 bg-white"></div>
        <div class="h-full w-1/3 bg-[#138808]"></div>
      </div>

      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <a href="#/" class="flex items-center gap-2 group text-decoration-none">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF9933] to-[#e67300] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            সে
          </div>
          <div>
            <span class="text-xl font-black tracking-tight text-gray-900 group-hover:text-[#FF9933] transition-colors">
              Scheme<span class="text-[#FF9933]">Setu</span>
            </span>
            <span class="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
              BETA
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav class="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              class="hover:text-[#FF9933] transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions: A11y & Lang */}
        <div class="flex items-center gap-2 sm:gap-3">
          {/* Font Size Toggle */}
          <button
            onClick={cycleFontSize}
            title="Text Size (A / A+ / A++)"
            class="px-2.5 py-1 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            A{fs === 'large' ? '+' : fs === 'x-large' ? '++' : ''}
          </button>

          {/* High Contrast / Dark Mode Toggle */}
          <button
            onClick={toggleHighContrast}
            title="Toggle Dark / High Contrast Mode"
            class={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
              hc ? 'bg-black text-white border-black' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            ◐
          </button>

          {/* Language Switcher */}
          <div class="flex rounded-lg border border-gray-300 overflow-hidden text-xs font-medium bg-gray-50">
            <button
              onClick={() => setLanguage('en')}
              class={`px-2 py-1 transition-colors ${lang === 'en' ? 'bg-[#FF9933] text-white font-bold' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              class={`px-2 py-1 transition-colors ${lang === 'hi' ? 'bg-[#FF9933] text-white font-bold' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              हिं
            </button>
            <button
              onClick={() => setLanguage('as')}
              class={`px-2 py-1 transition-colors ${lang === 'as' ? 'bg-[#FF9933] text-white font-bold' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              অস
            </button>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            class="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div class="md:hidden bg-white border-b border-gray-200 px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              class="block py-2 px-3 rounded-lg text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-[#FF9933] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
