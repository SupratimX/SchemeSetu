import { useState } from 'preact/hooks';
import { language } from '../store/profile.js';
import { t } from '../utils/i18n.js';
import { isSpeechRecognitionSupported, startVoiceInput, stopVoiceInput } from '../utils/speech.js';

export default function QuestionCard({ question, value, onChange, onSkip, onNext, onBack, isFirst, isLast }) {
  const [listening, setListening] = useState(false);
  const lang = language.value;
  const qText = question.question?.[lang] || question.question?.en || '';
  const options = question.options || [];

  const handleVoice = () => {
    if (listening) { stopVoiceInput(); setListening(false); return; }
    setListening(true);
    startVoiceInput({
      lang,
      onResult: (text) => {
        setListening(false);
        if (question.type === 'number') {
          const m = text.match(/\d+/);
          if (m) onChange(Number(m[0]));
        } else if (question.type === 'select' || question.type === 'radio') {
          const opt = options.find(o => {
            const l = (o.label?.[lang] || o.label?.en || o.value).toLowerCase();
            return text.toLowerCase().includes(l) || l.includes(text.toLowerCase());
          });
          if (opt) onChange(opt.value);
        }
      },
      onError: () => setListening(false),
      onEnd: () => setListening(false)
    });
  };

  const handleCheckbox = (val) => {
    const list = Array.isArray(value) ? [...value] : [];
    if (val === 'none') { onChange(['none']); return; }
    const filtered = list.filter(v => v !== 'none');
    onChange(filtered.includes(val) ? filtered.filter(v => v !== val) : [...filtered, val]);
  };

  const titleId = `q-title-${question.id}`;

  return (
    <div class="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 transition-all">
      <div class="flex items-start justify-between gap-4 mb-6">
        <h2 id={titleId} class="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">{qText}</h2>
        {isSpeechRecognitionSupported() && (
          <button
            type="button"
            onClick={handleVoice}
            title={listening ? 'Stop voice input' : 'Speak your answer'}
            aria-label={listening ? 'Stop listening' : `Speak your answer for ${qText}`}
            aria-pressed={listening}
            class={`p-3 rounded-full flex-shrink-0 transition-colors focus:ring-2 focus:ring-[#FF9933] ${
              listening ? 'bg-red-500 text-white animate-pulse' : 'bg-orange-50 text-[#FF9933] hover:bg-orange-100'
            }`}
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        )}
      </div>

      {listening && (
        <div class="mb-4 text-xs font-semibold text-red-500 flex items-center gap-2 animate-pulse" role="status" aria-live="polite">
          <span class="w-2 h-2 rounded-full bg-red-500" aria-hidden="true"></span>
          {t('voice.listening', {}, lang)}
        </div>
      )}

      <div class="mb-8">
        {question.type === 'select' && (
          <select
            id={`q-select-${question.id}`}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            aria-label={qText}
            class="w-full min-h-[52px] px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:bg-white transition-all cursor-pointer"
          >
            <option value="" disabled>-- {t('common.select', {}, lang)} --</option>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label?.[lang] || opt.label?.en || opt.value}</option>)}
          </select>
        )}

        {question.type === 'radio' && (
          <div role="radiogroup" aria-labelledby={titleId} class="space-y-3">
            {options.map(opt => {
              const sel = value === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  role="radio"
                  aria-checked={sel}
                  onClick={() => onChange(opt.value)}
                  class={`w-full text-left min-h-[52px] p-4 rounded-xl border flex items-center justify-between transition-all focus:ring-2 focus:ring-[#FF9933] ${
                    sel ? 'border-[#FF9933] bg-orange-50/70 text-gray-900 ring-2 ring-[#FF9933]' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span class="font-medium text-sm sm:text-base">{opt.label?.[lang] || opt.label?.en || opt.value}</span>
                  <div class={`w-5 h-5 rounded-full border flex items-center justify-center ${sel ? 'border-[#FF9933]' : 'border-gray-300'}`} aria-hidden="true">
                    {sel && <div class="w-3 h-3 rounded-full bg-[#FF9933]"></div>}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {question.type === 'number' && (
          <div class="space-y-2">
            <input
              id={`q-num-${question.id}`}
              type="number"
              min={question.min ?? 1}
              max={question.max ?? 120}
              value={value ?? ''}
              onInput={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 28"
              aria-label={qText}
              class="w-full min-h-[52px] px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:bg-white transition-all"
            />
            <p class="text-xs text-gray-500">Allowed range: {question.min ?? 1} to {question.max ?? 120} years</p>
          </div>
        )}

        {question.type === 'multiselect' && (
          <div role="group" aria-labelledby={titleId} class="space-y-2.5">
            {options.map(opt => {
              const list = Array.isArray(value) ? value : [];
              const checked = list.includes(opt.value);
              return (
                <button
                  type="button"
                  key={opt.value}
                  role="checkbox"
                  aria-checked={checked}
                  onClick={() => handleCheckbox(opt.value)}
                  class={`w-full text-left min-h-[48px] p-3.5 rounded-xl border flex items-start gap-3 transition-all focus:ring-2 focus:ring-[#FF9933] ${
                    checked ? 'border-emerald-500 bg-emerald-50/70 text-gray-900' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div class={`w-5 h-5 mt-0.5 rounded border flex items-center justify-center flex-shrink-0 ${checked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300'}`} aria-hidden="true">
                    {checked && (
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span class="text-sm font-medium leading-snug">{opt.label?.[lang] || opt.label?.en || opt.value}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div class="flex items-center justify-between gap-3 pt-6 border-t border-gray-100">
        <div>
          {!isFirst && (
            <button
              type="button"
              onClick={onBack}
              class="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors focus:ring-2 focus:ring-gray-300"
            >
              ← {t('common.back', {}, lang)}
            </button>
          )}
        </div>
        <div class="flex items-center gap-2">
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              class="px-4 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors focus:ring-2 focus:ring-gray-300"
            >
              {t('common.skip', {}, lang)}
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            class="px-6 py-2.5 bg-[#FF9933] hover:bg-[#e67300] text-white text-sm font-bold rounded-xl shadow transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#FF9933]"
          >
            {isLast ? t('common.submit', {}, lang) : t('common.next', {}, lang) + ' →'}
          </button>
        </div>
      </div>
    </div>
  );
}
