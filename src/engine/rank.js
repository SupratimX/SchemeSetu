// rank.js - Rank and partition schemes by eligibility score
import { evaluateScheme } from './evaluate.js';

export function rankSchemes(schemes, profile) {
  const eligible = [];
  const maybe = [];
  const not_eligible = [];

  for (const scheme of schemes) {
    const evaluation = evaluateScheme(scheme, profile);
    const entry = { ...scheme, evaluation };

    if (evaluation.status === 'eligible') {
      eligible.push(entry);
    } else if (evaluation.status === 'maybe') {
      maybe.push(entry);
    } else {
      not_eligible.push(entry);
    }
  }

  const byScoreDesc = (a, b) => b.evaluation.score - a.evaluation.score;

  return {
    eligible: eligible.sort(byScoreDesc),
    maybe: maybe.sort(byScoreDesc),
    not_eligible: not_eligible.sort(byScoreDesc)
  };
}
