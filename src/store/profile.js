// profile.js - App State Store using @preact/signals
import { signal } from '@preact/signals';

function loadStorage(key, defaultValue) {
  try {
    const item = localStorage.getItem('schemesetu_' + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem('schemesetu_' + key, JSON.stringify(value));
  } catch (e) {
    // quota exceeded or private mode
  }
}

export const profile = signal(loadStorage('profile', {}));
export const savedSchemes = signal(new Set(loadStorage('saved', [])));
export const language = signal(loadStorage('lang', 'en'));
export const fontSize = signal(loadStorage('font_size', 'normal'));
export const highContrast = signal(loadStorage('high_contrast', false));
export const quizResults = signal(loadStorage('results', null));
export const checkedDocuments = signal(loadStorage('checked_docs', {}));

export function setProfile(answers) {
  profile.value = { ...profile.value, ...answers };
  saveStorage('profile', profile.value);
}

export function resetProfile() {
  profile.value = {};
  quizResults.value = null;
  saveStorage('profile', {});
  saveStorage('results', null);
}

export function setQuizResults(results) {
  quizResults.value = results;
  saveStorage('results', results);
}

export function toggleSaveScheme(schemeId) {
  const current = new Set(savedSchemes.value);
  if (current.has(schemeId)) {
    current.delete(schemeId);
  } else {
    current.add(schemeId);
  }
  savedSchemes.value = current;
  saveStorage('saved', Array.from(current));
}

export function isSchemeSaved(schemeId) {
  return savedSchemes.value.has(schemeId);
}

export function setLanguage(lang) {
  language.value = lang;
  saveStorage('lang', lang);
  document.documentElement.lang = lang;
}

export function setFontSize(size) {
  fontSize.value = size;
  saveStorage('font_size', size);
}

export function toggleHighContrast() {
  highContrast.value = !highContrast.value;
  saveStorage('high_contrast', highContrast.value);
}

export function toggleDocumentCheck(docId) {
  const current = { ...checkedDocuments.value };
  current[docId] = !current[docId];
  checkedDocuments.value = current;
  saveStorage('checked_docs', current);
}
