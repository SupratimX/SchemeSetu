// speech.js - Web Speech API for voice input and speech synthesis with safe fallback

export function isSpeechRecognitionSupported() {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
}

export function isSpeechSynthesisSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

let activeRecognition = null;

export function startVoiceInput({ lang = 'en-IN', onResult, onError, onEnd }) {
  if (!isSpeechRecognitionSupported()) {
    if (onError) onError('Speech recognition is not supported in this browser.');
    return null;
  }

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  activeRecognition = new SpeechRec();

  // Map app lang to BCP-47 locale
  let speechLocale = 'en-IN';
  if (lang === 'hi') speechLocale = 'hi-IN';
  if (lang === 'as') speechLocale = 'as-IN'; // falls back gracefully in browser

  activeRecognition.lang = speechLocale;
  activeRecognition.continuous = false;
  activeRecognition.interimResults = false;

  activeRecognition.onresult = (event) => {
    if (event.results && event.results[0] && event.results[0][0]) {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
    }
  };

  activeRecognition.onerror = (err) => {
    if (onError) onError(err);
  };

  activeRecognition.onend = () => {
    activeRecognition = null;
    if (onEnd) onEnd();
  };

  try {
    activeRecognition.start();
  } catch (e) {
    if (onError) onError(e);
  }

  return activeRecognition;
}

export function stopVoiceInput() {
  if (activeRecognition) {
    try {
      activeRecognition.stop();
    } catch (e) {}
    activeRecognition = null;
  }
}

export function speakText(text, lang = 'en') {
  if (!isSpeechSynthesisSupported()) return;

  try {
    window.speechSynthesis.cancel(); // Stop any pending utterance
    const utterance = new SpeechSynthesisUtterance(text);
    if (lang === 'hi') utterance.lang = 'hi-IN';
    else if (lang === 'as') utterance.lang = 'as-IN';
    else utterance.lang = 'en-IN';

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error('Speech synthesis error:', e);
  }
}
