import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const en = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/i18n/en.json'), 'utf8'));
const hi = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/i18n/hi.json'), 'utf8'));
const as = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/i18n/as.json'), 'utf8'));

function getFlattenedKeys(obj, prefix = '') {
  let keys = [];
  for (const k of Object.keys(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys = keys.concat(getFlattenedKeys(obj[k], full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

test('i18n - English, Hindi, and Assamese dictionary parity', () => {
  const enKeys = getFlattenedKeys(en);
  const hiKeys = new Set(getFlattenedKeys(hi));
  const asKeys = new Set(getFlattenedKeys(as));

  const missingInHi = enKeys.filter(k => !hiKeys.has(k));
  const missingInAs = enKeys.filter(k => !asKeys.has(k));

  assert.equal(missingInHi.length, 0, `Hindi dictionary missing keys: ${missingInHi.join(', ')}`);
  assert.equal(missingInAs.length, 0, `Assamese dictionary missing keys: ${missingInAs.join(', ')}`);
});
