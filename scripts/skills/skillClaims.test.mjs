// Unit tests for the skill-sync claim logic. Run with `node --test`.
import assert from 'node:assert/strict';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
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

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const skillsDir = resolve(repoRoot, '.claude/skills');
const coreBlob = readSourceBlob(resolve(repoRoot, 'packages/core/src'));
const { blob: skillBlob } = readSkillTexts(skillsDir);
const real = realDesignSystemFamilies(resolve(repoRoot, 'packages'));

test('every canonical core symbol resolves against the real core source', () => {
  for (const symbol of CANONICAL_CORE_SYMBOLS) {
    assert.ok(coreSymbolExists(coreBlob, symbol), `${symbol.name} should exist in packages/core/src`);
  }
});

test('every canonical core symbol is actually referenced by a skill', () => {
  for (const symbol of CANONICAL_CORE_SYMBOLS) {
    assert.ok(skillMentionsSymbol(skillBlob, symbol), `${symbol.name} should be referenced in a skill`);
  }
});

test('coreSymbolExists reports false for a fabricated symbol (drift would fail)', () => {
  assert.equal(coreSymbolExists(coreBlob, { name: 'HTMLComponentDriver', kind: 'export' }), false);
  assert.equal(coreSymbolExists(coreBlob, { name: 'totallyMadeUpMethod', kind: 'member' }), false);
});

test('coreSymbolExists distinguishes waitUntil from waitUntilComponentState', () => {
  // Both are real; the point is `waitUntil` must not only match inside the longer name.
  assert.ok(coreSymbolExists(coreBlob, { name: 'waitUntil', kind: 'member' }));
  const noBareWaitUntil = coreBlob.replaceAll(/waitUntil\s*[<(]/g, 'waitUntilComponentState(');
  assert.equal(coreSymbolExists(noBareWaitUntil, { name: 'waitUntil', kind: 'member' }), false);
});

test('real design-system families include the version-stripped set', () => {
  for (const family of ['html', 'mui', 'mui-x', 'angular-material', 'primevue', 'radix', 'shadcn', 'astryx']) {
    assert.ok(real.has(family), `${family} should be a real component-driver family`);
  }
});

test('every real family is accounted for in DESIGN_SYSTEM_FAMILIES (guards SYNC-03)', () => {
  for (const family of real) {
    assert.ok(family in DESIGN_SYSTEM_FAMILIES, `${family} must be a key in DESIGN_SYSTEM_FAMILIES`);
  }
});

test('every configured family maps to a real package (guards SYNC-04)', () => {
  for (const family of Object.keys(DESIGN_SYSTEM_FAMILIES)) {
    assert.ok(real.has(family), `configured family ${family} must ship a package`);
  }
});

test('every non-null family keyword is present in the skill prose (guards SYNC-05)', () => {
  for (const [family, keyword] of Object.entries(DESIGN_SYSTEM_FAMILIES)) {
    if (keyword != null) {
      assert.ok(skillMentionsKeyword(skillBlob, keyword), `${family} keyword "${keyword}" should appear in the skills`);
    }
  }
});

test('skillMentionsKeyword is case-insensitive (Radix ↔ radix)', () => {
  assert.ok(skillMentionsKeyword('… Radix portals menus to <body> …', 'radix'));
  assert.equal(skillMentionsKeyword('no design system here', 'radix'), false);
});
