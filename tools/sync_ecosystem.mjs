#!/usr/bin/env node
/**
 * ============================================================================
 * SOE ECOSYSTEM SYNCHRONIZER & MULTI-REPO DRIFT WORKER
 * ============================================================================
 * Synchronizes the canonical single source of truth (.agents/core/) across
 * all ecosystem repositories, web workspaces, and creative asset folders.
 * Runs Gate 1 (soe-canon-guard.mjs) to verify zero regression.
 * ============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const SOURCE_CORE = path.join(REPO_ROOT, '.agents', 'core');

// Target ecosystem destinations to keep synchronized
const TARGET_DESTINATIONS = [
  // 1. Parent Image Assets Workspace
  path.resolve(REPO_ROOT, '..', '.agents', 'core'),
  // 2. Standalone Website Repo (if present)
  path.resolve(REPO_ROOT, '..', '..', 'The-Sound-of-Essentials-Website', '.agents', 'core'),
];

console.log('\n\x1b[1m\x1b[35m========================================================\x1b[0m');
console.log('\x1b[1m\x1b[35m   SOE ECOSYSTEM DRIFT WORKER & MULTI-REPO SYNC        \x1b[0m');
console.log('\x1b[1m\x1b[35m========================================================\x1b[0m\n');

if (!fs.existsSync(SOURCE_CORE)) {
  console.error(`\x1b[31m✖ Source core not found: ${SOURCE_CORE}\x1b[0m`);
  process.exit(1);
}

const files = fs.readdirSync(SOURCE_CORE);
console.log(`\x1b[36mFound ${files.length} canonical schemas in source:\x1b[0m`);
for (const file of files) {
  console.log(`  • ${file}`);
}

console.log('\n\x1b[1mPropagating to ecosystem targets...\x1b[0m');

let syncCount = 0;
for (const dest of TARGET_DESTINATIONS) {
  const parentFolder = path.dirname(dest);
  if (!fs.existsSync(parentFolder)) {
    continue; // Target repo root does not exist on this machine
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  for (const file of files) {
    const srcFile = path.join(SOURCE_CORE, file);
    const destFile = path.join(dest, file);
    fs.copyFileSync(srcFile, destFile);
  }
  console.log(`  \x1b[32m✔\x1b[0m Synced to: ${path.relative(path.resolve(REPO_ROOT, '..', '..'), dest)}`);
  syncCount++;
}

// Also ensure AGENTS.md exists at parent asset root if missing
const parentAgentsMd = path.resolve(REPO_ROOT, '..', 'AGENTS.md');
const sourceAgentsMd = path.join(REPO_ROOT, 'AGENTS.md');
if (fs.existsSync(sourceAgentsMd)) {
  fs.copyFileSync(sourceAgentsMd, parentAgentsMd);
  console.log(`  \x1b[32m✔\x1b[0m Synced AGENTS.md to parent asset workspace`);
}

console.log(`\n\x1b[1mRunning Gate 1 verification...\x1b[0m`);
try {
  const result = execSync('npm run test:canon', {
    cwd: path.join(REPO_ROOT, 'web'),
    encoding: 'utf8',
  });
  console.log(result);
  console.log('\x1b[1m\x1b[32m========================================================\x1b[0m');
  console.log('\x1b[1m\x1b[32m✔ ECOSYSTEM SYNC COMPLETE & VERIFIED CLEAN!\x1b[0m');
  console.log('\x1b[1m\x1b[32m========================================================\x1b[0m\n');
} catch (err) {
  console.error('\x1b[31m✖ Gate 1 failed during sync verification:\x1b[0m');
  console.error(err.stdout || err.message);
  process.exit(2);
}
