/**
 * Possible relative positions for a locator in relation to the base element.
 *
 * - `'Root'` — resolve from the document root, ignoring the parent context.
 * - `'Descendant'` — anywhere beneath the parent (CSS descendant combinator,
 *   a space). The default for most builders (`byChecked` is the exception — it
 *   defaults to `'Same'` so it composes onto the input it matches).
 * - `'Same'` — the same element as the parent (compound onto it, no combinator).
 * - `'Child'` — a direct child of the parent (CSS child combinator, `>`), so a
 *   nested descendant with the same selector is not matched. Expressible through
 *   the locator model rather than only via a raw `byCssSelector` escape hatch. The
 *   combinator is emitted for you, so the selector fragment must NOT itself start
 *   with `>` (pass `byCssSelector('.item', 'Child')`, not
 *   `byCssSelector('> .item', 'Child')`, which would double the combinator).
 */
export type LocatorRelativePosition = 'Root' | 'Descendant' | 'Same' | 'Child';
