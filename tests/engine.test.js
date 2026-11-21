import test from 'node:test';
import assert from 'node:assert/strict';
import { applyOp } from '../src/engine/operators.js';
import { normalizeProfile, evaluateScheme } from '../src/engine/evaluate.js';
import { rankSchemes } from '../src/engine/rank.js';
import { explainReason } from '../src/engine/explain.js';

test('Operators - Equality and comparisons', () => {
  assert.equal(applyOp('eq', 'farmer', 'farmer'), true);
  assert.equal(applyOp('eq', 'farmer', 'student'), false);
  assert.equal(applyOp('neq', 'farmer', 'student'), true);
  assert.equal(applyOp('gte', 25, 18), true);
  assert.equal(applyOp('gte', 16, 18), false);
  assert.equal(applyOp('lte', 200000, 250000), true);
  assert.equal(applyOp('lte', 300000, 250000), false);
  assert.equal(applyOp('gt', 18, 18), false);
  assert.equal(applyOp('lt', 60, 60), false);
});

test('Operators - Set membership and ranges', () => {
  assert.equal(applyOp('in', 'sc', ['sc', 'st']), true);
  assert.equal(applyOp('in', 'general', ['sc', 'st']), false);
  assert.equal(applyOp('nin', 'general', ['sc', 'st']), true);
  assert.equal(applyOp('between', 25, [18, 40]), true);
  assert.equal(applyOp('between', 45, [18, 40]), false);
  assert.equal(applyOp('contains', ['bpl', 'disability'], 'bpl'), true);
  assert.equal(applyOp('contains', ['bpl'], 'disability'), false);
  assert.equal(applyOp('exists', 'provided_value', true), true);
  assert.equal(applyOp('exists', null, true), null);
});

test('Engine - Profile Normalization', () => {
  const norm = normalizeProfile({ income: '150000', age: '28', special: ['bpl', 'disability'] });
  assert.equal(norm.income, 150000);
  assert.equal(norm.annualIncome, 150000);
  assert.equal(norm.age, 28);
  assert.equal(norm.bpl, true);
  assert.equal(norm.disability, true);
  assert.equal(norm.widow, false);
});

test('Engine - Scheme Evaluation and Reasons', () => {
  const sampleScheme = {
    id: 'test-scheme',
    state: 'ALL',
    eligibility: {
      all: [
        { field: 'occupation', op: 'eq', value: 'farmer' },
        { field: 'age', op: 'gte', value: 18 }
      ],
      any: [],
      none: [
        { field: 'incomeTaxPayer', op: 'eq', value: true }
      ]
    }
  };

  const eligibleResult = evaluateScheme(sampleScheme, { occupation: 'farmer', age: 30, incomeTaxPayer: false });
  assert.equal(eligibleResult.status, 'eligible');

  const disqualifiedResult = evaluateScheme(sampleScheme, { occupation: 'student', age: 20 });
  assert.equal(disqualifiedResult.status, 'not_eligible');

  const maybeResult = evaluateScheme(sampleScheme, { occupation: 'farmer' });
  assert.equal(maybeResult.status, 'maybe');
});

test('Ranking - Rank and Partition Schemes', () => {
  const schemes = [
    {
      id: 's1',
      eligibility: {
        all: [{ field: 'occupation', op: 'eq', value: 'farmer' }]
      }
    },
    {
      id: 's2',
      eligibility: {
        all: [{ field: 'occupation', op: 'eq', value: 'student' }]
      }
    }
  ];
  const ranked = rankSchemes(schemes, { occupation: 'farmer' });
  assert.equal(ranked.eligible.length, 1);
  assert.equal(ranked.not_eligible.length, 1);
  assert.equal(ranked.eligible[0].id, 's1');
});

test('Explanation - Multilingual Reason Generation', () => {
  const reason = { field: 'occupation', op: 'eq', value: 'farmer', type: 'qualifier' };
  assert.ok(explainReason(reason, 'en').length > 0);
  assert.ok(explainReason(reason, 'hi').length > 0);
  assert.ok(explainReason(reason, 'as').length > 0);
});
