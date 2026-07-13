// Structural-invariant analyzer for atomic-testing driver / scene files.
//
// This is the deterministic half of the golden-fixture regression harness: the
// `scaffold-test-driver` Skill is instructions for an agent, not a codegen
// program, so we cannot mechanically re-derive a driver — but we CAN check that
// any driver file (hand-written or agent-produced) still obeys the fixed
// composite-driver idioms the Skill mandates. Point it at a file and it reports
// the invariants that hold, the ones that regressed, and the soft signals worth
// a human's eye.
//
// Severity policy is deliberate:
//   - `error`  → a load-bearing invariant broke; the file is structurally wrong.
//   - `warn`   → an advisory signal (approaching the god-driver ceiling, or a
//                missing belt-and-suspenders guard). Legitimate drivers trip
//                these; the shipped example drivers do (AdminSettingsDriver has
//                13 parts; none carry the `_Lock`), so warnings must never fail
//                a build. The checker's exit code keys off `error` only.
//
// Dependency-free Node ESM, mirroring the house `check-*.mjs` scripts. Kept pure
// (source string in, findings out) so it is unit-testable without a filesystem.

/** The composite-driver base classes whose subclasses carry the fixed idioms. */
const DRIVER_BASES = ['ComponentDriver', 'ContainerDriver', 'ListComponentDriver'];

/** Soft upper bound on a single driver's direct parts before extraction is due. */
export const PARTS_CEILING = 10;

/**
 * A single structural observation about a file.
 * @typedef {{ severity: 'error' | 'warn' | 'info', code: string, message: string }} Finding
 */

/**
 * Strip line and block comments so idiom patterns matched in prose/JSDoc (a
 * driver's own doc comment often names `satisfies ScenePart` or a method) never
 * masquerade as code. Leaves `://` (URLs) intact and ignores comment markers
 * inside string/template literals.
 * @param {string} src
 * @returns {string}
 */
