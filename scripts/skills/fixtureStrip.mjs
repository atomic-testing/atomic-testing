// Pure text transforms for the fixture snapshot/restore workflow. Kept separate
// from the fs-touching CLI (snapshot-fixture.mjs) so the (fiddly) consumer-edit
// logic is unit-testable against the real golden files.

/**
 * A fixture describes one strippable driver in a golden example app and how to
 * un-wire it from its page-object consumer, so an agent (or human) driving
 * `scaffold-test-driver` regenerates both the driver AND its scene wiring.
 * @typedef {{
 *   example: string,
 *   driverPath: string,
 *   consumerPath: string,
 *   removeLinePatterns: RegExp[],
 *   removeMethods: string[],
 *   description: string,
 * }} Fixture
 */

/** @type {Record<string, Fixture>} */
export const FIXTURES = {
  'admin-settings': {
    example: 'examples/example-astryx-workspace',
    driverPath: 'examples/example-astryx-workspace/src/testing/AdminSettingsDriver.ts',
    consumerPath: 'examples/example-astryx-workspace/src/testing/WorkspaceDriver.ts',
    // Un-wire AdminSettingsDriver from the WorkspaceDriver page object: its
    // import, its `admin:` ScenePart entry, and its `get admin()` accessor.
    removeLinePatterns: [
      /import\s*\{\s*AdminSettingsDriver\s*\}\s*from\s*'\.\/AdminSettingsDriver';/,
      /^\s*admin:\s*\{.*driver:\s*AdminSettingsDriver.*\},\s*$/m,
    ],
    removeMethods: ['admin'],
    description:
      'Strips the AdminSettingsDriver feature driver (13 parts, a settings form) and un-wires it from ' +
      'WorkspaceDriver, so scaffold-test-driver must re-create the driver and re-compose it into the page object.',
  },
};

/**
 * Remove whole lines matching any of the patterns.
 * @param {string} source
 * @param {RegExp[]} patterns
 * @returns {string}
 */
export function removeLines(source, patterns) {
  return source
    .split('\n')
    .filter(line => !patterns.some(p => (p.global || p.multiline ? new RegExp(p.source).test(line) : p.test(line))))
    .join('\n');
}

/**
 * Remove a brace-balanced accessor/method block (`get <name>() { ... }` or
 * `<name>(...) { ... }`) including its leading indentation and the blank line
 * that typically follows it.
 * @param {string} source
 * @param {string} name method/accessor name
 * @returns {string}
 */
export function removeMethodBlock(source, name) {
  const sig = new RegExp(String.raw`\n[ \t]*(?:async\s+)?(?:get\s+)?${name}\s*\(`);
  const sigMatch = sig.exec(source);
  if (!sigMatch) return source;
  const start = sigMatch.index; // at the leading newline
  const braceOpen = source.indexOf('{', sigMatch.index);
  if (braceOpen === -1) return source;
  let depth = 0;
  let end = -1;
  for (let i = braceOpen; i < source.length; i++) {
    const c = source[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end === -1) return source;
  // Swallow one trailing blank line if the block was followed by one.
  let tail = end;
  if (source.slice(end).startsWith('\n\n')) tail = end + 1;
  return source.slice(0, start) + source.slice(tail);
}

/**
 * Apply a fixture's consumer un-wiring to the consumer file's source.
 * @param {string} source consumer file contents
 * @param {Fixture} fixture
 * @returns {string}
 */
export function stripConsumer(source, fixture) {
  let out = removeLines(source, fixture.removeLinePatterns);
  for (const method of fixture.removeMethods) {
    out = removeMethodBlock(out, method);
  }
  return out;
}

/** Cheap structural sanity check: braces stay balanced after an edit. */
export function bracesBalanced(source) {
  let depth = 0;
  let str = null;
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    if (str) {
      if (c === '\\') {
        i++;
        continue;
      }
      if (c === str) str = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') str = c;
    else if (c === '{') depth++;
    else if (c === '}') depth--;
  }
  return depth === 0;
}
