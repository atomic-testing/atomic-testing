#!/usr/bin/env node
// Skill-sync gate (SKILL-SYNC-*), modelled on check-recipe-sync.mjs. Fails CI when
// a claim in a `.claude/skills/*/SKILL.md` has drifted from the real library:
//
//   SKILL-SYNC-01  a core symbol the skills name no longer exists in packages/core/src
//   SKILL-SYNC-02  the canonical symbol list names one no skill actually references (stale list)
//   SKILL-SYNC-03  a shipped component-driver-* family is unaccounted-for (add it to skillClaims.mjs)
//   SKILL-SYNC-04  skillClaims.mjs names a design-system family with no shipped package
//   SKILL-SYNC-05  a family the config says the skills reference is no longer mentioned in the prose
//   SKILL-SYNC-06  the scaffolder's embedded skill copy has drifted from .claude/skills/
//
// Exit 0 = in sync; exit 1 = drift (report printed); exit 2 = misconfiguration.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  CANONICAL_CORE_SYMBOLS,
  coreSymbolExists,
  DESIGN_SYSTEM_FAMILIES,
  readSkillTexts,
  readSourceBlob,
  realDesignSystemFamilies,
  skillMentionsKeyword,
  skillMentionsSymbol,
} from './skillClaims.mjs';
import { GENERATED_MODULE_REL, renderSkillContentModule } from './skillEmbed.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const skillsDir = resolve(repoRoot, '.claude/skills');
const coreSrc = resolve(repoRoot, 'packages/core/src');
const packagesDir = resolve(repoRoot, 'packages');

function main() {
  for (const path of [skillsDir, coreSrc, packagesDir]) {
    if (!existsSync(path)) {
      console.error(`[skill-sync] Missing expected path: ${path}`);
      process.exit(2);
    }
  }

  const errors = [];
  const { blob: skillBlob } = readSkillTexts(skillsDir);
  const coreBlob = readSourceBlob(coreSrc);

  // 01 / 02 — core symbols exist in source, and the canonical list stays honest.
  for (const symbol of CANONICAL_CORE_SYMBOLS) {
    if (!coreSymbolExists(coreBlob, symbol)) {
      errors.push(
        `SKILL-SYNC-01: the skills reference \`${symbol.name}\`, which no longer exists in packages/core/src.`
      );
    }
    if (!skillMentionsSymbol(skillBlob, symbol)) {
      errors.push(
        `SKILL-SYNC-02: \`${symbol.name}\` is in CANONICAL_CORE_SYMBOLS but no skill references it — drop it from skillClaims.mjs.`
      );
    }
  }

  // 03 / 04 / 05 — design-system families are three-way consistent
  // (real packages ↔ skillClaims config ↔ skill prose).
  const real = realDesignSystemFamilies(packagesDir);
  for (const family of [...real].sort()) {
    if (!(family in DESIGN_SYSTEM_FAMILIES)) {
      errors.push(
        `SKILL-SYNC-03: component-driver-${family}* ships but is not accounted for in skillClaims.mjs ` +
          `DESIGN_SYSTEM_FAMILIES. Add it with the keyword the skills use, or \`null\` to acknowledge it ships ` +
          `without being enumerated by the general skills.`
      );
    }
  }
  for (const [family, keyword] of Object.entries(DESIGN_SYSTEM_FAMILIES)) {
    if (!real.has(family)) {
      errors.push(
        `SKILL-SYNC-04: skillClaims.mjs names design-system family "${family}", which has no component-driver-${family}* package.`
      );
    }
    if (keyword != null && !skillMentionsKeyword(skillBlob, keyword)) {
      errors.push(
        `SKILL-SYNC-05: the skills are expected to reference "${family}" (keyword "${keyword}") but the prose no longer does.`
      );
    }
  }

  // 06 — the scaffolder's embedded copy matches the source skills byte-for-byte.
  const generatedPath = resolve(repoRoot, GENERATED_MODULE_REL);
  if (!existsSync(generatedPath)) {
    errors.push(`SKILL-SYNC-06: ${GENERATED_MODULE_REL} is missing. Run: pnpm gen:skill-content`);
  } else if (readFileSync(generatedPath, 'utf8') !== renderSkillContentModule(skillsDir)) {
    errors.push(
      `SKILL-SYNC-06: ${GENERATED_MODULE_REL} is out of sync with .claude/skills/. Run: pnpm gen:skill-content (and commit).`
    );
  }

  if (errors.length > 0) {
    console.error(`[skill-sync] ${errors.length} problem(s):`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }

  process.stdout.write(
    `[skill-sync] OK — ${CANONICAL_CORE_SYMBOLS.length} core symbol(s) resolve, ` +
      `${real.size} design-system famil(y|ies) accounted for, embedded skills in sync.\n`
  );
}

main();
