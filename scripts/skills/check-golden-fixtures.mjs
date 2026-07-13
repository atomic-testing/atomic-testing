#!/usr/bin/env node
// Golden-fixture regression harness (deterministic half).
//
// The repo's own example apps are the answer key for correct decomposition:
// each uses the "one thin page-object driver composing feature drivers" shape.
// This script asserts two things that CAN be checked mechanically:
//
//   1. Every golden-fixture driver/scene still passes the structural analyzer
//      with zero HARD errors (warnings — parts ceiling, missing lock — are fine).
//   2. The `example-mui-signup-form` decomposition ANTI-pattern still holds:
//      no single page-level wizard driver exists yet. This check is inverted on
//      purpose (see antiPattern.mjs); it flips to a real regression test the day
//      that example is fixed.
//
// The part that CANNOT be automated — handing a stripped fixture to an agent
// driving `scaffold-test-driver` and grading the regenerated driver — is the
// eval-time workflow documented in scripts/skills/README.md, driven by
// snapshot-fixture.mjs. This script is its deterministic scorer.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { findWizardPageObject } from './antiPattern.mjs';
import { analyzeDriverSource, hasErrors } from './driverStructure.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

const GOLDEN_FIXTURE_DIRS = [
  'examples/example-astryx-workspace/src/testing',
  'examples/example-mui-ticket-console/src/testing',
  'examples/example-shadcn-workspace/src/testing',
];

function structuralErrors() {
  const errors = [];
  let checked = 0;
  for (const rel of GOLDEN_FIXTURE_DIRS) {
    const dir = resolve(repoRoot, rel);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      if (!name.endsWith('.ts')) continue;
      const file = join(dir, name);
      checked++;
      const { findings } = analyzeDriverSource(readFileSync(file, 'utf8'), { fileName: file });
      if (hasErrors(findings)) {
        for (const f of findings.filter(x => x.severity === 'error')) {
          errors.push(`${rel}/${name}: [${f.code}] ${f.message}`);
        }
      }
    }
  }
  return { errors, checked };
}

function main() {
  const problems = [];

  const { errors, checked } = structuralErrors();
  problems.push(...errors);

  // Inverted anti-pattern assertion — see antiPattern.mjs for why this is here.
  const wizard = findWizardPageObject(repoRoot);
  if (wizard) {
    const rel = wizard.file.startsWith(repoRoot) ? wizard.file.slice(repoRoot.length + 1) : wizard.file;
    problems.push(
      `ANTI-PATTERN RESOLVED: ${rel} now composes step drivers [${wizard.drivers.join(', ')}] into one ` +
        `scene — the signup-form wizard finally has a page object. This inverted check has done its job. ` +
        `Flip the assertion in antiPattern.mjs to REQUIRE the page object, and update the "anti-pattern" ` +
        `framing in docs/docs/guides/decomposing-driver-trees.md.`
    );
  }

  if (problems.length > 0) {
    console.error(`[golden-fixtures] ${problems.length} problem(s):`);
    for (const p of problems) console.error(`  - ${p}`);
    process.exitCode = 1;
    return;
  }

  process.stdout.write(
    `[golden-fixtures] OK — ${checked} golden driver/scene file(s) structurally clean; ` +
      `signup-form wizard page-object gap still present (inverted anti-pattern check).\n`
  );
}

main();
