import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateScheme } from '../src/engine/evaluate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const central = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/schemes/central.json'), 'utf8'));
const assam = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/schemes/assam.json'), 'utf8'));
const allSchemes = [...central, ...assam];

test('Persona 1: Female Farmer in Assam with Low Income', () => {
  const profile = {
    state: 'AS',
    gender: 'female',
    age: 32,
    occupation: 'farmer',
    landOwner: true,
    incomeTaxPayer: false,
    income: 120000,
    special: ['bpl']
  };

  const results = allSchemes.map(s => ({ id: s.id, eval: evaluateScheme(s, profile) }));
  const eligibleIds = results.filter(r => r.eval.status === 'eligible').map(r => r.id);

  assert.ok(eligibleIds.includes('pm-kisan'), 'Farmer should be eligible for PM-KISAN');
  assert.ok(eligibleIds.includes('assam-orunodoi'), 'Assam low-income woman should be eligible for Orunodoi');
  assert.ok(eligibleIds.includes('ayushman-bharat'), 'BPL family should be eligible for Ayushman Bharat');
});

test('Persona 2: Young Student in Assam', () => {
  const profile = {
    state: 'AS',
    gender: 'female',
    age: 19,
    occupation: 'student',
    income: 200000
  };

  const results = allSchemes.map(s => ({ id: s.id, eval: evaluateScheme(s, profile) }));
  const matched = results.filter(r => r.eval.status !== 'not_eligible').map(r => r.id);

  assert.ok(matched.includes('assam-pragyan-bharati'), 'Female student should match Pragyan Bharati');
  assert.ok(matched.includes('assam-abhinandan-loan'), 'Student should match Abhinandan Loan Subsidy');
});

test('Persona 3: Urban Street Vendor', () => {
  const profile = {
    state: 'DL',
    area: 'urban',
    age: 40,
    gender: 'male',
    occupation: 'self-employed',
    streetVendor: true,
    special: ['streetVendor']
  };

  const results = allSchemes.map(s => ({ id: s.id, eval: evaluateScheme(s, profile) }));
  const eligibleIds = results.filter(r => r.eval.status === 'eligible').map(r => r.id);

  assert.ok(eligibleIds.includes('pm-svanidhi'), 'Street vendor should be eligible for PM SVANidhi');
});

test('Persona 4: Senior Citizen (68 years old)', () => {
  const profile = {
    state: 'UP',
    age: 68,
    occupation: 'retired',
    special: ['bpl']
  };

  const results = allSchemes.map(s => ({ id: s.id, eval: evaluateScheme(s, profile) }));
  const eligibleIds = results.filter(r => r.eval.status === 'eligible').map(r => r.id);

  assert.ok(eligibleIds.includes('nsap-old-age-pension'), 'Senior citizen should qualify for NSAP Old Age Pension');
});
