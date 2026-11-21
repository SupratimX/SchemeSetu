import { useState } from 'preact/hooks';
import { language, fontSize, highContrast, setLanguage, setFontSize, toggleHighContrast } from '../store/profile.js';
import { t } from '../utils/i18n.js';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const lang = language.value;
  const fs = fontSize.value;
  const hc = highContrast.value;

  // Local IP on network (dynamically fallback if on localhost)
  const networkIp = '10.162.43.45';
  const mobileUrl = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? `${window.location.protocol}//${window.location.host}`
    : `http://${networkIp}:5173`;

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
    { href: '#/about', label: t('nav.about', {}, lang) }
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              class="hover:text-[#FF9933] transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions: Mobile Connect, A11y & Lang */}
        <div class="flex items-center gap-2 sm:gap-3">
          {/* Mobile QR & Link Button */}
          <button
            onClick={() => setQrModalOpen(true)}
            title="Open on Mobile / Scan QR"
            class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-orange-50 border border-orange-200 text-[#FF9933] hover:bg-orange-100 transition-colors flex items-center gap-1"
          >
            <span>📱</span>
            <span class="hidden sm:inline">Mobile</span>
          </button>

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
            class={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${hc ? 'bg-black text-white border-black' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
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
          {navLinks.map(link => (
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

      {/* Mobile Connect & QR Code Modal */}
      {qrModalOpen && (
        <div
          class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setQrModalOpen(false)}
        >
          <div
            class="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div class="w-12 h-12 mx-auto rounded-2xl bg-orange-100 text-[#FF9933] flex items-center justify-center text-2xl font-bold">
              📱
            </div>

            <div>
              <h3 class="text-xl font-bold text-gray-900">Open on Your Phone</h3>
              <p class="text-xs text-gray-500 mt-1">
                Make sure your phone is connected to the same Wi-Fi network.
              </p>
            </div>

            {/* QR Code */}
            <div class="bg-gray-50 p-4 rounded-2xl border border-gray-200 inline-block mx-auto">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(mobileUrl)}`}
                alt="QR Code to open on mobile"
                class="w-44 h-44 rounded-xl mx-auto shadow-sm"
              />
            </div>

            {/* Direct URL Box */}
            <div class="bg-gray-100 p-3 rounded-xl flex items-center justify-between gap-2 text-xs font-mono">
              <span class="truncate text-gray-800 font-bold">{mobileUrl}</span>
              <button
                onClick={handleCopyLink}
                class="px-2.5 py-1 bg-[#FF9933] text-white rounded-lg font-sans font-bold text-[11px] hover:bg-[#e67300] transition-colors flex-shrink-0"
              >
                {copied ? 'Copied! ✓' : 'Copy'}
              </button>
            </div>

            <p class="text-[11px] text-gray-400">
              Point your phone's camera at the QR code, or open the link above in Chrome or Safari.
            </p>

            <button
              onClick={() => setQrModalOpen(false)}
              class="w-full py-2.5 bg-gray-900 text-white font-bold rounded-xl text-xs hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
