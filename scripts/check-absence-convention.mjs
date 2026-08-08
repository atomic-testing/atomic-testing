#!/usr/bin/env node
// Absence-convention gate (ABSENCE-*). Enforces ADR-006 §7's split for reads:
//
//   Optional<T>  (undefined) — "nothing was found". A lookup that came up empty.
//   Nullable<T>  (null)      — "a value the form itself holds", which may be empty.
//                              Never a bare `| null` for "not found".
//
// The ADR ratified that split; nothing enforced it. `component-driver-fluent-v9` was
// converted by hand under #1305 and the other twelve driver packages were not, so 76
// lookups across them still answered "not found" with `null` — and a new driver could
// add more without anything going red, because a wrong absence spelling is a perfectly
// well-typed program.
//
// ABSENCE-01 flags `Promise<Identifier | null>` where the identifier is a driver, a
// locator, or any other looked-up thing. Value reads are exempt by TYPE rather than by
// name: `Promise<string | null>` / `number` / `boolean` / `Date` are exactly the shapes
// §7 blesses as Nullable, and a literal union (`Promise<'left' | 'right' | null>`) is a
// held value by construction. Anything else naming a real type is a thing that was
// looked up, so its absence is `undefined`.
//
// Deliberately syntactic, not type-aware: it must run in the same cheap dependency-free
// pass as its sibling checks, and the shape it looks for is unambiguous in source. The
// cost is that it reads signatures, not intent — hence EXEMPT below.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packagesDir = resolve(repoRoot, 'packages');

// `Promise<T | null>` where T is one of these is a VALUE read, which ADR-006 §7 keeps
// as null on purpose.
const VALUE_TYPES = new Set(['string', 'number', 'boolean', 'Date']);

// Genuine `| null` reads that are not lookups. Keyed by "<relative path>:<type>" so an
// exemption cannot silently widen to another type in the same file.
const EXEMPT = new Map([
  [
    'packages/component-driver-mui-x-v9/src/components/datepicker/PickerFieldDriverBase.ts:TValue',
    'getValue() is a value read, and null is the empty picker — it implements ' +
      'IInputDriver<TValue | null>, so the null is the interface contract, not an absence spelling.',
  ],
  [
    'packages/create-atomic-testing/src/prompt/interactive.ts:RecipeSelection',
    'A CLI prompt result, not a driver read: null means the user cancelled.',
  ],
]);

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist') continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (entry.endsWith('.ts') && !entry.endsWith('.d.ts')) yield path;
  }
}

const errors = [];
let scanned = 0;
let exempted = 0;

for (const pkgDir of readdirSync(packagesDir).sort()) {
  const srcDir = join(packagesDir, pkgDir, 'src');
  try {
    if (!statSync(srcDir).isDirectory()) continue;
  } catch {
    continue;
  }
  for (const path of walk(srcDir)) {
    scanned += 1;
    const relPath = path.slice(repoRoot.length + 1);
    const lines = readFileSync(path, 'utf8').split('\n');
    lines.forEach((line, index) => {
      const match = /Promise<([A-Za-z][A-Za-z0-9_]*) \| null>/.exec(line);
      if (!match) return;
      const type = match[1];
      if (VALUE_TYPES.has(type)) return;
      if (EXEMPT.has(`${relPath}:${type}`)) {
        exempted += 1;
        return;
      }
      errors.push(
        `ABSENCE-01: ${relPath}:${index + 1} returns \`Promise<${type} | null>\`. Per ADR-006 §7 a read ` +
          `that reports "nothing was found" must say so with \`Optional<${type}>\` (undefined); a bare ` +
          `\`| null\` is reserved for a value the component itself holds. If this genuinely reads a ` +
          `held value rather than looking something up, add it to EXEMPT here with that reason.`
      );
    });
  }
}

if (errors.length > 0) {
  console.error(`[absence-convention] ${errors.length} problem(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

process.stdout.write(
  `[absence-convention] OK — ${scanned} source file(s) report absence per ADR-006 §7` +
    `${exempted > 0 ? ` (${exempted} documented value-read exemption(s))` : ''}.\n`
);
