// rank.js - Rank and partition schemes by eligibility score
import { evaluateScheme } from './evaluate.js';

export function rankSchemes(schemes, profile) {
  const res = { eligible: [], maybe: [], not_eligible: [] };
  for (const s of schemes) {
    const entry = { ...s, evaluation: evaluateScheme(s, profile) };
    (res[entry.evaluation.status] || res.not_eligible).push(entry);
  }
  const byScore = (a, b) => b.evaluation.score - a.evaluation.score;
  return {
    eligible: res.eligible.sort(byScore),
    maybe: res.maybe.sort(byScore),
    not_eligible: res.not_eligible.sort(byScore)
  };
}
