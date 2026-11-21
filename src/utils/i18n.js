// i18n.js - Language dictionary loader and translator
import enDict from '../i18n/en.json';
import hiDict from '../i18n/hi.json';
import asDict from '../i18n/as.json';

const dicts = { en: enDict, hi: hiDict, as: asDict };
let activeLang = 'en';

export const initLanguage = (l = 'en') => { activeLang = l; };
export function t(key, params = {}, lang = null) {
  const d = dicts[lang || activeLang] || dicts.en;
  let text = d[key] || dicts.en[key] || key;
  if (params && typeof params === 'object') {
    Object.keys(params).forEach(k => { text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k]); });
  }
  return text;
}
