import { useState } from 'preact/hooks';
import { language } from '../store/profile.js';
import { t } from '../utils/i18n.js';
import { isSpeechRecognitionSupported, startVoiceInput, stopVoiceInput } from '../utils/speech.js';
import { sanitizeSearchInput } from '../utils/security.js';

export default function SearchBar({ value, onChange, placeholder }) {
  const [listening, setListening] = useState(false);

  const toggleVoice = () => {
    if (listening) { stopVoiceInput(); setListening(false); return; }
    setListening(true);
    startVoiceInput({
      lang: language.value,
      onResult: (text) => { setListening(false); onChange(sanitizeSearchInput(text)); },
      onError: () => setListening(false),
      onEnd: () => setListening(false)
    });
  };

  const defaultPlaceholder = t('browse.search_placeholder', {}, language.value);

  return (
    <div class="relative w-full max-w-2xl mx-auto" role="search">
      <div class="relative flex items-center">
        <div class="absolute left-4 pointer-events-none text-gray-400" aria-hidden="true">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          id="scheme-search-input"
          type="search"
          value={value}
          onInput={(e) => onChange(sanitizeSearchInput(e.target.value))}
          placeholder={placeholder || defaultPlaceholder}
          aria-label={placeholder || defaultPlaceholder}
          class="w-full pl-12 pr-24 py-3.5 bg-white border border-gray-300 rounded-2xl text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-transparent transition-all"
        />
        <div class="absolute right-3 flex items-center gap-1.5">
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              aria-label="Clear search input"
              class="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-[#FF9933]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {isSpeechRecognitionSupported() && (
            <button
              type="button"
              onClick={toggleVoice}
              title={listening ? "Stop voice search" : "Voice Search"}
              aria-label={listening ? "Stop voice recognition" : "Voice search"}
              aria-pressed={listening}
              class={`p-2 rounded-xl transition-all focus:ring-2 focus:ring-[#FF9933] ${
                listening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-[#FF9933] hover:bg-orange-50'
              }`}
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
