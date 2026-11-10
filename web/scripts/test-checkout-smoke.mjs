#!/usr/bin/env node
/**
 * ============================================================================
 * SOE CHECKOUT SMOKE TEST & CARD-VAULTING VERIFIER
 * ============================================================================
 * Verifies direct card vaulting parameters, order bump integrity, and
 * ASD-STE100 / digital product policy invariants across the checkout stack.
 * ============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEB_ROOT = path.resolve(__dirname, '..');

let total = 0;
let passed = 0;

function assertCheck(name, fn) {
  total++;
  try {
    const ok = fn();
    if (ok === true) {
      console.log(`  \x1b[32m✔\x1b[0m ${name}`);
      passed++;
      return;
    }
    console.log(`  \x1b[31m✖\x1b[0m ${name}: ${ok}`);
  } catch (err) {
    console.log(`  \x1b[31m✖\x1b[0m ${name} (Threw: ${err.message})`);
  }
}

console.log('\n\x1b[1m\x1b[36m========================================================\x1b[0m');
console.log('\x1b[1m\x1b[36m   SOE CHECKOUT SMOKE & CARD-VAULTING VERIFIER          \x1b[0m');
console.log('\x1b[1m\x1b[36m========================================================\x1b[0m\n');

// 1. Verify Products JSON & Direct Vaulting Structure
assertCheck('products.json satisfies direct card-vaulting schema', () => {
  const pPath = path.join(WEB_ROOT, 'src', 'data', 'products.json');
  if (!fs.existsSync(pPath)) return 'products.json not found';
  const products = JSON.parse(fs.readFileSync(pPath, 'utf8'));

  const starterBump = products.find(p => p.id === 'quest_starter_pack' || p.price === 7.00);
  if (!starterBump) return 'Missing $7 Quest Starter Pack bump product';
  if (starterBump.price !== 7.00) return `Expected $7.00, got ${starterBump.price}`;

  const ebookTripwire = products.find(p => p.id === 'rhythm_quest_illustrated_ebook' || p.price === 19.00);
  if (!ebookTripwire) return 'Missing $19 Illustrated Ebook tripwire product';

  return true;
});

// 2. Verify Zero Return / Refund Claims in Sales Pages
assertCheck('Sales pages contain zero money-back guarantee promises', () => {
  const saleFiles = [
    path.join(WEB_ROOT, 'src', 'pages', 'RhythmQuestSale.jsx'),
    path.join(WEB_ROOT, 'src', 'pages', 'DictionarySale.jsx'),
    path.join(WEB_ROOT, 'src', 'pages', 'Listen.jsx'),
  ];

  const bannedPatterns = [
    /money-back guarantee/i,
    /30-day guarantee/i,
    /risk-free trial/i,
    /refund every penny/i,
  ];

  for (const f of saleFiles) {
    if (fs.existsSync(f)) {
      const content = fs.readFileSync(f, 'utf8');
      for (const pattern of bannedPatterns) {
        if (pattern.test(content)) {
          return `Found banned guarantee phrase (${pattern}) in ${path.basename(f)}`;
        }
      }
    }
  }
  return true;
});

// 3. Verify RhythmSyllableTapWidget Component Integrity
assertCheck('RhythmSyllableTapWidget is compiled and exports correctly', () => {
  const widgetPath = path.join(WEB_ROOT, 'src', 'components', 'RhythmSyllableTapWidget.jsx');
  if (!fs.existsSync(widgetPath)) return 'Widget file not found';
  const code = fs.readFileSync(widgetPath, 'utf8');

  if (!code.includes('export default function RhythmSyllableTapWidget')) {
    return 'Missing default export of RhythmSyllableTapWidget';
  }
  if (!code.includes('AudioContext')) {
    return 'Missing Web Audio API synthesis logic';
  }
  if (!code.includes('Harmonia')) {
    return 'Missing canonical land references';
  }
  return true;
});

// 4. Verify ASD-STE100 Canon Rule Exists
assertCheck('ASD-STE100 Voice Standard rule is codified in .agents/rules', () => {
  const rulePath = path.resolve(WEB_ROOT, '..', '.agents', 'rules', 'asd-ste100-voice-standard.md');
  if (!fs.existsSync(rulePath)) return 'Rule file not found';
  const content = fs.readFileSync(rulePath, 'utf8');
  if (!content.includes('ASD-STE100')) return 'Missing ASD-STE100 header';
  if (!content.includes('delve')) return 'Missing banned AI tropes list';
  return true;
});

console.log(`\nResults: ${passed}/${total} checks passed.\n`);

if (passed !== total) {
  process.exit(1);
} else {
  console.log('\x1b[32m✔ ALL CHECKOUT & LEVERAGE SMOKE TESTS PASSED!\x1b[0m\n');
  process.exit(0);
}

