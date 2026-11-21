import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const REQUIRED_KEYS = [
  'id', 'name', 'level', 'state', 'category', 'summary',
  'benefit', 'eligibility', 'documents', 'howToApply',
  'links', 'lastVerified', 'verifiedBy', 'status', 'source'
];

function checkDataset(relPath) {
  const filePath = path.join(rootDir, relPath);
  console.log(`Auditing: ${relPath}`);

  if (!fs.existsSync(filePath)) {
    console.error(`Missing file: ${relPath}`);
    return { success: false, errors: [`Missing file: ${relPath}`], ids: new Set(), total: 0 };
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  let items;
  try {
    items = JSON.parse(raw);
  } catch (err) {
    return { success: false, errors: [`Malformed JSON: ${err.message}`], ids: new Set(), total: 0 };
  }

  if (!Array.isArray(items)) {
    return { success: false, errors: ['Expected array of schemes'], ids: new Set(), total: 0 };
  }

  const errors = [];
  const ids = new Set();
  let staleCount = 0;
  const cutoff = Date.now() - (180 * 24 * 60 * 60 * 1000); // 6 months

  items.forEach((item, idx) => {
    const slug = item.id || `idx_${idx}`;
    if (!item.id) {
      errors.push(`Item at index ${idx} lacks 'id'`);
    } else if (ids.has(item.id)) {
      errors.push(`Duplicate ID '${item.id}' detected in ${relPath}`);
    } else {
      ids.add(item.id);
    }

    REQUIRED_KEYS.forEach(k => {
      if (item[k] === undefined || item[k] === null) {
        errors.push(`Scheme '${slug}' missing field '${k}'`);
      }
    });

    if (item.lastVerified) {
      const vTime = new Date(item.lastVerified).getTime();
      if (vTime < cutoff) {
        staleCount++;
      }
    }
  });

  return { success: errors.length === 0, errors, ids, total: items.length, staleCount };
}

console.log('=== SchemeSetu Dataset Verification ===');
const centralAudit = checkDataset('src/data/schemes/central.json');
const assamAudit = checkDataset('src/data/schemes/assam.json');

const dupsAcross = [...centralAudit.ids].filter(id => assamAudit.ids.has(id));
const combinedErrors = [...centralAudit.errors, ...assamAudit.errors];
if (dupsAcross.length > 0) {
  combinedErrors.push(`Duplicate IDs shared across datasets: ${dupsAcross.join(', ')}`);
}

console.log(`\nResults:`);
console.log(`- Total schemes audited: ${(centralAudit.total || 0) + (assamAudit.total || 0)}`);
console.log(`- Stale records (>180 days): ${(centralAudit.staleCount || 0) + (assamAudit.staleCount || 0)}`);

if (combinedErrors.length > 0) {
  console.error(`Validation failed with ${combinedErrors.length} errors:`);
  combinedErrors.slice(0, 10).forEach(e => console.error(`  * ${e}`));
  process.exit(1);
} else {
  console.log(`All datasets verified successfully.`);
  process.exit(0);
}
