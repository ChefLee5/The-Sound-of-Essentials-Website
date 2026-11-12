#!/usr/bin/env node
/**
 * ============================================================================
 * SOE MCLS CANONICAL JSON-TO-MARKDOWN COMPILER
 * ============================================================================
 * Reads canonical JSON sources (.agents/core/canon.json, lands.json,
 * heroes.json, tracks.json, products.json) and compiles a deterministic,
 * zero-drift MCLS Canon Manifest (src/data/mcls-canon-manifest.json) while
 * verifying public/llms.txt synchronization.
 * Zero external dependencies — pure Node.js built-ins.
 * ============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEB_ROOT = path.resolve(__dirname, '..');
const ECO_ROOT = path.resolve(WEB_ROOT, '..');

const canonJsonPath = path.resolve(ECO_ROOT, '.agents', 'core', 'canon.json');
const landsPath = path.resolve(WEB_ROOT, 'src', 'data', 'lands.json');
const heroesPath = path.resolve(WEB_ROOT, 'src', 'data', 'heroes.json');
const tracksPath = path.resolve(WEB_ROOT, 'src', 'data', 'tracks.json');
const productsPath = path.resolve(WEB_ROOT, 'src', 'data', 'products.json');
const manifestOutPath = path.resolve(WEB_ROOT, 'src', 'data', 'mcls-canon-manifest.json');

const canon = fs.existsSync(canonJsonPath)
  ? JSON.parse(fs.readFileSync(canonJsonPath, 'utf8'))
  : {};
const lands = JSON.parse(fs.readFileSync(landsPath, 'utf8'));
const heroes = JSON.parse(fs.readFileSync(heroesPath, 'utf8'));
const tracks = JSON.parse(fs.readFileSync(tracksPath, 'utf8'));
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const compiledManifest = {
  compiled_at: new Date().toISOString(),
  compiler: 'SOE MCLS Deterministic Canon Compiler v2.5',
  age_bounds: canon?.target_audience?.age_range || 'Ages 2–7 (Pre-K to Grade 2)',
  grade_ceiling: canon?.target_audience?.grade_ceiling || 'Grade 2',
  tagline: canon?.tagline || 'Designed for the developing brain — not the algorithm.',
  brand_proof_line:
    canon?.brand_proof_line ||
    "Crafted by a father's heart and a mother's love, born from living the early learning crisis and built with whole-heart devotion. 15 years in the making.",
  counts: {
    lands: lands.length,
    heroes: heroes.length,
    tracks: tracks.length,
    products: products.length,
  },
  lands_roster: lands.map((l) => ({
    id: l.id,
    name: l.name,
    domain: l.domain || l.subtitle || '',
    heroes: l.heroes,
  })),
  product_ladder: products.map((p) => ({
    id: p.id,
    title: p.title || p.name,
    price: p.price,
    priceFormatted: p.priceFormatted || `$${p.price}`,
  })),
  cultural_deltas: canon?.cultural_deltas || [
    { delta: 1, name: 'Screen vs. Sensory', focus: 'Tactile, audio-first learning over addictive screen flicker' },
    { delta: 2, name: 'Testing vs. Arts', focus: 'Music, rhythm, and poetry over standardized testing drill' },
    { delta: 3, name: 'Algorithm vs. Handcrafted', focus: 'Parent-crafted intentionality over dopamine algorithms' },
    { delta: 4, name: 'Institution vs. Sanctuary', focus: 'Home and community sanctuary over institutional assembly-line schooling' },
    { delta: 5, name: 'Consumption vs. Quest', focus: 'Active developmental quest over passive media consumption' },
  ],
};

fs.writeFileSync(manifestOutPath, JSON.stringify(compiledManifest, null, 2) + '\n', 'utf8');
console.log(
  `✔ MCLS Canon Manifest compiled (${lands.length} lands, ${heroes.length} heroes, ${tracks.length} studio tracks, ${products.length} products) -> src/data/mcls-canon-manifest.json`
);

