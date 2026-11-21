// evaluate.js - Rule evaluation engine for SchemeSetu
import { applyOp } from './operators.js';

export function normalizeProfile(rawProfile = {}) {
  const norm = { ...rawProfile };

  // Sync income & annualIncome
  if (norm.income !== undefined && norm.annualIncome === undefined) {
    norm.annualIncome = Number(norm.income);
  } else if (norm.annualIncome !== undefined && norm.income === undefined) {
    norm.income = Number(norm.annualIncome);
  }

  // Normalize age
  if (norm.age !== undefined && norm.age !== null && norm.age !== '') {
    norm.age = Number(norm.age);
  }

  // Expand special array into boolean flags (e.g. bpl, disability, widow, landOwner, incomeTaxPayer, etc.)
  if (Array.isArray(norm.special)) {
    const specials = ['bpl', 'disability', 'widow', 'minority', 'girlChild', 'landOwner', 'incomeTaxPayer', 'streetVendor'];
    specials.forEach(s => {
      if (norm[s] === undefined) {
        norm[s] = norm.special.includes(s);
      }
    });
  }

  return norm;
}

function evaluateRuleList(rules = [], profile) {
  return rules.map(rule => {
    let fieldValue = profile[rule.field];

    // Special check for state match on scheme-level or rule-level
    if (rule.field === 'state' && (fieldValue === 'ALL' || rule.value === 'ALL')) {
      return { ...rule, fieldValue, result: true };
    }

    const result = applyOp(rule.op, fieldValue, rule.value);
    return { ...rule, fieldValue, result };
  });
}

export function evaluateScheme(scheme, rawProfile = {}) {
  const profile = normalizeProfile(rawProfile);
  const elig = scheme.eligibility || { all: [], any: [], none: [] };

  // Scheme-level state check: if scheme is state-specific and user specified a different state
  let stateMismatch = false;
  if (scheme.state && scheme.state !== 'ALL' && profile.state && profile.state !== 'ALL') {
    if (scheme.state !== profile.state) {
      stateMismatch = true;
    }
  }

  const allRules = evaluateRuleList(elig.all || [], profile);
  const anyRules = evaluateRuleList(elig.any || [], profile);
  const noneRules = evaluateRuleList(elig.none || [], profile);

  const reasons = [];
  const unknownFields = [];
  let status = 'eligible';

  if (stateMismatch) {
    status = 'not_eligible';
    reasons.push({
      field: 'state',
      op: 'eq',
      value: scheme.state,
      fieldValue: profile.state,
      result: false,
      type: 'disqualifier',
      message: `Available only in ${scheme.state}`
    });
  }

  // Check 'all' rules (AND logic)
  for (const r of allRules) {
    if (r.result === false) {
      status = 'not_eligible';
      reasons.push({ ...r, type: 'disqualifier' });
    } else if (r.result === null) {
      unknownFields.push(r.field);
      reasons.push({ ...r, type: 'unknown' });
    } else {
      reasons.push({ ...r, type: 'qualifier' });
    }
  }

  // Check 'none' rules (NOT logic - if any true, disqualified)
  for (const r of noneRules) {
    if (r.result === true) {
      status = 'not_eligible';
      reasons.push({ ...r, type: 'disqualifier_none' });
    } else if (r.result === null) {
      unknownFields.push(r.field);
      reasons.push({ ...r, type: 'unknown' });
    } else {
      reasons.push({ ...r, type: 'qualifier_none' });
    }
  }

  // Check 'any' rules (OR logic)
  if (anyRules.length > 0) {
    const anyTrue = anyRules.some(r => r.result === true);
    const anyUnknown = anyRules.some(r => r.result === null);

    if (!anyTrue && !anyUnknown) {
      status = 'not_eligible';
    }

    anyRules.forEach(r => {
      reasons.push({
        ...r,
        type: r.result === true ? 'qualifier_any' : (r.result === null ? 'unknown' : 'disqualifier_any')
      });
    });
  }

  // If no hard disqualifier, but unknown fields exist -> 'maybe'
  if (status === 'eligible' && unknownFields.length > 0) {
    status = 'maybe';
  }

  // Calculate matching score (0-100)
  const total = allRules.length + noneRules.length + (anyRules.length > 0 ? 1 : 0) + (scheme.state !== 'ALL' ? 1 : 0);
  const passedCount = reasons.filter(r => r.type.startsWith('qualifier')).length;
  const baseScore = total > 0 ? (passedCount / total) * 70 : 60;
  const statusBonus = status === 'eligible' ? 30 : (status === 'maybe' ? 15 : 0);
  const score = Math.min(100, Math.round(baseScore + statusBonus));

  return {
    status,
    score,
    reasons,
    unknownFields: [...new Set(unknownFields)]
  };
}
