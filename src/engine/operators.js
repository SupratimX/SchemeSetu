// operators.js - Eligibility Rule Comparison Operators

/**
 * Applies a deterministic binary comparison operator between a profile field value and a scheme rule value.
 * @param {string} op - Operator code: 'eq', 'neq', 'in', 'nin', 'gte', 'lte', 'gt', 'lt', 'between', 'exists', 'contains'.
 * @param {any} f - Citizen profile field value.
 * @param {any} r - Scheme requirement value.
 * @returns {boolean|null} Evaluation result, or null if the profile field is missing/undefined.
 */
export function applyOp(op, f, r) {
  if (f === undefined || f === null || f === '') return null;
  const numF = Number(f), numR = Number(r);
  switch (op) {
    case 'eq': return f === r;
    case 'neq': return f !== r;
    case 'in': return Array.isArray(r) ? (Array.isArray(f) ? f.some(v => r.includes(v)) : r.includes(f)) : false;
    case 'nin': return Array.isArray(r) ? (Array.isArray(f) ? !f.some(v => r.includes(v)) : !r.includes(f)) : true;
    case 'gte': return numF >= numR;
    case 'lte': return numF <= numR;
    case 'gt': return numF > numR;
    case 'lt': return numF < numR;
    case 'between': return Array.isArray(r) && r.length === 2 && numF >= Number(r[0]) && numF <= Number(r[1]);
    case 'exists': return r ? (f !== '' && (!Array.isArray(f) || f.length > 0)) : (f === '' || (Array.isArray(f) && f.length === 0));
    case 'contains': return Array.isArray(f) ? f.includes(r) : String(f).toLowerCase().includes(String(r).toLowerCase());
    default: return null;
  }
}
