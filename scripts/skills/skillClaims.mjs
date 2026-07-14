// Pure claim-extraction + source-of-truth lookups for the skill-sync gate.
//
// The four SKILL.md files make concrete, checkable claims: they name core driver
// classes/methods, and they reference design-system driver packages. This module
// cross-checks those claims against the real `packages/core/src/` exports and the
// real `packages/component-driver-*` directory listing, so a rename/removal in the
// library turns a stale skill into a red build (mirroring check-recipe-sync.mjs).
//
// Dependency-free; separated from the CLI so it is unit-testable.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The load-bearing core symbols the skills reference by name, each with the kind
 * that decides how "does it still exist" is verified. Classes/types must be a
 * real export; members are verified as declared identifiers (they reach adopters
 * transitively through their owning class).
 * @type {{ name: string, kind: 'export' | 'member' }[]}
 */
export const CANONICAL_CORE_SYMBOLS = [
  { name: 'ComponentDriver', kind: 'export' },
  { name: 'ContainerDriver', kind: 'export' },
  { name: 'ListComponentDriver', kind: 'export' },
  { name: 'AssertScenePlaceableDriver', kind: 'export' },
  { name: 'commutableOption', kind: 'member' },
  { name: 'waitUntilComponentState', kind: 'member' },
  { name: 'waitUntil', kind: 'member' },
];

/**
 * Design-system families the skills may reference. `keyword` is the case-
 * insensitive token the skill prose uses; `null` marks a family that ships but is
 * intentionally NOT enumerated by the general skills (they reference DS packages
 * by illustrative pattern, not exhaustively). Every family is listed so that a
 * genuinely NEW `component-driver-*` package — neither named nor acknowledged —
 * still trips the gate, exactly like check-scaffolder-coverage's allow-list.
 * @type {Record<string, string | null>}
 */
export const DESIGN_SYSTEM_FAMILIES = {
  html: 'component-driver-html',
  mui: '-mui-v',
  'angular-material': 'angular-material',
  primevue: 'primevue',
  shadcn: 'shadcn',
  radix: 'radix',
  'mui-x': null,
  astryx: null,
  fluent: null,
};

/**
 * Read the given skills' SKILL.md bodies as one searchable blob plus per-file map.
 * Takes an explicit `skillIds` list (callers pass skillEmbed.mjs's `SKILL_IDS`)
 * rather than globbing every directory under `skillsDir` — `.claude/skills/` also
 * holds contributor-only skills (e.g. backfill-driver-feature) that aren't part of
 * what's distributed, and letting their prose satisfy a claim would let the four
 * distributed skills drift without the gate noticing.
 */
export function readSkillTexts(skillsDir, skillIds) {
  const byId = {};
  for (const id of skillIds) {
    byId[id] = readFileSync(join(skillsDir, id, 'SKILL.md'), 'utf8');
  }
  return { byId, blob: Object.values(byId).join('\n') };
}

/** Recursively concatenate every `.ts` under a directory (source of truth grep). */
export function readSourceBlob(dir) {
  let blob = '';
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      blob += readSourceBlob(full);
    } else if (name.endsWith('.ts')) {
      blob += `\n${readFileSync(full, 'utf8')}`;
    }
  }
  return blob;
}

/** Does the core source declare/export `symbol` per its kind? */
export function coreSymbolExists(coreBlob, symbol) {
  if (symbol.kind === 'export') {
    const re = new RegExp(
      String.raw`export\s+(?:declare\s+)?(?:abstract\s+)?(?:class|type|interface)\s+${symbol.name}\b`
    );
    return re.test(coreBlob);
  }
  // member: a method (`name(` / `name<`) or a property declaration.
  return (
    new RegExp(String.raw`\b${symbol.name}\s*[<(]`).test(coreBlob) ||
    new RegExp(String.raw`\b${symbol.name}\s*[:=]`).test(coreBlob)
  );
}

/**
 * Does any skill reference `symbol` by name? A plain word-boundary match — members
 * appear both as calls (`waitUntil(`) and property reads (`this.commutableOption`),
 * and `\bwaitUntil\b` will not spuriously match inside `waitUntilComponentState`.
 */
export function skillMentionsSymbol(skillBlob, symbol) {
  return new RegExp(String.raw`\b${symbol.name}\b`).test(skillBlob);
}

/** Case-insensitive substring test used for design-system keyword matching. */
export function skillMentionsKeyword(skillBlob, keyword) {
  return skillBlob.toLowerCase().includes(keyword.toLowerCase());
}

/** Real design-system families = version-stripped `component-driver-*` dir names. */
export function realDesignSystemFamilies(packagesDir) {
  const families = new Set();
  for (const dir of readdirSync(packagesDir)) {
    if (!dir.startsWith('component-driver-')) continue;
    families.add(dir.replace(/^component-driver-/, '').replace(/-v[0-9]+$/, ''));
  }
  return families;
}
