import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '../src');

function getAllFiles(dir, ext = '.jsx') {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(full, ext));
    } else if (file.endsWith(ext)) {
      results.push(full);
    }
  }
  return results;
}

test('Accessibility - Form inputs have labels or aria-label', () => {
  const files = getAllFiles(srcDir);
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const inputMatches = content.match(/<input[^>]+>/g) || [];
    for (const tag of inputMatches) {
      if (tag.includes('type="checkbox"') || tag.includes('type="hidden"') || tag.includes('aria-hidden="true"')) {
        continue;
      }
      const hasLabel = tag.includes('aria-label') || tag.includes('aria-labelledby') || tag.includes('id=');
      assert.ok(hasLabel, `Input tag in ${path.basename(file)} lacks accessible identifier: ${tag}`);
    }
  }
});

test('Accessibility - Target blank links enforce security attributes', () => {
  const files = getAllFiles(srcDir);
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const linkMatches = content.match(/<a[^>]+target="_blank"[^>]*>/g) || [];
    for (const tag of linkMatches) {
      assert.ok(
        tag.includes('rel="noopener noreferrer"'),
        `Link in ${path.basename(file)} lacks rel="noopener noreferrer": ${tag}`
      );
    }
  }
});

test('Accessibility - Index HTML contains Skip Link', () => {
  const htmlPath = path.resolve(__dirname, '../index.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  assert.ok(htmlContent.includes('href="#main-content"'), 'index.html must include skip to main content anchor');
});
