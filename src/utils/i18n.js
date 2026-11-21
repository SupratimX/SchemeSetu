// i18n.js - Language dictionary loader and translator
import enDict from '../i18n/en.json';
import hiDict from '../i18n/hi.json';
import asDict from '../i18n/as.json';

const dictionaries = {
  en: enDict,
  hi: hiDict,
  as: asDict
};

let activeLanguage = 'en';

export function initLanguage(lang = 'en') {
  activeLanguage = lang;
}

export function t(key, params = {}, lang = null) {
  const currentLang = lang || activeLanguage;
  const dict = dictionaries[currentLang] || dictionaries.en;
  let text = dict[key] || dictionaries.en[key] || key;

  if (params && typeof params === 'object') {
    Object.keys(params).forEach(k => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k]);
    });
  }

  return text;
}
