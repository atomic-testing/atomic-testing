/**
 * CSS selectors have two escaping contexts, and the same input needs *different* output
 * in each — which is why this module exposes two escapers rather than one blanket
 * `escape`:
 *
 * - **Identifier position** — `#id`, `.class`, and the attribute *name* in `[name=…]`.
 *   Only `-`, `_`, ASCII alphanumerics, non-ASCII code points and escape sequences are
 *   legal, and the leading characters are restricted further: an identifier may not
 *   start with a digit, nor with `-` followed by a digit. Those cases need the numeric
 *   `\<hex><space>` form, because `\1` would just re-read as the digit.
 *   Use {@link escapeCssIdentifier}.
 * - **Quoted-string position** — the value in `[name="…"]`. Nearly everything is legal
 *   verbatim; only `"`, `\` and control characters need escaping (a raw newline
 *   terminates the string outright). Use {@link escapeCssString}.
 *
 * Getting the context wrong fails *silently*: over-escaping happens to round-trip in
 * string position, because the CSS string parser collapses `\.` back to `.`. So a single
 * shared escaper looks correct on every input except the ones where it isn't — which is
 * exactly why the two contexts are separated here instead of sharing one table.
 *
 * `CSS.escape` is deliberately not used. It is a DOM global, and this package must stay
 * DOM-free: `@atomic-testing/playwright` imports it and runs in plain Node.
 * The algorithms below are the CSSOM ones, implemented directly.
 * @see https://drafts.csswg.org/cssom/#serialize-an-identifier
 * @see https://drafts.csswg.org/cssom/#serialize-a-string
 */

/**
 * The CSSOM "escaped as code point" form: a backslash, the lowercase hex code point, and
 * a space terminator. The terminator is what stops the parser from swallowing a
 * following hex digit into the escape sequence.
 */
function escapeAsCodePoint(codePoint: number): string {
  return `\\${codePoint.toString(16)} `;
}

function isAsciiDigit(codePoint: number): boolean {
  return codePoint >= 0x30 && codePoint <= 0x39;
}

/** Code points an identifier may carry verbatim once past the restricted leading positions. */
function isIdentifierSafe(codePoint: number): boolean {
  return (
    isAsciiDigit(codePoint) ||
    codePoint === 0x2d /* - */ ||
    codePoint === 0x5f /* _ */ ||
    (codePoint >= 0x41 && codePoint <= 0x5a) /* A-Z */ ||
    (codePoint >= 0x61 && codePoint <= 0x7a) /* a-z */
  );
}

/**
 * Escape a string for use where a CSS selector expects an *identifier*: an id (`#…`), a
 * class (`.…`), or an attribute name inside `[…]`.
 *
 * Implements the CSSOM "serialize an identifier" algorithm, the same one `CSS.escape`
 * exposes in browsers — reimplemented here to keep this package DOM-free.
 *
 * Note that the empty string has no valid identifier representation and is returned
 * as-is (matching `CSS.escape`), so `#${escapeCssIdentifier('')}` is a deliberately
 * invalid selector that throws at query time rather than silently matching nothing.
 *
 * @param value - The raw identifier text.
 * @returns The identifier escaped for CSS selector text.
 * @example
 * ```ts
 * escapeCssIdentifier('1abc'); // '\\31 abc' — an identifier may not start with a digit
 * escapeCssIdentifier('hover:bg-blue'); // 'hover\\:bg-blue'
 * ```
 */
export function escapeCssIdentifier(value: string): string {
  const startsWithHyphen = value.startsWith('-');
  const isLoneHyphen = value === '-';
  let escaped = '';
  // Counts code points, so an astral character occupies one position rather than two.
  let position = 0;

  for (const character of value) {
    const codePoint = character.codePointAt(0)!;

    if (codePoint === 0x0) {
      // U+0000 has no escape sequence at all; CSSOM substitutes the replacement character.
      escaped += '�';
    } else if (codePoint <= 0x1f || codePoint === 0x7f) {
      escaped += escapeAsCodePoint(codePoint);
    } else if (isAsciiDigit(codePoint) && (position === 0 || (position === 1 && startsWithHyphen))) {
      escaped += escapeAsCodePoint(codePoint);
    } else if (isLoneHyphen) {
      // A bare `-` tokenizes as a delimiter rather than an identifier.
      escaped += '\\-';
    } else if (codePoint >= 0x80 || isIdentifierSafe(codePoint)) {
      escaped += character;
    } else {
      escaped += `\\${character}`;
    }

    position += 1;
  }

  return escaped;
}

/**
 * Escape a string for use *inside* a double-quoted CSS string, such as the value in
 * `[data-testid="…"]`.
 *
 * Returns the string's contents only — the caller supplies the surrounding quotes. Only
 * double quotes are escaped, because every selector this package emits quotes with `"`.
 *
 * Implements the CSSOM "serialize a string" algorithm.
 *
 * @param value - The raw attribute value.
 * @returns The value escaped for placement between double quotes.
 * @example
 * ```ts
 * `[title="${escapeCssString('say "hi"')}"]`; // '[title="say \\"hi\\""]'
 * ```
 */
export function escapeCssString(value: string): string {
  let escaped = '';

  for (const character of value) {
    const codePoint = character.codePointAt(0)!;

    if (codePoint === 0x0) {
      escaped += '�';
    } else if (codePoint <= 0x1f || codePoint === 0x7f) {
      // A raw newline ends the string mid-selector; the rest are unprintable.
      escaped += escapeAsCodePoint(codePoint);
    } else if (codePoint === 0x22 /* " */ || codePoint === 0x5c /* \ */) {
      escaped += `\\${character}`;
    } else {
      escaped += character;
    }
  }

  return escaped;
}

/**
 * Escapes special characters in CSS class names.
 * This is necessary for class names containing characters like colons (Tailwind's `hover:bg-blue`),
 * dots, brackets, or other CSS selector metacharacters.
 *
 * A class name is an identifier, so this is {@link escapeCssIdentifier} under a name that
 * says where the result is going.
 *
 * @param name - The CSS class name to escape
 * @returns The escaped class name safe for use in CSS selectors
 */
export function escapeCssClassName(name: string): string {
  return escapeCssIdentifier(name);
}

/**
 * @deprecated Say which context you are escaping for: {@link escapeCssString} for a value
 * inside `[name="…"]`, or {@link escapeCssIdentifier} for an id, class or attribute name.
 *
 * Retained as an alias of {@link escapeCssString} because every remaining caller
 * interpolates into a quoted attribute value. It no longer escapes CSS metacharacters
 * such as `.` and `:` — those are literal inside a quoted string, and escaping them there
 * only worked because the parser collapsed the escape again.
 */
export function escapeValue(value: string): string {
  return escapeCssString(value);
}
