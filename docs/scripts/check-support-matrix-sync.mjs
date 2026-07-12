#!/usr/bin/env node
// Support-matrix sync-check (RFC #1095), modelled on
// packages/create-atomic-testing/scripts/check-recipe-sync.mjs. Rebuilds the matrix
// in memory from the CLI compatibility registry and compares it byte-for-byte with
// the committed docs/src/generated/supportMatrix.json, failing CI on any drift so a
// hand-edited or stale matrix can't ship. Fixing drift is one command:
//   node docs/scripts/genSupportMatrix.mjs
//
// The generator reads create-atomic-testing's built dist, so that package must be
// built first (pnpm --filter create-atomic-testing build).
import { existsSync, readFileSync } from 'node:fs';

import { buildMatrix, outputPath } from './genSupportMatrix.mjs';

let expected;
try {
  const matrix = await buildMatrix();
  expected = `${JSON.stringify(matrix, null, 2)}\n`;
} catch (error) {
  if (error.code === 'E_NO_DIST') {
    console.error('[support-matrix-sync] Cannot check: create-atomic-testing is not built.');
    console.error('[support-matrix-sync] Build the CLI dist first: pnpm --filter create-atomic-testing build');
    process.exit(2);
  }
  throw error;
}

if (!existsSync(outputPath)) {
  console.error(`[support-matrix-sync] Missing committed matrix at ${outputPath}.`);
  console.error('[support-matrix-sync] Generate it: node docs/scripts/genSupportMatrix.mjs');
  process.exit(1);
}

const committed = readFileSync(outputPath, 'utf8');
if (committed !== expected) {
  console.error('[support-matrix-sync] docs/src/generated/supportMatrix.json is out of date.');
  console.error('[support-matrix-sync] It no longer matches the CLI compatibility registry.');
  console.error('[support-matrix-sync] Regenerate it: node docs/scripts/genSupportMatrix.mjs');
  console.error('[support-matrix-sync] (Build the CLI dist first: pnpm --filter create-atomic-testing build.)');
  process.exit(1);
}

process.stdout.write('[support-matrix-sync] OK — committed matrix matches the CLI compatibility registry.\n');