function stripComments(src) {
  let out = '';
  let i = 0;
  let str = null; // active string delimiter, or null
  while (i < src.length) {
    const c = src[i];
    const next = src[i + 1];
    if (str) {
      out += c;
      if (c === '\\') {
        out += next ?? '';
        i += 2;
        continue;
      }
      if (c === str) str = null;
      i++;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      str = c;
      out += c;
      i++;
      continue;
    }
    if (c === '/' && next === '*') {
      const end = src.indexOf('*/', i + 2);
      i = end === -1 ? src.length : end + 2;
      out += ' ';
      continue;
    }
    // Line comment, but not the `//` inside a `://` URL.
    if (c === '/' && next === '/' && src[i - 1] !== ':') {
      const end = src.indexOf('\n', i);
      i = end === -1 ? src.length : end;
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

/**
 * Return the balanced substring beginning at the bracket at `openIdx`
 * (inclusive of both brackets), honoring nested brackets and string literals.
 * @param {string} src
 * @param {number} openIdx index of an opening `{`, `(` or `[`
 * @returns {string | null}
 */
function extractBalanced(src, openIdx) {
  const open = src[openIdx];
  const close = { '{': '}', '(': ')', '[': ']' }[open];
  if (!close) return null;
  let depth = 0;
  let str = null;
  for (let i = openIdx; i < src.length; i++) {
    const c = src[i];
    if (str) {
      if (c === '\\') {
        i++;
        continue;
      }
      if (c === str) str = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      str = c;
      continue;
    }
    if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) return src.slice(openIdx, i + 1);
    }
  }
  return null;
}

/**
 * Count the direct (depth-1) keys of an object literal — the driver's own parts,
 * never the `locator`/`driver` sub-keys nested one level down.
 * @param {string} objLiteral a balanced `{ ... }` string
 * @returns {number}
 */
function topLevelKeyCount(objLiteral) {
  let depth = 0;
  let str = null;
  let atKeyStart = false;
  let count = 0;
  for (let i = 0; i < objLiteral.length; i++) {
    const c = objLiteral[i];
    if (str) {
      if (c === '\\') {
        i++;
        continue;
      }
      if (c === str) str = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      // A quoted key at a key position still counts.
      if (depth === 1 && atKeyStart) {
        const rest = objLiteral.slice(i);
        if (/^(["'`])(?:\\.|(?!\1).)*\1\s*:/.test(rest)) count++;
        atKeyStart = false;
      }
      str = c;
      continue;
    }
    if (c === '{' || c === '(' || c === '[') {
      depth++;
      if (depth === 1) atKeyStart = true; // just entered the outer object
      continue;
    }
    if (c === '}' || c === ')' || c === ']') {
      depth--;
      continue;
    }
    if (depth === 1) {
      if (c === ',') {
        atKeyStart = true;
        continue;
      }
      if (atKeyStart && /[A-Za-z_$]/.test(c)) {
        const rest = objLiteral.slice(i);
        const m = rest.match(/^[A-Za-z_$][\w$]*\s*:/);
        if (m) count++;
        atKeyStart = false;
        continue;
      }
      if (!/\s/.test(c)) atKeyStart = false;
    }
  }
  return count;
}

/**
 * Locate `const <name> = { ... } satisfies ScenePart` (or without the
 * `satisfies`), returning the object literal, the declared name, and whether the
 * `satisfies ScenePart` assertion is present.
 * @param {string} code comment-stripped source
 * @returns {{ name: string, object: string, hasSatisfies: boolean }[]}
 */
function findSceneObjects(code) {
  const results = [];
  const decl = /(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=\s*\{/g;
  let match;
  while ((match = decl.exec(code)) !== null) {
    const braceIdx = code.indexOf('{', match.index);
    const object = extractBalanced(code, braceIdx);
    if (!object) continue;
    const after = code.slice(braceIdx + object.length, braceIdx + object.length + 40);
    const hasSatisfies = /^\s*satisfies\s+ScenePart\b/.test(after);
    // Only treat it as a scene object when it is asserted as one, or when its
    // entries look like `{ locator: ..., driver: ... }` part definitions.
    const looksLikeScene = hasSatisfies || /\bdriver\s*:/.test(object);
    if (looksLikeScene) results.push({ name: match[1], object, hasSatisfies });
  }
  return results;
}

/**
 * @param {string} code comment-stripped source
 * @returns {{ name: string, base: string }[]}
 */
function findDriverClasses(code) {
  const classes = [];
  const re = new RegExp(String.raw`class\s+([A-Za-z_$][\w$]*)\s+extends\s+(${DRIVER_BASES.join('|')})\b`, 'g');
  let match;
  while ((match = re.exec(code)) !== null) {
    classes.push({ name: match[1], base: match[2] });
  }
  return classes;
}

/**
 * Analyze one driver / scene file's source for the composite-driver structural
 * invariants. Pure: no I/O, no reliance on filename beyond the optional hints.
 *
 * @param {string} source raw file contents
 * @param {{ fileName?: string, page?: boolean }} [options]
 *   `page` (or a `*Parts.ts` filename) marks a page-level scene, which must have
 *   exactly one root entry (six-rule algorithm, rule 6).
 * @returns {{ kind: 'driver' | 'scene' | 'unknown', findings: Finding[] }}
 */
export function analyzeDriverSource(source, options = {}) {
  const { fileName = '', page } = options;
  const code = stripComments(source);
  /** @type {Finding[]} */
  const findings = [];

  const classes = findDriverClasses(code);
  const scenes = findSceneObjects(code);
  const isPageScene = page === true || /Parts\.ts$/.test(fileName);

  // A file with a driver class is a driver file; a scene-only file (no class,
  // like workspaceParts.ts) is a scene file. This split is what distinguishes a
  // page-root scene from an inner content/parts object declared beside a class.
  const kind = classes.length > 0 ? 'driver' : scenes.length > 0 ? 'scene' : 'unknown';

  if (kind === 'driver') {
    analyzeDriverFile(code, classes, scenes, findings);
  } else if (kind === 'scene') {
    analyzeSceneFile(scenes, isPageScene, findings);
  } else {
    findings.push({
      severity: 'info',
      code: 'no-driver',
      message: 'No composite driver class or ScenePart object found — nothing to check.',
    });
  }

  return { kind, findings };
}

/**
 * @param {string} code
 * @param {{ name: string, base: string }[]} classes
 * @param {ReturnType<typeof findSceneObjects>} scenes
 * @param {Finding[]} findings
 */
function analyzeDriverFile(code, classes, scenes, findings) {
  // The module-level `parts` object the class composes (the driver's own parts).
  const partsScene = scenes.find(s => s.name === 'parts') ?? scenes[0];

  // (1) satisfies ScenePart — the compile-time shape lock on the parts map.
  if (partsScene && !partsScene.hasSatisfies) {
    findings.push({
      severity: 'error',
      code: 'missing-satisfies',
      message: `The parts object (\`${partsScene.name}\`) is not asserted with \`satisfies ScenePart\`; the compile-time shape lock is missing.`,
    });
  }

  // (2) Contravariant constructor. The load-bearing rule: the option parameter
  // must be the EMPTY-default `Partial<IComponentDriverOption>`. Parameterizing
  // it (`IComponentDriverOption<typeof parts>`) makes the class unplaceable in a
  // parent ScenePart — a hard error.
  if (/IComponentDriverOption\s*</.test(code)) {
    findings.push({
      severity: 'error',
      code: 'parameterized-option',
      message:
        'Constructor option is typed `Partial<IComponentDriverOption<...>>`. Constructor params are contravariant, so this makes the driver unplaceable in a parent scene. Use the empty-default `Partial<IComponentDriverOption>` and hardcode `parts` in the body.',
    });
  }
  const hasContravariantCtor =
    /constructor\s*\([^)]*option\s*\??\s*:\s*Partial<IComponentDriverOption>[^)]*\)/.test(code) &&
    /super\s*\([^)]*\{\s*\.\.\.option\s*,\s*parts\s*\}/.test(code);
  if (partsScene && !hasContravariantCtor) {
    findings.push({
      severity: 'warn',
      code: 'missing-contravariant-ctor',
      message:
        'No constructor of the form `constructor(locator, interactor, option?: Partial<IComponentDriverOption>)` forwarding `{ ...option, parts }` to super was found. Composite drivers should hardcode their parts this way.',
    });
  }

  // (3) AssertScenePlaceableDriver lock. Advisory: it is the belt-and-suspenders
  // compile guard the Skill recommends, but the shipped example drivers omit it
  // and are still correct, so its absence is a warning, never a failure.
  for (const cls of classes) {
    const locked = new RegExp(String.raw`AssertScenePlaceableDriver<\s*typeof\s+${cls.name}\s*>`).test(code);
    if (!locked) {
      findings.push({
        severity: 'warn',
        code: 'missing-lock',
        message: `\`${cls.name}\` has no \`AssertScenePlaceableDriver<typeof ${cls.name}>\` lock. Recommended so a constructor regression fails here rather than at a distant call site.`,
      });
    }
  }

  // (4) Parts-count ceiling. Explicitly flag-don't-fail: a driver may legitimately
  // exceed it (a settings form is one domain concern with many controls).
  if (partsScene) {
    const count = topLevelKeyCount(partsScene.object);
    if (count > PARTS_CEILING) {
      findings.push({
        severity: 'warn',
        code: 'parts-ceiling',
        message: `\`${partsScene.name}\` declares ${count} direct parts (> ${PARTS_CEILING}). Review whether a child driver should be extracted; some single-domain drivers legitimately exceed this.`,
      });
    } else {
      findings.push({
        severity: 'info',
        code: 'parts-count',
        message: `\`${partsScene.name}\` declares ${count} direct part(s).`,
      });
    }
  }
}

/**
 * @param {ReturnType<typeof findSceneObjects>} scenes
 * @param {boolean} isPageScene
 * @param {Finding[]} findings
 */
function analyzeSceneFile(scenes, isPageScene, findings) {
  const scene = scenes.find(s => s.hasSatisfies) ?? scenes[0];
  if (!scene) return;

  if (!scene.hasSatisfies) {
    findings.push({
      severity: 'error',
      code: 'missing-satisfies',
      message: `Scene object \`${scene.name}\` is not asserted with \`satisfies ScenePart\`.`,
    });
  }

  const count = topLevelKeyCount(scene.object);
  if (isPageScene) {
    if (count !== 1) {
      findings.push({
        severity: 'error',
        code: 'page-multiple-roots',
        message: `A page-level scene must have exactly one root entry pointing to its page-object driver (six-rule algorithm, rule 6); \`${scene.name}\` has ${count}. A flat bag of unrelated parts is the canonical decomposition failure.`,
      });
    } else {
      findings.push({
        severity: 'info',
        code: 'page-single-root',
        message: `Page scene \`${scene.name}\` has exactly one root entry.`,
      });
    }
  } else {
    findings.push({
      severity: 'info',
      code: 'scene-count',
      message: `Scene \`${scene.name}\` declares ${count} entr${count === 1 ? 'y' : 'ies'}.`,
    });
  }
}

/** Convenience: does a findings array contain any hard error? */
export function hasErrors(findings) {
  return findings.some(f => f.severity === 'error');
}

// Exported for unit tests of the internal helpers.
export const _internal = { stripComments, extractBalanced, topLevelKeyCount, findSceneObjects, findDriverClasses };
