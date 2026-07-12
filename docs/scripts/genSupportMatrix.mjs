#!/usr/bin/env node
// Support-matrix generator (RFC #1095). The published Framework × Runner matrix is
// DERIVED from create-atomic-testing's own compatibility registry, so the docs and
// the recipes the CLI actually offers cannot drift apart. This script writes the
// model to docs/src/generated/supportMatrix.json; the <SupportMatrix> component and
// support-matrix.mdx render it. Regenerated before every docs build/start (see the
// docs package.json), and guarded in CI by check-support-matrix-sync.mjs.
//
// Dependency-free Node ESM, modelled on
// packages/create-atomic-testing/scripts/check-recipe-sync.mjs. Reads the CLI's built
// dist entry, so build that package first:
//   pnpm --filter create-atomic-testing build
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const distEntry = resolve(scriptDir, '../../packages/create-atomic-testing/dist/index.mjs');

/** Where the committed matrix lives; the check script compares against this file. */
export const outputPath = resolve(scriptDir, '../src/generated/supportMatrix.json');

/**
 * Load the CLI's compatibility registry from its built dist entry. Isolated so a
 * missing build raises a tagged error both this generator and the sync-check can
 * turn into their own message — importing this module has no side effects.
 */
async function loadRegistry() {
  if (!existsSync(distEntry)) {
    const error = new Error(`Missing build output at ${distEntry}`);
    error.code = 'E_NO_DIST';
    throw error;
  }
  return import(pathToFileURL(distEntry).href);
}

/** Classify one framework × runner combination into a renderable cell tier. */
function cellTier(compat) {
  if (!compat.registered) return 'unavailable'; // not a row in the registry at all
  if (!compat.enabled) return 'disabled'; // registered but gated off (keeps its note)
  return compat.tier; // 'verified' | 'experimental'
}

/**
 * Build the support-matrix JSON model from the CLI registry. Pure with respect to
 * the filesystem — the sync-check calls this and compares, without writing.
 * Deterministic by construction: no Date, no Math.random, so re-running never
 * churns the committed JSON.
 */
export async function buildMatrix() {
  const { FRAMEWORKS, RUNNERS, getFramework, getRunner, designSystemsForFramework, resolveCompatibility } =
    await loadRegistry();

  // `none` is the vanilla-DOM placeholder — it ships no TestEngine, so it is not a
  // row a reader can act on. Every other registered framework is a matrix row.
  const frameworkIds = Object.keys(FRAMEWORKS).filter(id => id !== 'none');
  const runnerIds = Object.keys(RUNNERS);

  const frameworks = frameworkIds.map(id => ({
    id,
    displayName: getFramework(id).displayName,
    majors: [...getFramework(id).supportedMajors],
  }));

  const runners = runnerIds.map(id => ({ id, displayName: getRunner(id).displayName }));

  const cells = [];
  for (const framework of frameworkIds) {
    for (const runner of runnerIds) {
      // Probe against the always-compatible HTML design system so the cell reflects
      // the framework × runner combination itself, not a design-system restriction.
      const compat = resolveCompatibility(framework, runner, 'html');
      const cell = { framework, runner, tier: cellTier(compat) };
      if (compat.note != null) cell.note = compat.note;
      cells.push(cell);
    }
  }

  const designSystems = frameworkIds.map(framework => ({
    framework,
    systems: designSystemsForFramework(framework).map(ds => ({ id: ds.id, displayName: ds.displayName })),
  }));

  return { generatedFrom: 'create-atomic-testing', frameworks, runners, cells, designSystems };
}

// Only write when invoked as a script — importing (from the sync-check) must not
// touch the filesystem.
const invokedDirectly = import.meta.url === pathToFileURL(process.argv[1] ?? '').href;
if (invokedDirectly) {
  try {
    const matrix = await buildMatrix();
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, `${JSON.stringify(matrix, null, 2)}\n`);
    process.stdout.write(`[support-matrix] Wrote ${outputPath}\n`);
  } catch (error) {
    if (error.code === 'E_NO_DIST') {
      console.error(`[support-matrix] ${error.message}.`);
      console.error('[support-matrix] Run: pnpm --filter create-atomic-testing build');
      process.exit(2);
    }
    throw error;
  }
}
