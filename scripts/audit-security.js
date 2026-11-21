// audit-security.js - Automated security test suite for SchemeSetu
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { escapeHtml, sanitizeUrl, sanitizeSearchInput, validateStorageData } from '../src/utils/security.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '../src');

console.log('=== Running SchemeSetu Security Audit ===\n');

// 1. Test HTML Escaping against XSS vectors
console.log('1. Testing XSS & HTML escaping...');
const xssPayloads = [
  { raw: '<script>alert("xss")</script>', expected: '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;' },
  { raw: '"><img src=x onerror=alert(1)>', expected: '&quot;&gt;&lt;img src=x onerror=alert(1)&gt;' },
  { raw: "'; alert('xss'); //", expected: '&#x27;; alert(&#x27;xss&#x27;); &#x2F;&#x2F;' },
  { raw: 'PM & Kisan <Scheme>', expected: 'PM &amp; Kisan &lt;Scheme&gt;' }
];
for (const test of xssPayloads) {
  const result = escapeHtml(test.raw);
  assert.strictEqual(result, test.expected, `Failed on: ${test.raw}`);
}
console.log('   ✓ HTML escaping blocks all tested XSS injection vectors.\n');

// 2. Test URL Protocol Sanitization
console.log('2. Testing URL protocol sanitization...');
const urlPayloads = [
  { url: 'javascript:alert(document.cookie)', isBlocked: true },
  { url: 'data:text/html;base64,PHNjcmlwdD4=', isBlocked: true },
  { url: 'vbscript:msgbox(1)', isBlocked: true },
  { url: 'https://pmkisan.gov.in', isBlocked: false },
  { url: 'http://myscheme.gov.in', isBlocked: false },
  { url: 'tel:155261', isBlocked: false }
];
for (const test of urlPayloads) {
  const result = sanitizeUrl(test.url);
  if (test.isBlocked) {
    assert.strictEqual(result, '#', `Failed to block malicious URL: ${test.url}`);
  } else {
    assert.strictEqual(result, test.url, `Wrongly blocked safe URL: ${test.url}`);
  }
}
console.log('   ✓ Safe protocol filter blocks javascript/data/vbscript links.\n');

// 3. Test Search Input Sanitization
console.log('3. Testing Search Input sanitization...');
const dirtySearch = 'Farmer\x00\x08 Scheme \x1B\x7F' + 'a'.repeat(200);
const cleanSearch = sanitizeSearchInput(dirtySearch, 50);
assert.ok(!cleanSearch.includes('\x00'));
assert.ok(cleanSearch.length <= 50);
assert.ok(cleanSearch.startsWith('Farmer Scheme'));
console.log('   ✓ Search input sanitization strips control chars and bounds length.\n');

// 4. Test LocalStorage Validation
console.log('4. Testing LocalStorage validation...');
const corruptedProfile = { age: -99, state: '<script>', special: ['bpl', 123, {}] };
const validated = validateStorageData('profile', corruptedProfile);
assert.strictEqual(validated.age, undefined); // Out of bounds rejected
assert.strictEqual(validated.special.length, 1); // Non-strings stripped
assert.strictEqual(validateStorageData('lang', 'malicious_lang'), 'en'); // Fallback to 'en'
console.log('   ✓ Storage schema validator protects reactive state from corrupted data.\n');

// 5. Scan all JSX files for target="_blank" without rel="noopener noreferrer"
console.log('5. Auditing external links for rel="noopener noreferrer"...');
function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) scanDir(full);
    else if (f.endsWith('.jsx')) {
      const content = fs.readFileSync(full, 'utf8');
      const matches = content.match(/<a[^>]+target="_blank"[^>]*>/g) || [];
      for (const m of matches) {
        assert.ok(
          m.includes('rel="noopener noreferrer"') || m.includes('rel="noreferrer noopener"'),
          `Missing rel="noopener noreferrer" in ${full}: ${m}`
        );
      }
    }
  }
}
scanDir(srcDir);
console.log('   ✓ All target="_blank" links enforce rel="noopener noreferrer".\n');

console.log('=== All 5 Security Audits Passed Successfully! ===');
