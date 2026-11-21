// search.js - MiniSearch fuzzy client-side search indexing
import MiniSearch from 'minisearch';

let searchEngine = null;

export function buildSearchIndex(schemes = []) {
  searchEngine = new MiniSearch({
    fields: ['name_en', 'name_hi', 'name_as', 'summary_en', 'summary_hi', 'summary_as', 'category', 'benefit'],
    storeFields: ['id'],
    searchOptions: { fuzzy: 0.25, prefix: true, boost: { name_en: 2.5, name_hi: 2.5, name_as: 2.5 } }
  });

  searchEngine.addAll(schemes.map(s => ({
    id: s.id,
    name_en: s.name?.en || '',
    name_hi: s.name?.hi || '',
    name_as: s.name?.as || '',
    summary_en: s.summary?.en || '',
    summary_hi: s.summary?.hi || '',
    summary_as: s.summary?.as || '',
    category: Array.isArray(s.category) ? s.category.join(' ') : (s.category || ''),
    benefit: s.benefit?.amount || ''
  })));
  return searchEngine;
}

export function searchSchemes(query = '') {
  if (!searchEngine || !query || !query.trim()) return null;
  return new Set(searchEngine.search(query.trim()).map(r => r.id));
}
