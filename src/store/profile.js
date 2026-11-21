// profile.js - App State Store using @preact/signals
import { signal } from '@preact/signals';
import { validateStorageData, purgeAllUserData } from '../utils/security.js';

const load = (k, d) => {
  try {
    const raw = localStorage.getItem('schemesetu_' + k);
    if (!raw) return d;
    const parsed = JSON.parse(raw);
    const validated = validateStorageData(k, parsed);
    return validated !== null ? validated : d;
  } catch {
    return d;
  }
};

const save = (k, v) => {
  try {
    localStorage.setItem('schemesetu_' + k, JSON.stringify(v));
  } catch {}
};

export const profile = signal(load('profile', {}));
export const savedSchemes = signal(new Set(load('saved', [])));
export const language = signal(load('lang', 'en'));
export const fontSize = signal(load('font_size', 'normal'));
export const highContrast = signal(load('high_contrast', false));
export const quizResults = signal(load('results', null));
export const checkedDocuments = signal(load('checked_docs', {}));

export const setProfile = (a) => {
  profile.value = { ...profile.value, ...a };
  save('profile', profile.value);
};

export const resetProfile = () => {
  profile.value = {};
  quizResults.value = null;
  save('profile', {});
  save('results', null);
};

export const setQuizResults = (r) => {
  quizResults.value = r;
  save('results', r);
};

export const toggleSaveScheme = (id) => {
  const s = new Set(savedSchemes.value);
  s.has(id) ? s.delete(id) : s.add(id);
  savedSchemes.value = s;
  save('saved', Array.from(s));
};

export const isSchemeSaved = (id) => savedSchemes.value.has(id);
export const setLanguage = (l) => { language.value = l; save('lang', l); document.documentElement.lang = l; };
export const setFontSize = (s) => { fontSize.value = s; save('font_size', s); };
export const toggleHighContrast = () => { highContrast.value = !highContrast.value; save('high_contrast', highContrast.value); };

export const toggleDocumentCheck = (id) => {
  const cur = { ...checkedDocuments.value, [id]: !checkedDocuments.value[id] };
  checkedDocuments.value = cur;
  save('checked_docs', cur);
};

/**
 * Complete, secure privacy wipe of all locally stored citizen data.
 */
export const clearAllUserData = () => {
  purgeAllUserData();
  profile.value = {};
  savedSchemes.value = new Set();
  quizResults.value = null;
  checkedDocuments.value = {};
};
