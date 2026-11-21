// speech.js - Web Speech API for voice input and speech synthesis
export const isSpeechRecognitionSupported = () => typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
export const isSpeechSynthesisSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

let activeRec = null;

export function startVoiceInput({ lang = 'en-IN', onResult, onError, onEnd }) {
  if (!isSpeechRecognitionSupported()) {
    if (onError) onError('Speech recognition is not supported in this browser.');
    return null;
  }

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  activeRec = new SpeechRec();
  activeRec.lang = lang === 'hi' ? 'hi-IN' : lang === 'as' ? 'as-IN' : 'en-IN';
  activeRec.continuous = false;
  activeRec.interimResults = false;

  activeRec.onresult = (e) => { if (e.results?.[0]?.[0] && onResult) onResult(e.results[0][0].transcript); };
  activeRec.onerror = (e) => { if (onError) onError(e); };
  activeRec.onend = () => { activeRec = null; if (onEnd) onEnd(); };

  try { activeRec.start(); } catch (e) { if (onError) onError(e); }
  return activeRec;
}

export function stopVoiceInput() {
  if (activeRec) {
    try { activeRec.stop(); } catch {}
    activeRec = null;
  }
}

export function speakText(text, lang = 'en') {
  if (!isSpeechSynthesisSupported()) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'hi' ? 'hi-IN' : lang === 'as' ? 'as-IN' : 'en-IN';
    window.speechSynthesis.speak(u);
  } catch (e) {
    console.error('Speech error:', e);
  }
}
