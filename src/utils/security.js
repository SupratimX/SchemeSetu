// security.js - Input sanitization, safe URL handling, and localStorage validation

/**
 * Escapes special HTML characters to prevent XSS / HTML injection.
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return String(str ?? '');
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  return str.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Validates that a URL uses safe protocols (https, http, tel, mailto).
 * Rejects javascript:, data:, vbscript:, and malformed targets.
 */
export function sanitizeUrl(url, allowedProtocols = ['https:', 'http:', 'tel:', 'mailto:']) {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();

  // Allow relative or internal hash links
  if (trimmed.startsWith('#') || trimmed.startsWith('/')) return trimmed;

  try {
    const base = typeof window !== 'undefined' && window.location ? window.location.origin : 'http://localhost';
    const parsed = new URL(trimmed, base);
    if (allowedProtocols.includes(parsed.protocol)) {
      return trimmed;
    }
  } catch {
    // Relative or invalid
  }
  return '#';
}

/**
 * Strips non-printable control characters, trims, and bounds length.
 */
export function sanitizeSearchInput(input, maxLength = 100) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\x00-\x1F\x7F]/g, '') // Strip control chars
    .slice(0, maxLength)
    .trim();
}

/**
 * Validates data loaded from localStorage to prevent tampering or corruption.
 */
export function validateStorageData(key, data) {
  if (data === null || data === undefined) return null;

  try {
    switch (key) {
      case 'profile': {
        if (typeof data !== 'object' || Array.isArray(data)) return {};
        const safe = {};
        if (typeof data.state === 'string') safe.state = data.state.slice(0, 10);
        if (['rural', 'urban'].includes(data.area)) safe.area = data.area;
        if (typeof data.age === 'number' && data.age >= 1 && data.age <= 120) safe.age = Math.round(data.age);
        if (['male', 'female', 'other'].includes(data.gender)) safe.gender = data.gender;
        if (typeof data.income === 'number' && data.income >= 0) safe.income = data.income;
        if (typeof data.annualIncome === 'number' && data.annualIncome >= 0) safe.annualIncome = data.annualIncome;
        if (typeof data.category === 'string') safe.category = data.category.slice(0, 20);
        if (typeof data.occupation === 'string') safe.occupation = data.occupation.slice(0, 30);
        if (Array.isArray(data.special)) safe.special = data.special.filter(s => typeof s === 'string').slice(0, 20);
        return safe;
      }

      case 'saved': {
        if (!Array.isArray(data)) return [];
        return data.filter(id => typeof id === 'string' && /^[a-z0-9-]+$/.test(id)).slice(0, 100);
      }

      case 'lang':
        return ['en', 'hi', 'as'].includes(data) ? data : 'en';

      case 'font_size':
        return ['normal', 'large', 'x-large'].includes(data) ? data : 'normal';

      case 'high_contrast':
        return typeof data === 'boolean' ? data : false;

      case 'checked_docs': {
        if (typeof data !== 'object' || Array.isArray(data)) return {};
        const safe = {};
        Object.keys(data).slice(0, 50).forEach(k => {
          if (/^[a-z0-9-]+$/.test(k) && typeof data[k] === 'boolean') {
            safe[k] = data[k];
          }
        });
        return safe;
      }

      default:
        return data;
    }
  } catch {
    return null;
  }
}

/**
 * Transparently purges all user data from client storage.
 */
export function purgeAllUserData() {
  try {
    const keys = ['profile', 'saved', 'lang', 'font_size', 'high_contrast', 'results', 'checked_docs'];
    keys.forEach(k => localStorage.removeItem('schemesetu_' + k));
  } catch {}
}
