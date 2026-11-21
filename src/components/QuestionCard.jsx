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

  return (
    <div class="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 transition-all">
      <div class="flex items-start justify-between gap-4 mb-6">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">{qText}</h2>
        {isSpeechRecognitionSupported() && (
          <button
            type="button"
            onClick={handleVoice}
            title={listening ? 'Stop voice input' : 'Speak your answer'}
            class={`p-3 rounded-full flex-shrink-0 transition-colors ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-orange-50 text-[#FF9933] hover:bg-orange-100'}`}
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </button>
        )}
      </div>

      {listening && (
        <div class="mb-4 text-xs font-semibold text-red-500 flex items-center gap-2 animate-pulse">
          <span class="w-2 h-2 rounded-full bg-red-500"></span>
          {t('voice.listening', {}, lang)}
        </div>
      )}

      <div class="mb-8">
        {question.type === 'select' && (
          <select
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            class="w-full min-h-[52px] px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:bg-white transition-all cursor-pointer"
          >
            <option value="" disabled>-- {t('common.select', {}, lang)} --</option>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label?.[lang] || opt.label?.en || opt.value}</option>)}
          </select>
        )}

        {question.type === 'radio' && (
          <div class="space-y-3">
            {options.map(opt => {
              const sel = value === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => onChange(opt.value)}
                  class={`w-full text-left min-h-[52px] p-4 rounded-xl border flex items-center justify-between transition-all ${
                    sel ? 'border-[#FF9933] bg-orange-50/70 text-gray-900 ring-2 ring-[#FF9933]' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span class="font-medium text-sm sm:text-base">{opt.label?.[lang] || opt.label?.en || opt.value}</span>
                  <div class={`w-5 h-5 rounded-full border flex items-center justify-center ${sel ? 'border-[#FF9933]' : 'border-gray-300'}`}>
                    {sel && <div class="w-3 h-3 rounded-full bg-[#FF9933]"></div>}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {question.type === 'number' && (
          <div>
            <input
              type="number"
              min={question.min || 0}
              max={question.max || 120}
              value={value ?? ''}
              placeholder="e.g. 28"
              onInput={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
              class="w-full min-h-[52px] px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-lg font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:bg-white transition-all"
            />
            <p class="text-xs text-gray-500 mt-2">Enter age in complete years (1-120)</p>
          </div>
        )}

        {question.type === 'multiselect' && (
          <div class="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {options.map(opt => {
              const chk = Array.isArray(value) && value.includes(opt.value);
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => handleCheckbox(opt.value)}
                  class={`w-full text-left p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                    chk ? 'border-[#FF9933] bg-orange-50/60 ring-1 ring-[#FF9933]' : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <input type="checkbox" checked={chk} readOnly class="mt-1 w-4 h-4 rounded text-[#FF9933] focus:ring-[#FF9933] cursor-pointer" />
                  <span class="text-sm font-medium text-gray-800 leading-snug">{opt.label?.[lang] || opt.label?.en || opt.value}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div class="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
        <div>
          {!isFirst ? (
            <button type="button" onClick={onBack} class="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors">
              {t('quiz.back', {}, lang)}
            </button>
          ) : (
            <button type="button" onClick={onSkip} class="text-xs text-gray-500 hover:text-gray-800 underline">
              {t('quiz.skip', {}, lang)}
            </button>
          )}
        </div>

        <div class="flex items-center gap-2">
          {!isFirst && (
            <button type="button" onClick={onSkip} class="px-3 py-2 text-xs text-gray-500 hover:text-gray-800 font-medium transition-colors">
              {t('quiz.skip', {}, lang)}
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            class="px-6 py-2.5 bg-gradient-to-r from-[#FF9933] to-[#e67300] text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-[#e67300] hover:to-[#cc6600] active:scale-95 transition-all text-sm"
          >
            {isLast ? t('quiz.finish', {}, lang) : t('quiz.next', {}, lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
