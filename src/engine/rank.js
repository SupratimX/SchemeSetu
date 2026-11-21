// rank.js - Rank and partition schemes by eligibility score
import { evaluateScheme } from './evaluate.js';

/**
 * Evaluates and partitions a collection of welfare schemes into eligible, maybe, and not eligible buckets.
 * @param {Array<Object>} schemes - List of scheme definition objects.
 * @param {Object} profile - Citizen survey response profile.
 * @returns {{ eligible: Array<Object>, maybe: Array<Object>, not_eligible: Array<Object> }} Partitioned schemes sorted by score.
 */
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

export const partitionSchemes = rankSchemes;
