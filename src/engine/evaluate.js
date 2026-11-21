// evaluate.js - Rule evaluation engine for SchemeSetu
import { applyOp } from './operators.js';

export function normalizeProfile(rawProfile = {}) {
  const norm = { ...rawProfile };
  if (norm.income !== undefined && norm.annualIncome === undefined) norm.annualIncome = Number(norm.income);
  else if (norm.annualIncome !== undefined && norm.income === undefined) norm.income = Number(norm.annualIncome);
  if (norm.age !== undefined && norm.age !== null && norm.age !== '') norm.age = Number(norm.age);
  if (Array.isArray(norm.special)) {
    ['bpl', 'disability', 'widow', 'minority', 'girlChild', 'landOwner', 'incomeTaxPayer', 'streetVendor'].forEach(s => {
      if (norm[s] === undefined) norm[s] = norm.special.includes(s);
    });
  }
  return norm;
}

function evaluateRuleList(rules = [], profile) {
  return rules.map(rule => {
    const fieldValue = profile[rule.field];
    if (rule.field === 'state' && (fieldValue === 'ALL' || rule.value === 'ALL')) return { ...rule, fieldValue, result: true };
    return { ...rule, fieldValue, result: applyOp(rule.op, fieldValue, rule.value) };
  });
}

export function evaluateScheme(scheme, rawProfile = {}) {
  const profile = normalizeProfile(rawProfile);
  const elig = scheme.eligibility || { all: [], any: [], none: [] };
  const stateMismatch = scheme.state && scheme.state !== 'ALL' && profile.state && profile.state !== 'ALL' && scheme.state !== profile.state;

  const allRules = evaluateRuleList(elig.all || [], profile);
  const anyRules = evaluateRuleList(elig.any || [], profile);
  const noneRules = evaluateRuleList(elig.none || [], profile);

  const reasons = [];
  const unknownFields = [];
  let status = 'eligible';

  if (stateMismatch) {
    status = 'not_eligible';
    reasons.push({ field: 'state', op: 'eq', value: scheme.state, fieldValue: profile.state, result: false, type: 'disqualifier', message: `Available only in ${scheme.state}` });
  }

  for (const r of allRules) {
    if (r.result === false) { status = 'not_eligible'; reasons.push({ ...r, type: 'disqualifier' }); }
    else if (r.result === null) { unknownFields.push(r.field); reasons.push({ ...r, type: 'unknown' }); }
    else reasons.push({ ...r, type: 'qualifier' });
  }

  for (const r of noneRules) {
    if (r.result === true) { status = 'not_eligible'; reasons.push({ ...r, type: 'disqualifier_none' }); }
    else if (r.result === null) { unknownFields.push(r.field); reasons.push({ ...r, type: 'unknown' }); }
    else reasons.push({ ...r, type: 'qualifier_none' });
  }

  if (anyRules.length > 0) {
    if (!anyRules.some(r => r.result === true) && !anyRules.some(r => r.result === null)) status = 'not_eligible';
    anyRules.forEach(r => reasons.push({ ...r, type: r.result === true ? 'qualifier_any' : (r.result === null ? 'unknown' : 'disqualifier_any') }));
  }

  if (status === 'eligible' && unknownFields.length > 0) status = 'maybe';

  const total = allRules.length + noneRules.length + (anyRules.length > 0 ? 1 : 0) + (scheme.state !== 'ALL' ? 1 : 0);
  const passedCount = reasons.filter(r => r.type.startsWith('qualifier')).length;
  const baseScore = total > 0 ? (passedCount / total) * 70 : 60;
  const statusBonus = status === 'eligible' ? 30 : (status === 'maybe' ? 15 : 0);
  const score = Math.min(100, Math.round(baseScore + statusBonus));

  return { status, score, reasons, unknownFields: [...new Set(unknownFields)] };
}
